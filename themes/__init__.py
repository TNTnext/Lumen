"""
Lumen Theme System - 独立主题文件夹

每个主题是一个独立的 Python 文件，包含完整的配色、字体、圆角、阴影定义。
系统启动时自动扫描 themes/ 目录，加载所有主题文件。

主题文件规范：
  - 文件名：xxx.py（如 ocean_blue.py）
  - 必须定义 THEME 字典（见下方模板）
  - 可选定义 register() 函数用于初始化
"""

import os
import json
import importlib.util
from typing import Dict, List, Optional, Any


def discover_themes() -> List[Dict[str, Any]]:
    """扫描 themes/ 目录，发现所有主题定义"""
    themes = []
    theme_dir = os.path.dirname(os.path.abspath(__file__))
    
    for filename in sorted(os.listdir(theme_dir)):
        if filename.startswith('_') or not filename.endswith('.py'):
            continue
        module_name = filename[:-3]
        try:
            spec = importlib.util.spec_from_file_location(
                f"themes.{module_name}",
                os.path.join(theme_dir, filename)
            )
            if spec and spec.loader:
                module = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(module)
                if hasattr(module, 'THEME'):
                    theme = dict(module.THEME)
                    theme['_source'] = module_name
                    themes.append(theme)
        except Exception as e:
            print(f"[Theme] Failed to load {filename}: {e}")
    
    return themes


def get_theme_by_name(name: str) -> Optional[Dict[str, Any]]:
    """按名称获取主题定义"""
    themes = discover_themes()
    for t in themes:
        if t.get('name') == name:
            return t
    return None
