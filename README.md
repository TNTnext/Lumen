# Lumen

> *Illuminate your AI infrastructure. One command, infinite models.*

<p align="center">
  <img src="https://img.shields.io/badge/python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/flask-3.1-000000?style=flat-square&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/sqlite-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
</p>

---

## Overview

Lumen is a self-hosted AI gateway and conversation platform. Connect to **9 built-in providers** (DeepSeek, OpenAI, Anthropic, Kimi, GLM, and more) or bring your own OpenAI-compatible endpoint. Multi-user access, granular permissions, endpoint toggles, and an clean admin dashboard — all from a single `python app.py`.

### Why Lumen

Most AI chat frontends are either too simple (single-user, no permissions) or too complex (Kubernetes, microservices). Lumen is the middle ground: **self-contained, zero-config, production-ready**.

---

## Features

| Category | Capabilities |
|----------|-------------|
| **Multi-Provider** | 9 built-in vendors + custom OpenAI-compatible endpoints |
| **Model Capabilities** | Streaming · Thinking/Reasoning · Vision · Tool Calling · File Upload · Web Search |
| **User System** | Registration (toggleable) · JWT Auth · Role-based (admin/user) · Force password change |
| **Permissions** | Two-tier: global defaults + per-user overrides. Daily limits, model allowlists, token caps, rate limits, export control |
| **Multi-Vendor Fallback** | Configure multiple vendors · Custom model priorities · Auto-failover on error · Per-vendor API keys and base URLs · Cross-vendor model priority ordering |
| **Plugin System** | Hot-pluggable architecture · 10+ capabilities: AI tools, chat hooks, custom pages, custom API routes, DB tables, middleware, events, cron jobs, lifecycle hooks · 3 built-in plugins (Calculator, Web Search, Translator) · 8 tools · Priority-based execution · Custom plugin support |
| **Multi-Database** | SQLite (default, zero-config) · PostgreSQL · MySQL · Configurable via admin panel or onboarding |
| **Admin Dashboard** | Real-time statistics · User CRUD · Conversation browser · Permission editor · Vendor management · Endpoint toggles · Plugin management · Theme manager · Database config · Bilingual (EN/ZH) · Responsive design · Auto language detection |
| **Onboarding Wizard** | First-login guided setup: password, **multiple providers**, API keys, permissions, registration policy, database config · Subtle skip button |
| **Security** | bcrypt passwords · AES-encrypted API keys · SQL injection prevention · CORS · CSRF protection |
| **Performance** | In-memory caching · Query batching · N+1 elimination · CDN preconnect |
| **Testing** | System test suite (45+ cases) · API smoke test · Database connection test |

---

## Quick Start

```bash
# 1. Clone
git clone <repo-url> && cd lumen

# 2. Install
pip install -r requirements.txt

# 3. Run
python app.py
```

Open `http://localhost:5000/login` — log in with **`admin` / `admin123`**.  
You'll be guided through the onboarding wizard on first login.

### Default Port

The server listens on the port specified by `DEPLOY_RUN_PORT` (default: `5000`).

---

## Architecture

```
┌──────────────┐     ┌──────────────────────────────────────┐
│   Browser    │────▶│  Flask (app.py)                       │
│  /admin SPA  │     │  ├── auth_routes.py   (JWT auth)      │
│  /login      │     │  ├── chat_routes.py   (AI chat)       │
└──────────────┘     │  ├── admin_routes.py  (dashboard)     │
                     │  ├── plugin_routes.py (plugins)       │
                     │  ├── ai_service.py    (multi-vendor)   │
                     │  ├── model_registry.py (capabilities)  │
                     │  ├── plugins/         (3 built-in)     │
                     │  └── models.py        (SQLAlchemy)     │
                     └──────────────────────────────────────┘
```

### API Endpoints

