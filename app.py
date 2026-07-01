"""Main application entry point."""
import os
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db

# In-memory endpoint toggle cache {endpoint_path: bool}
_endpoint_cache = {}
_endpoint_cache_loaded = False


def _load_endpoint_cache():
    """Load endpoint toggle states from DB into memory."""
    global _endpoint_cache, _endpoint_cache_loaded
    from models import EndpointToggle
    toggles = EndpointToggle.query.all()
    _endpoint_cache = {t.endpoint: t.enabled for t in toggles}
    _endpoint_cache_loaded = True


def _check_endpoint_enabled(req_path):
    """Check if the requested API endpoint is enabled. Returns (allowed, endpoint_key)."""
    global _endpoint_cache_loaded
    if not _endpoint_cache_loaded:
        _load_endpoint_cache()

    # Normalize: strip trailing slash, only check /api/ paths
    path = req_path.rstrip('/')
    if not path.startswith('/api/'):
        return True, None

    # Exact match
    if path in _endpoint_cache:
        return _endpoint_cache[path], path

    # Try matching dynamic routes: /api/chat/conversations/123 → /api/chat/conversations/<id>
    parts = path.split('/')
    for i in range(len(parts) - 1, 0, -1):
        candidate = '/'.join(parts[:i]) + '/<id>'
        if candidate in _endpoint_cache:
            return _endpoint_cache[candidate], candidate

    # Unknown endpoint — allow (not managed by toggle system)
    return True, None


def create_app():
    app = Flask(__name__, static_folder='static', static_url_path='/static')
    app.config.from_object(Config)

    # Initialize extensions
    CORS(app, supports_credentials=True)
    db.init_app(app)
    JWTManager(app)

    # ── Endpoint toggle middleware ──
    @app.before_request
    def enforce_endpoint_toggle():
        allowed, key = _check_endpoint_enabled(request.path)
        if not allowed:
            return jsonify({'error': f'接口 {key} 已被管理员关闭', 'disabled_endpoint': key}), 403

    # Register blueprints
    from auth_routes import auth_bp
    from chat_routes import chat_bp
    from admin_routes import admin_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(admin_bp)

    # ── Plugin system ──
    from plugin_routes import plugin_bp
    app.register_blueprint(plugin_bp)
    
    # Create tables and initialize data
    with app.app_context():
        db.create_all()
        _init_default_data()
        
        # Initialize plugin registry (after tables exist)
        from plugins import init_plugins
        import os
        plugin_dir = os.path.join(os.path.dirname(__file__), 'plugins')
        init_plugins(plugin_dir)

    # ── Frontend routes ──
    @app.route('/')
    def index():
        return '', 404

    @app.route('/login')
    @app.route('/login/')
    def serve_login():
        return send_from_directory('static', 'login.html')

    @app.route('/admin')
    @app.route('/admin/')
    def serve_admin():
        return send_from_directory('static', 'admin.html')

    @app.route('/docx')
    @app.route('/docx/')
    def serve_docx_index():
        return send_from_directory('docx', 'index.html')

    @app.route('/docx/<path:filename>')
    def serve_docx_file(filename):
        return send_from_directory('docx', filename)

    @app.route('/<path:path>')
    def serve_static(path):
        if path.startswith('api/'):
            return '', 404
        if os.path.exists(os.path.join('static', path)):
            return send_from_directory('static', path)
        return '', 404

    # Health check
    @app.route('/api/health')
    def health():
        return jsonify({'status': 'ok', 'service': 'Lumen'})

    return app


def _init_default_data():
    """Initialize default data: admin user, global permissions, system configs, endpoint toggles, vendor configs."""
    from models import User, GlobalPermission, SystemConfig, EndpointToggle, VendorConfig, DEFAULT_ENDPOINTS
    from werkzeug.security import generate_password_hash

    # Create default admin
    if not User.query.filter_by(username='admin').first():
        admin = User(
            username='admin',
            email='admin@example.com',
            password_hash=generate_password_hash('admin123'),
            role='admin',
            is_active=True,
            must_change_password=True,
        )
        db.session.add(admin)

    # Create default global permissions
    if not GlobalPermission.query.first():
        perm = GlobalPermission(
            max_daily_chats=100,
            allowed_models='deepseek-chat,deepseek-reasoner',
            max_tokens_per_request=4096,
            allow_export=False,
            allow_file_upload=False,
            rate_limit_per_minute=10,
        )
        db.session.add(perm)

    # Create default system configs
    defaults = {
        'open_registration': 'true',
        'conversation_retention_days': '90',
        'admin_can_view_content': 'false',
        'deepseek_api_key': '',
        'deepseek_base_url': 'https://api.deepseek.com',
    }
    for key, value in defaults.items():
        if not SystemConfig.query.filter_by(key=key).first():
            cfg = SystemConfig(key=key, value=value, is_encrypted=(key == 'deepseek_api_key'))
            db.session.add(cfg)

    # Create default endpoint toggles
    for ep in DEFAULT_ENDPOINTS:
        if not EndpointToggle.query.filter_by(endpoint=ep['endpoint']).first():
            toggle = EndpointToggle(
                endpoint=ep['endpoint'],
                description=ep['description'],
                group=ep['group'],
                enabled=ep['enabled'],
            )
            db.session.add(toggle)

    # Create default vendor configs from model_registry
    from model_registry import VENDORS
    for i, (vendor_id, vendor) in enumerate(VENDORS.items()):
        if not VendorConfig.query.filter_by(vendor_id=vendor_id).first():
            default_models = [{'model': m_id, 'priority': j + 1}
                              for j, m_id in enumerate(vendor['models'].keys())]
            vc = VendorConfig(
                vendor_id=vendor_id,
                display_name=vendor['name'],
                api_key='',
                base_url=vendor['base_url'],
                enabled=(vendor_id == 'deepseek'),
                priority=i + 1,
            )
            vc.set_model_priorities(default_models)
            db.session.add(vc)

    db.session.commit()


app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('DEPLOY_RUN_PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
