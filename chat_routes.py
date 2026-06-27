"""Chat API blueprint."""
import json
import time
from datetime import datetime, timezone, date
from flask import Blueprint, request, jsonify, Response, g, stream_with_context
from models import db, User, Conversation, Message
from auth_utils import require_auth, get_effective_permission, check_chat_permission
from ai_service import chat_completion, stream_chat_completion
from config import Config

chat_bp = Blueprint('chat', __name__)

# Config cache to avoid DB query on every request
_config_cache = {'ts': 0, 'api_key': '', 'base_url': '', 'vendor_id': 'deepseek'}
_CONFIG_CACHE_TTL = 30  # seconds


def _load_ai_config():
    """Load AI config from system settings (with cache)."""
    global _config_cache
    now = time.time()
    if now - _config_cache['ts'] < _CONFIG_CACHE_TTL:
        return _config_cache
    from models import SystemConfig
    api_key_cfg = SystemConfig.query.filter_by(key='deepseek_api_key').first()
    base_url_cfg = SystemConfig.query.filter_by(key='deepseek_base_url').first()
    vendor_cfg = SystemConfig.query.filter_by(key='ai_vendor').first()
    api_key = api_key_cfg.value if api_key_cfg else Config.DEEPSEEK_API_KEY
    base_url = base_url_cfg.value if base_url_cfg else Config.DEEPSEEK_BASE_URL
    vendor_id = vendor_cfg.value if vendor_cfg else 'deepseek'
    _config_cache = {'ts': now, 'api_key': api_key, 'base_url': base_url, 'vendor_id': vendor_id}
    return _config_cache


@chat_bp.route('/api/chat/send', methods=['POST'])
@require_auth
def send_message():
    """Send a message and get AI response."""
    cfg = _load_ai_config()

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': '请提供消息内容'}), 400

    content = (data.get('content') or '').strip()
    if not content:
        return jsonify({'error': '消息内容不能为空'}), 400

    model = data.get('model', 'deepseek-chat')
    conversation_id = data.get('conversation_id')

    # Permission check
    allowed, error_msg = check_chat_permission(g.current_user, model)
    if not allowed:
        return jsonify({'error': error_msg}), 403

    # Get or create conversation
    if conversation_id:
        conv = Conversation.query.filter_by(
            id=conversation_id, user_id=g.current_user.id
        ).first()
        if not conv:
            return jsonify({'error': '对话不存在'}), 404
    else:
        conv = Conversation(
            user_id=g.current_user.id,
            title=content[:50] + ('...' if len(content) > 50 else ''),
            model=model,
        )
        db.session.add(conv)
        db.session.flush()

    # Save user message
    user_msg = Message(
        conversation_id=conv.id,
        role='user',
        content=content,
    )
    db.session.add(user_msg)

    # Build messages array from history
    history = Message.query.filter_by(conversation_id=conv.id).order_by(
        Message.created_at.asc()
    ).all()
    messages = [{'role': m.role, 'content': m.content} for m in history]

    # Call AI
    perm = get_effective_permission(g.current_user)
    max_tokens = perm.get('max_tokens_per_request', 4096)

    result = chat_completion(
        vendor_id=cfg['vendor_id'],
        model=model,
        messages=messages,
        api_key=cfg['api_key'],
        base_url=cfg['base_url'],
        max_tokens=max_tokens,
    )

    if 'error' in result:
        db.session.rollback()
        return jsonify({'error': result.get('error', 'AI服务异常')}), 500

    # Save assistant message
    assistant_msg = Message(
        conversation_id=conv.id,
        role='assistant',
        content=result['content'],
        tokens=result.get('usage', {}).get('completion_tokens', 0),
    )
    db.session.add(assistant_msg)

    # Update conversation stats
    conv.total_tokens = (conv.total_tokens or 0) + result.get('usage', {}).get('total_tokens', 0)
    conv.message_count = conv.message_count + 2
    conv.model = model
    conv.updated_at = datetime.now(timezone.utc)

    # Update user daily count
    today = date.today()
    if g.current_user.daily_chat_date != today:
        g.current_user.daily_chat_count = 0
        g.current_user.daily_chat_date = today
    g.current_user.daily_chat_count += 1

    db.session.commit()

    return jsonify({
        'success': True,
        'conversation_id': conv.id,
        'message': assistant_msg.to_dict(),
        'tokens': result.get('usage', {}).get('total_tokens', 0),
    })


