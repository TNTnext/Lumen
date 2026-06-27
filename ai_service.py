"""Unified multi-vendor AI service layer.

Supports: DeepSeek, OpenAI, Anthropic, Kimi, Volcano Engine (Doubao),
         Alibaba (Qwen), xAI (Grok), Zhipu (GLM), Minimax.

Each vendor has its own API format — this module normalizes them into a
single `chat_completion()` interface with streaming support.
"""

import json
import logging
import time
from typing import Any, Dict, Generator, List, Optional

import requests

from model_registry import get_vendor

logger = logging.getLogger(__name__)

# ── Cache ────────────────────────────────────────────────────
_vendor_config_cache: Dict[str, Any] = {}
_vendor_config_ts: Dict[str, float] = {}
CACHE_TTL = 30  # seconds


def _cached_get(vendor_id: str):
    """Get vendor config with 30s TTL cache."""
    now = time.time()
    if vendor_id in _vendor_config_cache and (now - _vendor_config_ts.get(vendor_id, 0)) < CACHE_TTL:
        return _vendor_config_cache[vendor_id]
    vendor = get_vendor(vendor_id)
    _vendor_config_cache[vendor_id] = vendor
    _vendor_config_ts[vendor_id] = now
    return vendor


# ── Core ─────────────────────────────────────────────────────


def chat_completion(
    vendor_id: str,
    model: str,
    messages: List[Dict[str, Any]],
    api_key: str,
    base_url: Optional[str] = None,
    stream: bool = False,
    max_tokens: Optional[int] = None,
    temperature: float = 0.7,
    tools: Optional[List[Dict]] = None,
    **kwargs,
) -> Dict[str, Any]:
    """Send a chat completion request to any supported vendor.

    Args:
        vendor_id: Vendor key (deepseek, openai, anthropic, kimi, volcano,
                   alibaba, xai, glm, minimax)
        model: Model ID string
        messages: Chat messages in OpenAI format
        api_key: API key for the vendor
        base_url: Override base URL (from SystemConfig)
        stream: Enable SSE streaming
        max_tokens: Max tokens to generate
        temperature: Sampling temperature
        tools: Function definitions for tool calling

    Returns:
        Dict with keys: content, model, usage, finish_reason
    """
    vendor = _cached_get(vendor_id)
    if not vendor:
        return {"error": f"Unknown vendor: {vendor_id}"}

    # Determine endpoint
    url_base = base_url or vendor["base_url"]
    chat_path = vendor.get("chat_path", "/v1/chat/completions")
    url = f"{url_base.rstrip('/')}{chat_path}"

    # Build headers
    headers = {
        "Content-Type": "application/json",
    }
    auth_prefix = vendor.get("auth_prefix", "Bearer ")
    headers[vendor["auth_header"]] = f"{auth_prefix}{api_key}"

    # Anthropic needs a version header
    if vendor_id == "anthropic":
        headers["anthropic-version"] = "2023-06-01"

    # Build request body — vendor-specific
    if vendor_id == "minimax":
        body = _build_minimax_body(messages, model, stream, max_tokens, temperature, tools, **kwargs)
    elif vendor_id == "anthropic":
        body = _build_anthropic_body(messages, model, stream, max_tokens, temperature, tools, **kwargs)
    else:
        body = _build_openai_body(messages, model, stream, max_tokens, temperature, tools, **kwargs)

    try:
        timeout = kwargs.get("timeout", 120)
        resp = requests.post(url, headers=headers, json=body, timeout=timeout, stream=stream)
        resp.raise_for_status()

        if stream:
            return {"stream": resp}
        else:
            data = resp.json()
            return _parse_response(vendor_id, data)

    except requests.exceptions.Timeout:
        logger.error(f"[{vendor_id}] Request timeout after {timeout}s")
        return {"error": "Request timeout"}
    except requests.exceptions.HTTPError as e:
        logger.error(f"[{vendor_id}] HTTP {e.response.status_code}: {e.response.text[:500]}")
        return {"error": f"HTTP {e.response.status_code}", "detail": e.response.text[:500]}
    except Exception as e:
        logger.error(f"[{vendor_id}] Unexpected error: {str(e)}")
        return {"error": str(e)}