| Group | Endpoints |
|-------|-----------|
| **Auth** | `POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me` · `PUT /api/auth/change-password` |
| **Chat** | `POST /api/chat/send` · `GET /api/chat/models` · `GET /api/chat/conversations` · `GET /api/chat/conversations/<id>` · `DELETE /api/chat/conversations/<id>` |
| **Admin** | `GET /api/admin/dashboard` · `GET/PUT /api/admin/users` · `GET/PUT /api/admin/permissions` · `GET/PUT /api/admin/config` · `GET/PUT /api/admin/config/database` · `GET /api/admin/vendors` · `GET/POST/PUT/DELETE /api/admin/vendor-configs` · `GET/PUT /api/admin/endpoints` · `POST /api/admin/onboarding/complete` · `POST /api/admin/reset` |
| **Plugins** | `GET /api/admin/plugins` · `PUT /api/admin/plugins/<name>` · `POST /api/admin/plugins/reload` · `PUT /api/admin/plugins/reorder` · `GET /api/admin/plugins/tools` |

Full API documentation available at `/docx/`.

---

## Supported Providers & Models

<details>
<summary>Click to expand the full capability matrix</summary>

| Provider | Model | Text | Streaming | Thinking | Vision | Tools | File | Search |
|----------|-------|:----:|:---------:|:--------:|:------:|:-----:|:----:|:------:|
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

> **Custom Endpoints**: Add any OpenAI-compatible provider via the admin panel. Lumen auto-detects capabilities where possible.

</details>

---

## Database Support

Lumen supports three database backends:

| Backend | Status | Config Required |
|---------|--------|----------------|
| **SQLite** | Default | None (zero-config) |
| **PostgreSQL** | Supported | Host, Port, DB Name, User, Password |
| **MySQL** | Supported | Host, Port, DB Name, User, Password |

Configure via:
- **Admin Panel**: Navigate to "Database" in the sidebar
- **Onboarding Wizard**: Step 6 during first-time setup
- **Environment Variables**: `DB_TYPE`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`

> **Note**: Changing database type requires a server restart. Test your connection before saving.

---

## Plugin System

Lumen features a hot-pluggable plugin architecture with **10+ capabilities**:

| Plugin | Tools | Description |
|--------|-------|-------------|
| **Calculator** | `calculate`, `convert_units` | Math expression evaluation and unit conversion (length, weight, temp, data) |
| **Web Search** | `web_search`, `fetch_url` | Real-time web search and page content fetching |
| **Translator** | `translate`, `summarize`, `extract_keywords`, `count_text` | Multi-language translation (ZH/EN/JA/KO/FR), text summarization, keyword extraction |

### Plugin Capabilities

| Capability | Method | Description |
|------------|--------|-------------|
| **AI Tools** | `get_tools()` / `execute_tool()` | Register OpenAI function-calling tools injected into AI chat |
| **Chat Hooks** | `pre_chat()` / `post_chat()` / `on_error()` | Intercept and modify messages before/after AI response, or handle errors |
| **Custom Pages** | `register_pages()` | Inject custom admin pages with full HTML/CSS/JS, auto-appear in sidebar navigation |
| **Custom API Routes** | `register_api_routes()` | Register custom Flask endpoints at `/api/plugins/<name>/...` |
| **Database Tables** | `register_db_tables()` | Register custom SQLAlchemy models, auto-create tables on install |
| **Middleware** | `register_middleware()` | Register before/after request interceptors to modify requests/responses |
| **Event System** | `register_events()` | Register event handlers for system events (startup, shutdown, user.created, message.sent, etc.) |
| **Cron Jobs** | `register_cron_jobs()` | Register scheduled tasks with configurable intervals |
| **Lifecycle** | `on_install()` / `on_uninstall()` / `on_upgrade()` / `on_configure()` | Install/uninstall/upgrade/config-change callbacks |

### Creating a Plugin

Create a `.py` file in the `plugins/` directory:

```python
# plugins/my_plugin.py
from plugins import LumenPlugin, PluginMeta, ToolDefinition

PLUGIN_META = {
    "name": "my_plugin",
    "display_name": "My Plugin",
    "version": "1.0.0",
    "description": "A custom plugin",
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
            description="Do something useful",
            parameters={"type": "object", "properties": {"input": {"type": "string"}}, "required": ["input"]}
        )]

    def execute_tool(self, tool_name, arguments, ctx):
        return {"result": f"Processed: {arguments['input']}"}

    def register_pages(self):
        return [PageDefinition(page_id="my_page", title="My Page", icon="layout-dashboard", html_content="<div class='p-6'><h2>Hello!</h2></div>")]

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
        return {"message.sent": lambda data: print(f"Message by {data['user']}")}

    def register_cron_jobs(self):
        return [{"name": "cleanup", "interval_seconds": 3600, "handler": lambda: print("Hourly cleanup"), "enabled": True}]
