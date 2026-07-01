# Lumen

> *点亮你的 AI 基础设施。一条命令，无限模型。*

<p align="center">
  <img src="https://img.shields.io/badge/python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/flask-3.1-000000?style=flat-square&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/sqlite-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
</p>

---

## 概述

Lumen 是一款自托管的 AI 网关与对话管理平台。内置接入 **9 家大模型厂商**（DeepSeek、OpenAI、Anthropic、Kimi、GLM 等），也支持添加任意 OpenAI 兼容的自定义端点。多用户体系、细粒度权限、接口独立开关、简洁的管理后台——一行 `python app.py` 全部搞定。

### 为什么叫 Lumen

市面上大多数 AI 对话前端要么过于简陋（单用户、无权限），要么过于复杂（Kubernetes、微服务）。Lumen 取「光」之意——**轻量、通透、开箱即用**，像一束光照亮你的 AI 基础设施。

---

## 功能特性

| 分类 | 能力 |
|------|------|
| **多厂商接入** | 9 家内置厂商 + 自定义 OpenAI 兼容端点 |
| **模型能力** | 流式输出 · 深度推理 · 图片识别 · 函数调用 · 文件上传 · 联网搜索 |
| **用户系统** | 注册（可开关）· JWT 认证 · 角色分级（管理员/用户）· 强制改密 |
| **权限控制** | 两级权限：全局默认 + 用户单独覆盖。每日限额、模型白名单、Token 上限、频率限制、导出控制 |
| **多厂商故障转移** | 独立配置每个厂商 · 自定义模型优先级 · 失败自动切换 · 每厂商独立 API Key 和 Base URL · 跨厂商模型优先级排序 |
| **插件系统** | 热插拔架构 · 10+ 项能力：AI 工具、消息钩子、自定义页面、自定义 API、数据库表、中间件、事件系统、定时任务、生命周期钩子 · 3 个内置插件（计算器、网页搜索、翻译器）· 8 个工具 · 优先级排序 · 支持自定义插件 |
| **多数据库** | SQLite（默认，零配置）· PostgreSQL · MySQL · 通过管理面板或新手引导配置 |
| **管理后台** | 实时统计看板 · 用户增删改查 · 对话浏览 · 权限编辑 · 厂商管理 · 接口开关 · 插件管理 · 主题管理 · 数据库配置 · 中英双语 · 自适应布局 · 自动语言检测 |
| **新手引导** | 首次登录一站式配置：密码、**多厂商**、API Key、权限、注册策略、数据库配置 · 低调跳过按钮 |
| **安全防护** | bcrypt 密码哈希 · AES 加密存储 API Key · SQL 注入防护 · CORS · CSRF 保护 |
| **性能优化** | 内存缓存 · 查询合并 · N+1 消除 · CDN 预连接 |
| **测试工具** | 系统全量测试（45+ 用例）· API 冒烟测试 · 数据库连接测试 |

---

## 快速开始

```bash
# 1. 克隆项目
git clone <repo-url> && cd lumen

# 2. 安装依赖
pip install -r requirements.txt

# 3. 启动服务
python app.py
```

打开 `http://localhost:5000/login`，使用 **`admin` / `admin123`** 登录。  
首次登录将自动进入新手引导流程。

### 默认端口

服务监听 `DEPLOY_RUN_PORT` 环境变量指定的端口（默认 `5000`）。

---

## 系统架构

```
┌──────────────┐     ┌──────────────────────────────────────┐
│   浏览器      │────▶│  Flask (app.py)                       │
│  /admin SPA  │     │  ├── auth_routes.py   (JWT 认证)      │
│  /login      │     │  ├── chat_routes.py   (AI 对话)       │
└──────────────┘     │  ├── admin_routes.py  (管理后台)      │
                     │  ├── plugin_routes.py (插件管理)       │
                     │  ├── ai_service.py    (多厂商统一调用)  │
                     │  ├── model_registry.py (模型能力矩阵)   │
                     │  ├── plugins/         (3 个内置插件)    │
                     │  └── models.py        (SQLAlchemy)     │
                     └──────────────────────────────────────┘
```

### API 接口

