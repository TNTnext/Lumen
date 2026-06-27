"""Multi-vendor AI service with capability-aware chat, streaming, vision, and tools."""

import json
import time
import requests
from typing import Optional, Generator, Dict, Any, List
from model_registry import get_vendor, get_model_capabilities


class AIService:
    """Unified AI service supporting multiple vendors via OpenAI-compatible API."""

    def __init__(self, api_key: str = "", base_url: str = "", vendor_id: str = "deepseek"):
        self.api_key = api_key
        self.base_url = base_url
        self.vendor_id = vendor_id
        self._session = requests.Session()
        self._timeout = 120

    def update_config(self, api_key: str, base_url: str, vendor_id: str = "deepseek"):
        self.api_key = api_key
        self.base_url = base_url
        self.vendor_id = vendor_id

    def _get_headers(self) -> Dict[str, str]:
        vendor = get_vendor(self.vendor_id)
        auth_hdr = vendor["auth_header"] if vendor else "Authorization"
        prefix = vendor["auth_prefix"] if vendor else "Bearer "
        return {
            "Content-Type": "application/json",
            auth_hdr: f"{prefix}{self.api_key}",
        }

    def _get_chat_url(self) -> str:
        vendor = get_vendor(self.vendor_id)
        path = vendor["chat_path"] if vendor else "/v1/chat/completions"
        return f"{self.base_url.rstrip('/')}{path}"

    def chat(
        self,
        messages: List[Dict],
        model: str = "deepseek-chat",
        max_tokens: int = 4096,
        temperature: float = 0.7,
        tools: Optional[List[Dict]] = None,
        **kwargs,
    ) -> Dict[str, Any]:
        """Non-streaming chat completion."""
        url = self._get_chat_url()
        payload = {
            "model": model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "stream": False,
        }
        if tools:
            payload["tools"] = tools
            payload["tool_choice"] = "auto"
        payload.update(kwargs)

        for attempt in range(3):
            try:
                resp = self._session.post(
                    url,
                    headers=self._get_headers(),
                    json=payload,
                    timeout=self._timeout,
                )
                if resp.status_code == 200:
                    data = resp.json()
                    choice = data["choices"][0]
                    msg = choice.get("message", {})

                    # Handle tool calls
                    if msg.get("tool_calls"):
                        return {
                            "success": True,
                            "content": msg.get("content") or "",
                            "tool_calls": msg["tool_calls"],
                            "tokens": data.get("usage", {}).get("total_tokens", 0),
                            "completion_tokens": data.get("usage", {}).get("completion_tokens", 0),
                        }

                    return {
                        "success": True,
                        "content": msg.get("content", ""),
                        "tokens": data.get("usage", {}).get("total_tokens", 0),
                        "completion_tokens": data.get("usage", {}).get("completion_tokens", 0),
                    }
                elif resp.status_code == 429:
                    time.sleep(2 ** attempt)
                    continue
                else:
                    err = resp.json() if resp.text else {}
                    return {"success": False, "error": err.get("error", {}).get("message", f"API Error {resp.status_code}")}
            except requests.exceptions.Timeout:
                if attempt < 2:
                    time.sleep(1)
                    continue
                return {"success": False, "error": "请求超时，请稍后重试"}
            except requests.exceptions.ConnectionError:
                return {"success": False, "error": "无法连接到 API 服务"}
            except Exception as e:
                return {"success": False, "error": str(e)}

        return {"success": False, "error": "请求失败，已达最大重试次数"}

    def chat_stream(
        self,
        messages: List[Dict],
        model: str = "deepseek-chat",
        max_tokens: int = 4096,
        temperature: float = 0.7,
        **kwargs,
    ) -> Generator[str, None, None]:
        """Streaming chat completion — yields content chunks."""
        url = self._get_chat_url()
        payload = {
            "model": model,
            "messages": messages,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "stream": True,
        }
        payload.update(kwargs)

        try:
            resp = self._session.post(
                url,
                headers=self._get_headers(),
                json=payload,
                timeout=self._timeout,
                stream=True,
            )
            if resp.status_code != 200:
                err = resp.json() if resp.text else {}
                yield f"[ERROR] {err.get('error', {}).get('message', f'API Error {resp.status_code}')}"
                return

            for line in resp.iter_lines(decode_unicode=True):
                if not line or not line.startswith("data: "):
                    continue
                data_str = line[6:]
                if data_str == "[DONE]":
                    break
                try:
                    data = json.loads(data_str)
                    delta = data.get("choices", [{}])[0].get("delta", {})
                    content = delta.get("content", "")
                    if content:
                        yield content
                except json.JSONDecodeError:
                    continue
        except Exception as e:
            yield f"[ERROR] {str(e)}"

    def test_connection(self, model: str = "deepseek-chat") -> Dict[str, Any]:
        """Test API connectivity with a minimal request."""
        return self.chat(
            messages=[{"role": "user", "content": "Hi"}],
            model=model,
            max_tokens=10,
        )

    def chat_with_vision(
        self,
        messages: List[Dict],
        model: str,
        max_tokens: int = 4096,
        **kwargs,
    ) -> Dict[str, Any]:
        """Chat with image content (for vision-capable models)."""
        return self.chat(messages=messages, model=model, max_tokens=max_tokens, **kwargs)

    def chat_with_tools(
        self,
        messages: List[Dict],
        tools: List[Dict],
        model: str,
        max_tokens: int = 4096,
        **kwargs,
    ) -> Dict[str, Any]:
        """Chat with function/tool calling."""
        return self.chat(messages=messages, model=model, max_tokens=max_tokens, tools=tools, **kwargs)


# Backward-compatible alias
DeepSeekService = AIService
