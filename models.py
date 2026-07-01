"""Database models for AI Chat Application."""
import json
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')
    is_active = db.Column(db.Boolean, default=True)
    must_change_password = db.Column(db.Boolean, default=False)
    daily_chat_count = db.Column(db.Integer, default=0)
    daily_chat_date = db.Column(db.Date, nullable=True)
    daily_limit = db.Column(db.Integer, nullable=True)  # Per-user daily chat limit (None = use global)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    conversations = db.relationship('Conversation', back_populates='user', lazy='dynamic',
                                    cascade='all, delete-orphan')
    user_permissions = db.relationship('UserPermission', back_populates='user', uselist=False,
                                       cascade='all, delete-orphan', lazy='joined')

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'must_change_password': self.must_change_password,
            'daily_limit': self.daily_limit,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }

    def to_admin_dict(self):
        d = self.to_dict()
        d['daily_chat_count'] = self.daily_chat_count
        d['conversation_count'] = self.conversations.count()
        d['updated_at'] = self.updated_at.isoformat() if self.updated_at else None
        return d


class Conversation(db.Model):
    __tablename__ = 'conversations'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    title = db.Column(db.String(200), default='新对话')
    model = db.Column(db.String(50), default='deepseek-chat')
    total_tokens = db.Column(db.Integer, default=0)
    message_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='conversations')
    messages = db.relationship('Message', back_populates='conversation', lazy='dynamic',
                               cascade='all, delete-orphan', order_by='Message.created_at')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'title': self.title,
            'model': self.model,
            'total_tokens': self.total_tokens,
            'message_count': self.message_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }


class Message(db.Model):
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    conversation_id = db.Column(db.Integer, db.ForeignKey('conversations.id'),
                                nullable=False, index=True)
    role = db.Column(db.String(20), nullable=False)
    content = db.Column(db.Text, nullable=False)
    tokens = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    conversation = db.relationship('Conversation', back_populates='messages')

    def to_dict(self):
        return {
            'id': self.id,
            'conversation_id': self.conversation_id,
            'role': self.role,
            'content': self.content,
            'tokens': self.tokens,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }


class GlobalPermission(db.Model):
    __tablename__ = 'global_permissions'

    id = db.Column(db.Integer, primary_key=True)
    max_daily_chats = db.Column(db.Integer, default=100)
    allowed_models = db.Column(db.String(500), default='deepseek-chat,deepseek-reasoner')
    max_tokens_per_request = db.Column(db.Integer, default=4096)
    allow_export = db.Column(db.Boolean, default=False)
    allow_file_upload = db.Column(db.Boolean, default=False)
    rate_limit_per_minute = db.Column(db.Integer, default=10)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        return {
            'id': self.id,
            'max_daily_chats': self.max_daily_chats,
            'allowed_models': self.allowed_models.split(',') if self.allowed_models else [],
            'max_tokens_per_request': self.max_tokens_per_request,
            'allow_export': self.allow_export,
            'allow_file_upload': self.allow_file_upload,
            'rate_limit_per_minute': self.rate_limit_per_minute,
        }


class UserPermission(db.Model):
    __tablename__ = 'user_permissions'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    use_custom = db.Column(db.Boolean, default=False)
    max_daily_chats = db.Column(db.Integer, nullable=True)
    allowed_models = db.Column(db.String(500), nullable=True)
    max_tokens_per_request = db.Column(db.Integer, nullable=True)
    allow_export = db.Column(db.Boolean, nullable=True)
    allow_file_upload = db.Column(db.Boolean, nullable=True)
    rate_limit_per_minute = db.Column(db.Integer, nullable=True)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='user_permissions')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'use_custom': self.use_custom,
            'max_daily_chats': self.max_daily_chats,
            'allowed_models': self.allowed_models.split(',') if self.allowed_models else [],
            'max_tokens_per_request': self.max_tokens_per_request,
            'allow_export': self.allow_export,
            'allow_file_upload': self.allow_file_upload,
            'rate_limit_per_minute': self.rate_limit_per_minute,
        }


class SystemConfig(db.Model):
    __tablename__ = 'system_configs'

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False, index=True)
    value = db.Column(db.Text, nullable=True)
    is_encrypted = db.Column(db.Boolean, default=False)
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))


# ── API endpoint toggle ──────────────────────────────
ENDPOINT_GROUPS = {
    'auth':    '认证接口',
    'chat':    '对话接口',
    'admin':   '管理接口',
}

