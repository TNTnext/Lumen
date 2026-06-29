"""Chat routes — conversation management with multi-vendor fallback."""

import json
import logging
from flask import Blueprint, request, jsonify, Response, stream_with_context
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, User, Conversation, Message, VendorConfig
from auth_utils import get_effective_permission
from ai_service import chat_completion, stream_chat_completion
from model_registry import get_vendor_list, get_all_models_flat

chat_bp = Blueprint('chat', __name__)
logger = logging.getLogger(__name__)


def _get_active_vendor_configs():
    """Get all enabled vendor configs ordered by priority."""
    return VendorConfig.query.filter_by(enabled=True).order_by(VendorConfig.priority).all()


def _extract_model_names(model_priorities_json):
    """Extract model name strings from model_priorities JSON.
    Handles both [{model, priority}, ...] and flat [model_name, ...] formats."""
    if not model_priorities_json:
        return []
    try:
        data = json.loads(model_priorities_json)
        if isinstance(data, list):
            if data and isinstance(data[0], dict):
                return [item.get('model', '') for item in data if item.get('model')]
            return [str(x) for x in data if x]
        return []
    except (json.JSONDecodeError, TypeError):
        return []


def _get_first_model(cfg):
    """Get the first available model from a vendor config."""
    if cfg.default_model:
        return cfg.default_model
    names = _extract_model_names(cfg.model_priorities)
    return names[0] if names else None


def _build_message_content(text, image_urls=None, file_urls=None):
    """Build message content, supporting multi-modal (text + images + files).

    Returns:
        str: plain text if no media
        list: multi-modal content array if images/files present
    """
    if not image_urls and not file_urls:
        return text

    parts = []
    if text:
        parts.append({'type': 'text', 'text': text})

    for url in (image_urls or []):
        # Detect base64 vs URL
        if url.startswith('data:') or url.startswith('http'):
            parts.append({'type': 'image_url', 'image_url': {'url': url}})
        else:
            parts.append({'type': 'image_url', 'image_url': {'url': url}})

    for url in (file_urls or []):
        # Files are sent as URLs - the LLM needs to access them
        parts.append({'type': 'file_url', 'file_url': {'url': url}})

    return parts if parts else text


def _build_fallback_chain(primary_config, resolved_model, all_configs):
    """Build a fallback chain: primary first, then cross-vendor priority if configured."""
    from models import SystemConfig

    fallback_chain = []
    if primary_config:
        fallback_chain.append((primary_config, resolved_model))

    # Check for cross-vendor model priority order
    cross_priority_cfg = SystemConfig.query.filter_by(key='model_priority_order').first()
    cross_priority = []
    if cross_priority_cfg and cross_priority_cfg.value:
        try:
            cross_priority = json.loads(cross_priority_cfg.value)
        except (json.JSONDecodeError, TypeError):
            cross_priority = []

    if cross_priority:
        # Build chain by model order: for each model in priority, find first enabled vendor that has it
        for priority_model in cross_priority:
            for cfg in all_configs:
                if cfg.id == (primary_config.id if primary_config else -1):
                    continue
                model_names = _extract_model_names(cfg.model_priorities)
                if priority_model in model_names or priority_model == cfg.default_model:
                    if (cfg, priority_model) not in fallback_chain:
                        fallback_chain.append((cfg, priority_model))
                    break
    else:
        # Default: vendor-by-vendor fallback
        for cfg in all_configs:
            if cfg.id != (primary_config.id if primary_config else -1):
                fm = _get_first_model(cfg)
                if fm and (cfg, fm) not in fallback_chain:
                    fallback_chain.append((cfg, fm))

    return fallback_chain


def _resolve_model(user, requested_model=None):
    """
    Resolve which model to use.
    1. If user requests a specific model, use it (must be in user's allowed models)
    2. Otherwise, use the first vendor's default_model
    3. Fall back to the first model in the first vendor's model_priority list
    """
    perm = get_effective_permission(user)
    allowed_models = perm.get('allowed_models', []) if perm else []

    configs = _get_active_vendor_configs()
    if not configs:
        return None, None, '没有可用的 AI 厂商配置'

    if requested_model:
        # Check if model is allowed
        if allowed_models and requested_model not in allowed_models:
            return None, None, f'模型 {requested_model} 不在允许列表中'
        # Find which vendor has this model
        for cfg in configs:
            model_names = _extract_model_names(cfg.model_priorities)
            if requested_model in model_names or requested_model == cfg.default_model:
                return cfg, requested_model, None
        # Model not found in any vendor — try first vendor anyway
        return configs[0], requested_model, None

    # Auto-select: use first vendor's default model
    primary = configs[0]
    model = primary.default_model
    if not model:
        # Fall back to first model in priority list
        model_names = _extract_model_names(primary.model_priorities)
        model = model_names[0] if model_names else None

    if not model:
        return None, None, '没有可用的模型'

    # Check allowed models
    if allowed_models and model not in allowed_models:
        # Try to find an allowed model from the priority list
        model_names = _extract_model_names(primary.model_priorities)
        for m in model_names:
            if m in allowed_models:
                model = m
                break
        else:
            return None, None, '没有权限使用任何可用模型'

    return primary, model, None


