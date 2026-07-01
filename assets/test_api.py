#!/usr/bin/env python3
"""
Lumen API 测试工具
用法: python3 test_api.py [--base-url http://localhost:5000] [--verbose]
"""

import sys
import json
import time
import argparse
from typing import Optional, Dict, Any, List, Tuple

try:
    import requests
except ImportError:
    print("请先安装 requests: pip install requests")
    sys.exit(1)

# ── 颜色 ──────────────────────────────────────────────
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[94m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

def ok(msg: str) -> str:   return f"{GREEN}✓{RESET} {msg}"
def fail(msg: str) -> str: return f"{RED}✗{RESET} {msg}"
def warn(msg: str) -> str: return f"{YELLOW}⚠{RESET} {msg}"
def info(msg: str) -> str: return f"{CYAN}→{RESET} {msg}"
def hdr(msg: str) -> str:  return f"\n{BOLD}{'='*60}{RESET}\n{BOLD}  {msg}{RESET}\n{BOLD}{'='*60}{RESET}"

# ── 测试框架 ──────────────────────────────────────────
class Tester:
    def __init__(self, base_url: str, verbose: bool = False):
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.token: Optional[str] = None
        self.verbose = verbose
        self.passed = 0
        self.failed = 0
        self.skipped = 0

    def _url(self, path: str) -> str:
        return f"{self.base_url}{path}"

    def _headers(self, auth: bool = True) -> Dict[str, str]:
        h = {"Content-Type": "application/json"}
        if auth and self.token:
            h["Authorization"] = f"Bearer {self.token}"
        return h

    def _req(self, method: str, path: str, data: Any = None, auth: bool = True,
             raw: bool = False, timeout: int = 30) -> Tuple[int, Any]:
        kwargs = {"headers": self._headers(auth), "timeout": timeout}
        if data is not None:
            kwargs["json"] = data
        try:
            r = self.session.request(method, self._url(path), **kwargs)
            if raw:
                return r.status_code, r.text
            try:
                body = r.json() if r.content else None
            except json.JSONDecodeError:
                body = r.text
            return r.status_code, body
        except requests.exceptions.Timeout:
            return 0, "TIMEOUT"
        except requests.exceptions.ConnectionError:
            return 0, "CONNECTION_REFUSED"

    def test(self, name: str, method: str, path: str, data: Any = None,
             auth: bool = True, expect_status: int = 200,
             expect_field: Optional[str] = None,
             expect_contains: Optional[str] = None,
             expect_not_contains: Optional[str] = None) -> bool:
        if self.verbose:
            print(f"{info(name)}")
        code, body = self._req(method, path, data, auth)

        errors = []
        if code != expect_status:
            errors.append(f"状态码 {code} (期望 {expect_status})")
        if expect_field and isinstance(body, dict) and expect_field not in body:
            errors.append(f"缺少字段 '{expect_field}'")
        if expect_contains and isinstance(body, str) and expect_contains not in body:
            errors.append(f"响应不含 '{expect_contains}'")
        if expect_not_contains and isinstance(body, str) and expect_not_contains in body:
            errors.append(f"响应不应包含 '{expect_not_contains}'")

        if errors:
            self.failed += 1
            detail = body if self.verbose else (str(body)[:120] if body else "(空)")
            print(f"  {fail(name)} — {'; '.join(errors)}")
            if self.verbose:
                print(f"    响应: {detail}")
            return False
        else:
            self.passed += 1
            if self.verbose:
                print(f"  {ok(name)}")
            return True

    def skip(self, name: str, reason: str):
        self.skipped += 1
        print(f"  {warn(name)} — {reason}")

    def summary(self):
        total = self.passed + self.failed + self.skipped
        print(f"\n{BOLD}结果:{RESET} 总计 {total} | {GREEN}通过 {self.passed}{RESET} | {RED}失败 {self.failed}{RESET} | {YELLOW}跳过 {self.skipped}{RESET}")
        return self.failed == 0


# ── 测试用例 ──────────────────────────────────────────
def run_tests(t: Tester):
    # ─── 1. 基础连通性 ───
    print(hdr("1. 服务连通性"))
    t.test("服务可达", "GET", "/api/auth/me", auth=False, expect_status=401)
    t.test("管理后台页面", "GET", "/admin", auth=False, expect_status=200, expect_field=None)

    # ─── 2. 认证 ───
    print(hdr("2. 认证接口 /api/auth"))
    t.test("登录 (正确密码)", "POST", "/api/auth/login",
           {"username": "admin", "password": "admin123"},
           auth=False, expect_status=200, expect_field="token")
    t.test("登录 (错误密码)", "POST", "/api/auth/login",
           {"username": "admin", "password": "wrong"},
           auth=False, expect_status=401)
    t.test("登录 (空用户名)", "POST", "/api/auth/login",
           {"username": "", "password": "admin123"},
           auth=False, expect_status=400)

    # 获取 token
    _, login_resp = t._req("POST", "/api/auth/login",
                           {"username": "admin", "password": "admin123"}, auth=False)
    if login_resp and isinstance(login_resp, dict) and login_resp.get("token"):
        t.token = login_resp["token"]
        print(f"  {ok('获取 Token 成功')} ({t.token[:20]}...)")
    else:
        print(f"  {fail('无法获取 Token，后续认证测试将跳过')}")
        return

    t.test("获取当前用户", "GET", "/api/auth/me", expect_status=200, expect_field="success")
    t.test("登出", "POST", "/api/auth/logout", expect_status=200, expect_field="message")

    # 重新登录
    _, login_resp = t._req("POST", "/api/auth/login",
                           {"username": "admin", "password": "admin123"}, auth=False)
    t.token = login_resp["token"]

    # ─── 3. 对话 ───
    print(hdr("3. 对话接口 /api/chat"))
    t.test("获取模型列表", "GET", "/api/chat/models", expect_status=200, expect_field="models")
    t.test("获取对话列表", "GET", "/api/chat/conversations", expect_status=200, expect_field="conversations")

    # 创建对话并发送消息
    _, chat_resp = t._req("POST", "/api/chat/send",
                          {"content": "Hello", "model": "deepseek-chat"},
                          timeout=15)
    if isinstance(chat_resp, dict):
        conv_id = chat_resp.get("conversation_id")
        if conv_id:
            t.test("发送消息成功", "POST", "/api/chat/send",
                   {"content": "Hello", "model": "deepseek-chat"},
                   expect_status=200, expect_field="conversation_id")
            t.test("获取对话详情", "GET", f"/api/chat/conversations/{conv_id}",
                   expect_status=200, expect_field="messages")
            t.test("删除对话", "DELETE", f"/api/chat/conversations/{conv_id}",
                   expect_status=200)
        else:
            print(f"  {warn('发送消息')} — 可能 API key 未配置，跳过相关测试")
            t.skip("发送消息", "API key 未配置")
            t.skip("获取对话详情", "无对话 ID")
            t.skip("删除对话", "无对话 ID")
    else:
        t.skip("发送消息", f"异常响应: {str(chat_resp)[:80]}")

    # ─── 4. 管理后台 ───
    print(hdr("4. 管理后台 /api/admin"))
    t.test("数据看板", "GET", "/api/admin/dashboard", expect_status=200, expect_field="stats")
    t.test("用户列表", "GET", "/api/admin/users", expect_status=200, expect_field="users")
    t.test("全部对话概览", "GET", "/api/admin/conversations", expect_status=200)
    t.test("全局权限", "GET", "/api/admin/permissions/global", expect_status=200, expect_field="permissions")
    t.test("系统配置", "GET", "/api/admin/config", expect_status=200, expect_field="configs")
    t.test("注册开关", "GET", "/api/admin/config/open-registration", expect_status=200, expect_field="open_registration")
    t.test("接口开关列表", "GET", "/api/admin/endpoints", expect_status=200, expect_field="groups")
    t.test("厂商模型列表", "GET", "/api/admin/vendors", expect_status=200, expect_field="vendors")
    t.test("厂商配置列表", "GET", "/api/admin/vendor-configs", expect_status=200, expect_field="configs")
    t.test("模型优先级排序", "GET", "/api/admin/model-priority-order", expect_status=200)

    # 修改配置 (无副作用)
    t.test("更新全局权限", "PUT", "/api/admin/permissions/global",
           {"max_daily_chats": 100, "max_tokens_per_request": 4096},
           expect_status=200)

    # 厂商配置更新
    _, configs_resp = t._req("GET", "/api/admin/vendor-configs")
    configs = (configs_resp or {}).get("configs", [])
    if configs:
        first_id = configs[0]["id"]
        t.test("更新厂商配置", "PUT", f"/api/admin/vendor-configs/{first_id}",
               {"enabled": configs[0]["enabled"]},  # 不改动实际状态
               expect_status=200)

    # ─── 5. 权限校验 ───
    print(hdr("5. 权限与安全"))
    t.test("无 Token 访问管理接口", "GET", "/api/admin/dashboard", auth=False, expect_status=401)
    t.test("无 Token 访问对话接口", "GET", "/api/chat/conversations", auth=False, expect_status=401)

    # 注册新用户
    test_user = f"test_{int(time.time())}"
    t.test("注册新用户", "POST", "/api/auth/register",
           {"username": test_user, "email": f"{test_user}@test.com", "password": "Test1234"},
           auth=False, expect_status=201)

    # 用新用户登录
    _, new_login = t._req("POST", "/api/auth/login",
                          {"username": test_user, "password": "Test1234"}, auth=False)
    if new_login and isinstance(new_login, dict) and new_login.get("token"):
        new_token = new_login["token"]
        old_token = t.token
        t.token = new_token
        t.test("普通用户访问管理接口 (应403)", "GET", "/api/admin/dashboard", expect_status=403)
        t.test("普通用户访问对话接口 (应200)", "GET", "/api/chat/conversations", expect_status=200)
        t.token = old_token  # 恢复 admin token

    # ─── 6. 接口开关 ───
    print(hdr("6. 接口开关"))
    _, endpoints = t._req("GET", "/api/admin/endpoints")
    groups = (endpoints or {}).get("groups", {})
    for g_name, g_data in groups.items():
        eps = g_data.get("endpoints", [])
        enabled_count = sum(1 for e in eps if e.get("enabled"))
        print(f"  {info(g_name)}: {enabled_count}/{len(eps)} 已启用")

    # ─── 7. 非流式对话 ───
    print(hdr("7. 非流式对话"))
    _, send_resp = t._req("POST", "/api/chat/send",
                          {"content": "Hi", "model": "deepseek-chat", "stream": False},
                          timeout=30)
    if isinstance(send_resp, dict):
        if send_resp.get("conversation_id"):
            print(f"  {ok('非流式对话')} — conversation_id={send_resp['conversation_id']}")
            t.passed += 1
        else:
            err = send_resp.get("error", "未知错误")
            print(f"  {warn('非流式对话')} — {err[:80]}")
            t.skipped += 1
    else:
        print(f"  {warn('非流式对话')} — 响应异常")
        t.skipped += 1

    # ─── 8. 厂商优先级排序 ───
    print(hdr("8. 厂商优先级排序"))
    _, order_resp = t._req("GET", "/api/admin/model-priority-order")
    current_order = (order_resp or {}).get("order", [])
    t.test("保存模型优先级", "PUT", "/api/admin/model-priority-order",
           {"order": current_order[:3] if current_order else []},
           expect_status=200)

    # ─── 9. 厂商测试连接 ───
    print(hdr("9. 厂商连接测试"))
    _, configs2 = t._req("GET", "/api/admin/vendor-configs")
    configs = (configs2 or {}).get("configs", [])
    for c in configs:
        if c.get("enabled") and c.get("api_key"):
            _, test_resp = t._req("POST", "/api/admin/config/test-connection",
                                  {"vendor_config_id": c["id"]}, timeout=15)
            if isinstance(test_resp, dict):
                status = "✓" if test_resp.get("success") else "✗"
                msg = test_resp.get("message", "")[:60]
                print(f"  {info(c['vendor_id'])}: {status} {msg}")
            else:
                print(f"  {info(c['vendor_id'])}: {warn('响应异常')}")
        else:
            print(f"  {info(c['vendor_id'])}: {warn('未启用或无 API Key')} — 跳过")


# ── 入口 ──────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Lumen API 测试工具")
    parser.add_argument("--base-url", default="http://localhost:5000", help="API 地址")
    parser.add_argument("--verbose", "-v", action="store_true", help="详细输出")
    args = parser.parse_args()

    print(f"{BOLD}Lumen API 测试{RESET}")
    print(f"目标: {args.base_url}")
    print(f"时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")

    t = Tester(args.base_url, args.verbose)
    try:
        run_tests(t)
    except KeyboardInterrupt:
        print(f"\n{warn('用户中断')}")
    except Exception as e:
        print(f"\n{fail(f'测试异常: {e}')}")
        import traceback
        traceback.print_exc()

    success = t.summary()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