| 分组 | 接口 |
|------|------|
| **认证** | `POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me` · `PUT /api/auth/change-password` |
| **对话** | `POST /api/chat/send` · `GET /api/chat/models` · `GET /api/chat/conversations` · `GET /api/chat/conversations/<id>` · `DELETE /api/chat/conversations/<id>` |
| **管理** | `GET /api/admin/dashboard` · `GET/PUT /api/admin/users` · `GET/PUT /api/admin/permissions` · `GET/PUT /api/admin/config` · `GET/PUT /api/admin/config/database` · `GET /api/admin/vendors` · `GET/POST/PUT/DELETE /api/admin/vendor-configs` · `GET/PUT /api/admin/endpoints` · `POST /api/admin/onboarding/complete` · `POST /api/admin/reset` |
| **插件** | `GET /api/admin/plugins` · `PUT /api/admin/plugins/<name>` · `POST /api/admin/plugins/reload` · `PUT /api/admin/plugins/reorder` · `GET /api/admin/plugins/tools` |

完整 API 文档请访问 `/docx/`。

---

## 支持的厂商与模型

<details>
<summary>点击展开完整能力矩阵</summary>

| 厂商 | 模型 | 文本 | 流式 | 推理 | 视觉 | 工具 | 文件 | 搜索 |
|------|------|:----:|:----:|:----:|:----:|:----:|:----:|:----:|
| **DeepSeek** | deepseek-chat (V3.2) | ✓ | ✓ | — | — | ✓ | ✓ | — |
| | deepseek-reasoner (V3.2) | ✓ | ✓ | ✓ | — | — | — | — |
| | deepseek-v4-flash / v4-pro | ✓ | ✓ | ✓ | — | ✓ | ✓ | — |
| **OpenAI** | gpt-4o / gpt-4o-mini | ✓ | ✓ | — | ✓ | ✓ | ✓ | — |
| | gpt-4.1 / gpt-4.1-mini | ✓ | ✓ | — | ✓ | ✓ | ✓ | — |
| | o3 / o4-mini | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| **Anthropic** | claude-sonnet-4-20250514 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| | claude-opus-4-20250514 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| | claude-3-5-haiku-20241022 | ✓ | ✓ | — | ✓ | ✓ | — | — |
| **Kimi** | kimi-k2.5 (旗舰) | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| | kimi-k2-0905-preview | ✓ | ✓ | ✓ | — | ✓ | — | — |
| | moonshot-v1-8k/32k/128k | ✓ | ✓ | — | — | ✓ | ✓ | — |
| **火山引擎** | doubao-seed-2-1-pro/turbo | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| | doubao-seed-2-0-lite | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| | doubao-seed-1-6 / 1-6-flash | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| **阿里云** | qwen-max (Qwen3) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| | qwen-plus (Qwen3.6) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| | qwen-turbo / qwen-coder-plus | ✓ | ✓ | ✓ | — | ✓ | ✓ | — |
| **xAI** | grok-4.3 | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| | grok-build-0.1 | ✓ | ✓ | ✓ | — | ✓ | — | — |
| **GLM** | glm-5.1 / glm-5 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| | glm-4.7 / glm-4.6 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| **Minimax** | MiniMax-M2.7 / M2.5 | ✓ | ✓ | ✓ | — | ✓ | — | ✓ |
| | abab6.5s-chat | ✓ | ✓ | — | — | ✓ | — | — |

> **自定义端点**：通过管理后台添加任意 OpenAI 兼容的 API 端点，Lumen 会尽可能自动检测模型能力。

</details>

---

## 数据库支持

Lumen 支持三种数据库后端：

| 后端 | 状态 | 配置要求 |
|------|------|---------|
| **SQLite** | 默认 | 无需配置（零配置） |
| **PostgreSQL** | 支持 | 主机、端口、数据库名、用户名、密码 |
| **MySQL** | 支持 | 主机、端口、数据库名、用户名、密码 |

配置方式：
- **管理后台**：侧边栏点击「数据库」
- **新手引导**：首次设置第 6 步
- **环境变量**：`DB_TYPE`、`DB_HOST`、`DB_PORT`、`DB_NAME`、`DB_USER`、`DB_PASSWORD`

> **注意**：更改数据库类型后需要重启服务。保存前建议先测试连接。

---

## 插件系统

Lumen 采用热插拔插件架构，支持 **10+ 项能力**：

| 插件 | 工具 | 功能说明 |
|------|------|---------|
| **计算器** | `calculate`、`convert_units` | 数学表达式求值和单位换算（长度、重量、温度、数据） |
| **网页搜索** | `web_search`、`fetch_url` | 实时网页搜索和页面内容获取 |
| **翻译器** | `translate`、`summarize`、`extract_keywords`、`count_text` | 多语言翻译（中/英/日/韩/法）、文本摘要、关键词提取 |

### 插件能力

