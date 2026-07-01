import os
from dotenv import load_dotenv

load_dotenv()


def _build_database_uri():
    """Build database URI from environment or config."""
    db_type = os.environ.get('DATABASE_TYPE', 'sqlite').lower()

    if db_type == 'sqlite':
        return os.environ.get('DATABASE_URL', 'sqlite:///app.db')

    db_host = os.environ.get('DB_HOST', 'localhost')
    db_port = os.environ.get('DB_PORT', '5432' if db_type == 'postgresql' else '3306')
    db_name = os.environ.get('DB_NAME', 'lumen')
    db_user = os.environ.get('DB_USER', 'lumen')
    db_password = os.environ.get('DB_PASSWORD', '')

    if db_type == 'postgresql':
        return f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
    elif db_type == 'mysql':
        return f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

    return os.environ.get('DATABASE_URL', 'sqlite:///app.db')


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    SQLALCHEMY_DATABASE_URI = _build_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = 3600 * 24  # 24 hours

    # DeepSeek defaults (can be overridden via admin panel)
    DEEPSEEK_API_KEY = os.environ.get('DEEPSEEK_API_KEY', '')
    DEEPSEEK_BASE_URL = os.environ.get('DEEPSEEK_BASE_URL', 'https://api.deepseek.com')
    DEEPSEEK_MODELS = ['deepseek-chat', 'deepseek-reasoner']

    # App settings
    OPEN_REGISTRATION = os.environ.get('OPEN_REGISTRATION', 'true').lower() == 'true'
    CONVERSATION_RETENTION_DAYS = int(os.environ.get('CONVERSATION_RETENTION_DAYS', '90'))
