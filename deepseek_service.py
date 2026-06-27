"""DeepSeek API service layer."""
import time
import logging
import requests
from typing import Generator

logger = logging.getLogger(__name__)


class DeepSeekService:
    """Service for interacting with DeepSeek API."""

    def __init__(self, api_key: str = '', base_url: str = 'https://api.deepseek.com'):
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.max_retries = 3
        self.timeout = 60

    def update_config(self, api_key: str, base_url: str):
        """Update API configuration."""
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')

    def _build_headers(self) -> dict:
        return {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
        }

    def chat(
        self,
        messages: list[dict],
        model: str = 'deepseek-chat',
        max_tokens: int = 4096,
        temperature: float = 0.7,
        stream: bool = False,
    ) -> dict:
        """Send a chat request to DeepSeek API (non-streaming)."""
        url = f'{self.base_url}/v1/chat/completions'
        payload = {
            'model': model,
            'messages': messages,
            'max_tokens': max_tokens,
            'temperature': temperature,
            'stream': False,
        }

        last_error = None
        for attempt in range(self.max_retries):
            try:
                resp = requests.post(
                    url, headers=self._build_headers(),
                    json=payload, timeout=self.timeout
                )
                if resp.status_code == 200:
                    data = resp.json()
                    choice = data['choices'][0]
                    return {
                        'success': True,
                        'content': choice['message']['content'],
                        'model': data.get('model', model),
                        'tokens': data.get('usage', {}).get('total_tokens', 0),
                        'prompt_tokens': data.get('usage', {}).get('prompt_tokens', 0),
                        'completion_tokens': data.get('usage', {}).get('completion_tokens', 0),
                    }
                elif resp.status_code == 429:
                    wait = min(2 ** attempt, 10)
                    logger.warning(f'DeepSeek rate limited, retrying in {wait}s')
                    time.sleep(wait)
                elif resp.status_code >= 500:
                    wait = min(2 ** attempt, 8)
                    logger.warning(f'DeepSeek server error {resp.status_code}, retrying in {wait}s')
                    time.sleep(wait)
                else:
                    error_data = resp.json() if resp.text else {}
                    return {
                        'success': False,
                        'error': error_data.get('error', {}).get('message', f'API错误: {resp.status_code}'),
                    }
            except requests.Timeout:
                last_error = '请求超时，请稍后重试'
                if attempt < self.max_retries - 1:
                    time.sleep(1)
            except requests.ConnectionError:
                last_error = '无法连接到 DeepSeek API'
                if attempt < self.max_retries - 1:
                    time.sleep(2)
            except Exception as e:
                last_error = f'请求异常: {str(e)}'
                logger.error(f'DeepSeek API error: {e}')
                if attempt < self.max_retries - 1:
                    time.sleep(1)

        return {'success': False, 'error': last_error or '请求失败，已达最大重试次数'}

    def chat_stream(
        self,
        messages: list[dict],
        model: str = 'deepseek-chat',
        max_tokens: int = 4096,
        temperature: float = 0.7,
    ) -> Generator[str, None, None]:
        """Send a streaming chat request to DeepSeek API."""
        url = f'{self.base_url}/v1/chat/completions'
        payload = {
            'model': model,
            'messages': messages,
            'max_tokens': max_tokens,
            'temperature': temperature,
            'stream': True,
        }

        last_error = None
        for attempt in range(self.max_retries):
            try:
                resp = requests.post(
                    url, headers=self._build_headers(),
                    json=payload, timeout=self.timeout, stream=True
                )
                if resp.status_code == 200:
                    for line in resp.iter_lines(decode_unicode=True):
                        if line and line.startswith('data: '):
                            data_str = line[6:]
                            if data_str.strip() == '[DONE]':
                                return
                            try:
                                import json
                                chunk = json.loads(data_str)
                                delta = chunk.get('choices', [{}])[0].get('delta', {})
                                content = delta.get('content', '')
                                if content:
                                    yield content
                            except (json.JSONDecodeError, KeyError, IndexError):
                                continue
                    return
                elif resp.status_code == 429:
                    wait = min(2 ** attempt, 10)
                    time.sleep(wait)
                elif resp.status_code >= 500:
                    wait = min(2 ** attempt, 8)
                    time.sleep(wait)
                else:
                    yield f'\n[错误] API返回状态码: {resp.status_code}'
                    return
            except requests.Timeout:
                last_error = '请求超时'
                if attempt < self.max_retries - 1:
                    time.sleep(1)
            except Exception as e:
                last_error = str(e)
                logger.error(f'DeepSeek stream error: {e}')
                if attempt < self.max_retries - 1:
                    time.sleep(1)

        if last_error:
            yield f'\n[错误] {last_error}'

    def test_connection(self) -> dict:
        """Test API connection with a simple request."""
        try:
            result = self.chat(
                messages=[{'role': 'user', 'content': 'Hi'}],
                model='deepseek-chat',
                max_tokens=10,
            )
            return result
        except Exception as e:
            return {'success': False, 'error': str(e)}
