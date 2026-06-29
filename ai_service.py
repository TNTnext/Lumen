"""Multi-vendor AI service with automatic failover.

Supports 9 built-in vendors + custom OpenAI-compatible endpoints.
Each vendor can have multiple models with configurable priority.
On failure, automatically tries next model/vendor in priority order.
"""

import json
import time
import requests
from typing import Optional, Generator, Dict, Any, List


# ── Vendor API adapters ──

def _openai_compatible_chat(vendor_id: str, model: str, messages: list,
                             api_key: str, base_url: str, max_tokens: int,
                             stream: bool = False, **kwargs) -> dict:
    """Standard OpenAI-compatible /v1/chat/completions."""
    url = f"{base_url.rstrip('/')}/v1/chat/completions"
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }
    body = {
        'model': model,
        'messages': messages,
        'max_tokens': max_tokens,
        'stream': stream,
    }
    # Thinking/reasoning support
    if kwargs.get('thinking') and vendor_id in ('deepseek', 'kimi'):
        body['thinking'] = {'type': 'enabled'}
    # Web search support
    if kwargs.get('web_search'):
        body['web_search'] = True
    # Tools support
    if kwargs.get('tools'):
        body['tools'] = kwargs['tools']

    resp = requests.post(url, headers=headers, json=body, timeout=120)
    if not resp.ok:
        return {'error': f'API error {resp.status_code}: {resp.text[:300]}'}

    data = resp.json()
    choice = data['choices'][0]
    content = choice.get('message', {}).get('content', '') or ''
    # Handle thinking content (DeepSeek R1, Kimi K2)
    reasoning = choice.get('message', {}).get('reasoning_content', '')
    if reasoning:
        content = f"[思考]\n{reasoning}\n[/思考]\n\n{content}"

    return {
        'content': content,
        'model': data.get('model', model),
        'usage': data.get('usage', {}),
        'vendor_id': vendor_id,
    }


