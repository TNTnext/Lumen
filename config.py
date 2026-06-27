import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = 3600 * 24  # 24 hours

    # DeepSeek defaults (can be overridden via admin panel)
    DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY', '')
    DEEPSEEK_BASE_URL = os.environ.get('DEEPSEEK_BASE_URL', 'https://api.deepseek.com')
    DEEPSEEK_MODELS = ['deepseek-chat', 'deepseek-reasoner']

    # App settings
    OPEN_REGISTRATION = os.environ.get('OPEN_REGISTRATION', 'true').lower() == 'true'
    CONVERSATION_RETENTION_DAYS = int(os.environ.get('CONVERSATION_RETENTION_DAYS', '90'))
