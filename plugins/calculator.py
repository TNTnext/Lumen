"""
Calculator Plugin — 为 AI 提供精确数学计算能力
"""
import json
import math
import re
import logging
from plugins import LumenPlugin, PluginMeta, ToolDefinition
from typing import Dict, Any

logger = logging.getLogger(__name__)


class CalculatorPlugin(LumenPlugin):
    meta = PluginMeta(
        name="calculator",
        display_name="Calculator",
        description="精确数学计算 — 支持四则运算、三角函数、对数、统计等",
        version="1.0.0",
        author="Lumen",
        priority=80,
        config={"max_precision": 10}
    )

    def get_tools(self) -> list:
        return [
            ToolDefinition(
                name="calculate",
                description="Evaluate a mathematical expression. Supports +, -, *, /, **, %, sqrt, sin, cos, tan, log, log10, abs, round, pi, e. Example: 'sqrt(16) + 3 * 5'",
                parameters={
                    "type": "object",
                    "properties": {
                        "expression": {
                            "type": "string",
                            "description": "The mathematical expression to evaluate"
                        }
                    },
                    "required": ["expression"]
                }
            ),
            ToolDefinition(
                name="convert_units",
                description="Convert between common units: length (km/m/cm/mm/mi/ft/in), weight (kg/g/lb/oz), temperature (C/F/K), time (h/min/s). Example: convert 100 km to miles",
                parameters={
                    "type": "object",
                    "properties": {
                        "value": {
                            "type": "number",
                            "description": "The numeric value to convert"
                        },
                        "from_unit": {
                            "type": "string",
                            "description": "Source unit (km, m, cm, mm, mi, ft, in, kg, g, lb, oz, C, F, K, h, min, s)"
                        },
                        "to_unit": {
                            "type": "string",
                            "description": "Target unit"
                        }
                    },
                    "required": ["value", "from_unit", "to_unit"]
                }
            )
        ]

    def execute_tool(self, tool_name: str, arguments: Dict[str, Any]) -> str:
        if tool_name == "calculate":
            return self._calculate(arguments.get("expression", ""))
        elif tool_name == "convert_units":
            return self._convert(
                arguments.get("value", 0),
                arguments.get("from_unit", ""),
                arguments.get("to_unit", "")
            )
        return json.dumps({"error": f"Unknown tool: {tool_name}"})

    def _calculate(self, expr: str) -> str:
        if not expr:
            return json.dumps({"error": "Empty expression"})

        # Whitelist allowed characters
        safe_expr = re.sub(r'[^0-9+\-*/().%^,\s]', '', expr)
        # Replace ^ with **
        safe_expr = safe_expr.replace('^', '**')

        try:
            # Allow safe math functions
            allowed_names = {
                "sqrt": math.sqrt, "sin": math.sin, "cos": math.cos,
                "tan": math.tan, "log": math.log, "log10": math.log10,
                "abs": abs, "round": round, "pi": math.pi, "e": math.e,
                "ceil": math.ceil, "floor": math.floor,
                "asin": math.asin, "acos": math.acos, "atan": math.atan,
                "degrees": math.degrees, "radians": math.radians,
            }
            result = eval(safe_expr, {"__builtins__": {}}, allowed_names)
            precision = self.meta.config.get("max_precision", 10)
            if isinstance(result, float):
                result = round(result, precision)
            return json.dumps({
                "expression": expr,
                "result": result
            }, ensure_ascii=False)
        except Exception as e:
            return json.dumps({"error": f"Calculation error: {str(e)}"})

    def _convert(self, value, from_unit: str, to_unit: str) -> str:
        from_unit = from_unit.lower().strip()
        to_unit = to_unit.lower().strip()

        # Length conversions (to meters first)
        length_to_m = {
            "km": 1000, "m": 1, "cm": 0.01, "mm": 0.001,
            "mi": 1609.344, "ft": 0.3048, "in": 0.0254,
        }
        # Weight conversions (to grams first)
        weight_to_g = {
            "kg": 1000, "g": 1, "lb": 453.592, "oz": 28.3495,
        }

        try:
            value = float(value)

            # Length
            if from_unit in length_to_m and to_unit in length_to_m:
                result = value * length_to_m[from_unit] / length_to_m[to_unit]
                return json.dumps({
                    "value": value, "from": from_unit, "to": to_unit,
                    "result": round(result, 6)
                })

            # Weight
            if from_unit in weight_to_g and to_unit in weight_to_g:
                result = value * weight_to_g[from_unit] / weight_to_g[to_unit]
                return json.dumps({
                    "value": value, "from": from_unit, "to": to_unit,
                    "result": round(result, 6)
                })

            # Temperature
            if from_unit == "c" and to_unit == "f":
                result = value * 9/5 + 32
                return json.dumps({"value": value, "from": "C", "to": "F", "result": round(result, 2)})
            if from_unit == "f" and to_unit == "c":
                result = (value - 32) * 5/9
                return json.dumps({"value": value, "from": "F", "to": "C", "result": round(result, 2)})
            if from_unit == "c" and to_unit == "k":
                result = value + 273.15
                return json.dumps({"value": value, "from": "C", "to": "K", "result": round(result, 2)})
            if from_unit == "k" and to_unit == "c":
                result = value - 273.15
                return json.dumps({"value": value, "from": "K", "to": "C", "result": round(result, 2)})

            # Time
            time_to_s = {"h": 3600, "min": 60, "s": 1}
            if from_unit in time_to_s and to_unit in time_to_s:
                result = value * time_to_s[from_unit] / time_to_s[to_unit]
                return json.dumps({"value": value, "from": from_unit, "to": to_unit, "result": round(result, 4)})

            return json.dumps({"error": f"Unsupported conversion: {from_unit} -> {to_unit}"})
        except Exception as e:
            return json.dumps({"error": f"Conversion error: {str(e)}"})


PLUGIN_META = {
    'name': 'calculator',
    'display_name': '智能计算器',
    'description': '支持四则运算、幂运算、三角函数、对数、单位换算的智能计算器',
    'version': '1.0.0',
    'author': 'Lumen',
    'category': 'utility',
    'priority': 10,
    'enabled': True,
}

def create_plugin(meta):
    return CalculatorPlugin(meta)
