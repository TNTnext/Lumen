"""
插件管理 API — /api/admin/plugins
"""
from flask import Blueprint, request, jsonify
from auth_utils import require_admin, get_current_user
from plugins import get_registry

plugin_bp = Blueprint('plugins', __name__, url_prefix='/api/admin/plugins')


@plugin_bp.route('/', methods=['GET'])
@require_admin
def list_plugins():
    """获取所有插件列表 (含元数据、状态)"""
    registry = get_registry()
    plugins = registry.get_meta_list()

    # 合并数据库中的额外配置
    try:
        from models import PluginConfig
        db_configs = {p.name: p.to_dict() for p in PluginConfig.query.all()}
        for p in plugins:
            if p['name'] in db_configs:
                p['db_config'] = db_configs[p['name']]
    except Exception:
        pass

    return jsonify({'plugins': plugins, 'count': len(plugins)})


@plugin_bp.route('/<name>/toggle', methods=['PUT'])
@require_admin
def toggle_plugin(name):
    """启用/禁用插件"""
    data = request.get_json() or {}
    enabled = data.get('enabled', True)

    registry = get_registry()
    plugin = registry.get_plugin(name)
    if not plugin:
        return jsonify({'error': f'Plugin "{name}" not found'}), 404

    plugin.meta.enabled = enabled
    if enabled:
        plugin.on_enable()
    else:
        plugin.on_disable()

    # 持久化到数据库
    _upsert_db_config(name, enabled=enabled)

    return jsonify({
        'success': True,
        'name': name,
        'enabled': enabled
    })


@plugin_bp.route('/<name>/priority', methods=['PUT'])
@require_admin
def set_plugin_priority(name):
    """设置插件优先级"""
    data = request.get_json() or {}
    priority = data.get('priority', 50)

    registry = get_registry()
    plugin = registry.get_plugin(name)
    if not plugin:
        return jsonify({'error': f'Plugin "{name}" not found'}), 404

    plugin.meta.priority = max(0, min(100, int(priority)))
    _upsert_db_config(name, priority=plugin.meta.priority)

    return jsonify({
        'success': True,
        'name': name,
        'priority': plugin.meta.priority
    })


@plugin_bp.route('/<name>/config', methods=['GET', 'PUT'])
@require_admin
def plugin_config(name):
    """获取/更新插件配置"""
    registry = get_registry()
    plugin = registry.get_plugin(name)
    if not plugin:
        return jsonify({'error': f'Plugin "{name}" not found'}), 404

    if request.method == 'GET':
        return jsonify({'name': name, 'config': plugin.meta.config})

    data = request.get_json() or {}
    plugin.meta.config = data.get('config', {})
    _upsert_db_config(name, config=plugin.meta.config)

    return jsonify({
        'success': True,
        'name': name,
        'config': plugin.meta.config
    })


@plugin_bp.route('/<name>/reload', methods=['POST'])
@require_admin
def reload_plugin(name):
    """热重载插件 (从文件重新加载)"""
    registry = get_registry()
    try:
        registry.reload_plugin(name)
        return jsonify({'success': True, 'name': name, 'message': 'Plugin reloaded'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@plugin_bp.route('/reorder', methods=['PUT'])
@require_admin
def reorder_plugins():
    """批量更新插件优先级排序"""
    data = request.get_json() or {}
    order = data.get('order', [])  # [{name, priority}, ...]

    registry = get_registry()
    for item in order:
        name = item.get('name')
        priority = item.get('priority', 50)
        plugin = registry.get_plugin(name)
        if plugin:
            plugin.meta.priority = max(0, min(100, int(priority)))
            _upsert_db_config(name, priority=plugin.meta.priority)

    return jsonify({'success': True, 'order': order})


@plugin_bp.route('/tools', methods=['GET'])
@require_admin
def list_tools():
    """列出所有插件提供的工具"""
    registry = get_registry()
    tools = registry.collect_tools()
    return jsonify({'tools': tools, 'count': len(tools)})


@plugin_bp.route('/pages', methods=['GET'])
@require_admin
def list_pages():
    """列出所有插件提供的自定义页面"""
    registry = get_registry()
    pages = registry.get_all_pages()
    return jsonify({'pages': pages, 'count': len(pages)})


@plugin_bp.route('/page/<plugin_name>/<page_id>', methods=['GET'])
@require_admin
def get_page_content(plugin_name, page_id):
    """获取插件自定义页面的 HTML 内容"""
    registry = get_registry()
    content = registry.get_page_content(plugin_name, page_id)
    if content is None:
        return jsonify({'error': 'Page not found'}), 404
    return content  # 直接返回 HTML


@plugin_bp.route('/routes', methods=['GET'])
@require_admin
def list_api_routes():
    """列出所有插件提供的自定义 API 路由"""
    registry = get_registry()
    routes = registry.get_all_api_routes()
    # 不暴露 handler 函数对象
    safe_routes = [{
        'plugin_name': r['plugin_name'],
        'method': r['method'],
        'path': r['path'],
        'auth_required': r['auth_required'],
        'admin_only': r['admin_only'],
    } for r in routes]
    return jsonify({'routes': safe_routes, 'count': len(safe_routes)})


# —— 辅助 ——

def _upsert_db_config(name: str, enabled=None, priority=None, config=None):
    """更新或创建插件数据库配置"""
    try:
        from models import PluginConfig
        from app import db
        import json as _json

        cfg = PluginConfig.query.filter_by(name=name).first()
        if not cfg:
            plugin = get_registry().get_plugin(name)
            cfg = PluginConfig(
                name=name,
                display_name=plugin.meta.display_name if plugin else name,
                enabled=True,
                priority=50,
                config_json='{}'
            )
            db.session.add(cfg)

        if enabled is not None:
            cfg.enabled = enabled
        if priority is not None:
            cfg.priority = priority
        if config is not None:
            cfg.config_json = _json.dumps(config)

        db.session.commit()
    except Exception as e:
        import logging
        logging.getLogger(__name__).warning(f"Failed to upsert plugin config: {e}")