# Default endpoints that can be toggled
DEFAULT_ENDPOINTS = [
    # Auth
    {'endpoint': '/api/auth/register',     'description': '用户注册',       'group': 'auth',   'enabled': True},
    {'endpoint': '/api/auth/login',        'description': '用户登录',       'group': 'auth',   'enabled': True},
    {'endpoint': '/api/auth/logout',       'description': '用户登出',       'group': 'auth',   'enabled': True},
    {'endpoint': '/api/auth/me',           'description': '获取用户信息',   'group': 'auth',   'enabled': True},
    {'endpoint': '/api/auth/change-password','description': '修改密码',     'group': 'auth',   'enabled': True},
    # Chat
    {'endpoint': '/api/chat/send',         'description': '发送消息',       'group': 'chat',   'enabled': True},
    {'endpoint': '/api/chat/send-stream',  'description': '流式发送消息',   'group': 'chat',   'enabled': True},
    {'endpoint': '/api/chat/conversations','description': '对话列表',       'group': 'chat',   'enabled': True},
    {'endpoint': '/api/chat/conversations/<id>','description': '对话详情/删除','group':'chat',   'enabled': True},
    {'endpoint': '/api/chat/models',       'description': '可用模型列表',   'group': 'chat',   'enabled': True},
    # Admin
    {'endpoint': '/api/admin/dashboard',   'description': '数据看板',       'group': 'admin',  'enabled': True},
    {'endpoint': '/api/admin/users',       'description': '用户管理',       'group': 'admin',  'enabled': True},
    {'endpoint': '/api/admin/conversations','description': '对话管理',      'group': 'admin',  'enabled': True},
    {'endpoint': '/api/admin/permissions', 'description': '权限管理',       'group': 'admin',  'enabled': True},
    {'endpoint': '/api/admin/config',      'description': '系统配置',       'group': 'admin',  'enabled': True},
    {'endpoint': '/api/admin/reset',       'description': '系统重置',       'group': 'admin',  'enabled': True},
]


class EndpointToggle(db.Model):
    """API endpoint on/off toggle."""
    __tablename__ = 'endpoint_toggle'

    id = db.Column(db.Integer, primary_key=True)
    endpoint = db.Column(db.String(256), unique=True, nullable=False, index=True)
    enabled = db.Column(db.Boolean, default=True, nullable=False)
    description = db.Column(db.String(256), default='')
    group = db.Column(db.String(64), default='other')

    def to_dict(self):
        return {
            'id': self.id,
            'endpoint': self.endpoint,
            'enabled': self.enabled,
            'description': self.description,
            'group': self.group,
        }


