"""Multi-vendor model capability registry.

Each vendor has a list of models with capability flags:
- text: basic chat
- vision: image understanding (multimodal)
- streaming: SSE streaming support
- thinking: chain-of-thought / reasoning
- tools: function calling / tool use
- file_upload: file upload support
- web_search: built-in web search capability

Updated: 2026-06-27 — latest models from official docs.
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
                "name": "DeepSeek V3.2 (非思考)",
                "capabilities": ["text", "streaming", "tools", "file_upload"],
                "max_tokens": 8192,
                "description": "通用对话模型，128K 上下文，支持工具调用与文件上传",
            },
            "deepseek-reasoner": {
                "name": "DeepSeek V3.2 (思考)",
                "capabilities": ["text", "streaming", "thinking"],
                "max_tokens": 8192,
                "description": "深度推理模型，内置思维链，128K 上下文",
            },
            "deepseek-v4-flash": {
                "name": "DeepSeek V4 Flash",
                "capabilities": ["text", "streaming", "thinking", "tools", "file_upload"],
                "max_tokens": 8192,
                "description": "V4 快速模型，1M 上下文，支持思考与工具调用",
            },
            "deepseek-v4-pro": {
                "name": "DeepSeek V4 Pro",
                "capabilities": ["text", "streaming", "thinking", "tools", "file_upload"],
                "max_tokens": 8192,
                "description": "V4 旗舰模型，1M 上下文，384K 最大输出",
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
                "description": "旗舰多模态模型，支持视觉、工具调用，128K 上下文",
            },
            "gpt-4o-mini": {
                "name": "GPT-4o Mini",
                "capabilities": ["text", "vision", "streaming", "tools", "file_upload"],
                "max_tokens": 16384,
                "description": "轻量多模态模型，高性价比",
            },
            "gpt-4.1": {
                "name": "GPT-4.1",
                "capabilities": ["text", "vision", "streaming", "tools", "file_upload"],
                "max_tokens": 32768,
                "description": "编程优化模型，1M 上下文，指令遵循增强",
            },
            "gpt-4.1-mini": {
                "name": "GPT-4.1 Mini",
                "capabilities": ["text", "vision", "streaming", "tools", "file_upload"],
                "max_tokens": 16384,
                "description": "轻量编程模型，1M 上下文，高性价比",
            },
            "o3": {
                "name": "o3",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools", "web_search"],
                "max_tokens": 100000,
                "description": "旗舰推理模型，多模态思维链，支持工具与搜索",
            },
            "o4-mini": {
                "name": "o4 Mini",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools", "web_search"],
                "max_tokens": 100000,
                "description": "轻量多模态推理模型，200K 上下文，STEM 优化",
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
                "capabilities": ["text", "vision", "streaming", "thinking", "tools", "file_upload"],
                "max_tokens": 64000,
                "description": "高性能均衡模型，200K 上下文，支持视觉与工具",
            },
            "claude-opus-4-20250514": {
                "name": "Claude Opus 4",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools", "file_upload"],
                "max_tokens": 128000,
                "description": "最强编程模型，500K-1M 上下文，长周期自主任务",
            },
            "claude-3-5-haiku-20241022": {
                "name": "Claude 3.5 Haiku",
                "capabilities": ["text", "vision", "streaming", "tools"],
                "max_tokens": 8192,
                "description": "最快轻量模型，低延迟高吞吐",
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
            "kimi-k2.5": {
                "name": "Kimi K2.5",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools", "web_search"],
                "max_tokens": 8192,
                "description": "最新旗舰，256K 上下文，原生多模态，思考+非思考双模式",
            },
            "kimi-k2-0905-preview": {
                "name": "Kimi K2 (0905)",
                "capabilities": ["text", "streaming", "thinking", "tools"],
                "max_tokens": 8192,
                "description": "K2 增强版，256K 上下文，Agentic Coding 优化",
            },
            "moonshot-v1-8k": {
                "name": "Moonshot v1 8K",
                "capabilities": ["text", "streaming", "tools", "file_upload"],
                "max_tokens": 4096,
                "description": "8K 上下文文本模型",
            },
            "moonshot-v1-128k": {
                "name": "Moonshot v1 128K",
                "capabilities": ["text", "streaming", "tools", "file_upload"],
                "max_tokens": 4096,
                "description": "128K 超长上下文文本模型",
            },
            "moonshot-v1-32k-vision-preview": {
                "name": "Moonshot v1 Vision 32K",
                "capabilities": ["text", "vision", "streaming"],
                "max_tokens": 4096,
                "description": "32K 上下文视觉理解模型",
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
            "doubao-seed-2-1-pro-260628": {
                "name": "Seed 2.1 Pro",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools", "web_search"],
                "max_tokens": 4096,
                "description": "旗舰 Agent 模型，256K 上下文，编程+多模态+工具调用",
            },
            "doubao-seed-2-1-turbo-260628": {
                "name": "Seed 2.1 Turbo",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools", "web_search"],
                "max_tokens": 4096,
                "description": "高性能性价比模型，256K 上下文，规模化生产",
            },
            "doubao-seed-2-0-lite-260428": {
                "name": "Seed 2.0 Lite",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools"],
                "max_tokens": 4096,
                "description": "轻量多模态模型，256K 上下文",
            },
            "doubao-seed-1-6-250615": {
                "name": "Seed 1.6",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools"],
                "max_tokens": 4096,
                "description": "经典旗舰，256K 上下文，支持思考与视觉",
            },
            "doubao-seed-1-6-flash-250715": {
                "name": "Seed 1.6 Flash",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools"],
                "max_tokens": 4096,
                "description": "极速推理模型，256K 上下文，视觉定位",
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
                "name": "Qwen3 Max",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools", "file_upload", "web_search"],
                "max_tokens": 8192,
                "description": "旗舰模型，262K 上下文，全能力覆盖",
            },
            "qwen-plus": {
                "name": "Qwen3.6 Plus",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools", "file_upload"],
                "max_tokens": 8192,
                "description": "效果速度成本均衡，1M 上下文，多模态",
            },
            "qwen-turbo": {
                "name": "Qwen3.5 Flash",
                "capabilities": ["text", "streaming", "tools"],
                "max_tokens": 4096,
                "description": "高性价比快速模型，1M 上下文",
            },
            "qwen-coder-plus": {
                "name": "Qwen Coder Plus",
                "capabilities": ["text", "streaming", "thinking", "tools", "file_upload"],
                "max_tokens": 8192,
                "description": "卓越代码模型，1M 上下文，擅长工具调用",
            },
            "qwen-vl-max": {
                "name": "Qwen VL Max",
                "capabilities": ["text", "vision", "streaming"],
                "max_tokens": 4096,
                "description": "旗舰视觉理解模型",
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
            "grok-4.3": {
                "name": "Grok 4.3",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools", "web_search"],
                "max_tokens": 8192,
                "description": "最新旗舰，1M 上下文，可调推理强度，工具调用+搜索",
            },
            "grok-build-0.1": {
                "name": "Grok Build 0.1",
                "capabilities": ["text", "streaming", "thinking", "tools"],
                "max_tokens": 8192,
                "description": "编程专用模型，代码生成与重构",
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
            "glm-5.1": {
                "name": "GLM-5.1",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools", "file_upload", "web_search"],
                "max_tokens": 4096,
                "description": "最新旗舰，200K 上下文，8小时自主工作，全能力覆盖",
            },
            "glm-5": {
                "name": "GLM-5",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools", "file_upload", "web_search"],
                "max_tokens": 4096,
                "description": "Agentic Engineering 基座，200K 上下文，长程工程任务",
            },
            "glm-4.7": {
                "name": "GLM-4.7",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools", "file_upload"],
                "max_tokens": 4096,
                "description": "Agentic Coding 专精，200K 上下文，前端审美跃升",
            },
            "glm-4.6": {
                "name": "GLM-4.6",
                "capabilities": ["text", "vision", "streaming", "thinking", "tools", "file_upload"],
                "max_tokens": 4096,
                "description": "均衡型模型，200K 上下文，Token 效率提升 30%",
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
            "MiniMax-M2.7": {
                "name": "MiniMax M2.7",
                "capabilities": ["text", "streaming", "thinking", "tools", "web_search"],
                "max_tokens": 4096,
                "description": "最新 Agent 旗舰，递归自我迭代，SWE-bench Pro 56%",
            },
            "MiniMax-M2.5": {
                "name": "MiniMax M2.5",
                "capabilities": ["text", "streaming", "thinking", "tools", "web_search"],
                "max_tokens": 4096,
                "description": "原生 Agent 生产级模型，SWE-Bench Verified 80.2%",
            },
            "abab6.5s-chat": {
                "name": "ABAB 6.5s",
                "capabilities": ["text", "streaming", "tools"],
                "max_tokens": 4096,
                "description": "万亿参数 MoE，245K 上下文，支持函数调用",
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
