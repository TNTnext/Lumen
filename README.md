# AI Chat Platform

> *Enterprise-grade AI conversation management, distilled into a single deployable artifact.*

<p align="center">
  <img src="https://img.shields.io/badge/python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/flask-3.1-000000?style=flat-square&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/sqlite-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License" />
</p>

---

## Overview

A self-hosted AI conversation platform with a polished admin dashboard. Connect to **9 LLM providers** (DeepSeek, OpenAI, Anthropic, Kimi, GLM, and more), manage multi-user access with granular permissions, and control every API endpoint with toggle switches — all from a clean, Apple-inspired interface.

### Why This Exists

Most AI chat frontends are either too simple (single-user, no permissions) or too complex (Kubernetes, microservices). This is the middle ground: **one `python app.py`**, everything you need.

---

## Features

| Category | Capabilities |
|----------|-------------|
| **Multi-Provider** | DeepSeek · OpenAI · Anthropic · Kimi · 火山引擎 · 阿里云 · xAI · GLM · Minimax |
| **Model Capabilities** | Streaming · Thinking/Reasoning · Vision · Tool Calling · File Upload · Web Search |
| **User System** | Registration (toggleable) · JWT Auth · Role-based (admin/user) · Force password change |
| **Permissions** | Two-tier: global defaults + per-user overrides. Daily limits, model allowlists, rate limits, export control |
| **Admin Dashboard** | Real-time statistics · User CRUD · Conversation browser · Permission editor · API key config · Endpoint toggles |
| **Onboarding Wizard** | First-login guided setup: password, provider, API key, permissions, registration policy |
| **Security** | bcrypt passwords · AES-encrypted API keys · SQL injection prevention · CORS · CSRF protection |
| **Performance** | In-memory caching · Query batching · N+1 elimination · CDN preconnect |

---

## Quick Start

```bash
# 1. Clone
git clone <repo-url> && cd ai-chat-platform

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
                     │  ├── ai_service.py    (multi-vendor)   │
                     │  ├── model_registry.py (capabilities)  │
                     │  └── models.py        (SQLAlchemy)     │
                     └──────────────────────────────────────┘
```

### API Endpoints

| Group | Endpoints |
|-------|-----------|
| **Auth** | `POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me` · `PUT /api/auth/change-password` |
| **Chat** | `POST /api/chat/send` · `GET /api/chat/conversations` · `GET /api/chat/conversations/<id>` · `DELETE /api/chat/conversations/<id>` |
| **Admin** | `GET /api/admin/dashboard` · `GET/PUT /api/admin/users` · `GET/PUT /api/admin/permissions` · `GET/PUT /api/admin/config` · `GET /api/admin/vendors` · `GET/PUT /api/admin/endpoints` · `POST /api/admin/onboarding/complete` · `POST /api/admin/reset` |

Full API documentation available at `/docx/`.

---

## Supported Providers & Models

<details>
<summary>Click to expand the full capability matrix</summary>

| Provider | Model | Text | Streaming | Thinking | Vision | Tools | File | Search |
|----------|-------|:----:|:---------:|:--------:|:------:|:-----:|:----:|:------:|
| **DeepSeek** | deepseek-chat | ✓ | ✓ | — | — | ✓ | — | — |
| | deepseek-reasoner | ✓ | ✓ | ✓ | — | — | — | — |
| **OpenAI** | gpt-4o | ✓ | ✓ | — | ✓ | ✓ | ✓ | — |
| | gpt-4o-mini | ✓ | ✓ | — | ✓ | ✓ | ✓ | — |
| | o1 / o3-mini | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| **Anthropic** | claude-sonnet-4-20250514 | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — |
| | claude-haiku-3.5 | ✓ | ✓ | — | ✓ | ✓ | — | — |
| **Kimi** | moonshot-v1-8k/32k/128k | ✓ | ✓ | — | — | ✓ | ✓ | — |
| **火山引擎** | doubao-1.5-pro-256k | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ |
| | doubao-1.5-lite-32k | ✓ | ✓ | — | — | ✓ | — | — |
| **阿里云** | qwen-turbo / qwen-plus / qwen-max | ✓ | ✓ | ✓ | ✓ | ✓ | — | — |
| **xAI** | grok-2 | ✓ | ✓ | — | ✓ | ✓ | — | — |
| **GLM** | glm-4-flash / glm-4-plus | ✓ | ✓ | — | ✓ | ✓ | — | ✓ |
| **Minimax** | abab6.5s-chat | ✓ | ✓ | — | — | ✓ | — | — |

</details>

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
  <a href="https://afdian.com/a/tntminecraft"><img src="https://img.shields.io/badge/爱发电-赞助支持-946CE6?style=for-the-badge&logo=buymeacoffee&logoColor=white" alt="爱发电" /></a>
  &nbsp;
  <a href="https://space.bilibili.com/3546659195718047"><img src="https://img.shields.io/badge/Bilibili-关注-00A1D6?style=for-the-badge&logo=bilibili&logoColor=white" alt="Bilibili" /></a>
  &nbsp;
  <a href="mailto:cyy.nex.zdwxx.py.12@gmail.com"><img src="https://img.shields.io/badge/Email-联系作者-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
</p>

---

<p align="center">
  <sub>English · <a href="./README_zh.md">中文</a></sub>
</p>