@chat_bp.route('/api/chat/send-stream', methods=['POST'])
@require_auth
def send_message_stream():
    """Send a message and get streaming AI response."""
    cfg = _load_ai_config()

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': '请提供消息内容'}), 400

    content = (data.get('content') or '').strip()
    if not content:
        return jsonify({'error': '消息内容不能为空'}), 400

    model = data.get('model', 'deepseek-chat')
    conversation_id = data.get('conversation_id')

    # Permission check
    allowed, error_msg = check_chat_permission(g.current_user, model)
    if not allowed:
        return jsonify({'error': error_msg}), 403

    # Get or create conversation
    if conversation_id:
        conv = Conversation.query.filter_by(
            id=conversation_id, user_id=g.current_user.id
        ).first()
        if not conv:
            return jsonify({'error': '对话不存在'}), 404
    else:
        conv = Conversation(
            user_id=g.current_user.id,
            title=content[:50] + ('...' if len(content) > 50 else ''),
            model=model,
        )
        db.session.add(conv)
        db.session.flush()

    # Save user message
    user_msg = Message(
        conversation_id=conv.id,
        role='user',
        content=content,
    )
    db.session.add(user_msg)
    db.session.commit()

    # Build messages array
    history = Message.query.filter_by(conversation_id=conv.id).order_by(
        Message.created_at.asc()
    ).all()
    messages = [{'role': m.role, 'content': m.content} for m in history]

    perm = get_effective_permission(g.current_user)
    max_tokens = perm.get('max_tokens_per_request', 4096)

    def generate():
        full_content = ''
        try:
            for chunk in stream_chat_completion(
                vendor_id=cfg['vendor_id'],
                model=model,
                messages=messages,
                api_key=cfg['api_key'],
                base_url=cfg['base_url'],
                max_tokens=max_tokens,
            ):
                full_content += chunk
                yield f'data: {json.dumps({"content": chunk})}\n\n'

            # Save assistant message
            assistant_msg = Message(
                conversation_id=conv.id,
                role='assistant',
                content=full_content,
                tokens=0,
            )
            db.session.add(assistant_msg)
            conv.message_count = conv.message_count + 2
            conv.updated_at = datetime.now(timezone.utc)

            today = date.today()
            if g.current_user.daily_chat_date != today:
                g.current_user.daily_chat_count = 0
                g.current_user.daily_chat_date = today
            g.current_user.daily_chat_count += 1

            db.session.commit()

            yield f'data: {json.dumps({"done": True, "conversation_id": conv.id})}\n\n'
        except Exception as e:
            yield f'data: {json.dumps({"error": str(e)})}\n\n'

    return Response(
        stream_with_context(generate()),
        mimetype='text/event-stream',
        headers={
            'Cache-Control': 'no-cache',
            'X-Accel-Buffering': 'no',
        },
    )


@chat_bp.route('/api/chat/conversations', methods=['GET'])
@require_auth
def list_conversations():
    """List current user's conversations."""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    pagination = Conversation.query.filter_by(user_id=g.current_user.id).order_by(
        Conversation.updated_at.desc()
    ).paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'success': True,
        'conversations': [c.to_dict() for c in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'page': page,
    })


@chat_bp.route('/api/chat/conversations/<int:conv_id>', methods=['GET'])
@require_auth
def get_conversation(conv_id: int):
    """Get conversation detail with messages."""
    conv = Conversation.query.filter_by(
        id=conv_id, user_id=g.current_user.id
    ).first()
    if not conv:
        return jsonify({'error': '对话不存在'}), 404

    messages = Message.query.filter_by(conversation_id=conv.id).order_by(
        Message.created_at.asc()
    ).all()

    return jsonify({
        'success': True,
        'conversation': conv.to_dict(),
        'messages': [m.to_dict() for m in messages],
    })


@chat_bp.route('/api/chat/conversations/<int:conv_id>', methods=['DELETE'])
@require_auth
def delete_conversation(conv_id: int):
    """Delete a conversation."""
    conv = Conversation.query.filter_by(
        id=conv_id, user_id=g.current_user.id
    ).first()
    if not conv:
        return jsonify({'error': '对话不存在'}), 404

    db.session.delete(conv)
    db.session.commit()
    return jsonify({'success': True, 'message': '对话已删除'})


@chat_bp.route('/api/chat/models', methods=['GET'])
@require_auth
def get_available_models():
    """Get available models for current user."""
    perm = get_effective_permission(g.current_user)
    return jsonify({
        'success': True,
        'models': perm.get('allowed_models', []),
    })
