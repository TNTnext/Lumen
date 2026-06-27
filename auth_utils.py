"""Authentication utilities and decorators."""
import re
import time
from datetime import datetime, timezone, date
from functools import wraps
from flask import request, jsonify, g
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from models import db, User, GlobalPermission, UserPermission

# ── Permission cache (TTL 30s) ──────────────────────────────────────────
_perm_cache: dict[int, tuple[float, dict]] = {}
_PERM_CACHE_TTL = 30  # seconds


def _invalidate_perm_cache(user_id: int = None):
    """Clear permission cache for a user or all users."""
    global _perm_cache
    if user_id is not None:
        _perm_cache.pop(user_id, None)
    else:
        _perm_cache.clear()


def get_current_user() -> User | None:
    """Get current authenticated user from JWT."""
    try:
        verify_jwt_in_request()
        user_id = get_jwt_identity()
        if user_id is None:
            return None
        return db.session.get(User, int(user_id))
    except Exception:
        return None


def require_auth(f):
    """Decorator: require valid JWT authentication."""
    @wraps(f)
    def decorated(*args, **kwargs):
        user = get_current_user()
        if user is None:
            return jsonify({'error': '未登录或登录已过期'}), 401
        if not user.is_active:
            return jsonify({'error': '账号已被禁用'}), 403
        g.current_user = user
        return f(*args, **kwargs)
    return decorated


def require_admin(f):
    """Decorator: require admin role."""
    @wraps(f)
    @require_auth
    def decorated(*args, **kwargs):
        if g.current_user.role != 'admin':
            return jsonify({'error': '需要管理员权限'}), 403
        return f(*args, **kwargs)
    return decorated


def get_effective_permission(user: User) -> dict:
    """Get effective permission for a user (custom override or global default).
    Results are cached per-user with a 30s TTL."""
    now = time.time()
    cached = _perm_cache.get(user.id)
    if cached and now - cached[0] < _PERM_CACHE_TTL:
        return cached[1]

    global_perm = GlobalPermission.query.first()
    if global_perm is None:
        global_perm = GlobalPermission()
        db.session.add(global_perm)
        db.session.commit()

    base = global_perm.to_dict()

    user_perm = UserPermission.query.filter_by(user_id=user.id).first()
    if user_perm and user_perm.use_custom:
        if user_perm.max_daily_chats is not None:
            base['max_daily_chats'] = user_perm.max_daily_chats
        if user_perm.allowed_models is not None:
            base['allowed_models'] = user_perm.allowed_models.split(',')
        if user_perm.max_tokens_per_request is not None:
            base['max_tokens_per_request'] = user_perm.max_tokens_per_request
        if user_perm.allow_export is not None:
            base['allow_export'] = user_perm.allow_export
        if user_perm.allow_file_upload is not None:
            base['allow_file_upload'] = user_perm.allow_file_upload
        if user_perm.rate_limit_per_minute is not None:
            base['rate_limit_per_minute'] = user_perm.rate_limit_per_minute

    _perm_cache[user.id] = (now, base)
    return base


def check_chat_permission(user: User, model: str) -> tuple[bool, str]:
    """Check if user can send a chat message with given model.
    Returns (allowed, error_message).
    """
    perm = get_effective_permission(user)

    # Check model access
    if model not in perm['allowed_models']:
        return False, f'您没有使用模型 {model} 的权限'

    # Check daily limit
    today = date.today()
    if user.daily_chat_date != today:
        user.daily_chat_count = 0
        user.daily_chat_date = today
        db.session.commit()

    # User-level daily_limit overrides global permission max_daily_chats
    effective_daily_limit = user.daily_limit if user.daily_limit is not None else perm['max_daily_chats']

    if user.daily_chat_count >= effective_daily_limit:
        return False, f'已达到每日对话上限（{effective_daily_limit}次）'

    return True, ''


def validate_password_strength(password: str) -> tuple[bool, str]:
    """Validate password strength. Returns (valid, error_message)."""
    if len(password) < 6:
        return False, '密码长度至少6位'
    if len(password) > 128:
        return False, '密码长度不能超过128位'
    return True, ''


def validate_username(username: str) -> tuple[bool, str]:
    """Validate username format."""
    if not username or len(username) < 2:
        return False, '用户名至少2个字符'
    if len(username) > 50:
        return False, '用户名不能超过50个字符'
    if not re.match(r'^[a-zA-Z0-9_\u4e00-\u9fff]+$', username):
        return False, '用户名只能包含字母、数字、下划线和中文'
    return True, ''