def stream_chat_completion(
    vendor_id: str,
    model: str,
    messages: List[Dict[str, Any]],
    api_key: str,
    base_url: Optional[str] = None,
    max_tokens: Optional[int] = None,
    temperature: float = 0.7,
    tools: Optional[List[Dict]] = None,
    **kwargs,
) -> Generator[str, None, None]:
    """Streaming chat completion — yields content chunks as strings."""
    result = chat_completion(
        vendor_id=vendor_id,
        model=model,
        messages=messages,
        api_key=api_key,
        base_url=base_url,
        stream=True,
        max_tokens=max_tokens,
        temperature=temperature,
        tools=tools,
        **kwargs,
    )

    if "error" in result:
        yield json.dumps({"error": result["error"]})
        return

    resp = result.get("stream")
    if not resp:
        yield json.dumps({"error": "No stream returned"})
        return

    for line in resp.iter_lines(decode_unicode=True):
        if not line:
            continue
        if vendor_id == "anthropic":
            yield from _parse_anthropic_stream_line(line)
        elif vendor_id == "minimax":
            yield from _parse_minimax_stream_line(line)
        else:
            yield from _parse_openai_stream_line(line)


# ── Request builders ─────────────────────────────────────────


def _build_openai_body(messages, model, stream, max_tokens, temperature, tools, **kwargs):
    body = {
        "model": model,
        "messages": messages,
        "stream": stream,
    }
    if max_tokens:
        body["max_tokens"] = max_tokens
    if temperature is not None:
        body["temperature"] = temperature
    if tools:
        body["tools"] = tools
    # Volcano / Alibaba / Zhipu extra params
    if kwargs.get("enable_thinking") is not None:
        body["thinking"] = {"type": "enabled"} if kwargs["enable_thinking"] else {"type": "disabled"}
    if kwargs.get("web_search"):
        body["enable_search"] = True
    return body


def _build_anthropic_body(messages, model, stream, max_tokens, temperature, tools, **kwargs):
    # Convert OpenAI-format messages to Anthropic format
    system_msg = None
    anthropic_msgs = []
    for m in messages:
        if m["role"] == "system":
            system_msg = m["content"]
        elif m["role"] == "assistant" and isinstance(m.get("content"), list):
            # Tool calls — convert to Anthropic format
            text_parts = []
            tool_uses = []
            for part in m["content"]:
                if part.get("type") == "text":
                    text_parts.append({"type": "text", "text": part["text"]})
                elif part.get("type") == "tool_use":
                    tool_uses.append({
                        "type": "tool_use",
                        "id": part.get("id", ""),
                        "name": part.get("name", ""),
                        "input": part.get("input", {}),
                    })
            anthropic_msgs.append({"role": "assistant", "content": text_parts + tool_uses})
        elif m["role"] == "tool":
            anthropic_msgs.append({
                "role": "user",
                "content": [{
                    "type": "tool_result",
                    "tool_use_id": m.get("tool_call_id", ""),
                    "content": m.get("content", ""),
                }],
            })
        else:
            content = m.get("content", "")
            if isinstance(content, list):
                # Multimodal content
                parts = []
                for item in content:
                    if item.get("type") == "text":
                        parts.append({"type": "text", "text": item["text"]})
                    elif item.get("type") == "image_url":
                        parts.append({
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": item.get("image_url", {}).get("detail", "image/jpeg"),
                                "data": item.get("image_url", {}).get("url", "").split(",")[-1]
                                if item.get("image_url", {}).get("url", "").startswith("data:")
                                else item.get("image_url", {}).get("url", ""),
                            },
                        })
                anthropic_msgs.append({"role": m["role"], "content": parts})
            else:
                anthropic_msgs.append({"role": m["role"], "content": content})

    body = {
        "model": model,
        "messages": anthropic_msgs,
        "stream": stream,
        "max_tokens": max_tokens or 4096,
    }
    if system_msg:
        body["system"] = system_msg
    if tools:
        body["tools"] = tools
    if kwargs.get("enable_thinking"):
        body["thinking"] = {"type": "enabled", "budget_tokens": kwargs.get("thinking_budget", 4000)}
    return body


