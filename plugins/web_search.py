"""
Web Search Plugin — 为 AI 提供实时网络搜索能力
"""
import json
import logging
from plugins import LumenPlugin, PluginMeta, ToolDefinition
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)


class WebSearchPlugin(LumenPlugin):
    meta = PluginMeta(
        name="web_search",
        display_name="Web Search",
        description="实时网络搜索 — 让 AI 获取最新信息，支持多搜索引擎",
        version="1.0.0",
        author="Lumen",
        priority=90,
        config={
            "engine": "duckduckgo",
            "max_results": 5,
            "timeout": 10,
        }
    )

    def get_tools(self) -> list:
        return [
            ToolDefinition(
                name="web_search",
                description="Search the web for real-time information. Use this when you need current data, news, or facts beyond your knowledge cutoff.",
                parameters={
                    "type": "object",
                    "properties": {
                        "query": {
                            "type": "string",
                            "description": "The search query string"
                        },
                        "max_results": {
                            "type": "integer",
                            "description": "Maximum number of results to return (1-10)",
                            "default": 5
                        }
                    },
                    "required": ["query"]
                }
            ),
            ToolDefinition(
                name="fetch_url",
                description="Fetch and extract content from a URL. Use this to read a webpage's text content.",
                parameters={
                    "type": "object",
                    "properties": {
                        "url": {
                            "type": "string",
                            "description": "The URL to fetch content from"
                        }
                    },
                    "required": ["url"]
                }
            )
        ]

    def execute_tool(self, tool_name: str, arguments: Dict[str, Any]) -> str:
        if tool_name == "web_search":
            return self._search(arguments.get("query", ""), arguments.get("max_results", 5))
        elif tool_name == "fetch_url":
            return self._fetch(arguments.get("url", ""))
        return json.dumps({"error": f"Unknown tool: {tool_name}"})

    def _search(self, query: str, max_results: int = 5) -> str:
        if not query:
            return json.dumps({"error": "Empty query"})

        try:
            import requests
            engine = self.meta.config.get("engine", "duckduckgo")
            timeout = self.meta.config.get("timeout", 10)
            max_results = min(int(max_results), 10)

            if engine == "duckduckgo":
                url = "https://api.duckduckgo.com/"
                params = {"q": query, "format": "json", "no_html": 1, "skip_disambig": 1}
                resp = requests.get(url, params=params, timeout=timeout)
                data = resp.json()

                results = []
                # Abstract
                if data.get("AbstractText"):
                    results.append({
                        "title": data.get("AbstractSource", "DuckDuckGo"),
                        "snippet": data["AbstractText"],
                        "url": data.get("AbstractURL", "")
                    })
                # Related topics
                for topic in data.get("RelatedTopics", [])[:max_results]:
                    if isinstance(topic, dict) and topic.get("Text"):
                        results.append({
                            "title": topic.get("FirstURL", "").split("/")[-1].replace("_", " "),
                            "snippet": topic["Text"],
                            "url": topic.get("FirstURL", "")
                        })

                return json.dumps({
                    "query": query,
                    "results": results[:max_results],
                    "count": len(results[:max_results])
                }, ensure_ascii=False)

            return json.dumps({"error": f"Unknown engine: {engine}"})
        except Exception as e:
            logger.warning(f"Web search failed: {e}")
            return json.dumps({"error": f"Search failed: {str(e)}"})

    def _fetch(self, url: str) -> str:
        if not url:
            return json.dumps({"error": "Empty URL"})
        try:
            import requests
            resp = requests.get(url, timeout=10, headers={"User-Agent": "Lumen/1.0"})
            resp.raise_for_status()
            # Simple text extraction — strip HTML tags
            import re
            text = re.sub(r'<[^>]+>', ' ', resp.text)
            text = re.sub(r'\s+', ' ', text).strip()
            return json.dumps({
                "url": url,
                "content": text[:5000],
                "status": resp.status_code
            }, ensure_ascii=False)
        except Exception as e:
            return json.dumps({"error": f"Fetch failed: {str(e)}"})


PLUGIN_META = {
    'name': 'web_search',
    'display_name': '网页搜索',
    'description': '支持网页搜索和URL内容抓取的网络搜索插件',
    'version': '1.0.0',
    'author': 'Lumen',
    'category': 'search',
    'priority': 20,
    'enabled': True,
}

def create_plugin(meta):
    return WebSearchPlugin(meta)
