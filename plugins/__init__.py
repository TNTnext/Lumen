"""
Lumen 插件系统 — 热插拔、优先级、钩子管线

插件生命周期:
  on_load()      → 插件加载时调用一次
  on_unload()    → 插件卸载时调用一次
  on_enable()    → 插件启用时调用
  on_disable()   → 插件禁用时调用

钩子管线 (按 priority 排序执行):
  pre_chat()     → 消息发送前 (可修改 content / tools)
  post_chat()    → AI 响应后 (可修改 response)
  on_error()     → 出错时

工具注册:
  get_tools()    → 返回 OpenAI function-calling 格式的工具列表
  execute_tool() → 执行工具调用，返回结果
"""

import os
import sys
import json
import logging
import importlib
import traceback
from abc import ABC, abstractmethod
from typing import Dict, List, Any, Optional, Callable
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)


# ═══════════════════════════════════════════════
# 插件元数据
# ═══════════════════════════════════════════════

@dataclass
class PluginMeta:
    """插件元数据 — 每个插件文件必须定义 PLUGIN_META 字典"""
    name: str                    # 唯一标识，如 "web_search"
    display_name: str            # 显示名称
    version: str = "1.0.0"
    description: str = ""
    author: str = ""
    priority: int = 50           # 0-100，越大越先执行
    category: str = "tool"       # tool / middleware / filter
    enabled: bool = True
    config: Dict[str, Any] = field(default_factory=dict)


# ═══════════════════════════════════════════════
# 工具定义
# ═══════════════════════════════════════════════

@dataclass
class ToolDefinition:
    """工具定义 — 用于描述插件提供给 AI 的工具"""
    name: str
    description: str
    parameters: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": self.description,
                "parameters": self.parameters
            }
        }


@dataclass
class PageDefinition:
    """插件自定义页面定义"""
    page_id: str                          # 唯一标识，如 "stats"
    title: str                            # 页面标题
    icon: str = "layout-dashboard"        # Lucide 图标名
    category: str = "plugin"              # 导航分类
    html_content: str = ""                # 页面 HTML 内容（支持内联 <style>/<script>）
    js_handler: Optional[str] = None      # 全局 JS 函数名，页面渲染后调用


@dataclass
class ApiRouteDefinition:
    """插件自定义 API 路由定义"""
    method: str                           # GET/POST/PUT/DELETE
    path: str                             # 路由路径，如 "/hello"
    handler: Callable                     # Flask 视图函数
    auth_required: bool = True            # 是否需要认证
    admin_only: bool = True               # 是否需要管理员权限


# ═══════════════════════════════════════════════
# 插件基类
# ═══════════════════════════════════════════════