def _try_chat_completion(vendor_config, model, messages, **kwargs):
    """Attempt chat completion with a specific vendor. Returns (result, error)."""
    try:
        result = chat_completion(
            vendor_id=vendor_config.vendor_id,
            api_key=vendor_config.api_key,
            base_url=vendor_config.base_url,
            model=model,
            messages=messages,
            **kwargs
        )
        if result.get('error'):
            return None, f"{vendor_config.vendor_id}/{model}: {result['error']}"
        return result, None
    except Exception as e:
        logger.warning(f"Vendor {vendor_config.vendor_id} model {model} failed: {e}")
        return None, str(e)


def _try_stream_chat_completion(vendor_config, model, messages, **kwargs):
    """Attempt streaming chat completion. Returns (generator, error)."""
    try:
        gen = stream_chat_completion(
            vendor_id=vendor_config.vendor_id,
            api_key=vendor_config.api_key,
            base_url=vendor_config.base_url,
            model=model,
            messages=messages,
            **kwargs
        )
        return gen, None
    except Exception as e:
        logger.warning(f"Vendor {vendor_config.vendor_id} model {model} stream failed: {e}")
        return None, str(e)


@chat_bp.route('/api/chat/send', methods=['POST'])
@jwt_required()
def send_message():
    """Send a message with multi-vendor fallback."""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': '用户不存在'}), 404

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': '请提供消息内容'}), 400

    content = data.get('content', '').strip()
    image_urls = data.get('image_urls', [])
    file_urls = data.get('file_urls', [])
    if not content and not image_urls and not file_urls:
        return jsonify({'error': '消息内容不能为空'}), 400

    conversation_id = data.get('conversation_id')
    model = data.get('model')  # optional user override
    stream = data.get('stream', False)
    max_tokens = data.get('max_tokens')
    temperature = data.get('temperature')
    top_p = data.get('top_p')
    tools = data.get('tools')
    thinking = data.get('thinking')
    web_search = data.get('web_search')

    # Get or create conversation
    if conversation_id:
        conv = Conversation.query.filter_by(id=conversation_id, user_id=user_id).first()
        if not conv:
            return jsonify({'error': '对话不存在'}), 404
    else:
        conv = Conversation(user_id=user_id, title=content[:50])
        db.session.add(conv)
        db.session.flush()

    # Save user message
    user_msg = Message(conversation_id=conv.id, role='user', content=content)
    db.session.add(user_msg)
    db.session.flush()

    # Build message history
    history = Message.query.filter_by(conversation_id=conv.id).order_by(Message.created_at).all()
    messages = [{'role': m.role, 'content': m.content} for m in history]

    # Build current user message content (supports multi-modal)
    user_content = _build_message_content(content, image_urls, file_urls)
    # Replace the last user message (just saved) with multi-modal version
    messages[-1]['content'] = user_content

    # Resolve model with fallback
    primary_config, resolved_model, resolve_error = _resolve_model(user, model)
    if resolve_error:
        return jsonify({'error': resolve_error}), 400

    # Get all active configs for fallback
    all_configs = _get_active_vendor_configs()

    # Build fallback chain: primary first, then cross-vendor or vendor-by-vendor
    fallback_chain = _build_fallback_chain(primary_config, resolved_model, all_configs)

    # Extra kwargs
    extra_kwargs = {}
    if max_tokens:
        extra_kwargs['max_tokens'] = max_tokens
    if temperature is not None:
        extra_kwargs['temperature'] = temperature
    if top_p is not None:
        extra_kwargs['top_p'] = top_p
    if tools:
        extra_kwargs['tools'] = tools
    if thinking is not None:
        extra_kwargs['thinking'] = thinking
    if web_search is not None:
        extra_kwargs['web_search'] = web_search

    if stream:
        return _handle_stream(conv, user_msg, messages, fallback_chain, extra_kwargs)

    # Non-streaming: try each vendor in order
    last_error = None
    for vendor_cfg, mdl in fallback_chain:
        result, error = _try_chat_completion(vendor_cfg, mdl, messages, **extra_kwargs)
        if result and result.get('success'):
            assistant_content = result.get('content', '')
            tokens_used = result.get('tokens', 0)

            # Save assistant message
            assistant_msg = Message(
                conversation_id=conv.id,
                role='assistant',
                content=assistant_content,
                tokens=tokens_used
            )
            db.session.add(assistant_msg)

            # Update conversation
            conv.model = f"{vendor_cfg.vendor_id}/{mdl}"
            conv.total_tokens = (conv.total_tokens or 0) + tokens_used
            conv.message_count = (conv.message_count or 0) + 2
            if not conv.title or conv.title == content[:50]:
                conv.title = content[:50]
            db.session.commit()

            return jsonify({
                'success': True,
                'conversation_id': conv.id,
                'message': assistant_msg.to_dict(),
                'tokens': tokens_used,
                'vendor': vendor_cfg.vendor_id,
                'model': mdl,
                'fallback_used': vendor_cfg.id != fallback_chain[0][0].id if fallback_chain else False
            })
        last_error = error

    return jsonify({'error': f'所有厂商均请求失败: {last_error}'}), 502


