"""
Translator Plugin — 为 AI 提供多语言翻译与文本处理能力
"""
import json
import logging
from plugins import LumenPlugin, PluginMeta, ToolDefinition
from typing import Dict, Any

logger = logging.getLogger(__name__)


class TranslatorPlugin(LumenPlugin):
    meta = PluginMeta(
        name="translator",
        display_name="Translator",
        description="多语言翻译 — 支持 30+ 语言互译、文本摘要、关键词提取、字符统计",
        version="1.0.0",
        author="Lumen",
        priority=70,
        config={
            "default_source": "auto",
            "default_target": "zh",
            "max_length": 5000,
        }
    )

    def get_tools(self) -> list:
        return [
            ToolDefinition(
                name="translate",
                description="Translate text between languages. Supports 30+ languages.",
                parameters={
                    "type": "object",
                    "properties": {
                        "text": {"type": "string", "description": "Text to translate"},
                        "target": {"type": "string", "description": "Target language code (zh, en, ja, ko, fr, de, es, ru, ar, pt, it, nl, ...)", "default": "zh"},
                        "source": {"type": "string", "description": "Source language code, or 'auto' for auto-detect", "default": "auto"}
                    },
                    "required": ["text", "target"]
                }
            ),
            ToolDefinition(
                name="summarize",
                description="Summarize long text into a concise version",
                parameters={
                    "type": "object",
                    "properties": {
                        "text": {"type": "string", "description": "Text to summarize"},
                        "max_sentences": {"type": "integer", "description": "Max sentences in summary", "default": 3}
                    },
                    "required": ["text"]
                }
            ),
            ToolDefinition(
                name="extract_keywords",
                description="Extract key phrases and keywords from text",
                parameters={
                    "type": "object",
                    "properties": {
                        "text": {"type": "string", "description": "Text to analyze"},
                        "count": {"type": "integer", "description": "Number of keywords to return", "default": 10}
                    },
                    "required": ["text"]
                }
            ),
            ToolDefinition(
                name="count_text",
                description="Count characters, words, sentences, paragraphs in text",
                parameters={
                    "type": "object",
                    "properties": {
                        "text": {"type": "string", "description": "Text to analyze"}
                    },
                    "required": ["text"]
                }
            )
        ]

    def execute_tool(self, tool_name: str, arguments: Dict[str, Any]) -> str:
        if tool_name == "translate":
            return self._translate(
                arguments.get("text", ""),
                arguments.get("target", "zh"),
                arguments.get("source", "auto")
            )
        elif tool_name == "summarize":
            return self._summarize(arguments.get("text", ""), arguments.get("max_sentences", 3))
        elif tool_name == "extract_keywords":
            return self._extract_keywords(arguments.get("text", ""), arguments.get("count", 10))
        elif tool_name == "count_text":
            return self._count_text(arguments.get("text", ""))
        return json.dumps({"error": f"Unknown tool: {tool_name}"})

    # — 语言代码映射 —
    LANG_MAP = {
        "zh": "Chinese", "en": "English", "ja": "Japanese", "ko": "Korean",
        "fr": "French", "de": "German", "es": "Spanish", "ru": "Russian",
        "ar": "Arabic", "pt": "Portuguese", "it": "Italian", "nl": "Dutch",
        "pl": "Polish", "tr": "Turkish", "vi": "Vietnamese", "th": "Thai",
        "id": "Indonesian", "ms": "Malay", "hi": "Hindi", "bn": "Bengali",
        "sv": "Swedish", "no": "Norwegian", "da": "Danish", "fi": "Finnish",
        "cs": "Czech", "ro": "Romanian", "uk": "Ukrainian", "he": "Hebrew",
        "auto": "Auto-detect"
    }

    def _translate(self, text: str, target: str, source: str = "auto") -> str:
        if not text.strip():
            return json.dumps({"error": "Empty text"})
        max_len = self.meta.config.get("max_length", 5000)
        if len(text) > max_len:
            text = text[:max_len]

        target_name = self.LANG_MAP.get(target, target)
        source_name = self.LANG_MAP.get(source, source)

        return json.dumps({
            "source": source,
            "source_name": source_name,
            "target": target,
            "target_name": target_name,
            "original": text[:500],
            "note": "Translation requires an LLM provider. The translation prompt has been prepared.",
            "translation_prompt": f"Translate the following text from {source_name} to {target_name}. Return ONLY the translated text, no explanations:\n\n{text}"
        }, ensure_ascii=False)

    def _summarize(self, text: str, max_sentences: int = 3) -> str:
        if not text.strip():
            return json.dumps({"error": "Empty text"})

        # Simple extractive summary: pick first N sentences
        import re
        sentences = re.split(r'(?<=[.!?。！？])\s+', text.strip())
        summary = ' '.join(sentences[:max_sentences])

        return json.dumps({
            "original_length": len(text),
            "summary_length": len(summary),
            "sentences_total": len(sentences),
            "summary": summary,
            "note": "Extractive summary (first sentences). For better results, use an LLM."
        }, ensure_ascii=False)

    def _extract_keywords(self, text: str, count: int = 10) -> str:
        if not text.strip():
            return json.dumps({"error": "Empty text"})

        # Simple TF-based keyword extraction
        import re
        from collections import Counter

        words = re.findall(r'[a-zA-Z\u4e00-\u9fff]{2,}', text.lower())
        # Filter stop words (simple list)
        stop_words = {
            "the", "a", "an", "is", "are", "was", "were", "be", "been",
            "being", "have", "has", "had", "do", "does", "did", "will",
            "would", "could", "should", "may", "might", "can", "shall",
            "to", "of", "in", "for", "on", "with", "at", "by", "from",
            "and", "or", "but", "not", "no", "so", "if", "as", "this",
            "that", "it", "its", "we", "you", "they", "he", "she", "我",
            "的", "了", "是", "在", "不", "和", "有", "也", "就", "都",
        }
        filtered = [w for w in words if w not in stop_words]
        top = Counter(filtered).most_common(count)

        return json.dumps({
            "keywords": [{"word": w, "frequency": f} for w, f in top],
            "count": len(top)
        }, ensure_ascii=False)

    def _count_text(self, text: str) -> str:
        import re
        chars = len(text)
        chars_no_space = len(re.sub(r'\s', '', text))
        words = len(re.findall(r'[a-zA-Z\u4e00-\u9fff]+', text))
        sentences = len(re.findall(r'[.!?。！？]', text))
        paragraphs = len([p for p in text.split('\n\n') if p.strip()])

        return json.dumps({
            "characters": chars,
            "characters_no_spaces": chars_no_space,
            "words": words,
            "sentences": sentences,
            "paragraphs": paragraphs,
        })


PLUGIN_META = {
    "name": "translator",
    "display_name": "Translator",
    "version": "1.0.0",
    "description": "Multi-language translation and text statistics",
    "author": "Lumen",
    "priority": 40,
    "category": "utility"
}

pass

def create_plugin(meta):
    return TranslatorPlugin(meta)
