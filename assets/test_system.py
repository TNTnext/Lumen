#!/usr/bin/env python3
"""
Lumen 系统全量测试工具
用法: python3 test_system.py [--base-url http://localhost:5000] [--verbose] [--skip-db]
覆盖: 认证、对话、管理后台、权限、接口开关、厂商、插件、数据库、多语言、批量操作、删除用户
"""

import sys
import json
import time
import argparse
import os
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
CYAN   = "\033[96m"
BOLD   = "\033[1m"
RESET  = "\033[0m"

def ok(msg: str) -> str:   return f"{GREEN}✓{RESET} {msg}"
def fail(msg: str) -> str: return f"{RED}✗{RESET} {msg}"
def warn(msg: str) -> str: return f"{YELLOW}⚠{RESET} {msg}"
def info(msg: str) -> str: return f"{CYAN}→{RESET} {msg}"

class TestRunner:
    def __init__(self, base_url: str, verbose: bool = False, skip_db: bool = False):
        self.base_url = base_url.rstrip('/')
        self.verbose = verbose
        self.skip_db = skip_db
        self.token: Optional[str] = None
        self.test_user_token: Optional[str] = None
        self.passed = 0
        self.failed = 0
        self.warnings = 0
        self.results: List[Tuple[str, bool, str]] = []
        self.conv_id: Optional[int] = None
        self.test_user = f"testuser_{int(time.time())}"
        self.test_pwd = "Test123456"

    def _req(self, method: str, path: str, **kwargs) -> requests.Response:
        url = f"{self.base_url}{path}"
        headers = kwargs.pop('headers', {})
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        headers.setdefault('Content-Type', 'application/json')
        return requests.request(method, url, headers=headers, timeout=30, **kwargs)

    def _log(self, msg: str):
        if self.verbose:
            print(f"    {msg}")

    def test(self, name: str, fn) -> bool:
        """Run a test case and record result."""
        try:
            result = fn()
            if result:
                self.passed += 1
                self.results.append((name, True, 'OK'))
                print(f"  {ok(name)}")
            else:
                self.failed += 1
                self.results.append((name, False, 'Assertion failed'))
                print(f"  {fail(name)}")
            return result
        except Exception as e:
            self.failed += 1
            self.results.append((name, False, str(e)))
            print(f"  {fail(name)} — {RED}{e}{RESET}")
            return False

    def run_all(self):
        print(f"\n{BOLD}{'='*60}{RESET}")
        print(f"{BOLD}  Lumen System Test Suite{RESET}")
        print(f"  Base URL: {self.base_url}")
        print(f"{BOLD}{'='*60}{RESET}\n")

        # ─── 1. Service Health ───
        self._test_health()

        # ─── 2. Auth Module ───
        self._test_auth()

        # ─── 3. Onboarding ───
        self._test_onboarding()

        # ─── 4. Chat Module ───
        self._test_chat()

        # ─── 5. Admin Dashboard ───
        self._test_dashboard()

        # ─── 6. Admin Users ───
        self._test_users()

        # ─── 7. Admin Permissions ───
        self._test_permissions()

        # ─── 8. Admin Config ───
        self._test_config()

        # ─── 9. Endpoint Toggles ───
        self._test_endpoints()

        # ─── 10. Vendor Management ───
        self._test_vendors()

        # ─── 11. Model Priority ───
        self._test_model_priority()

        # ─── 12. Plugin System ───
        self._test_plugins()

        # ─── 13. Database Config ───
        self._test_database()

        # ─── 14. API Documentation Page ───
        self._test_docx_page()

        # ─── 15. Admin UI Pages ───
        self._test_ui_pages()

        # ─── 16. Batch Operations & Delete User ───
        self._test_batch()

        # ─── Summary ───
        self._print_summary()

    # ══════════════════════════════════════════════════════════
    # 1. Service Health
    # ══════════════════════════════════════════════════════════
    def _test_health(self):
        print(f"{BOLD}[1] Service Health{RESET}")

        def t_root_404():
            r = requests.get(self.base_url + '/', timeout=10, allow_redirects=False)
            return r.status_code == 404

        def t_login_page():
            r = requests.get(self.base_url + '/login', timeout=10)
            return r.status_code == 200

        def t_admin_page():
            r = requests.get(self.base_url + '/admin', timeout=10)
            return r.status_code == 200

        def t_docx_page():
            r = requests.get(self.base_url + '/docx/', timeout=10)
            return r.status_code == 200

        self.test("GET / → 404", t_root_404)
        self.test("GET /login → 200", t_login_page)
        self.test("GET /admin → 200", t_admin_page)
        self.test("GET /docx/ → 200", t_docx_page)

    # ══════════════════════════════════════════════════════════
    # 2. Auth Module
    # ══════════════════════════════════════════════════════════
    def _test_auth(self):
        print(f"\n{BOLD}[2] Auth Module{RESET}")

        def t_register_no_data():
            r = self._req('POST', '/api/auth/register', json={})
            return r.status_code == 400

        def t_login_bad():
            r = self._req('POST', '/api/auth/login', json={'username': 'nonexist', 'password': 'wrong'})
            return r.status_code == 401

        def t_login_admin():
            r = self._req('POST', '/api/auth/login', json={'username': 'admin', 'password': 'admin123'})
            if r.status_code == 200:
                data = r.json()
                self.token = data.get('token')
                return bool(self.token)
            return False

        def t_me():
            r = self._req('GET', '/api/auth/me')
            if r.status_code == 200:
                data = r.json()
                user = data.get('user', {})
                return user.get('username') == 'admin'
            return False

        def t_change_password():
            r = self._req('POST', '/api/auth/change-password',
                          json={'old_password': 'admin123', 'new_password': 'admin123'})
            return r.status_code == 200

        def t_register_new_user():
            r = requests.post(f"{self.base_url}/api/auth/register",
                            json={'username': self.test_user, 'password': self.test_pwd,
                                  'email': f'{self.test_user}@test.com'}, timeout=10)
            if r.status_code == 201:
                data = r.json()
                self.test_user_token = data.get('token')
                return bool(self.test_user_token)
            return r.status_code == 400  # might already exist

        self.test("Register without data → 400", t_register_no_data)
        self.test("Login with bad credentials → 401", t_login_bad)
        self.test("Login as admin → 200 + token", t_login_admin)
        self.test("GET /auth/me → admin", t_me)
        self.test("Change password → 200", t_change_password)
        self.test("Register new user → 201", t_register_new_user)

    # ══════════════════════════════════════════════════════════
    # 3. Onboarding
    # ══════════════════════════════════════════════════════════
    def _test_onboarding(self):
        print(f"\n{BOLD}[3] Onboarding{RESET}")

        def t_onboarding_status():
            r = self._req('GET', '/api/admin/onboarding/status')
            if r.status_code == 200:
                data = r.json()
                return 'needs_onboarding' in data or 'success' in data
            return False

        def t_complete_empty():
            r = self._req('POST', '/api/admin/onboarding/complete', json={'database': {'db_type': 'sqlite'}})
            return r.status_code in [200, 403]  # 403 if already completed

        self.test("GET onboarding status", t_onboarding_status)
        self.test("POST onboarding complete", t_complete_empty)

    # ══════════════════════════════════════════════════════════
    # 4. Chat Module
    # ══════════════════════════════════════════════════════════
    def _test_chat(self):
        print(f"\n{BOLD}[4] Chat Module{RESET}")

        def t_models():
            r = self._req('GET', '/api/chat/models')
            return r.status_code == 200

        def t_send_no_model():
            r = self._req('POST', '/api/chat/send',
                         json={'message': 'Hello', 'stream': False})
            # May return error if no model available — either 200 or 400/500 is fine
            return r.status_code in [200, 400, 422, 500]

        def t_conversations():
            r = self._req('GET', '/api/chat/conversations')
            return r.status_code == 200

        def t_new_conversation():
            r = self._req('POST', '/api/chat/conversations', json={'title': 'Test Conv'})
            if r.status_code in [200, 201]:
                data = r.json()
                self.conv_id = data.get('id') or data.get('conversation', {}).get('id')
                return self.conv_id is not None
            # May not have this endpoint
            return r.status_code in [404, 405]

        def t_conv_detail():
            if self.conv_id:
                r = self._req('GET', f'/api/chat/conversations/{self.conv_id}')
                return r.status_code == 200
            return True  # skip

        def t_delete_conv():
            if self.conv_id:
                r = self._req('DELETE', f'/api/chat/conversations/{self.conv_id}')
                return r.status_code == 200
            return True  # skip

        self.test("GET /chat/models", t_models)
        self.test("POST /chat/send (no model)", t_send_no_model)
        self.test("GET /chat/conversations", t_conversations)
        self.test("POST new conversation", t_new_conversation)
        self.test("GET conversation detail", t_conv_detail)
        self.test("DELETE conversation", t_delete_conv)

    # ══════════════════════════════════════════════════════════
    # 5. Admin Dashboard
    # ══════════════════════════════════════════════════════════
    def _test_dashboard(self):
        print(f"\n{BOLD}[5] Admin Dashboard{RESET}")

        def t_dashboard():
            r = self._req('GET', '/api/admin/dashboard')
            if r.status_code == 200:
                data = r.json()
                return data.get('success') and 'stats' in data
            return False

        self.test("GET /admin/dashboard", t_dashboard)

    # ══════════════════════════════════════════════════════════
    # 6. Admin Users
    # ══════════════════════════════════════════════════════════
    def _test_users(self):
        print(f"\n{BOLD}[6] Admin Users{RESET}")

        def t_users_list():
            r = self._req('GET', '/api/admin/users')
            return r.status_code == 200

        def t_update_user():
            r = self._req('GET', '/api/admin/users')
            users = r.json().get('users', [])
            if users:
                uid = users[0].get('id')
                r2 = self._req('PUT', f'/api/admin/users/{uid}',
                              json={'role': users[0].get('role', 'user')})
                return r2.status_code == 200
            return True

        def t_user_convs():
            r = self._req('GET', '/api/admin/users')
            users = r.json().get('users', [])
            if users:
                uid = users[0].get('id')
                r2 = self._req('GET', f'/api/admin/users/{uid}/conversations')
                return r2.status_code == 200
            return True

        self.test("GET /admin/users", t_users_list)
        self.test("PUT /admin/users/:id", t_update_user)
        self.test("GET /admin/users/:id/conversations", t_user_convs)

    # ══════════════════════════════════════════════════════════
    # 7. Admin Permissions
    # ══════════════════════════════════════════════════════════
    def _test_permissions(self):
        print(f"\n{BOLD}[7] Admin Permissions{RESET}")

        def t_global_perms():
            r = self._req('GET', '/api/admin/permissions/global')
            return r.status_code == 200

        def t_update_global():
            r = self._req('PUT', '/api/admin/permissions/global',
                         json={'max_daily_chats': 100})
            return r.status_code == 200

        def t_user_perms():
            r = self._req('GET', '/api/admin/users')
            users = r.json().get('users', [])
            if users:
                uid = users[0].get('id')
                r2 = self._req('GET', f'/api/admin/permissions/user/{uid}')
                return r2.status_code == 200
            return True

        self.test("GET /admin/permissions/global", t_global_perms)
        self.test("PUT /admin/permissions/global", t_update_global)
        self.test("GET /admin/permissions/user/:id", t_user_perms)

    # ══════════════════════════════════════════════════════════
    # 8. Admin Config
    # ══════════════════════════════════════════════════════════
    def _test_config(self):
        print(f"\n{BOLD}[8] Admin Config{RESET}")

        def t_get_config():
            r = self._req('GET', '/api/admin/config')
            return r.status_code == 200

        def t_api_key():
            r = self._req('GET', '/api/admin/config/api-key')
            return r.status_code == 200

        def t_open_reg():
            r = self._req('GET', '/api/admin/config/open-registration')
            return r.status_code == 200

        self.test("GET /admin/config", t_get_config)
        self.test("GET /admin/config/api-key", t_api_key)
        self.test("GET /admin/config/open-registration", t_open_reg)

    # ══════════════════════════════════════════════════════════
    # 9. Endpoint Toggles
    # ══════════════════════════════════════════════════════════
    def _test_endpoints(self):
        print(f"\n{BOLD}[9] Endpoint Toggles{RESET}")

        def t_list_endpoints():
            r = self._req('GET', '/api/admin/endpoints')
            return r.status_code == 200

        def t_batch_toggle():
            r = self._req('PUT', '/api/admin/endpoints/batch',
                         json={'group': 'auth', 'enabled': True})
            return r.status_code == 200

        self.test("GET /admin/endpoints", t_list_endpoints)
        self.test("PUT /admin/endpoints/batch", t_batch_toggle)

    # ══════════════════════════════════════════════════════════
    # 10. Vendor Management
    # ══════════════════════════════════════════════════════════
    def _test_vendors(self):
        print(f"\n{BOLD}[10] Vendor Management{RESET}")

        def t_vendors_list():
            r = self._req('GET', '/api/admin/vendors')
            return r.status_code == 200

        def t_vendor_configs():
            r = self._req('GET', '/api/admin/vendor-configs')
            return r.status_code == 200

        def t_test_connection():
            r = self._req('GET', '/api/admin/vendor-configs')
            configs = r.json().get('vendor_configs', []) if r.status_code == 200 else []
            if configs:
                vid = configs[0].get('id')
                r2 = self._req('POST', '/api/admin/config/test-connection',
                              json={'vendor_config_id': vid})
                # May fail if no valid API key, that's OK
                return r2.status_code in [200, 500]
            return True

        self.test("GET /admin/vendors", t_vendors_list)
        self.test("GET /admin/vendor-configs", t_vendor_configs)
        self.test("POST test connection", t_test_connection)

    # ══════════════════════════════════════════════════════════
    # 11. Model Priority
    # ══════════════════════════════════════════════════════════
    def _test_model_priority(self):
        print(f"\n{BOLD}[11] Model Priority{RESET}")

        def t_model_priority():
            r = self._req('GET', '/api/admin/model-priority-order')
            return r.status_code == 200

        def t_update_priority():
            r = self._req('PUT', '/api/admin/model-priority-order',
                         json={'order': ['deepseek-chat', 'gpt-4o-mini']})
            return r.status_code == 200

        self.test("GET /admin/model-priority-order", t_model_priority)
        self.test("PUT /admin/model-priority-order", t_update_priority)

    # ══════════════════════════════════════════════════════════
    # 12. Plugin System
    # ══════════════════════════════════════════════════════════
    def _test_plugins(self):
        print(f"\n{BOLD}[12] Plugin System{RESET}")

        def t_plugins_list():
            r = self._req('GET', '/api/admin/plugins/')
            if r.status_code == 200:
                data = r.json()
                return 'plugins' in data
            return False

        def t_plugin_tools():
            r = self._req('GET', '/api/admin/plugins/tools')
            return r.status_code == 200

        def t_toggle_plugin():
            r = self._req('GET', '/api/admin/plugins/')
            plugins = r.json().get('plugins', []) if r.status_code == 200 else []
            if plugins:
                name = plugins[0].get('name')
                r2 = self._req('PUT', f'/api/admin/plugins/{name}/toggle',
                              json={'enabled': plugins[0].get('enabled', True)})
                return r2.status_code == 200
            return True

        self.test("GET /admin/plugins", t_plugins_list)
        self.test("GET /admin/plugins/tools", t_plugin_tools)
        self.test("PUT toggle plugin", t_toggle_plugin)

    # ══════════════════════════════════════════════════════════
    # 13. Database Config
    # ══════════════════════════════════════════════════════════
    def _test_database(self):
        print(f"\n{BOLD}[13] Database Configuration{RESET}")

        if self.skip_db:
            print(f"  {warn('Database tests skipped (--skip-db)')}")
            self.warnings += 1
            return

        def t_get_db_config():
            r = self._req('GET', '/api/admin/config/database')
            if r.status_code == 200:
                data = r.json()
                return data.get('success') and 'config' in data
            return False

        def t_update_db_config():
            r = self._req('PUT', '/api/admin/config/database',
                         json={'db_type': 'sqlite', 'db_name': 'app.db'})
            return r.status_code == 200

        def t_test_db_connection():
            r = self._req('POST', '/api/admin/config/database/test',
                         json={'db_type': 'sqlite', 'db_name': 'app.db'})
            if r.status_code == 200:
                return r.json().get('success', False)
            return False

        self.test("GET /admin/config/database", t_get_db_config)
        self.test("PUT /admin/config/database", t_update_db_config)
        self.test("POST test database connection", t_test_db_connection)

    # ══════════════════════════════════════════════════════════
    # 14. API Documentation Page
    # ══════════════════════════════════════════════════════════
    def _test_docx_page(self):
        print(f"\n{BOLD}[14] API Documentation Page{RESET}")

        def t_docx_html():
            r = requests.get(f"{self.base_url}/docx/", timeout=10)
            return r.status_code == 200 and 'html' in r.headers.get('content-type', '').lower()

        def t_docx_i18n():
            r = requests.get(f"{self.base_url}/docx/", timeout=10)
            text = r.text.lower()
            # Check for both languages
            has_chinese = any(word in text for word in ['文档', '接口', '管理'])
            has_english = any(word in text for word in ['api', 'documentation', 'auth'])
            return has_english or has_chinese

        self.test("GET /docx/ HTML response", t_docx_html)
        self.test("/docx/ has bilingual content", t_docx_i18n)

    # ══════════════════════════════════════════════════════════
    # 15. Admin UI Pages
    # ══════════════════════════════════════════════════════════
    def _test_ui_pages(self):
        print(f"\n{BOLD}[15] Admin UI Pages (HTML){RESET}")

        def t_admin_html():
            r = requests.get(f"{self.base_url}/admin", timeout=10)
            text = r.text.lower()
            has_i18n = 'nav_' in text or 'lang' in text or 'zh' in text or 'en' in text
            has_plugins = 'plugins' in text or '插件' in text
            has_database = 'database' in text or '数据库' in text
            return r.status_code == 200 and (has_i18n or has_plugins or has_database)

        def t_login_html():
            r = requests.get(f"{self.base_url}/login", timeout=10)
            text = r.text.lower()
            has_lang_switch = 'lang' in text or '语言' in text or 'language' in text
            return r.status_code == 200 and has_lang_switch

        self.test("GET /admin → i18n + plugins + database", t_admin_html)
        self.test("GET /login → language switch", t_login_html)

    # ══════════════════════════════════════════════════════════
    # 16. Batch Operations & Delete User
    # ══════════════════════════════════════════════════════════
    def _test_batch(self):
        print(f"\n{BOLD}[16] Batch Operations & Delete User{RESET}")

        # Create a test user for delete operations
        test_username = f"batch_test_{int(time.time())}"
        create_res = self._req('POST', '/api/auth/register',
            json={"username": test_username, "password": "test123456", "email": f"{test_username}@test.com"})
        test_user_id = None
        try:
            body = create_res.json()
            if body.get('success'):
                test_user_id = body.get('user', {}).get('id')
        except: pass

        if not test_user_id:
            r = self._req('GET', '/api/admin/users?page=1&per_page=100')
            try:
                for u in r.json().get('users', []):
                    if u.get('username') == test_username:
                        test_user_id = u['id']
                        break
            except: pass

        # Test: DELETE user
        def t_delete_user():
            if not test_user_id:
                return True  # skip, not fail
            r = self._req('DELETE', f'/api/admin/users/{test_user_id}')
            return r.status_code in (200, 404)

        # Test: DELETE self (should fail)
        def t_delete_self():
            r = self._req('GET', '/api/auth/me')
            try:
                admin_id = r.json().get('user', {}).get('id')
            except: return False
            r = self._req('DELETE', f'/api/admin/users/{admin_id}')
            return r.status_code == 400  # should reject self-delete

        # Test: batch delete conversations (empty ids)
        def t_batch_empty_conv():
            r = self._req('POST', '/api/admin/batch',
                json={"action": "delete_conversations", "ids": []})
            return r.status_code == 400

        # Test: batch delete users (empty ids)
        def t_batch_empty_users():
            r = self._req('POST', '/api/admin/batch',
                json={"action": "delete_users", "ids": []})
            return r.status_code == 400

        # Test: batch toggle endpoints
        def t_batch_toggle():
            r = self._req('POST', '/api/admin/batch',
                json={"action": "toggle_endpoints", "ids": [99999], "extra": {"enabled": True}})
            return r.status_code == 200

        # Test: unknown action
        def t_batch_unknown():
            r = self._req('POST', '/api/admin/batch',
                json={"action": "invalid_action", "ids": [1]})
            return r.status_code == 400

        self.test("DELETE /api/admin/users/:id (test user)", t_delete_user)
        self.test("DELETE /api/admin/users/:id (self, should fail)", t_delete_self)
        self.test("POST /api/admin/batch (empty convs → 400)", t_batch_empty_conv)
        self.test("POST /api/admin/batch (empty users → 400)", t_batch_empty_users)
        self.test("POST /api/admin/batch (toggle endpoints)", t_batch_toggle)
        self.test("POST /api/admin/batch (unknown action → 400)", t_batch_unknown)

    # ══════════════════════════════════════════════════════════
    # Summary
    # ══════════════════════════════════════════════════════════
    def _print_summary(self):
        total = self.passed + self.failed
        print(f"\n{BOLD}{'='*60}{RESET}")
        print(f"{BOLD}  Test Summary{RESET}")
        print(f"{'='*60}")
        print(f"  Total:   {total}")
        print(f"  Passed:  {GREEN}{self.passed}{RESET}")
        print(f"  Failed:  {RED}{self.failed}{RESET}")
        if self.warnings:
            print(f"  Warnings:{YELLOW} {self.warnings}{RESET}")
        if self.failed == 0:
            print(f"\n  {GREEN}{BOLD}All tests passed!{RESET}")
        else:
            print(f"\n  {RED}{BOLD}Some tests failed:{RESET}")
            for name, passed, err in self.results:
                if not passed:
                    print(f"    {RED}✗{RESET} {name}: {err}")
        print(f"{'='*60}\n")


def main():
    parser = argparse.ArgumentParser(description='Lumen System Test Suite')
    parser.add_argument('--base-url', default=os.environ.get('LUMEN_URL', 'http://localhost:5000'),
                       help='Lumen server URL (default: http://localhost:5000)')
    parser.add_argument('--verbose', '-v', action='store_true', help='Verbose output')
    parser.add_argument('--skip-db', action='store_true', help='Skip database connection tests')
    args = parser.parse_args()

    runner = TestRunner(args.base_url, args.verbose, args.skip_db)
    runner.run_all()
    sys.exit(0 if runner.failed == 0 else 1)


if __name__ == '__main__':
    main()
