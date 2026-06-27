"""Multi-vendor model capability registry.

Each vendor has a list of models with capability flags:
- text: basic chat
- vision: image understanding (multimodal)
- streaming: SSE streaming support
- thinking: chain-of-thought / reasoning
- tools: function calling / tool use
- file_upload: file upload support
- web_search: built-in web search capability
"""

VENDORS = {
    "deepseek": {
        "name": "DeepSeek",
        "base_url": "https://api.deepseek.com",
        "auth_header": "Authorization",
        "auth_prefix": "Bearer ",
        "chat_path": "/v1/chat/completions",
        "models": {
            "deepseek-chat": {
                "name": "DeepSeek V3",
                "capabilities": ["text", "streaming", "tools", "file_upload"],
                "max_tokens": 8192,
                "description": "通用对话模型，支持函数调用与文件上传",
            },
            "deepseek-reasoner": {
                "name": "DeepSeek R1",
                "capabilities": ["text", "streaming", "thinking"],
                "max_tokens": 8192,
                "description": "深度推理模型，内置思维链",
            },
        },
    },
    "openai": {
        "name": "OpenAI",
        "base_url": "https://api.openai.com",
        "auth_header": "Authorization",
        "auth_prefix": "Bearer ",
        "chat_path": "/v1/chat/completions",
        "models": {
            "gpt-4o": {
                "name": "GPT-4o",
                "capabilities": ["text", "vision", "streaming", "tools", "file_upload"],
                "max_tokens": 16384,
                "description": "旗舰多模态模型，支持视觉、工具调用",
            },
            "gpt-4o-mini": {
                "name": "GPT-4o Mini",
                "capabilities": ["text", "vision", "streaming", "tools", "file_upload"],
                "max_tokens": 16384,
                "description": "轻量多模态模型，高性价比",
            },
            "o1": {
                "name": "o1",
                "capabilities": ["text", "streaming", "thinking"],
                "max_tokens": 100000,
                "description": "深度推理模型，复杂逻辑与数学",
            },
            "o3-mini": {
                "name": "o3 Mini",
                "capabilities": ["text", "streaming", "thinking"],
                "max_tokens": 100000,
                "description": "轻量推理模型，STEM 优化",
            },
        },
    },
    "anthropic": {
        "name": "Anthropic",
        "base_url": "https://api.anthropic.com",
        "auth_header": "x-api-key",
        "auth_prefix": "",
        "chat_path": "/v1/messages",
        "models": {
            "claude-sonnet-4-20250514": {
                "name": "Claude Sonnet 4",
                "capabilities": ["text", "vision", "streaming", "tools", "file_upload"],
                "max_tokens": 8192,
                "description": "高性能均衡模型，支持视觉与工具",
            },
            "claude-3-5-sonnet-20241022": {
                "name": "Claude 3.5 Sonnet",
                "capabilities": ["text", "vision", "streaming", "tools", "file_upload"],
                "max_tokens": 8192,
                "description": "经典高性能模型",
            },
            "claude-3-haiku-20240307": {
                "name": "Claude 3 Haiku",
                "capabilities": ["text", "vision", "streaming", "tools"],
                "max_tokens": 4096,
                "description": "快速轻量模型",
            },
        },
    },
    "kimi": {
        "name": "Kimi (月之暗面)",
        "base_url": "https://api.moonshot.cn",
        "auth_header": "Authorization",
        "auth_prefix": "Bearer ",
        "chat_path": "/v1/chat/completions",
        "models": {
            "moonshot-v1-auto": {
                "name": "Moonshot v1 Auto",
                "capabilities": ["text", "streaming", "tools", "file_upload"],
                "max_tokens": 4096,
                "description": "自动选择最佳模型",
            },
            "moonshot-v1-8k": {
                "name": "Moonshot v1 8K",
                "capabilities": ["text", "streaming", "tools", "file_upload"],
                "max_tokens": 4096,
                "description": "8K 上下文模型",
            },
            "moonshot-v1-32k": {
                "name": "Moonshot v1 32K",
                "capabilities": ["text", "streaming", "tools", "file_upload"],
                "max_tokens": 4096,
                "description": "32K 长上下文模型",
            },
            "moonshot-v1-128k": {
                "name": "Moonshot v1 128K",
                "capabilities": ["text", "streaming", "tools", "file_upload"],
                "max_tokens": 4096,
                "description": "128K 超长上下文模型",
            },
        },
    },
    "volcano": {
        "name": "火山引擎 (豆包)",
        "base_url": "https://ark.cn-beijing.volces.com",
        "auth_header": "Authorization",
        "auth_prefix": "Bearer ",
        "chat_path": "/api/v3/chat/completions",
        "models": {
            "doubao-1.5-pro-32k": {
                "name": "豆包 1.5 Pro 32K",
                "capabilities": ["text", "streaming", "thinking", "tools", "web_search"],
                "max_tokens": 4096,
                "description": "旗舰模型，支持思考与联网搜索",
            },
            "doubao-1.5-lite-32k": {
                "name": "豆包 1.5 Lite 32K",
                "capabilities": ["text", "streaming"],
                "max_tokens": 4096,
                "description": "轻量高效模型",
            },
            "doubao-1.5-vision-pro-32k": {
                "name": "豆包 视觉 Pro 32K",
                "capabilities": ["text", "vision", "streaming"],
                "max_tokens": 4096,
                "description": "多模态视觉模型",
            },
        },
    },
    "alibaba": {
        "name": "阿里云 (通义)",
        "base_url": "https://dashscope.aliyuncs.com",
        "auth_header": "Authorization",
        "auth_prefix": "Bearer ",
        "chat_path": "/compatible-mode/v1/chat/completions",
        "models": {
            "qwen-max": {
                "name": "通义千问 Max",
                "capabilities": ["text", "vision", "streaming", "tools", "file_upload", "web_search"],
                "max_tokens": 8192,
                "description": "旗舰模型，全能力覆盖",
            },
            "qwen-plus": {
                "name": "通义千问 Plus",
                "capabilities": ["text", "vision", "streaming", "tools"],
                "max_tokens": 8192,
                "description": "性能与成本均衡",
            },
            "qwen-turbo": {
                "name": "通义千问 Turbo",
                "capabilities": ["text", "streaming"],
                "max_tokens": 4096,
                "description": "高性价比快速模型",
            },
            "qwen-vl-max": {
                "name": "通义千问 VL Max",
                "capabilities": ["text", "vision", "streaming"],
                "max_tokens": 4096,
                "description": "旗舰视觉模型",
            },
        },
    },
    "xai": {
        "name": "xAI (Grok)",
        "base_url": "https://api.x.ai",
        "auth_header": "Authorization",
        "auth_prefix": "Bearer ",
        "chat_path": "/v1/chat/completions",
        "models": {
            "grok-2-1212": {
                "name": "Grok 2",
                "capabilities": ["text", "streaming", "tools"],
                "max_tokens": 4096,
                "description": "通用对话模型",
            },
            "grok-2-vision-1212": {
                "name": "Grok 2 Vision",
                "capabilities": ["text", "vision", "streaming"],
                "max_tokens": 4096,
                "description": "多模态视觉模型",
            },
        },
    },
    "glm": {
        "name": "智谱 (GLM)",
        "base_url": "https://open.bigmodel.cn",
        "auth_header": "Authorization",
        "auth_prefix": "Bearer ",
        "chat_path": "/api/paas/v4/chat/completions",
        "models": {
            "glm-4-plus": {
                "name": "GLM-4 Plus",
                "capabilities": ["text", "vision", "streaming", "tools", "file_upload", "web_search"],
                "max_tokens": 4096,
                "description": "旗舰模型，全能力覆盖",
            },
            "glm-4v-plus": {
                "name": "GLM-4V Plus",
                "capabilities": ["text", "vision", "streaming"],
                "max_tokens": 4096,
                "description": "旗舰视觉模型",
            },
            "glm-4-flash": {
                "name": "GLM-4 Flash",
                "capabilities": ["text", "streaming", "tools", "web_search"],
                "max_tokens": 4096,
                "description": "免费快速模型，支持工具与搜索",
            },
        },
    },
    "minimax": {
        "name": "Minimax",
        "base_url": "https://api.minimax.chat",
        "auth_header": "Authorization",
        "auth_prefix": "Bearer ",
        "chat_path": "/v1/text/chatcompletion_v2",
        "models": {
            "abab6.5s-chat": {
                "name": "ABAB 6.5s",
                "capabilities": ["text", "streaming"],
                "max_tokens": 4096,
                "description": "标准对话模型",
            },
            "abab6.5t-chat": {
                "name": "ABAB 6.5t",
                "capabilities": ["text", "streaming", "tools"],
                "max_tokens": 4096,
                "description": "支持函数调用的增强模型",
            },
        },
    },
}


