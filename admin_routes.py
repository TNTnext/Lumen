"""Admin API blueprint."""
from datetime import datetime, timezone, date, timedelta
from flask import Blueprint, request, jsonify, g
from sqlalchemy import func
from models import db, User, Conversation, Message, GlobalPermission, UserPermission, SystemConfig
from auth_utils import require_admin, get_effective_permission
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from ai_service import AIService
from model_registry import get_vendor_list, get_all_models_flat, get_model_capabilities
from config import Config

admin_bp = Blueprint('admin', __name__)


# ─── Dashboard ───────────────────────────────────────────

@admin_bp.route('/api/admin/dashboard', methods=['GET'])
@require_admin
def dashboard():
    """Get advanced multi-dimensional dashboard statistics."""
    today = date.today()
    today_start = datetime.combine(today, datetime.min.time())
    this_week_start = today - timedelta(days=today.weekday())
    this_month_start = today.replace(day=1)

    # Basic counts
    total_users = User.query.count()
    active_today = User.query.filter(
        User.daily_chat_date == today,
        User.daily_chat_count > 0,
    ).count()
    total_conversations = Conversation.query.count()
    total_messages = Message.query.count()

    # Today's API calls
    today_api_calls = Message.query.filter(
        Message.created_at >= today_start,
        Message.role == 'assistant',
    ).count()

    # Token usage
    today_tokens = db.session.query(func.coalesce(func.sum(Message.tokens), 0)).filter(
        Message.created_at >= today_start,
        Message.role == 'assistant',
    ).scalar()
    week_tokens = db.session.query(func.coalesce(func.sum(Message.tokens), 0)).filter(
        Message.created_at >= datetime.combine(this_week_start, datetime.min.time()),
        Message.role == 'assistant',
    ).scalar()
    month_tokens = db.session.query(func.coalesce(func.sum(Message.tokens), 0)).filter(
        Message.created_at >= datetime.combine(this_month_start, datetime.min.time()),
        Message.role == 'assistant',
    ).scalar()

    # Last 7 days chat trend (messages by day)
    seven_days_ago = today - timedelta(days=6)
    daily_stats = []
    for i in range(7):
        d = seven_days_ago + timedelta(days=i)
        day_start = datetime.combine(d, datetime.min.time())
        day_end = datetime.combine(d + timedelta(days=1), datetime.min.time())
        user_msgs = Message.query.filter(
            Message.created_at >= day_start,
            Message.created_at < day_end,
            Message.role == 'user',
        ).count()
        ai_msgs = Message.query.filter(
            Message.created_at >= day_start,
            Message.created_at < day_end,
            Message.role == 'assistant',
        ).count()
        daily_stats.append({
            'date': d.isoformat(),
            'user_messages': user_msgs,
            'ai_messages': ai_msgs,
            'count': user_msgs + ai_msgs,
        })

    # Last 7 days active users trend
    active_users_trend = []
    for i in range(7):
        d = seven_days_ago + timedelta(days=i)
        day_start = datetime.combine(d, datetime.min.time())
        day_end = datetime.combine(d + timedelta(days=1), datetime.min.time())
        count = db.session.query(func.count(func.distinct(Conversation.user_id))).filter(
            Conversation.created_at >= day_start,
            Conversation.created_at < day_end,
        ).scalar()
        active_users_trend.append({'date': d.isoformat(), 'count': count or 0})

    # Model usage distribution
    model_stats = db.session.query(
        Conversation.model, func.count(Conversation.id)
    ).group_by(Conversation.model).all()

    # User ranking (top 10 by message count)
    user_ranking = db.session.query(
        User.username, func.count(Message.id).label('msg_count')
    ).join(Conversation, Message.conversation_id == Conversation.id).join(
        User, Conversation.user_id == User.id
    ).filter(
        Message.role == 'user'
    ).group_by(User.username).order_by(
        func.count(Message.id).desc()
    ).limit(10).all()

    # Hourly distribution (today) — SQLite compatible
    hourly_dist = db.session.query(
        func.strftime('%H', Message.created_at).label('hour'),
        func.count(Message.id)
    ).filter(
        Message.created_at >= today_start,
        Message.role == 'user',
    ).group_by('hour').order_by('hour').all()

    # New users this week
    new_users_week = User.query.filter(
        User.created_at >= datetime.combine(this_week_start, datetime.min.time())
    ).count()

    # Average messages per conversation
    subq = db.session.query(
        func.count(Message.id).label('cnt')
    ).group_by(Message.conversation_id).subquery()
    raw_avg = db.session.query(func.avg(subq.c.cnt)).scalar()
    avg_msgs = round(raw_avg) if raw_avg is not None else 0

    # Disabled users count
    disabled_users = User.query.filter_by(is_active=False).count()

    # Admin count
    admin_count = User.query.filter_by(role='admin').count()

    return jsonify({
        'success': True,
        'stats': {
            'total_users': total_users,
            'active_today': active_today,
            'total_conversations': total_conversations,
            'total_messages': total_messages,
            'today_api_calls': today_api_calls,
            'today_tokens': today_tokens or 0,
            'week_tokens': week_tokens or 0,
            'month_tokens': month_tokens or 0,
            'new_users_week': new_users_week,
            'disabled_users': disabled_users,
            'admin_count': admin_count,
            'avg_messages_per_conv': float(avg_msgs) if avg_msgs else 0,
            'daily_trend': daily_stats,
            'active_users_trend': active_users_trend,
            'model_distribution': [
                {'model': m, 'count': c} for m, c in model_stats
            ],
            'user_ranking': [
                {'username': u, 'message_count': c} for u, c in user_ranking
            ],
            'hourly_distribution': [
                {'hour': int(h), 'count': c} for h, c in hourly_dist
            ],
        },
    })


