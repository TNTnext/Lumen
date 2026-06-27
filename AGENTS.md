# AGENTS.md

## 项目概览
Lumen — 自托管 AI 网关与对话管理平台，基于 Python Flask 的后端 API 服务 + Apple 风格管理后台前端。支持 9 家内置厂商 + 自定义 OpenAI 兼容端点、多用户系统、细粒度权限控制。

## 技术栈
- **后端**: Python 3.11+, Flask, SQLAlchemy, Flask-JWT-Extended, Flask-CORS
- **数据库**: SQLite（开发），可切换 PostgreSQL
- **前端**: 纯 HTML/CSS/JS + Tailwind CSS v4 CDN + Lucide Icons
- **AI 服务**: 多厂商支持（DeepSeek/OpenAI/Anthropic/Kimi/火山引擎/阿里云/xAI/GLM/Minimax），通过 `ai_service.py` 统一调用

## 项目结构
```
├── app.py                  # 应用入口，工厂函数，路由注册，初始化
├── config.py               # 配置类（环境变量读取）
├── models.py               # 数据库模型（7 个表）
├── auth_utils.py           # JWT 认证、权限装饰器、权限合并逻辑
├── auth_routes.py          # 认证蓝图（注册/登录/登出/改密/个人信息）
├── chat_routes.py          # 对话蓝图（发送消息/历史/删除/会话管理）
├── admin_routes.py          # 管理后台蓝图（看板/用户管理/权限/系统配置）
├── ai_service.py           # 多厂商 AI 服务层（统一调用接口）
├── model_registry.py       # 厂商/模型能力矩阵（9 厂商 20+ 模型）
├── requirements.txt        # Python 依赖
├── .coze                   # Coze CLI 配置
├── static/
│   ├── login.html          # 登录页
│   ├── admin.html          # 管理后台 SPA
│   └── js/
│       └── admin.js        # 管理后台 JS 逻辑
├── docx/
│   └── index.html          # API 文档页面
└── app.db                  # SQLite 数据库（自动生成）
```

## 构建与运行
```bash
# 安装依赖
pip install -r requirements.txt

# 启动开发服务器
python app.py

# 或通过 coze CLI
coze dev
```

## API 接口清单

### 认证 (/api/auth)
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 用户注册 |
| POST | /api/auth/login | 用户登录 |
| POST | /api/auth/logout | 用户登出 |
| GET | /api/auth/me | 获取当前用户信息 |
| PUT | /api/auth/change-password | 修改密码 |

### 对话 (/api/chat)
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/chat/send | 发送消息（支持多轮） |
| GET | /api/chat/conversations | 对话列表（分页） |
| GET | /api/chat/conversations/<id> | 对话详情+消息 |
| DELETE | /api/chat/conversations/<id> | 删除对话 |

### 管理后台 (/api/admin)
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/dashboard | 数据看板统计 |
| GET | /api/admin/users | 用户列表 |
| PUT | /api/admin/users/<id> | 更新用户 |
| POST | /api/admin/users/<id>/reset-password | 重置密码 |
| GET | /api/admin/users/<id>/conversations | 用户对话列表 |
| GET | /api/admin/conversations | 全部对话概览 |
| GET | /api/admin/conversations/<id> | 对话详情 |
| GET/PUT | /api/admin/permissions/global | 全局权限 |
| GET/PUT | /api/admin/permissions/user/<id> | 用户权限 |
| GET/PUT | /api/admin/config | 系统配置 |
| POST | /api/admin/config/test-connection | 测试 API 连接 |
| GET | /api/admin/config/api-key | 获取 API Key + 用量统计 |
| GET/PUT | /api/admin/config/open-registration | 注册开关 |
| POST | /api/admin/reset | 系统重置（清空对话/配置/用户） |
| GET | /api/admin/endpoints | 接口开关列表（分组） |
| PUT | /api/admin/endpoints/<id> | 切换单个接口开关 |
| PUT | /api/admin/endpoints/batch | 批量切换接口开关 |
| GET | /api/admin/vendors | 厂商与模型列表 |
| GET | /api/admin/onboarding/status | 新手引导状态 |
| POST | /api/admin/onboarding/complete | 完成新手引导配置 |

## 数据库模型
- **User**: 用户表（username, email, password_hash, role, is_active, must_change_password）
- **Conversation**: 对话表（user_id, title, model, total_tokens, message_count）
- **Message**: 消息表（conversation_id, role, content, tokens）
- **GlobalPermission**: 全局权限（max_daily_chats, allowed_models, max_tokens_per_request 等）
- **UserPermission**: 用户单独权限（use_custom, 覆盖全局值）
- **SystemConfig**: 系统配置（key-value, 支持加密存储）
- **EndpointToggle**: 接口开关（endpoint, description, group, enabled）

## 权限控制
- 两级权限：全局默认权限 + 用户单独权限
- 权限项：每日对话次数、可用模型、单次最大 Token、导出开关、文件上传、频率限制
- 用户单独权限可设为"继承全局"或"自定义覆盖"
- 后端通过 `@require_admin` 和 `get_effective_permission()` 统一校验

## 接口开关
- `EndpointToggle` 模型存储每个接口的开关状态
- 3 个分组：认证(auth)、对话(chat)、管理后台(admin)
- `app.py` 的 `before_request` 钩子自动检查开关，关闭的接口返回 403
- 管理后台接口（/api/admin/*）始终可用，不受开关影响
- 管理员可在「接口开关」页面按组或逐个切换

## 路由说明
- `/` → 404
- `/login` → 登录页面
- `/admin` → 管理后台 SPA
- `/docx/` → API 文档页面
- 所有 API 在 `/api/*` 下

## 新手引导
- 默认管理员首次登录后触发引导流程
- 引导页面可配置：管理员密码、AI 厂商/API Key/模型、全局权限、开放注册、管理员查看对话、保留天数、接口开关
- 完成后设置 `onboarding_completed=true`，不再显示引导
- 密码使用 werkzeug `generate_password_hash` 哈希存储
- API Key 等敏感配置加密存储（标记 is_encrypted）
- JWT Token 认证，支持过期与刷新
- 用户数据隔离：普通用户只能操作自己的对话
- 管理员默认不能查看用户对话内容（可配置 admin_can_view_content）
- 默认管理员 admin/admin123，首次登录 must_change_password=true
