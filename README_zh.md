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
| **管理后台** | 实时统计看板 · 用户增删改查 · 对话浏览 · 权限编辑 · API 密钥配置 · 接口开关 |
| **新手引导** | 首次登录一站式配置：密码、厂商、API Key、权限、注册策略 |
| **安全防护** | bcrypt 密码哈希 · AES 加密存储 API Key · SQL 注入防护 · CORS · CSRF 保护 |
| **性能优化** | 内存缓存 · 查询合并 · N+1 消除 · CDN 预连接 |

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
                     │  ├── ai_service.py    (多厂商统一调用)  │
                     │  ├── model_registry.py (模型能力矩阵)   │
                     │  └── models.py        (SQLAlchemy)     │
                     └──────────────────────────────────────┘
```

### API 接口

| 分组 | 接口 |
|------|------|
| **认证** | `POST /api/auth/register` · `POST /api/auth/login` · `POST /api/auth/logout` · `GET /api/auth/me` · `POST /api/auth/change-password` |
| **对话** | `POST /api/chat/send` · `GET /api/chat/conversations` · `GET /api/chat/conversations/<id>` · `DELETE /api/chat/conversations/<id>` |
| **管理** | `GET /api/admin/dashboard` · `GET/PUT /api/admin/users` · `GET/PUT /api/admin/permissions` · `GET/PUT /api/admin/config` · `GET /api/admin/vendors` · `GET/PUT /api/admin/endpoints` · `POST /api/admin/onboarding/complete` · `POST /api/admin/reset` |

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