class LumenPlugin(ABC):
    """所有插件必须继承此类"""

    meta: PluginMeta

    def __init__(self, meta: PluginMeta):
        self.meta = meta

    # —— 生命周期 ——

    def on_load(self):
        """插件文件被导入时调用"""

    def on_unload(self):
        """插件被卸载时调用"""

    def on_enable(self):
        """插件从禁用变为启用"""

    def on_disable(self):
        """插件从启用变为禁用"""

    # —— 钩子 ——

    def pre_chat(self, ctx: Dict[str, Any]) -> Dict[str, Any]:
        """
        消息发送前钩子
        ctx 包含: content, model, tools, conversation_id, user_id, vendor_config
        返回修改后的 ctx (可增删改)
        """
        return ctx

    def post_chat(self, response: str, ctx: Dict[str, Any]) -> str:
        """
        AI 响应后钩子
        返回修改后的响应文本
        """
        return response

    def on_error(self, error: str, ctx: Dict[str, Any]) -> Optional[str]:
        """
        出错时钩子
        返回 None 表示不处理，返回字符串表示降级响应
        """
        return None

    # —— 工具 ——

    def get_tools(self) -> List[Dict[str, Any]]:
        """返回 OpenAI function-calling 格式的工具列表"""
        return []

    def execute_tool(self, tool_name: str, arguments: Dict[str, Any], ctx: Dict[str, Any]) -> Dict[str, Any]:
        """
        执行工具调用
        返回 {"result": ..., "error": ...}
        """
        return {"error": f"Tool '{tool_name}' not implemented"}

    # —— 自定义页面 ——

    def register_pages(self) -> List[PageDefinition]:
        """返回插件自定义页面列表（显示在管理后台导航中）"""
        return []

    # —— 自定义 API ——

    def register_api_routes(self) -> List[ApiRouteDefinition]:
        """返回插件自定义 API 路由列表（注册到 Flask）"""
        return []

    # —— 数据库表 ——

    def register_db_tables(self) -> List[Any]:
        """注册自定义数据库表（SQLAlchemy Model），db.create_all() 时自动创建"""
        return []

    # —— 中间件 ——

    def register_middleware(self) -> List[Dict[str, Any]]:
        """注册请求/响应中间件，type: before_request|after_request, priority 越小越先"""
        return []

    # —— 事件系统 ——

    def register_events(self) -> Dict[str, callable]:
        """注册事件处理器 {event_name: handler}，内置事件见文档"""
        return {}

    # —— 定时任务 ——

    def register_cron_jobs(self) -> List[Dict[str, Any]]:
        """注册定时任务 {name, interval_seconds, handler, enabled}"""
        return []

    # —— 生命周期 ——

    def on_install(self) -> bool:
        """插件安装时调用"""
        return True

    def on_uninstall(self) -> bool:
        """插件卸载时调用"""
        return True

    def on_upgrade(self, from_version: str, to_version: str) -> bool:
        """插件升级时调用"""
        return True

    def on_configure(self, config: Dict[str, Any]) -> bool:
        """插件配置更新时调用"""
        return True

    # —— 辅助 ——

    def log(self, msg: str, level: str = "info"):
        getattr(logger, level)(f"[{self.meta.name}] {msg}")


# ═══════════════════════════════════════════════
# 插件注册中心
# ═══════════════════════════════════════════════