def get_vendor(vendor_id: str):
    """Get vendor config by ID."""
    return VENDORS.get(vendor_id)


def get_model_capabilities(vendor_id: str, model_id: str):
    """Get capabilities for a specific model."""
    vendor = VENDORS.get(vendor_id)
    if not vendor:
        return []
    model = vendor["models"].get(model_id)
    if not model:
        return []
    return model.get("capabilities", [])


def get_all_models_flat():
    """Return flat list of all models with vendor info."""
    result = []
    for vendor_id, vendor in VENDORS.items():
        for model_id, model in vendor["models"].items():
            result.append({
                "vendor_id": vendor_id,
                "vendor_name": vendor["name"],
                "model_id": model_id,
                "model_name": model["name"],
                "capabilities": model["capabilities"],
                "max_tokens": model["max_tokens"],
                "description": model["description"],
            })
    return result


def get_vendor_list():
    """Return list of vendors with their models."""
    result = []
    for vendor_id, vendor in VENDORS.items():
        models = []
        for model_id, model in vendor["models"].items():
            models.append({
                "id": model_id,
                "name": model["name"],
                "capabilities": model["capabilities"],
                "max_tokens": model["max_tokens"],
                "description": model["description"],
            })
        result.append({
            "id": vendor_id,
            "name": vendor["name"],
            "base_url": vendor["base_url"],
            "models": models,
        })
    return result