@admin_bp.route('/api/admin/conversations', methods=['GET'])
@require_admin
def list_all_conversations():
    """Admin: list all conversations (overview only, no message content)."""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('search', '').strip()
    model_filter = request.args.get('model', '').strip()

    query = Conversation.query
    if search:
        query = query.join(User).filter(
            db.or_(
                User.username.ilike(f'%{search}%'),
                Conversation.title.ilike(f'%{search}%'),
            )
        )
    if model_filter:
        query = query.filter_by(model=model_filter)

    pagination = query.order_by(Conversation.updated_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    results = []
    for conv in pagination.items:
        d = conv.to_dict()
        d['username'] = conv.user.username if conv.user else 'Unknown'
        results.append(d)

    return jsonify({
        'success': True,
        'conversations': results,
        'total': pagination.total,
        'pages': pagination.pages,
        'page': page,
    })


@admin_bp.route('/api/admin/conversations/<int:conv_id>', methods=['GET'])
@require_admin
def get_conversation_detail(conv_id: int):
    """Admin: get conversation detail with messages (super admin only)."""
    conv = db.session.get(Conversation, conv_id)
    if not conv:
        return jsonify({'error': '对话不存在'}), 404

    # Check if admin can view content
    can_view = SystemConfig.query.filter_by(key='admin_can_view_content').first()
    if can_view and can_view.value == 'false' and g.current_user.role != 'super_admin':
        return jsonify({
            'success': True,
            'conversation': conv.to_dict(),
            'messages': [],
            'restricted': True,
        })

    messages = Message.query.filter_by(conversation_id=conv.id).order_by(
        Message.created_at.asc()
    ).all()

    return jsonify({
        'success': True,
        'conversation': conv.to_dict(),
        'messages': [m.to_dict() for m in messages],
    })


# ─── User Management ──────────────────────────────────────

@admin_bp.route('/api/admin/users', methods=['GET'])
@require_admin
def list_users():
    """List all users with pagination."""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('search', '').strip()
    status = request.args.get('status', '').strip()

    query = User.query
    if search:
        query = query.filter(
            db.or_(
                User.username.ilike(f'%{search}%'),
                User.email.ilike(f'%{search}%'),
            )
        )
    if status == 'active':
        query = query.filter_by(is_active=True)
    elif status == 'disabled':
        query = query.filter_by(is_active=False)

    pagination = query.order_by(User.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        'success': True,
        'users': [u.to_admin_dict() for u in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'page': page,
    })


@admin_bp.route('/api/admin/users/<int:user_id>', methods=['PUT'])
@require_admin
def update_user(user_id: int):
    """Update user info (role, active status, etc.)."""
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': '用户不存在'}), 404

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': '请提供更新数据'}), 400

    if 'is_active' in data:
        user.is_active = bool(data['is_active'])
    if 'role' in data and data['role'] in ('admin', 'user'):
        user.role = data['role']
    if 'email' in data:
        user.email = data['email']
    if 'daily_limit' in data:
        val = data['daily_limit']
        user.daily_limit = int(val) if val is not None and val != '' else None

    db.session.commit()
    return jsonify({'success': True, 'user': user.to_admin_dict()})


@admin_bp.route('/api/admin/users/<int:user_id>/reset-password', methods=['POST'])
@require_admin
def reset_user_password(user_id: int):
    """Reset a user's password."""
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': '用户不存在'}), 404

    data = request.get_json(silent=True) or {}
    new_password = data.get('password', 'reset123')
    user.set_password(new_password)
    user.must_change_password = True
    db.session.commit()

    return jsonify({'success': True, 'message': '密码已重置'})


@admin_bp.route('/api/admin/users/<int:user_id>/conversations', methods=['GET'])
@require_admin
def get_user_conversations(user_id: int):
    """Get a user's conversation list."""
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': '用户不存在'}), 404

    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)

    pagination = Conversation.query.filter_by(user_id=user_id).order_by(
        Conversation.updated_at.desc()
    ).paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        'success': True,
        'conversations': [c.to_dict() for c in pagination.items],
        'total': pagination.total,
        'pages': pagination.pages,
        'page': page,
    })