def _anthropic_chat(vendor_id: str, model: str, messages: list,
                    api_key: str, base_url: str, max_tokens: int,
                    stream: bool = False, **kwargs) -> dict:
    """Anthropic Messages API adapter."""
    url = f"{base_url.rstrip('/')}/v1/messages"
    headers = {
        'x-api-key': api_key,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json',
    }

    # Convert OpenAI format messages to Anthropic format
    system_msgs = [m['content'] for m in messages if m['role'] == 'system' and isinstance(m['content'], str)]
    anthropic_msgs = []
    for m in messages:
        if m['role'] == 'system':
            continue
        role = 'assistant' if m['role'] == 'assistant' else 'user'
        content = m['content']
        # Convert multi-modal OpenAI content to Anthropic format
        if isinstance(content, list):
            anthropic_content = []
            for part in content:
                if part.get('type') == 'text':
                    anthropic_content.append({'type': 'text', 'text': part['text']})
                elif part.get('type') == 'image_url':
                    image_url = part.get('image_url', {}).get('url', '')
                    anthropic_content.append({
                        'type': 'image',
                        'source': {'type': 'url', 'url': image_url},
                    })
                elif part.get('type') == 'file_url':
                    file_url = part.get('file_url', {}).get('url', '')
                    anthropic_content.append({
                        'type': 'document',
                        'source': {'type': 'url', 'url': file_url},
                    })
            content = anthropic_content
        anthropic_msgs.append({'role': role, 'content': content})

    body = {
        'model': model,
        'messages': anthropic_msgs,
        'max_tokens': max_tokens,
    }
    if system_msgs:
        body['system'] = '\n'.join(system_msgs)
    if kwargs.get('thinking'):
        body['thinking'] = {'type': 'enabled', 'budget_tokens': min(max_tokens // 2, 4096)}

    # Convert OpenAI-format tools to Anthropic format
    tools = kwargs.get('tools')
    if tools:
        anthropic_tools = []
        for tool in tools:
            if isinstance(tool, dict):
                func = tool.get('function', tool)
                anthropic_tools.append({
                    'name': func.get('name', ''),
                    'description': func.get('description', ''),
                    'input_schema': func.get('parameters', {'type': 'object', 'properties': {}}),
                })
        if anthropic_tools:
            body['tools'] = anthropic_tools

    # Anthropic native web search
    if kwargs.get('web_search'):
        body.setdefault('tools', [])
        body['tools'].append({
            'type': 'web_search_20250305',
            'name': 'web_search',
        })

    resp = requests.post(url, headers=headers, json=body, timeout=120)
    if not resp.ok:
        return {'error': f'Anthropic API error {resp.status_code}: {resp.text[:300]}'}

    data = resp.json()
    content_blocks = data.get('content', [])
    text_parts = []
    for block in content_blocks:
        if block.get('type') == 'text':
            text_parts.append(block.get('text', ''))
        elif block.get('type') == 'thinking':
            text_parts.append(f"[思考]\n{block.get('thinking', '')}\n[/思考]")

    return {
        'content': '\n'.join(text_parts),
        'model': data.get('model', model),
        'usage': data.get('usage', {}),
        'vendor_id': vendor_id,
    }


def _minimax_chat(vendor_id: str, model: str, messages: list,
                  api_key: str, base_url: str, max_tokens: int,
                  stream: bool = False, **kwargs) -> dict:
    """Minimax non-standard API adapter."""
    url = f"{base_url.rstrip('/')}/v1/text/chatcompletion_v2"
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }
    # Minimax uses sender_type
    minimax_msgs = []
    for m in messages:
        sender_type = 'BOT' if m['role'] == 'assistant' else 'USER'
        minimax_msgs.append({'sender_type': sender_type, 'text': m['content']})

    body = {
        'model': model,
        'messages': minimax_msgs,
        'tokens_to_generate': max_tokens,
    }
    resp = requests.post(url, headers=headers, json=body, timeout=120)
    if not resp.ok:
        return {'error': f'Minimax API error {resp.status_code}: {resp.text[:300]}'}

    data = resp.json()
    if data.get('base_resp', {}).get('status_code') != 0:
        return {'error': f"Minimax error: {data.get('base_resp', {}).get('status_msg', 'unknown')}"}

    reply = data.get('reply', '') or ''
    choices = data.get('choices', [])
    if choices:
        for choice in choices:
            msgs = choice.get('messages', [])
            for msg in msgs:
                reply += msg.get('text', '')

    return {
        'content': reply,
        'model': model,
        'usage': {'total_tokens': data.get('usage', {}).get('total_tokens', 0)},
        'vendor_id': vendor_id,
    }


# ── Vendor adapter registry ──
_VENDOR_ADAPTERS = {
    'openai': _openai_compatible_chat,
    'deepseek': _openai_compatible_chat,
    'kimi': _openai_compatible_chat,
    'volcano': _openai_compatible_chat,
    'alibaba': _openai_compatible_chat,
    'xai': _openai_compatible_chat,
    'glm': _openai_compatible_chat,
    'anthropic': _anthropic_chat,
    'minimax': _minimax_chat,
}


def _get_adapter(vendor_id: str):
    """Get the API adapter for a vendor. Falls back to OpenAI-compatible."""
    return _VENDOR_ADAPTERS.get(vendor_id, _openai_compatible_chat)


# ── Public API ──

def chat_completion(vendor_id: str, model: str, messages: list,
                    api_key: str, base_url: str, max_tokens: int = 4096,
                    **kwargs) -> dict:
    """Single-shot chat completion for a specific vendor+model.

    Returns: {'content': str, 'model': str, 'usage': dict, 'vendor_id': str}
             or {'error': str}
    """
    adapter = _get_adapter(vendor_id)
    try:
        kwargs.setdefault('stream', False)
        return adapter(
            vendor_id=vendor_id, model=model, messages=messages,
            api_key=api_key, base_url=base_url, max_tokens=max_tokens,
            **kwargs,
        )
    except requests.exceptions.Timeout:
        return {'error': f'{vendor_id}/{model}: 请求超时'}
    except requests.exceptions.ConnectionError:
        return {'error': f'{vendor_id}/{model}: 连接失败'}
    except Exception as e:
        return {'error': f'{vendor_id}/{model}: {str(e)}'}


def stream_chat_completion(vendor_id: str, model: str, messages: list,
                           api_key: str, base_url: str, max_tokens: int = 4096,
                           **kwargs) -> Generator[str, None, None]:
    """Streaming chat completion for a specific vendor+model.

    Yields content chunks as strings.
    """
    adapter = _get_adapter(vendor_id)
    url = f"{base_url.rstrip('/')}/v1/chat/completions"
    headers = {
        'Authorization': f'Bearer {api_key}',
        'Content-Type': 'application/json',
    }
    body = {
        'model': model,
        'messages': messages,
        'max_tokens': max_tokens,
        'stream': True,
    }
    if kwargs.get('thinking') and vendor_id in ('deepseek', 'kimi'):
        body['thinking'] = {'type': 'enabled'}

    try:
        resp = requests.post(url, headers=headers, json=body, timeout=120, stream=True)
        if not resp.ok:
            yield f"[Error: {resp.status_code}]"
            return

        for line in resp.iter_lines(decode_unicode=True):
            if not line or not line.startswith('data: '):
                continue
            data_str = line[6:]
            if data_str.strip() == '[DONE]':
                break
            try:
                data = json.loads(data_str)
                delta = data.get('choices', [{}])[0].get('delta', {})
                content = delta.get('content', '')
                if content:
                    yield content
            except (json.JSONDecodeError, KeyError, IndexError):
                continue
    except Exception as e:
        yield f"[Error: {str(e)}]"


def _load_vendor_configs() -> List[Dict[str, Any]]:
    """Load all enabled vendor configs ordered by priority from DB."""
    from models import VendorConfig
    configs = VendorConfig.query.filter_by(enabled=True).order_by(
        VendorConfig.priority.asc()
    ).all()
    result = []
    for vc in configs:
        if not vc.api_key:
            continue
        models = vc.get_model_priorities()
        if not models:
            continue
        models_sorted = sorted(models, key=lambda m: m.get('priority', 999))
        result.append({
            'vendor_id': vc.vendor_id,
            'api_key': vc.api_key,
            'base_url': vc.base_url,
            'models': models_sorted,
        })
    return result


def chat_completion_with_failover(messages: list, max_tokens: int = 4096,
                                   **kwargs) -> dict:
    """Chat completion with automatic vendor/model failover.

    Tries each enabled vendor's models in priority order.
    On first success, returns the result.
    On all failures, returns the last error.

    Returns: {'content': str, 'model': str, 'usage': dict, 'vendor_id': str}
             or {'error': str}
    """
    configs = _load_vendor_configs()
    if not configs:
        return {'error': '没有可用的 AI 厂商配置，请先在管理后台配置 API Key'}

    last_error = None
    for vc in configs:
        for mp in vc['models']:
            model_id = mp.get('model', '')
            if not model_id:
                continue
            result = chat_completion(
                vendor_id=vc['vendor_id'],
                model=model_id,
                messages=messages,
                api_key=vc['api_key'],
                base_url=vc['base_url'],
                max_tokens=max_tokens,
                **kwargs,
            )
            if 'error' not in result:
                return result
            last_error = result['error']

    return {'error': last_error or '所有厂商和模型均请求失败'}


def stream_chat_completion_with_failover(messages: list, max_tokens: int = 4096,
                                          **kwargs) -> Generator[str, None, None]:
    """Streaming chat completion with automatic vendor/model failover.

    Tries each enabled vendor's models in priority order.
    On first successful stream, yields chunks.
    On all failures, yields error message.
    """
    configs = _load_vendor_configs()
    if not configs:
        yield "[Error: 没有可用的 AI 厂商配置]"
        return

    last_error = None
    for vc in configs:
        for mp in vc['models']:
            model_id = mp.get('model', '')
            if not model_id:
                continue
            try:
                chunks = []
                for chunk in stream_chat_completion(
                    vendor_id=vc['vendor_id'],
                    model=model_id,
                    messages=messages,
                    api_key=vc['api_key'],
                    base_url=vc['base_url'],
                    max_tokens=max_tokens,
                    **kwargs,
                ):
                    if chunk.startswith('[Error'):
                        last_error = chunk
                        break
                    chunks.append(chunk)
                    yield chunk
                if chunks and not chunks[0].startswith('[Error'):
                    return
            except Exception as e:
                last_error = f'{vc["vendor_id"]}/{model_id}: {str(e)}'

    yield f"[Error: {last_error or '所有厂商和模型均请求失败'}]"


def test_vendor_connection(vendor_id: str, api_key: str, base_url: str,
                           model: str) -> dict:
    """Test a vendor connection with a simple chat request."""
    return chat_completion(
        vendor_id=vendor_id,
        model=model,
        messages=[{'role': 'user', 'content': 'Hi'}],
        api_key=api_key,
        base_url=base_url,
        max_tokens=10,
    )