def _build_minimax_body(messages, model, stream, max_tokens, temperature, tools, **kwargs):
    """Minimax uses a different API format (non-OpenAI-compatible)."""
    # Minimax expects: { model, messages, stream, tokens_to_generate, ... }
    # Messages format: [{ sender_type: "USER"/"BOT", text: "..." }]
    minimax_msgs = []
    for m in messages:
        role = m.get("role", "user")
        content = m.get("content", "")
        if isinstance(content, list):
            # Multimodal — extract text
            text_parts = [item["text"] for item in content if item.get("type") == "text"]
            content = "\n".join(text_parts)
        minimax_msgs.append({
            "sender_type": "BOT" if role == "assistant" else "USER",
            "text": content,
        })

    body = {
        "model": model,
        "messages": minimax_msgs,
        "stream": stream,
        "tokens_to_generate": max_tokens or 4096,
        "temperature": temperature or 0.7,
    }
    if tools:
        body["functions"] = tools
    if kwargs.get("web_search"):
        body["enable_search"] = True
    return body


# ── Response parsers ─────────────────────────────────────────


def _parse_response(vendor_id: str, data: Dict) -> Dict:
    """Parse non-streaming response into unified format."""
    if vendor_id == "anthropic":
        content = ""
        for block in data.get("content", []):
            if block.get("type") == "text":
                content += block.get("text", "")
        return {
            "content": content,
            "model": data.get("model", ""),
            "usage": {
                "prompt_tokens": data.get("usage", {}).get("input_tokens", 0),
                "completion_tokens": data.get("usage", {}).get("output_tokens", 0),
                "total_tokens": (
                    data.get("usage", {}).get("input_tokens", 0)
                    + data.get("usage", {}).get("output_tokens", 0)
                ),
            },
            "finish_reason": data.get("stop_reason", ""),
        }
    elif vendor_id == "minimax":
        reply = data.get("reply", "")
        return {
            "content": reply,
            "model": model,
            "usage": {
                "prompt_tokens": data.get("usage", {}).get("prompt_tokens", 0),
                "completion_tokens": data.get("usage", {}).get("completion_tokens", 0),
                "total_tokens": data.get("usage", {}).get("total_tokens", 0),
            },
            "finish_reason": data.get("finish_reason", "stop"),
        }
    else:
        # OpenAI-compatible
        choice = data.get("choices", [{}])[0]
        return {
            "content": choice.get("message", {}).get("content", ""),
            "model": data.get("model", ""),
            "usage": data.get("usage", {}),
            "finish_reason": choice.get("finish_reason", ""),
        }


def _parse_openai_stream_line(line: str) -> Generator[str, None, None]:
    """Parse SSE line for OpenAI-compatible vendors."""
    if not line.startswith("data: "):
        return
    data_str = line[6:]
    if data_str == "[DONE]":
        return
    try:
        data = json.loads(data_str)
        delta = data.get("choices", [{}])[0].get("delta", {})
        content = delta.get("content", "")
        if content:
            yield content
    except json.JSONDecodeError:
        pass


def _parse_anthropic_stream_line(line: str) -> Generator[str, None, None]:
    """Parse SSE line for Anthropic."""
    if not line.startswith("data: "):
        return
    data_str = line[6:]
    try:
        data = json.loads(data_str)
        if data.get("type") == "content_block_delta":
            delta = data.get("delta", {})
            if delta.get("type") == "text_delta":
                yield delta.get("text", "")
    except json.JSONDecodeError:
        pass


def _parse_minimax_stream_line(line: str) -> Generator[str, None, None]:
    """Parse SSE line for Minimax."""
    if not line.startswith("data: "):
        return
    data_str = line[6:]
    if data_str == "[DONE]":
        return
    try:
        data = json.loads(data_str)
        choices = data.get("choices", [])
        if choices:
            delta = choices[0].get("delta", {})
            content = delta.get("text", "")
            if content:
                yield content
    except json.JSONDecodeError:
        pass