# ─── Permissions ─────────────────────────────────────────

@admin_bp.route('/api/admin/permissions/global', methods=['GET'])
@require_admin
def get_global_permissions():
    """Get global default permissions."""
    perm = GlobalPermission.query.first()
    if not perm:
        perm = GlobalPermission()
        db.session.add(perm)
        db.session.commit()
    return jsonify({'success': True, 'permissions': perm.to_dict()})


@admin_bp.route('/api/admin/permissions/global', methods=['PUT'])
@require_admin
def update_global_permissions():
    """Update global default permissions."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': '请提供权限配置'}), 400

    perm = GlobalPermission.query.first()
    if not perm:
        perm = GlobalPermission()
        db.session.add(perm)

    if 'max_daily_chats' in data:
        perm.max_daily_chats = int(data['max_daily_chats'])
    if 'allowed_models' in data:
        models = data['allowed_models']
        perm.allowed_models = ','.join(models) if isinstance(models, list) else models
    if 'max_tokens_per_request' in data:
        perm.max_tokens_per_request = int(data['max_tokens_per_request'])
    if 'allow_export' in data:
        perm.allow_export = bool(data['allow_export'])
    if 'allow_file_upload' in data:
        perm.allow_file_upload = bool(data['allow_file_upload'])
    if 'rate_limit_per_minute' in data:
        perm.rate_limit_per_minute = int(data['rate_limit_per_minute'])

    db.session.commit()
    return jsonify({'success': True, 'permissions': perm.to_dict()})


@admin_bp.route('/api/admin/permissions/user/<int:user_id>', methods=['GET'])
@require_admin
def get_user_permissions(user_id: int):
    """Get a specific user's permission settings."""
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': '用户不存在'}), 404

    user_perm = UserPermission.query.filter_by(user_id=user_id).first()
    effective = get_effective_permission(user)

    return jsonify({
        'success': True,
        'user': user.to_dict(),
        'custom_permissions': user_perm.to_dict() if user_perm else None,
        'effective_permissions': effective,
    })