class PluginRegistry:
    """全局插件注册中心 — 单例"""

    _instance: Optional["PluginRegistry"] = None

    def __init__(self):
        self._plugins: Dict[str, LumenPlugin] = {}     # name → 实例
        self._modules: Dict[str, Any] = {}              # name → module
        self._plugin_dir: str = ""

    @classmethod
    def get(cls) -> "PluginRegistry":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    # —— 注册 / 卸载 ——

    def load_from_directory(self, plugin_dir: str):
        """扫描目录，导入所有 .py 插件文件"""
        self._plugin_dir = plugin_dir
        if not os.path.isdir(plugin_dir):
            os.makedirs(plugin_dir, exist_ok=True)
            return

        sys.path.insert(0, os.path.dirname(plugin_dir))

        for fname in sorted(os.listdir(plugin_dir)):
            if fname.startswith("_") or not fname.endswith(".py"):
                continue
            mod_name = fname[:-3]
            try:
                self._load_plugin(mod_name)
            except Exception as e:
                logger.error(f"Failed to load plugin '{mod_name}': {e}")
                traceback.print_exc()

    def _load_plugin(self, mod_name: str):
        """加载单个插件模块"""
        full_name = f"plugins.{mod_name}"
        if full_name in sys.modules:
            importlib.reload(sys.modules[full_name])
        mod = importlib.import_module(full_name)

        if not hasattr(mod, "PLUGIN_META"):
            logger.warning(f"Plugin '{mod_name}' missing PLUGIN_META, skipping")
            return
        if not hasattr(mod, "create_plugin"):
            logger.warning(f"Plugin '{mod_name}' missing create_plugin(), skipping")
            return

        meta = PluginMeta(**mod.PLUGIN_META)
        plugin = mod.create_plugin(meta)

        # 如果已存在同名插件，先卸载旧版
        if meta.name in self._plugins:
            self._plugins[meta.name].on_unload()

        self._plugins[meta.name] = plugin
        self._modules[meta.name] = mod
        plugin.on_load()
        logger.info(f"Plugin loaded: {meta.name} v{meta.version} (priority={meta.priority})")

    def reload_plugin(self, name: str):
        """热重载单个插件"""
        if name not in self._modules:
            raise ValueError(f"Plugin '{name}' not found")
        self._load_plugin(name)
        # 同步数据库状态
        self._sync_from_db()

    def unload_plugin(self, name: str):
        """卸载插件"""
        if name in self._plugins:
            self._plugins[name].on_unload()
            del self._plugins[name]
        if name in self._modules:
            del self._modules[name]

    # —— 数据库同步 ——

    def _sync_from_db(self):
        """从数据库读取 enabled / priority / config 并同步到插件实例"""
        try:
            from models import PluginConfig
            from app import db
            configs = {p.name: p for p in PluginConfig.query.all()}
            for name, plugin in self._plugins.items():
                if name in configs:
                    cfg = configs[name]
                    plugin.meta.enabled = cfg.enabled
                    plugin.meta.priority = cfg.priority
                    if cfg.config_json:
                        try:
                            plugin.meta.config = json.loads(cfg.config_json)
                        except json.JSONDecodeError:
                            plugin.meta.config = {}
        except Exception as e:
            logger.warning(f"Failed to sync plugins from DB: {e}")

    # —— 查询 ——

    def get_plugin(self, name: str) -> Optional[LumenPlugin]:
        return self._plugins.get(name)

    def get_all(self) -> List[LumenPlugin]:
        return sorted(self._plugins.values(), key=lambda p: (-p.meta.priority, p.meta.name))

    def get_enabled(self) -> List[LumenPlugin]:
        return sorted(
            [p for p in self._plugins.values() if p.meta.enabled],
            key=lambda p: (-p.meta.priority, p.meta.name)
        )

    def get_all_tools(self) -> List[Dict[str, Any]]:
        """获取所有已启用插件的 tools（用于注入 AI 请求）"""
        tools = []
        for name in sorted(self._plugin_order, key=lambda n: self._plugins[n].priority):
            plugin = self._plugins.get(name)
            if plugin and plugin.enabled:
                try:
                    plugin_tools = plugin.get_tools()
                    for t in plugin_tools:
                        if isinstance(t, ToolDefinition):
                            tools.append(t.to_dict())
                        elif isinstance(t, dict):
                            tools.append(t)
                except Exception as e:
                    logger.warning(f"Plugin {name} get_tools error: {e}")
        return tools

    def get_meta_list(self) -> List[Dict[str, Any]]:
        """返回所有插件的元数据 (给 API)"""
        result = []
        for p in self.get_all():
            result.append({
                "name": p.meta.name,
                "display_name": p.meta.display_name,
                "version": p.meta.version,
                "description": p.meta.description,
                "author": p.meta.author,
                "priority": p.meta.priority,
                "enabled": p.meta.enabled,
                "config": p.meta.config,
                "has_tools": len(p.get_tools()) > 0,
                "tools": [t.name for t in p.get_tools()],
            })
        return result

    # —— 管线执行 ——

    def run_pre_chat(self, ctx: Dict[str, Any]) -> Dict[str, Any]:
        """按优先级执行所有已启用插件的 pre_chat 钩子"""
        for plugin in self.get_enabled():
            try:
                ctx = plugin.pre_chat(ctx)
            except Exception as e:
                logger.error(f"Plugin '{plugin.meta.name}' pre_chat error: {e}")
        return ctx

    def run_post_chat(self, response: str, ctx: Dict[str, Any]) -> str:
        """按优先级执行所有已启用插件的 post_chat 钩子"""
        for plugin in self.get_enabled():
            try:
                response = plugin.post_chat(response, ctx)
            except Exception as e:
                logger.error(f"Plugin '{plugin.meta.name}' post_chat error: {e}")
        return response

    def run_on_error(self, error: str, ctx: Dict[str, Any]) -> Optional[str]:
        """按优先级执行 on_error 钩子，第一个非 None 返回值作为降级响应"""
        for plugin in self.get_enabled():
            try:
                result = plugin.on_error(error, ctx)
                if result is not None:
                    return result
            except Exception as e:
                logger.error(f"Plugin '{plugin.meta.name}' on_error error: {e}")
        return None

    def collect_tools(self) -> List[Dict[str, Any]]:
        """收集所有已启用插件的工具定义"""
        tools = []
        seen = set()
        for plugin in self.get_enabled():
            for tool in plugin.get_tools():
                td = tool.to_dict() if hasattr(tool, 'to_dict') else tool
                name = td.get("function", {}).get("name", "")
                if name and name not in seen:
                    tools.append(td)
                    seen.add(name)
        return tools

    def get_all_pages(self) -> List[Dict[str, Any]]:
        """收集所有已启用插件的自定义页面"""
        pages = []
        for plugin in self.get_enabled():
            try:
                for p in plugin.register_pages():
                    pages.append({
                        "plugin_name": plugin.meta.name,
                        "plugin_display": plugin.meta.display_name,
                        "page_id": p.page_id,
                        "title": p.title,
                        "icon": p.icon,
                        "category": p.category,
                        "js_handler": p.js_handler,
                        "has_html": bool(p.html_content),
                    })
            except Exception as e:
                logger.warning(f"Plugin '{plugin.meta.name}' register_pages error: {e}")
        return pages

    def get_page_content(self, plugin_name: str, page_id: str) -> Optional[str]:
        """获取插件自定义页面的 HTML 内容"""
        plugin = self.get_plugin(plugin_name)
        if not plugin or not plugin.meta.enabled:
            return None
        for p in plugin.register_pages():
            if p.page_id == page_id:
                return p.html_content
        return None

    def get_all_api_routes(self) -> List[Dict[str, Any]]:
        """收集所有已启用插件的自定义 API 路由"""
        routes = []
        for plugin in self.get_enabled():
            try:
                for r in plugin.register_api_routes():
                    routes.append({
                        "plugin_name": plugin.meta.name,
                        "method": r.method.upper(),
                        "path": r.path,
                        "auth_required": r.auth_required,
                        "admin_only": r.admin_only,
                        "handler": r.handler,
                    })
            except Exception as e:
                logger.warning(f"Plugin '{plugin.meta.name}' register_api_routes error: {e}")
        return routes

    def execute_tool(self, tool_name: str, arguments: Dict[str, Any], ctx: Dict[str, Any]) -> Dict[str, Any]:
        """查找并执行工具"""
        for plugin in self.get_enabled():
            for tool in plugin.get_tools():
                td = tool.to_dict() if hasattr(tool, 'to_dict') else tool
                if td.get("function", {}).get("name") == tool_name:
                    try:
                        return plugin.execute_tool(tool_name, arguments, ctx)
                    except Exception as e:
                        logger.error(f"Plugin '{plugin.meta.name}' tool '{tool_name}' error: {e}")
                        return {"error": str(e)}
        return {"error": f"Tool '{tool_name}' not found"}


# ═══════════════════════════════════════════════
# 便捷函数
# ═══════════════════════════════════════════════

def get_registry() -> PluginRegistry:
    return PluginRegistry.get()


def init_plugins(plugin_dir: str):
    """初始化插件系统 — 在 app.py 中调用"""
    registry = PluginRegistry.get()
    registry.load_from_directory(plugin_dir)
    try:
        registry._sync_from_db()
    except Exception:
        pass  # 首次启动数据库可能还没建表