| 能力 | 方法 | 说明 |
|------|------|------|
| **AI 工具** | `get_tools()` / `execute_tool()` | 注册 OpenAI function-calling 工具，自动注入 AI 对话 |
| **消息钩子** | `pre_chat()` / `post_chat()` / `on_error()` | 消息发送前/响应后/错误时拦截和修改 |
| **自定义页面** | `register_pages()` | 注入管理后台自定义页面（完整 HTML/CSS/JS），自动出现在侧边导航 |
| **自定义 API** | `register_api_routes()` | 注册 Flask 路由 `/api/plugins/<插件名>/...` |
| **数据库表** | `register_db_tables()` | 注册自定义 SQLAlchemy Model，安装时自动建表 |
| **中间件** | `register_middleware()` | 注册请求前/响应后拦截器 |
| **事件系统** | `register_events()` | 注册事件处理器（启动、关闭、用户注册、消息发送等） |
| **定时任务** | `register_cron_jobs()` | 注册定时任务，按间隔自动执行 |
| **生命周期** | `on_install()` / `on_uninstall()` / `on_upgrade()` / `on_configure()` | 安装/卸载/升级/配置变更回调 |

### 编写插件

在 `plugins/` 目录下创建 `.py` 文件：

```python
# plugins/my_plugin.py
from plugins import LumenPlugin, PluginMeta, ToolDefinition, PageDefinition, ApiRouteDefinition

PLUGIN_META = {
    "name": "my_plugin",
    "display_name": "我的插件",
    "version": "1.0.0",
    "description": "一个自定义插件示例",
    "author": "Your Name",
    "priority": 50,
    "category": "tool",
}

def create_plugin(meta: PluginMeta):
    return MyPlugin(meta)

class MyPlugin(LumenPlugin):
    def get_tools(self):
        return [ToolDefinition(
            name="my_tool",
            description="处理输入文本",
            parameters={"type": "object", "properties": {"input": {"type": "string"}}, "required": ["input"]}
        )]

    def execute_tool(self, tool_name, arguments, ctx):
        return {"result": f"已处理: {arguments['input']}"}

    def register_pages(self):
        return [PageDefinition(page_id="my_page", title="我的页面", icon="layout-dashboard", html_content="<div class='p-6'><h2>你好！</h2></div>")]

    def register_api_routes(self):
        from flask import jsonify
        return [ApiRouteDefinition(method="GET", path="/hello", handler=lambda: jsonify({"msg": "Hi!"}), auth_required=False)]

    def register_db_tables(self):
        import sqlalchemy as sa
        from models import db
        class MyData(db.Model):
            __tablename__ = "my_data"
            id = sa.Column(sa.Integer, primary_key=True)
            key = sa.Column(sa.String(255))
            value = sa.Column(sa.Text)
        return [MyData]

    def register_middleware(self):
        def log_request():
            from flask import g
            import time
            g.start = time.time()
        return [{"type": "before_request", "handler": log_request, "priority": 10}]

    def register_events(self):
        return {"message.sent": lambda data: print(f"消息来自 {data['user']}")}

    def register_cron_jobs(self):
        return [{"name": "cleanup", "interval_seconds": 3600, "handler": lambda: print("每小时清理"), "enabled": True}]
```

放入文件后，通过 **管理后台 → 插件管理 → 热重载** 即可生效。

### 插件 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/plugins/` | 获取所有插件及状态 |
| PUT | `/api/admin/plugins/<name>/toggle` | 切换插件启用/禁用 |
| PUT | `/api/admin/plugins/<name>` | 更新插件配置 |
| POST | `/api/admin/plugins/reload` | 热重载所有插件 |
| PUT | `/api/admin/plugins/reorder` | 批量排序插件优先级 |
| GET | `/api/admin/plugins/tools` | 列出所有已启用插件工具 |
| GET | `/api/admin/plugins/pages` | 列出所有插件自定义页面 |
| GET | `/api/admin/plugins/routes` | 列出所有插件自定义 API 路由 |

---

## 主题系统

Lumen 支持**完整的自定义主题系统**。你可以创建、编辑、激活、删除主题，实现完全的视觉自定义。

### 功能特性

- **浅色/深色双模式配色**：各 15 个色域（背景、卡片、边框、文字、强调色、危险色、成功色、警告色、侧边栏等）
- **自定义字体**：标题、正文、等宽三种字体族
- **圆角调节**：可配置圆角基数，自动计算 sm/md/lg/xl 四档
- **阴影系统**：4 级阴影（sm/md/lg/xl）
- **自定义 CSS**：自由输入 CSS 代码，覆盖任意样式
- **实时预览**：编辑时切换浅色/深色预览效果
- **即时生效**：激活后通过 CSS 变量立即应用
- **无需刷新**：通过 `<style>` 元素注入，无需刷新页面