class VendorConfig(db.Model):
    """Per-vendor API key, base URL, enabled status, and model priority list."""
    __tablename__ = 'vendor_configs'

    id = db.Column(db.Integer, primary_key=True)
    vendor_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    display_name = db.Column(db.String(100), nullable=True)
    api_key = db.Column(db.String(500), nullable=True)
    base_url = db.Column(db.String(500), nullable=True)
    enabled = db.Column(db.Boolean, default=False)
    priority = db.Column(db.Integer, default=0)
    default_model = db.Column(db.String(100), nullable=True)
    model_priorities = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    def get_model_priorities(self) -> list:
        """Return ordered model priority list: [{'model': 'gpt-4o', 'priority': 1}, ...]"""
        if not self.model_priorities:
            return []
        try:
            return json.loads(self.model_priorities)
        except (json.JSONDecodeError, TypeError):
            return []

    def set_model_priorities(self, models: list):
        """Set ordered model priority list."""
        self.model_priorities = json.dumps(models, ensure_ascii=False)

    def to_dict(self):
        return {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'display_name': self.display_name,
            'api_key': self.api_key[:8] + '••••' + self.api_key[-4:] if self.api_key and len(self.api_key) > 12 else (self.api_key or ''),
            'base_url': self.base_url,
            'enabled': self.enabled,
            'priority': self.priority,
            'default_model': self.default_model,
            'model_priorities': self.get_model_priorities(),
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

    def to_admin_dict(self):
        """Full dict including raw api_key for admin use."""
        d = self.to_dict()
        d['api_key'] = self.api_key or ''
        return d


class ThemeConfig(db.Model):
    """自定义主题配置表"""
    __tablename__ = 'theme_configs'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    is_active = db.Column(db.Boolean, default=False)
    colors_json = db.Column(db.Text, default='{}')      # 浅色颜色
    dark_colors_json = db.Column(db.Text, default='{}') # 深色颜色
    fonts_json = db.Column(db.Text, default='{}')       # {heading, body, mono}
    shadows_json = db.Column(db.Text, default='{}')     # {sm, md, lg, xl}
    radius = db.Column(db.String(20), default='0.75rem')
    custom_css = db.Column(db.Text, default='')         # 用户自定义 CSS
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def get_colors(self) -> dict:
        try: return json.loads(self.colors_json)
        except (json.JSONDecodeError, TypeError): return {}

    def set_colors(self, colors: dict):
        self.colors_json = json.dumps(colors, ensure_ascii=False)

    def get_dark_colors(self) -> dict:
        try: return json.loads(self.dark_colors_json)
        except (json.JSONDecodeError, TypeError): return {}

    def set_dark_colors(self, colors: dict):
        self.dark_colors_json = json.dumps(colors, ensure_ascii=False)

    def get_fonts(self) -> dict:
        try: return json.loads(self.fonts_json)
        except (json.JSONDecodeError, TypeError): return {}

    def set_fonts(self, fonts: dict):
        self.fonts_json = json.dumps(fonts, ensure_ascii=False)

    def get_shadows(self) -> dict:
        try: return json.loads(self.shadows_json)
        except (json.JSONDecodeError, TypeError): return {}

    def set_shadows(self, shadows: dict):
        self.shadows_json = json.dumps(shadows, ensure_ascii=False)

    def to_dict(self):
        return {
            'id': self.id, 'name': self.name, 'is_active': self.is_active,
            'colors': self.get_colors(), 'darkColors': self.get_dark_colors(),
            'fonts': self.get_fonts(), 'shadows': self.get_shadows(),
            'radius': self.radius, 'customCSS': self.custom_css,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

    def to_css(self) -> str:
        """Generate CSS custom properties for the theme (light + dark)."""
        colors = self.get_colors()
        dark_colors = self.get_dark_colors()
        fonts = self.get_fonts()
        shadows = self.get_shadows()
        lines = [':root {']
        color_map = {
            'bg': '--color-bg', 'surface': '--color-surface', 'surfaceHover': '--color-surface-hover',
            'border': '--color-border', 'text': '--color-text', 'textSecondary': '--color-text-secondary',
            'textTertiary': '--color-text-tertiary', 'accent': '--color-accent', 'accentHover': '--color-accent-hover',
            'danger': '--color-danger', 'success': '--color-success', 'warning': '--color-warning',
            'sidebar': '--color-sidebar', 'sidebarHover': '--color-sidebar-hover', 'sidebarActive': '--color-sidebar-active',
        }
        for key, var in color_map.items():
            if key in colors: lines.append(f'  {var}: {colors[key]};')
        font_map = {'heading': '--font-sans', 'body': '--font-body', 'mono': '--font-mono'}
        for key, var in font_map.items():
            if key in fonts: lines.append(f'  {var}: {fonts[key]};')
        if self.radius:
            lines.append(f'  --radius-sm: {self.radius};')
            lines.append(f'  --radius-md: calc({self.radius} + 2px);')
            lines.append(f'  --radius-lg: calc({self.radius} + 6px);')
            lines.append(f'  --radius-xl: calc({self.radius} + 10px);')
            lines.append(f'  --radius-2xl: calc({self.radius} + 14px);')
        shadow_map = {'sm': '--shadow-sm', 'md': '--shadow-md', 'lg': '--shadow-lg', 'xl': '--shadow-xl'}
        for key, var in shadow_map.items():
            if key in shadows: lines.append(f'  {var}: {shadows[key]};')
        lines.append('}')
        if dark_colors:
            lines.append('\n[data-theme="dark"] {')
            for key, var in color_map.items():
                if key in dark_colors: lines.append(f'  {var}: {dark_colors[key]};')
            lines.append('}')
        if self.custom_css and self.custom_css.strip():
            lines.append(f'\n/* Custom CSS */\n{self.custom_css}')
        return '\n'.join(lines)


class PluginConfig(db.Model):
    """插件配置表 — 持久化 enabled / priority / config"""
    __tablename__ = 'plugin_configs'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    display_name = db.Column(db.String(200), nullable=False, default='')
    enabled = db.Column(db.Boolean, default=True)
    priority = db.Column(db.Integer, default=50)
    config_json = db.Column(db.Text, default='{}')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'display_name': self.display_name,
            'enabled': self.enabled,
            'priority': self.priority,
            'config': json.loads(self.config_json) if self.config_json else {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