def _handle_stream(conv, user_msg, messages, fallback_chain, extra_kwargs):
    """Handle streaming response with fallback."""
    def generate():
        last_error = None
        assistant_content = ''
        used_vendor = None
        used_model = None

        for vendor_cfg, mdl in fallback_chain:
            gen, error = _try_stream_chat_completion(vendor_cfg, mdl, messages, **extra_kwargs)
            if error:
                last_error = error
                continue

            used_vendor = vendor_cfg.vendor_id
            used_model = mdl
            try:
                for chunk in gen:
                    if isinstance(chunk, dict):
                        delta = chunk.get('content', '')
                        if delta:
                            assistant_content += delta
                            yield f"data: {json.dumps({'content': delta})}\n\n"
                        if chunk.get('done'):
                            break
                    else:
                        assistant_content += str(chunk)
                        yield f"data: {json.dumps({'content': str(chunk)})}\n\n"
                break  # Success — don't try next vendor
            except Exception as e:
                logger.warning(f"Stream from {vendor_cfg.vendor_id}/{mdl} interrupted: {e}")
                last_error = str(e)
                continue

        if not assistant_content and last_error:
            yield f"data: {json.dumps({'error': f'所有厂商均请求失败: {last_error}'})}\n\n"
            yield "data: [DONE]\n\n"
            return

        # Save assistant message
        with db.session.begin():
            assistant_msg = Message(
                conversation_id=conv.id,
                role='assistant',
                content=assistant_content,
                tokens=len(assistant_content) // 4  # rough estimate
            )
            db.session.add(assistant_msg)
            conv.model = f"{used_vendor}/{used_model}" if used_vendor else conv.model
            conv.total_tokens = (conv.total_tokens or 0) + len(assistant_content) // 4
            conv.message_count = (conv.message_count or 0) + 2
            if not conv.title or conv.title == messages[-1]['content'][:50]:
                conv.title = messages[-1]['content'][:50]

        yield f"data: {json.dumps({'done': True, 'conversation_id': conv.id, 'vendor': used_vendor, 'model': used_model})}\n\n"
        yield "data: [DONE]\n\n"

    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no'
        }
    )


@chat_bp.route('/api/chat/conversations', methods=['GET'])
@jwt_required()
def list_conversations():
    """List user's conversations with pagination."""
    user_id = int(get_jwt_identity())
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    pagination = Conversation.query.filter_by(user_id=user_id)\
        .order_by(Conversation.updated_at.desc())\
        .paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'success': True,
        'conversations': [c.to_dict() for c in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'page': page
    })


@chat_bp.route('/api/chat/conversations/<int:conv_id>', methods=['GET'])
@jwt_required()
def get_conversation(conv_id):
    """Get conversation detail with messages."""
    user_id = int(get_jwt_identity())
    conv = Conversation.query.filter_by(id=conv_id, user_id=user_id).first()
    if not conv:
        return jsonify({'error': '对话不存在'}), 404

    messages = Message.query.filter_by(conversation_id=conv_id)\
        .order_by(Message.created_at).all()

    return jsonify({
        'success': True,
        'conversation': conv.to_dict(),
        'messages': [m.to_dict() for m in messages]
    })


@chat_bp.route('/api/chat/conversations/<int:conv_id>', methods=['DELETE'])
@jwt_required()
def delete_conversation(conv_id):
    """Delete a conversation and its messages."""
    user_id = int(get_jwt_identity())
    conv = Conversation.query.filter_by(id=conv_id, user_id=user_id).first()
    if not conv:
        return jsonify({'error': '对话不存在'}), 404

    Message.query.filter_by(conversation_id=conv_id).delete()
    db.session.delete(conv)
    db.session.commit()

    return jsonify({'success': True, 'message': '对话已删除'})


@chat_bp.route('/api/chat/models', methods=['GET'])
@jwt_required()
def list_available_models():
    """List models available to the current user, considering vendor configs and permissions."""
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': '用户不存在'}), 404
    perm = get_effective_permission(user)
    allowed_models = perm.get('allowed_models', []) if perm else []

    configs = _get_active_vendor_configs()
    available = []

    for cfg in configs:
        model_names = _extract_model_names(cfg.model_priorities)
        for m in model_names:
            if not allowed_models or m in allowed_models:
                available.append({
                    'vendor_id': cfg.vendor_id,
                    'vendor_name': cfg.display_name,
                    'model': m,
                    'is_default': m == cfg.default_model,
                    'priority': cfg.priority
                })

    # Deduplicate by model name, keep highest priority
    seen = set()
    deduped = []
    for item in sorted(available, key=lambda x: x['priority']):
        if item['model'] not in seen:
            seen.add(item['model'])
            deduped.append(item)

    return jsonify({'success': True, 'models': deduped})