@admin_bp.route('/api/admin/permissions/user/<int:user_id>', methods=['PUT'])
@require_admin
def update_user_permissions(user_id: int):
    """Update a specific user's permission settings."""
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': '用户不存在'}), 404

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': '请提供权限配置'}), 400

    user_perm = UserPermission.query.filter_by(user_id=user_id).first()
    if not user_perm:
        user_perm = UserPermission(user_id=user_id)
        db.session.add(user_perm)

    if 'use_custom' in data:
        user_perm.use_custom = bool(data['use_custom'])
    if 'max_daily_chats' in data:
        user_perm.max_daily_chats = int(data['max_daily_chats']) if data['max_daily_chats'] is not None else None
    if 'allowed_models' in data:
        models = data['allowed_models']
        user_perm.allowed_models = ','.join(models) if isinstance(models, list) else models
    if 'max_tokens_per_request' in data:
        user_perm.max_tokens_per_request = int(data['max_tokens_per_request']) if data['max_tokens_per_request'] is not None else None
    if 'allow_export' in data:
        user_perm.allow_export = bool(data['allow_export']) if data['allow_export'] is not None else None
    if 'allow_file_upload' in data:
        user_perm.allow_file_upload = bool(data['allow_file_upload']) if data['allow_file_upload'] is not None else None
    if 'rate_limit_per_minute' in data:
        user_perm.rate_limit_per_minute = int(data['rate_limit_per_minute']) if data['rate_limit_per_minute'] is not None else None

    db.session.commit()
    return jsonify({'success': True, 'permissions': user_perm.to_dict()})


# ─── System Config ───────────────────────────────────────

@admin_bp.route('/api/admin/config', methods=['GET'])
@require_admin
def get_system_config():
    """Get all system configurations."""
    configs = SystemConfig.query.all()
    result = {}
    for c in configs:
        if c.is_encrypted:
            result[c.key] = '••••••••'
        else:
            result[c.key] = c.value
    return jsonify({'success': True, 'configs': result})


@admin_bp.route('/api/admin/config/api-key', methods=['GET'])
@require_admin
def get_api_key():
    """Get the actual API key value (admin only)."""
    from datetime import datetime, timedelta
    cfg = SystemConfig.query.filter_by(key='deepseek_api_key').first()
    today = datetime.utcnow().date()
    month_start = today.replace(day=1)

    # Calculate usage stats
    today_calls = Message.query.filter(
        Message.role == 'assistant',
        db.func.date(Message.created_at) == today
    ).count()

    monthly_calls = Message.query.filter(
        Message.role == 'assistant',
        Message.created_at >= month_start
    ).count()

    monthly_tokens = db.session.query(db.func.coalesce(db.func.sum(Message.tokens), 0)).filter(
        Message.role == 'assistant',
        Message.created_at >= month_start
    ).scalar()

    return jsonify({
        'success': True,
        'api_key': cfg.value if cfg else '',
        'base_url': SystemConfig.query.filter_by(key='deepseek_base_url').first().value if SystemConfig.query.filter_by(key='deepseek_base_url').first() else 'https://api.deepseek.com',
        'usage': {
            'today_calls': today_calls,
            'monthly_calls': monthly_calls,
            'monthly_tokens': monthly_tokens,
        }
    })


