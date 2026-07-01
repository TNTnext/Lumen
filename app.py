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

    def _register_plugin_routes(app):
        """Register custom API routes from all enabled plugins."""
        from plugins import get_registry
        from auth_utils import require_admin
        registry = get_registry()
        for route_info in registry.get_all_api_routes():
            try:
                handler = route_info['handler']
                path = route_info['path']
                method = route_info['method']
                admin_only = route_info['admin_only']
                auth_required = route_info['auth_required']

                # Wrap with auth
                if admin_only:
                    handler = require_admin(handler)
                elif auth_required:
                    from flask_jwt_extended import jwt_required
                    handler = jwt_required()(handler)

                # Register as Flask route under /api/plugins/<plugin_name>/...
                full_path = f"/api/plugins/{route_info['plugin_name']}{path}"
                app.add_url_rule(full_path, f"plugin_{route_info['plugin_name']}_{path.replace('/', '_')}", handler, methods=[method])
                import logging
                logging.getLogger(__name__).info(f"Registered plugin route: {method} {full_path}")
            except Exception as e:
                import logging
                logging.getLogger(__name__).warning(f"Failed to register plugin route: {e}")
    
    # Create tables and initialize data
    with app.app_context():
        db.create_all()
        _init_default_data()
        
        # Initialize plugin registry (after tables exist)
        import os
        _ensure_default_files()
        from plugins import init_plugins, get_registry
        plugin_dir = os.path.join(os.path.dirname(__file__), 'plugins')
        init_plugins(plugin_dir)

        # Register plugin custom API routes
        _register_plugin_routes(app)

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


def _ensure_default_files():
    """Auto-create default files in themes/ and plugins/ if missing."""
    import os
    base = os.path.dirname(os.path.abspath(__file__))

    # Ensure themes/__init__.py exists
    themes_dir = os.path.join(base, 'themes')
    os.makedirs(themes_dir, exist_ok=True)
    themes_init = os.path.join(themes_dir, '__init__.py')
    if not os.path.exists(themes_init):
        with open(themes_init, 'w', encoding='utf-8') as f:
            f.write('# Lumen Themes - Custom theme files go here\n')
            f.write('# Each .py file should define get_theme() -> dict\n')

    # Ensure default theme exists
    default_theme = os.path.join(themes_dir, 'lumen_light.py')
    if not os.path.exists(default_theme):
        with open(default_theme, 'w', encoding='utf-8') as f:
            f.write('''# Default Lumen Light Theme
def get_theme():
    return {
        "name": "Lumen Light",
        "is_active": False,
        "colors": {
            "bg": "#f5f5f7", "surface": "#ffffff", "surfaceHover": "#f0f0f2",
            "border": "#e8e8ed", "text": "#1d1d1f", "textSecondary": "#86868b",
            "textTertiary": "#aeaeb2", "accent": "#0071e3", "accentHover": "#0066cc",
            "danger": "#ff3b30", "success": "#34c759", "warning": "#ff9500",
            "sidebar": "#f5f5f7", "sidebarHover": "#ebebf0", "sidebarActive": "#e0e0e5",
            "card": "#ffffff", "muted": "#f0f0f2", "surfaceContainer": "#f5f5f7",
            "error": "#ff3b30"
        },
        "darkColors": {
            "bg": "#1c1c1e", "surface": "#2c2c2e", "surfaceHover": "#3a3a3c",
            "border": "#38383a", "text": "#f5f5f7", "textSecondary": "#98989d",
            "textTertiary": "#636366", "accent": "#0a84ff", "accentHover": "#409cff",
            "danger": "#ff453a", "success": "#30d158", "warning": "#ff9f0a",
            "sidebar": "#1c1c1e", "sidebarHover": "#2c2c2e", "sidebarActive": "#3a3a3c",
            "card": "#2c2c2e", "muted": "#3a3a3c", "surfaceContainer": "#2c2c2e",
            "error": "#ff453a"
        },
        "fonts": {"heading": "-apple-system, sans-serif", "body": "-apple-system, sans-serif", "mono": "SF Mono, monospace"},
        "shadows": {"sm": "0 1px 2px rgba(0,0,0,0.05)", "md": "0 4px 6px rgba(0,0,0,0.07)", "lg": "0 10px 25px rgba(0,0,0,0.1)", "xl": "0 20px 50px rgba(0,0,0,0.15)", "float": "0 8px 30px rgba(0,0,0,0.12)"},
        "radius": "0.75rem",
        "customCSS": ""
    }
''')

    # Ensure plugins/__init__.py exists
    plugins_dir = os.path.join(base, 'plugins')
    os.makedirs(plugins_dir, exist_ok=True)
    plugins_init = os.path.join(plugins_dir, '__init__.py')
    if not os.path.exists(plugins_init):
        # This is critical - copy from template if missing
        _template = '''# Lumen Plugin System
import importlib
import os
import sys
from typing import Any, Dict, List, Optional

class PluginMeta:
    def __init__(self, name, display_name, version, description='', author='', priority=50, category='tool'):
        self.name = name
        self.display_name = display_name
        self.version = version
        self.description = description
        self.author = author
        self.priority = priority
        self.category = category

class ToolDefinition:
    def __init__(self, name, description, parameters):
        self.name = name
        self.description = description
        self.parameters = parameters

class PageDefinition:
    def __init__(self, page_id, title, icon, html_content, js_handler=None):
        self.page_id = page_id
        self.title = title
        self.icon = icon
        self.html_content = html_content
        self.js_handler = js_handler

class ApiRouteDefinition:
    def __init__(self, method, path, handler, description='', auth_required=True):
        self.method = method
        self.path = path
        self.handler = handler
        self.description = description
        self.auth_required = auth_required

class LumenPlugin:
    def __init__(self, meta: PluginMeta):
        self.meta = meta
        self.config: Dict[str, Any] = {}
    def get_tools(self) -> List[ToolDefinition]: return []
    def execute_tool(self, tool_name: str, arguments: Dict, ctx: Dict) -> Dict: return {}
    def pre_chat(self, ctx: Dict) -> Dict: return ctx
    def post_chat(self, response: str, ctx: Dict) -> str: return response
    def on_error(self, error: Exception, ctx: Dict) -> Optional[str]: return None
    def on_enable(self): pass
    def on_disable(self): pass
    def register_pages(self) -> List[PageDefinition]: return []
    def register_api_routes(self) -> List[ApiRouteDefinition]: return []
    def register_db_tables(self) -> List: return []
    def register_middleware(self) -> List[Dict]: return []
    def register_events(self) -> Dict[str, callable]: return {}
    def register_cron_jobs(self) -> List[Dict]: return []
    def on_install(self) -> bool: return True
    def on_uninstall(self) -> bool: return True
    def on_upgrade(self, from_version: str, to_version: str) -> bool: return True
    def on_configure(self, config: Dict) -> bool: return True

_plugin_registry: Dict[str, LumenPlugin] = {}
_plugin_order: List[str] = []

def register_plugin(name: str, plugin: LumenPlugin): pass
def get_plugin(name: str) -> Optional[LumenPlugin]: pass
def get_all_plugins() -> List[LumenPlugin]: pass
def get_enabled_plugins() -> List[LumenPlugin]: pass
'''
        with open(plugins_init, 'w', encoding='utf-8') as f:
            f.write(_template)

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
