"""Authentication API blueprint."""
from datetime import datetime, timezone
from flask import Blueprint, request, jsonify, g
from flask_jwt_extended import create_access_token, get_jwt_identity
from models import db, User, GlobalPermission, UserPermission
from auth_utils import (
    require_auth, require_admin, validate_username, validate_password_strength
)
from config import Config

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user."""
    if not Config.OPEN_REGISTRATION:
        return jsonify({'error': '当前未开放注册'}), 403

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': '请提供注册信息'}), 400

    username = (data.get('username') or '').strip()
    password = data.get('password') or ''
    email = (data.get('email') or '').strip() or None
    daily_limit = data.get('daily_limit')  # None = use default

    valid, msg = validate_username(username)
    if not valid:
        return jsonify({'error': msg}), 400

    valid, msg = validate_password_strength(password)
    if not valid:
        return jsonify({'error': msg}), 400

    if User.query.filter_by(username=username).first():
        return jsonify({'error': '用户名已存在'}), 409

    if email and User.query.filter_by(email=email).first():
        return jsonify({'error': '邮箱已被注册'}), 409

    user = User(username=username, email=email, role='user')
    if daily_limit is not None:
        user.daily_limit = int(daily_limit)
    user.set_password(password)
    db.session.add(user)
    db.session.flush()

    # Create default user permission record
    user_perm = UserPermission(user_id=user.id, use_custom=False)
    db.session.add(user_perm)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({
        'success': True,
        'message': '注册成功',
        'token': token,
        'user': user.to_dict(),
    }), 201


@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    """User login."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': '请提供登录信息'}), 400

    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    if not username or not password:
        return jsonify({'error': '用户名和密码不能为空'}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({'error': '用户名或密码错误'}), 401

    if not user.is_active:
        return jsonify({'error': '账号已被禁用，请联系管理员'}), 403

    user.updated_at = datetime.now(timezone.utc)
    db.session.commit()

    token = create_access_token(identity=str(user.id))
    return jsonify({
        'success': True,
        'message': '登录成功',
        'token': token,
        'user': user.to_dict(),
        'must_change_password': user.must_change_password,
    })


@auth_bp.route('/api/auth/me', methods=['GET'])
@require_auth
def get_me():
    """Get current user info."""
    return jsonify({
        'success': True,
        'user': g.current_user.to_dict(),
    })


@auth_bp.route('/api/auth/change-password', methods=['POST'])
@require_auth
def change_password():
    """Change current user's password."""
    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': '请提供密码信息'}), 400

    old_password = data.get('old_password') or ''
    new_password = data.get('new_password') or ''

    if not g.current_user.check_password(old_password):
        return jsonify({'error': '原密码错误'}), 400

    valid, msg = validate_password_strength(new_password)
    if not valid:
        return jsonify({'error': msg}), 400

    g.current_user.set_password(new_password)
    g.current_user.must_change_password = False
    db.session.commit()

    return jsonify({'success': True, 'message': '密码修改成功'})


@auth_bp.route('/api/auth/users', methods=['GET'])
@require_admin
def list_users():
    """Admin: list all users."""
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('search', '').strip()
    status = request.args.get('status', '')  # 'active', 'disabled', ''

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


@auth_bp.route('/api/auth/users/<int:user_id>', methods=['PUT'])
@require_admin
def update_user(user_id: int):
    """Admin: update user info."""
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': '用户不存在'}), 404

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': '请提供更新信息'}), 400

    if 'is_active' in data:
        user.is_active = bool(data['is_active'])
    if 'role' in data and data['role'] in ('admin', 'user'):
        user.role = data['role']
    if 'email' in data:
        email = (data['email'] or '').strip()
        if email and email != user.email:
            if User.query.filter_by(email=email).first():
                return jsonify({'error': '邮箱已被使用'}), 409
            user.email = email or None
    if 'daily_limit' in data:
        user.daily_limit = data['daily_limit']  # None means use default

    db.session.commit()
    return jsonify({'success': True, 'user': user.to_admin_dict()})


@auth_bp.route('/api/auth/users/<int:user_id>/reset-password', methods=['POST'])
@require_admin
def reset_user_password(user_id: int):
    """Admin: reset user password."""
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': '用户不存在'}), 404

    data = request.get_json(silent=True)
    new_password = (data.get('new_password') or 'admin123') if data else 'admin123'

    valid, msg = validate_password_strength(new_password)
    if not valid:
        return jsonify({'error': msg}), 400

    user.set_password(new_password)
    user.must_change_password = True
    db.session.commit()

    return jsonify({'success': True, 'message': f'密码已重置为: {new_password}'})


@auth_bp.route('/api/auth/users/<int:user_id>', methods=['DELETE'])
@require_admin
def delete_user(user_id: int):
    """Admin: delete a user."""
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': '用户不存在'}), 404

    if user.role == 'admin':
        admin_count = User.query.filter_by(role='admin').count()
        if admin_count <= 1:
            return jsonify({'error': '不能删除唯一的管理员账号'}), 400

    db.session.delete(user)
    db.session.commit()
    return jsonify({'success': True, 'message': '用户已删除'})