@admin_bp.route('/api/admin/config', methods=['PUT'])
@require_admin
def update_system_config():
    """Update system configurations."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': '请提供配置信息'}), 400

    sensitive_keys = {'deepseek_api_key'}

    for key, value in data.items():
        cfg = SystemConfig.query.filter_by(key=key).first()
        if not cfg:
            cfg = SystemConfig(key=key)
            db.session.add(cfg)

        if key in sensitive_keys and value and value != '••••••••':
            cfg.value = value
            cfg.is_encrypted = True
        elif key not in sensitive_keys:
            cfg.value = str(value) if value is not None else ''

    db.session.commit()
    return jsonify({'success': True, 'message': '配置已保存'})


@admin_bp.route('/api/admin/config/test-connection', methods=['POST'])
@require_admin
def test_deepseek_connection():
    """Test DeepSeek API connection and record usage."""
    data = request.get_json(silent=True) or {}
    api_key = data.get('api_key', '')
    base_url = data.get('base_url', 'https://api.deepseek.com')

    if not api_key:
        cfg = SystemConfig.query.filter_by(key='deepseek_api_key').first()
        api_key = cfg.value if cfg else Config.DEEPSEEK_API_KEY

    if not base_url or base_url == 'https://api.deepseek.com':
        cfg = SystemConfig.query.filter_by(key='deepseek_base_url').first()
        base_url = cfg.value if cfg else Config.DEEPSEEK_BASE_URL

    if not api_key:
        return jsonify({'success': False, 'error': '请先配置 API Key'}), 400

    service = AIService(api_key=api_key, base_url=base_url)
    result = service.test_connection()

    # Record test call in stats counter (no conversation pollution)
    if result.get('success'):
        try:
            today = date.today()
            cfg = SystemConfig.query.filter_by(key='test_call_count_today').first()
            cfg_date = SystemConfig.query.filter_by(key='test_call_date').first()
            if cfg_date and cfg_date.value == today.isoformat():
                cfg.value = str(int(cfg.value or 0) + 1) if cfg else '1'
            else:
                if not cfg:
                    cfg = SystemConfig(key='test_call_count_today', value='1')
                    db.session.add(cfg)
                else:
                    cfg.value = '1'
                if cfg_date:
                    cfg_date.value = today.isoformat()
                else:
                    db.session.add(SystemConfig(key='test_call_date', value=today.isoformat()))
            db.session.commit()
        except Exception:
            db.session.rollback()

    return jsonify(result)


@admin_bp.route('/api/admin/config/open-registration', methods=['GET'])
@require_admin
def get_open_registration():
    """Get open registration status."""
    cfg = SystemConfig.query.filter_by(key='open_registration').first()
    is_open = cfg.value == 'true' if cfg else Config.OPEN_REGISTRATION
    return jsonify({'success': True, 'open_registration': is_open})


# ─── Endpoint Toggles ───────────────────────────────────

@admin_bp.route('/api/admin/endpoints', methods=['GET'])
@require_admin
def list_endpoints():
    """List all endpoint toggles, grouped."""
    from models import EndpointToggle, ENDPOINT_GROUPS, DEFAULT_ENDPOINTS

    toggles = EndpointToggle.query.order_by(EndpointToggle.group, EndpointToggle.id).all()

    # Ensure all default endpoints exist in DB
    existing = {t.endpoint for t in toggles}
    for ep in DEFAULT_ENDPOINTS:
        if ep['endpoint'] not in existing:
            t = EndpointToggle(
                endpoint=ep['endpoint'],
                description=ep['description'],
                group=ep['group'],
                enabled=ep['enabled'],
            )
            db.session.add(t)
            toggles.append(t)
    db.session.commit()

    # Build grouped response
    groups = {}
    for t in toggles:
        d = t.to_dict()
        group_key = t.group or 'other'
        group_name = ENDPOINT_GROUPS.get(group_key, group_key)
        if group_key not in groups:
            groups[group_key] = {'name': group_name, 'endpoints': []}
        groups[group_key]['endpoints'].append(d)

    return jsonify({'success': True, 'groups': groups})


@admin_bp.route('/api/admin/endpoints/<int:endpoint_id>', methods=['PUT'])
@require_admin
def update_endpoint(endpoint_id):
    """Toggle an endpoint on/off."""
    from models import EndpointToggle
    import app as app_module

    toggle = db.session.get(EndpointToggle, endpoint_id)
    if not toggle:
        return jsonify({'error': '接口不存在'}), 404

    data = request.get_json(silent=True) or {}
    if 'enabled' in data:
        toggle.enabled = bool(data['enabled'])

    db.session.commit()

    # Refresh in-memory cache
    app_module._load_endpoint_cache()

    return jsonify({'success': True, 'endpoint': toggle.to_dict()})


@admin_bp.route('/api/admin/endpoints/batch', methods=['PUT'])
@require_admin
def batch_update_endpoints():
    """Batch toggle endpoints. Body: { endpoint_ids: [1,2,3], enabled: true/false }
    Or: { group: 'chat', enabled: true/false }"""
    from models import EndpointToggle
    import app as app_module

    data = request.get_json(silent=True) or {}
    enabled = bool(data.get('enabled', True))

    if 'group' in data:
        group = data['group']
        count = EndpointToggle.query.filter_by(group=group).update({EndpointToggle.enabled: enabled})
    elif 'endpoint_ids' in data:
        ids = data['endpoint_ids']
        count = EndpointToggle.query.filter(EndpointToggle.id.in_(ids)).update(
            {EndpointToggle.enabled: enabled}, synchronize_session='fetch'
        )
    else:
        return jsonify({'error': '请提供 group 或 endpoint_ids'}), 400

    db.session.commit()

    # Refresh cache
    app_module._load_endpoint_cache()

    return jsonify({'success': True, 'updated': count})


# ─── Vendor & Model Registry ──────────────────────────────

@admin_bp.route('/api/admin/vendors', methods=['GET'])
@require_admin
def list_vendors():
    """Return all supported vendors with their models and capabilities."""
    return jsonify({'success': True, 'vendors': get_vendor_list()})


@admin_bp.route('/api/admin/models', methods=['GET'])
@require_admin
def list_models():
    """Return flat list of all models with capabilities."""
    return jsonify({'success': True, 'models': get_all_models_flat()})


# ─── Onboarding ───────────────────────────────────────────

@admin_bp.route('/api/admin/onboarding/status', methods=['GET'])
@jwt_required()
def onboarding_status():
    """Check if current admin needs onboarding."""
    uid = get_jwt_identity()
    u = User.query.filter_by(id=int(uid)).first()
    if not u or u.role != 'admin':
        return jsonify({'success': True, 'needs_onboarding': False})
    cfg = SystemConfig.query.filter_by(key='onboarding_completed').first()
    needs = not cfg or cfg.value != 'true'
    return jsonify({'success': True, 'needs_onboarding': needs, 'must_change_password': u.must_change_password})


@admin_bp.route('/api/admin/onboarding/complete', methods=['POST'])
@jwt_required()
def complete_onboarding():
    """Complete onboarding with initial setup."""
    uid = get_jwt_identity()
    u = User.query.filter_by(id=int(uid)).first()
    if not u or u.role != 'admin':
        return jsonify({'success': False, 'error': '仅管理员可操作'}), 403

    data = request.get_json(silent=True) or {}

    # Update admin password if provided
    new_password = data.get('new_password')
    if new_password:
        u.password_hash = generate_password_hash(new_password)
        u.must_change_password = False

    # Update admin email
    new_email = data.get('email')
    if new_email:
        u.email = new_email

    # AI vendor config
    vendor_id = data.get('vendor_id')
    if vendor_id:
        _upsert_config('ai_vendor', vendor_id)
    api_key = data.get('api_key')
    if api_key:
        _upsert_config('deepseek_api_key', api_key, encrypt=True)
    base_url = data.get('base_url')
    if base_url:
        _upsert_config('deepseek_base_url', base_url)
    model = data.get('model')
    if model:
        _upsert_config('deepseek_model', model)

    # Global permissions
    perms = data.get('permissions', {})
    gp = GlobalPermission.query.first()
    if gp:
        if 'max_daily_chats' in perms:
            gp.max_daily_chats = perms['max_daily_chats']
        if 'max_tokens_per_request' in perms:
            gp.max_tokens_per_request = perms['max_tokens_per_request']
        if 'rate_limit_per_minute' in perms:
            gp.rate_limit_per_minute = perms['rate_limit_per_minute']
        if 'allowed_models' in perms:
            gp.allowed_models = perms['allowed_models']
        if 'allow_export' in perms:
            gp.allow_export = perms['allow_export']
        if 'allow_file_upload' in perms:
            gp.allow_file_upload = perms['allow_file_upload']

    # System settings
    if 'open_registration' in data:
        _upsert_config('open_registration', str(data['open_registration']).lower())
    if 'admin_can_view_content' in data:
        _upsert_config('admin_can_view_content', str(data['admin_can_view_content']).lower())
    if 'conversation_retention_days' in data:
        _upsert_config('conversation_retention_days', str(data['conversation_retention_days']))

    # Endpoint toggles
    from models import EndpointToggle
    endpoint_toggles = data.get('endpoint_toggles', {})
    for group, enabled in endpoint_toggles.items():
        EndpointToggle.query.filter_by(group=group).update({'enabled': bool(enabled)})

    # Mark onboarding complete
    _upsert_config('onboarding_completed', 'true')

    db.session.commit()

    # Refresh endpoint cache
    import app as app_module
    app_module._load_endpoint_cache()

    return jsonify({'success': True, 'message': '初始化完成'})


def _upsert_config(key, value, encrypt=False):
    """Insert or update a system config."""
    cfg = SystemConfig.query.filter_by(key=key).first()
    if cfg:
        cfg.value = value
        if encrypt:
            cfg.is_encrypted = True
    else:
        db.session.add(SystemConfig(key=key, value=value, is_encrypted=encrypt))


# ─── System Reset ─────────────────────────────────────────

@admin_bp.route('/api/admin/reset', methods=['POST'])
@require_admin
def reset_system():
    """Reset system: clear conversations, messages, configs, and optionally users.
    Body: { scope: 'all' | 'conversations' | 'configs' }
    """
    data = request.get_json(silent=True) or {}
    scope = data.get('scope', 'all')

    results = {}

    if scope in ('all', 'conversations'):
        # Delete all messages first (FK constraint)
        msg_count = Message.query.count()
        Message.query.delete()
        # Delete all conversations
        conv_count = Conversation.query.count()
        Conversation.query.delete()
        # Reset user daily counters
        User.query.update({User.daily_chat_count: 0, User.daily_chat_date: None})
        results['messages_deleted'] = msg_count
        results['conversations_deleted'] = conv_count

    if scope in ('all', 'configs'):
        # Reset system configs to defaults
        SystemConfig.query.filter(SystemConfig.key.notin_(['deepseek_api_key', 'deepseek_base_url'])).delete()
        defaults = {
            'open_registration': 'true',
            'conversation_retention_days': '90',
            'admin_can_view_content': 'false',
        }
        for key, value in defaults.items():
            if not SystemConfig.query.filter_by(key=key).first():
                db.session.add(SystemConfig(key=key, value=value))
        # Reset global permissions
        gp = GlobalPermission.query.first()
        if gp:
            gp.max_daily_chats = 100
            gp.allowed_models = 'deepseek-chat,deepseek-reasoner'
            gp.max_tokens_per_request = 4096
            gp.allow_export = False
            gp.allow_file_upload = False
            gp.rate_limit_per_minute = 10
        # Reset user custom permissions
        UserPermission.query.delete()
        results['configs_reset'] = True

    if scope in ('all', 'users'):
        # Delete non-admin users
        non_admin_count = User.query.filter(User.role != 'admin').count()
        User.query.filter(User.role != 'admin').delete()
        results['non_admin_users_deleted'] = non_admin_count

    db.session.commit()
    return jsonify({'success': True, 'message': '系统已重置', 'results': results})


@admin_bp.route('/api/admin/config/open-registration', methods=['PUT'])
@require_admin
def set_open_registration():
    """Set open registration status."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': '请提供配置'}), 400

    is_open = bool(data.get('open_registration', True))
    cfg = SystemConfig.query.filter_by(key='open_registration').first()
    if not cfg:
        cfg = SystemConfig(key='open_registration')
        db.session.add(cfg)
    cfg.value = 'true' if is_open else 'false'
    db.session.commit()

    return jsonify({'success': True, 'open_registration': is_open})
