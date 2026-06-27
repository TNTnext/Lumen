"""Database models for AI Chat Application."""
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