```

Hot-reload via **Admin Panel → Plugins → Reload** after placing the file.

### Plugin APIs

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/plugins/` | List all plugins with status |
| PUT | `/api/admin/plugins/<name>/toggle` | Toggle plugin enabled/disabled |
| PUT | `/api/admin/plugins/<name>` | Update plugin config |
| POST | `/api/admin/plugins/reload` | Hot reload all plugins |
| PUT | `/api/admin/plugins/reorder` | Batch reorder plugin priorities |
| GET | `/api/admin/plugins/tools` | List all enabled plugin tools |
| GET | `/api/admin/plugins/pages` | List all plugin custom pages |
| GET | `/api/admin/plugins/routes` | List all plugin custom API routes |

---

## Theme System

Lumen supports a **complete custom theme system**. Create, edit, activate, and delete themes with full visual customization.

### Features

- **Light & Dark Colors**: 15 color slots each (bg, surface, border, text, accent, danger, success, warning, sidebar, etc.)
- **Custom Fonts**: Heading, body, and monospace font families
- **Border Radius**: Configurable radius scale (sm/md/lg/xl)
- **Shadows**: 4 shadow levels (sm/md/lg/xl)
- **Custom CSS**: Free-form CSS that overrides any style
- **Live Preview**: Toggle light/dark preview while editing
- **Instant Apply**: Theme changes take effect immediately via CSS variables
- **No Page Reload**: Active theme is injected via `<style>` element, no refresh needed

### How It Works

1. Each theme stores `colors` (light) and `darkColors` (dark) as JSON
2. `to_css()` generates a complete CSS string with `:root` and `[data-theme="dark"]` blocks
3. Active theme CSS is served at `GET /api/admin/themes/active` (public, no auth)
4. Admin panel fetches and injects CSS via `<style id="custom-theme-style">`
5. Dark mode toggle (`[data-theme="dark"]`) overrides light colors with dark ones

### Theme APIs

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/admin/themes` | List all themes |
| POST | `/api/admin/themes` | Create new theme |
| PUT | `/api/admin/themes/<id>` | Update theme |
| DELETE | `/api/admin/themes/<id>` | Delete theme (cannot delete active) |
| PUT | `/api/admin/themes/<id>/activate` | Activate theme |
| GET | `/api/admin/themes/active` | Get active theme CSS (public) |

### Default Themes

| Theme | Description |
|-------|-------------|
| **Lumen Light** | Clean, professional light interface (default) |
| **Lumen Dark** | Eye-friendly dark mode |

### CSS Variables

Active theme injects these CSS variables:

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
  /* ... dark overrides for all variables ... */
}
```

Use these in `customCSS` to create fully custom themes:

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

## Testing

```bash
# System test suite (45+ test cases covering all modules)
python3 assets/test_system.py [--base-url http://localhost:5000] [--verbose] [--skip-db]

# API smoke test (31 test cases)
python3 assets/test_api.py [--base-url http://localhost:5000] [--verbose]

# Python client CLI
python3 assets/lumen_client.py
```

---

## Configuration

All runtime configuration is stored in the database and managed through the admin panel:

- **API Keys**: Encrypted at rest with AES-256
- **Global Permissions**: Daily chat limits, model allowlists, token caps, rate limits
- **Endpoint Toggles**: Enable/disable individual API endpoints by group
- **Registration**: Open or closed; admin-only user creation
- **Retention**: Auto-cleanup of conversations older than N days

---

## Author

**Tnt-next**

<p align="left">
  <a href="https://afdian.com/a/tntminecraft"><img src="https://img.shields.io/badge/Afdian-Sponsor-946CE6?style=for-the-badge&logo=buymeacoffee&logoColor=white" alt="Afdian" /></a>
  &nbsp;
  <a href="https://space.bilibili.com/3546659195718047"><img src="https://img.shields.io/badge/Bilibili-Follow-00A1D6?style=for-the-badge&logo=bilibili&logoColor=white" alt="Bilibili" /></a>
  &nbsp;
  <a href="mailto:cyy.nex.zdwxx.py.12@gmail.com"><img src="https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
</p>

---

<p align="center">
  <sub>English · <a href="./README_zh.md">中文</a></sub>
</p>
