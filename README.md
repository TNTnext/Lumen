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
| **Plugin System** | Hot-pluggable architecture · 3 built-in plugins (Calculator, Web Search, Translator) · 8 tools · Priority-based execution · Custom plugin support |
| **Multi-Database** | SQLite (default, zero-config) · PostgreSQL · MySQL · Configurable via admin panel or onboarding |
| **Admin Dashboard** | Real-time statistics · User CRUD · Conversation browser · Permission editor · Vendor management · Endpoint toggles · Plugin management · Database config · Bilingual (EN/ZH) · Responsive design · Auto language detection |
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

Lumen features a hot-pluggable plugin architecture:

| Plugin | Tools | Description |
|--------|-------|-------------|
| **Calculator** | `calculate`, `convert_units` | Math expression evaluation and unit conversion (length, weight, temp, data) |
| **Web Search** | `web_search`, `fetch_url` | Real-time web search and page content fetching |
| **Translator** | `translate`, `summarize`, `extract_keywords`, `count_text` | Multi-language translation (ZH/EN/JA/KO/FR), text summarization, keyword extraction |

- **Hot-pluggable**: Enable/disable plugins without restart
- **Priority-based**: Drag-to-reorder plugin execution order
- **Custom plugins**: Drop `.py` files into the `plugins/` directory with `PLUGIN_META` + `create_plugin()`
- **Tool injection**: Plugin tools are automatically injected into chat model's function calling

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