### 工作原理

1. 每个主题存储 `colors`（浅色）和 `darkColors`（深色）作为 JSON
2. `to_css()` 生成完整 CSS（含 `:root` 和 `[data-theme="dark"]` 块）
3. 激活主题的 CSS 通过 `GET /api/admin/themes/active`（公开端点）提供服务
4. 管理后台获取并注入 `<style id="custom-theme-style">` 元素
5. 深色模式切换（`[data-theme="dark"]`）自动覆盖为深色配色

### 主题 API

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/admin/themes` | 获取所有主题 |
| POST | `/api/admin/themes` | 创建新主题 |
| PUT | `/api/admin/themes/<id>` | 更新主题 |
| DELETE | `/api/admin/themes/<id>` | 删除主题（不能删除激活的） |
| PUT | `/api/admin/themes/<id>/activate` | 激活主题 |
| GET | `/api/admin/themes/active` | 获取当前激活主题 CSS（公开） |

### 默认主题

| 主题 | 说明 |
|------|------|
| **Lumen Light** | 清爽专业的浅色界面（默认） |
| **Lumen Dark** | 护眼暗色模式 |

### CSS 变量

激活主题后注入以下 CSS 变量：

```css
:root {
  --color-bg: #f5f5f7;
  --color-surface: #ffffff;
  --color-surface-hover: #f0f0f2;
  --color-border: #e8e8ed;
  --color-text: #1d1d1f;
  --color-text-secondary: #86868b;
  --color-text-tertiary: #aeaeb2;
  --color-accent: #0071e3;
  --color-accent-hover: #0066cc;
  --color-danger: #ff3b30;
  --color-success: #34c759;
  --color-warning: #ff9500;
  --color-sidebar: #f5f5f7;
  --color-sidebar-hover: #ebebf0;
  --color-sidebar-active: #e0e0e5;
  --font-sans: -apple-system, sans-serif;
  --font-body: -apple-system, sans-serif;
  --font-mono: SF Mono, monospace;
  --radius-sm: 0.75rem;
  --radius-md: calc(0.75rem + 2px);
  --radius-lg: calc(0.75rem + 6px);
  --radius-xl: calc(0.75rem + 10px);
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
  --shadow-lg: 0 10px 25px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 50px rgba(0,0,0,0.15);
}

[data-theme="dark"] {
  --color-bg: #1c1c1e;
  --color-surface: #2c2c2e;
  /* ... 深色覆盖所有变量 ... */
}
```

在 `customCSS` 中使用这些变量可实现完全自定义：

```css
.btn-custom {
  background: linear-gradient(135deg, var(--color-accent), var(--color-success));
  color: white;
}
[data-theme="dark"] .card-header {
  border-bottom-color: var(--color-border);
}
```

---

## 测试工具

```bash
# 系统全量测试（45+ 测试用例，覆盖所有模块）
python3 assets/test_system.py [--base-url http://localhost:5000] [--verbose] [--skip-db]

# API 冒烟测试（31 测试用例）
python3 assets/test_api.py [--base-url http://localhost:5000] [--verbose]

# Python 客户端命令行工具
python3 assets/lumen_client.py
```

---

## 配置说明

所有运行时配置均存储在数据库中，通过管理后台进行管理：

- **API 密钥**：AES-256 加密存储
- **全局权限**：每日对话次数、可用模型列表、Token 上限、频率限制
- **接口开关**：按分组独立开启/关闭每个 API 接口
- **注册控制**：开放或关闭公开注册
- **数据保留**：超过 N 天的对话自动清理

---

## 作者

**Tnt-next**

<p align="left">
  <a href="https://afdian.com/a/tntminecraft"><img src="https://img.shields.io/badge/爱发电-赞助支持-946CE6?style=for-the-badge&logo=buymeacoffee&logoColor=white" alt="爱发电" /></a>
  &nbsp;
  <a href="https://space.bilibili.com/3546659195718047"><img src="https://img.shields.io/badge/Bilibili-关注-00A1D6?style=for-the-badge&logo=bilibili&logoColor=white" alt="Bilibili" /></a>
  &nbsp;
  <a href="mailto:cyy.nex.zdwxx.py.12@gmail.com"><img src="https://img.shields.io/badge/Email-联系作者-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
</p>

---

<p align="center">
  <sub><a href="./README.md">English</a> · 中文</sub>
</p>
