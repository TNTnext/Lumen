#!/usr/bin/env python3
"""
Lumen AI Gateway Python Client
基于 https://github.com/TNTnext/Lumen API 的对话客户端
"""

import requests
import json
from typing import Optional, Iterator, Dict, Any, List
from dataclasses import dataclass
from urllib.parse import urljoin


@dataclass
class User:
    """用户信息"""
    id: int
    username: str
    email: Optional[str] = None


@dataclass
class Message:
    """对话消息"""
    role: str
    content: str
    created_at: Optional[str] = None


@dataclass
class Conversation:
    """对话会话"""
    id: int
    title: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class LumenClient:
    """
    Lumen AI Gateway 客户端
    
    使用示例:
        client = LumenClient("https://your-lumen-api.com")
        
        # 登录
        client.login("username", "password")
        
        # 发送消息（非流式）
        response = client.chat("你好，请介绍一下自己")
        print(response)
        
        # 发送消息（流式）
        for chunk in client.chat_stream("你好"):
            print(chunk, end="")
    """
    
    def __init__(self, base_url: str, timeout: int = 60):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.session = requests.Session()
        self._token: Optional[str] = None
        self._user: Optional[User] = None
    
    @property
    def token(self) -> Optional[str]:
        return self._token
    
    @property
    def is_authenticated(self) -> bool:
        return self._token is not None
    
    def _get_headers(self, auth: bool = True) -> Dict[str, str]:
        """获取请求头"""
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
        if auth and self._token:
            headers["Authorization"] = f"Bearer {self._token}"
        return headers
    
    def _request(
        self, 
        method: str, 
        endpoint: str, 
        data: Optional[Dict] = None,
        auth: bool = True,
        stream: bool = False
    ) -> Any:
        """发送HTTP请求"""
        url = urljoin(self.base_url, endpoint)
        try:
            response = self.session.request(
                method=method,
                url=url,
                headers=self._get_headers(auth),
                json=data,
                timeout=self.timeout,
                stream=stream
            )
            response.raise_for_status()
            
            if stream:
                return response
            return response.json() if response.content else None
            
        except requests.exceptions.RequestException as e:
            raise LumenAPIError(f"请求失败: {e}")
    
    # ========== 认证接口 ==========
    
    def register(self, username: str, password: str, email: Optional[str] = None) -> Dict:
        """
        注册新用户
        
        Args:
            username: 用户名
            password: 密码
            email: 邮箱（可选）
        
        Returns:
            {"success": True, "message": "注册成功"}
        """
        data = {
            "username": username,
            "password": password
        }
        if email:
            data["email"] = email
        
        return self._request("POST", "/api/auth/register", data, auth=False)
    
    def login(self, username: str, password: str) -> User:
        """
        用户登录，获取JWT Token
        
        Args:
            username: 用户名
            password: 密码
        
        Returns:
            User对象
        """
        data = {
            "username": username,
            "password": password
        }
        
        result = self._request("POST", "/api/auth/login", data, auth=False)
        
        if result.get("success"):
            self._token = result.get("token")
            user_data = result.get("user", {})
            self._user = User(
                id=user_data.get("id"),
                username=user_data.get("username"),
                email=user_data.get("email")
            )
            return self._user
        else:
            raise LumenAuthError("登录失败: " + result.get("message", "未知错误"))
    
    def logout(self) -> Dict:
        """登出当前用户"""
        result = self._request("POST", "/api/auth/logout")
        self._token = None
        self._user = None
        return result
    
    def get_me(self) -> User:
        """获取当前用户信息"""
        result = self._request("GET", "/api/auth/me")
        
        if result.get("success"):
            user_data = result.get("data", {})
            self._user = User(
                id=user_data.get("id"),
                username=user_data.get("username"),
                email=user_data.get("email")
            )
            return self._user
        return self._user
    
    # ========== 对话接口 ==========
    
    def chat(
        self,
        content: str,
        conversation_id: Optional[int] = None,
        model: str = "deepseek-chat",
        stream: bool = False,
        thinking: bool = False,
        web_search: bool = False,
        image_urls: Optional[List[str]] = None,
        file_urls: Optional[List[str]] = None,
        max_tokens: int = 4096,
        temperature: float = 0.7,
        top_p: float = 0.9,
        tools: Optional[List[Dict]] = None
    ) -> str:
        """
        发送消息（非流式）
        
        Args:
            content: 消息内容
            conversation_id: 对话ID（可选，用于多轮对话）
            model: 模型名称
            stream: 是否流式输出
            thinking: 是否显示思考过程
            web_search: 是否启用联网搜索
            image_urls: 图片URL列表
            file_urls: 文件URL列表
            max_tokens: 最大token数
            temperature: 温度参数
            top_p: top_p参数
            tools: 工具调用配置
        
        Returns:
            AI回复内容
        """
        data = {
            "content": content,
            "model": model,
            "stream": stream,
            "thinking": thinking,
            "web_search": web_search,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "top_p": top_p
        }
        
        if conversation_id:
            data["conversation_id"] = conversation_id
        if image_urls:
            data["image_urls"] = image_urls
        if file_urls:
            data["file_urls"] = file_urls
        if tools:
            data["tools"] = tools
        
        result = self._request("POST", "/api/chat/send", data)
        
        if result.get("success"):
            message = result.get("message", {})
            return message.get("content", "")
        else:
            raise LumenAPIError("对话失败: " + result.get("message", "未知错误"))
    
    def chat_stream(
        self,
        content: str,
        conversation_id: Optional[int] = None,
        model: str = "deepseek-chat",
        thinking: bool = False,
        web_search: bool = False,
        image_urls: Optional[List[str]] = None,
        file_urls: Optional[List[str]] = None,
        max_tokens: int = 4096,
        temperature: float = 0.7,
        top_p: float = 0.9,
        tools: Optional[List[Dict]] = None
    ) -> Iterator[str]:
        """
        发送消息（流式输出）
        
        Yields:
            每个流式数据块
        """
        data = {
            "content": content,
            "model": model,
            "stream": True,
            "thinking": thinking,
            "web_search": web_search,
            "max_tokens": max_tokens,
            "temperature": temperature,
            "top_p": top_p
        }
        
        if conversation_id:
            data["conversation_id"] = conversation_id
        if image_urls:
            data["image_urls"] = image_urls
        if file_urls:
            data["file_urls"] = file_urls
        if tools:
            data["tools"] = tools
        
        response = self._request("POST", "/api/chat/send", data, stream=True)
        
        for line in response.iter_lines():
            if not line:
                continue
            
            line = line.decode('utf-8')
            
            # 跳过 SSE 事件类型行和空数据行
            if line.startswith('event:') or line.startswith(':') or not line.strip():
                continue
            
            # 处理 SSE data: 前缀
            if line.startswith('data: '):
                line = line[6:]
            elif line.startswith('data:'):
                line = line[5:]
            
            if line.strip() == '[DONE]':
                break
            
            try:
                chunk = json.loads(line)
                if chunk.get("error"):
                    raise LumenAPIError(chunk["error"])
                if chunk.get("content"):
                    yield chunk["content"]
                if chunk.get("done"):
                    break
            except json.JSONDecodeError:
                continue
    
    def get_conversations(self, page: int = 1, page_size: int = 20) -> List[Conversation]:
        """
        获取当前用户的对话列表
        
        Args:
            page: 页码
            page_size: 每页数量
        
        Returns:
            对话列表
        """
        params = f"?page={page}&page_size={page_size}"
        result = self._request("GET", f"/api/chat/conversations{params}")
        
        if result.get("success"):
            conversations = result.get("data", [])
            return [
                Conversation(
                    id=c.get("id"),
                    title=c.get("title"),
                    created_at=c.get("created_at"),
                    updated_at=c.get("updated_at")
                )
                for c in conversations
            ]
        return []
    
    def get_conversation(self, conversation_id: int) -> Dict:
        """
        获取对话详情及消息列表
        
        Args:
            conversation_id: 对话ID
        
        Returns:
            对话详情，包含messages列表
        """
        return self._request("GET", f"/api/chat/conversations/{conversation_id}")
    
    def delete_conversation(self, conversation_id: int) -> Dict:
        """
        删除指定对话
        
        Args:
            conversation_id: 对话ID
        
        Returns:
            {"success": True, "message": "删除成功"}
        """
        return self._request("DELETE", f"/api/chat/conversations/{conversation_id}")


class LumenAPIError(Exception):
    """API错误"""
    pass


class LumenAuthError(Exception):
    """认证错误"""
    pass


# ========== 命令行交互界面 ==========

def interactive_chat():
    """交互式对话模式"""
    import getpass
    
    print("=" * 50)
    print("  Lumen AI Gateway - Python Client")
    print("  https://github.com/TNTnext/Lumen")
    print("=" * 50)
    
    # 配置
    base_url = input("\n请输入API地址 (默认: http://localhost:5000): ").strip()
    if not base_url:
        base_url = "http://localhost:5000"
    
    client = LumenClient(base_url)
    
    # 登录或注册
    while True:
        print("\n[1] 登录")
        print("[2] 注册")
        print("[3] 退出")
        choice = input("请选择: ").strip()
        
        if choice == "1":
            username = input("用户名: ").strip()
            password = getpass.getpass("密码: ")
            try:
                user = client.login(username, password)
                print(f"\n✓ 登录成功，欢迎 {user.username}!")
                break
            except Exception as e:
                print(f"✗ 登录失败: {e}")
        
        elif choice == "2":
            username = input("用户名: ").strip()
            email = input("邮箱 (可选): ").strip() or None
            password = getpass.getpass("密码: ")
            confirm = getpass.getpass("确认密码: ")
            
            if password != confirm:
                print("✗ 密码不一致")
                continue
            
            try:
                result = client.register(username, password, email)
                print(f"\n✓ {result.get('message', '注册成功')}")
            except Exception as e:
                print(f"✗ 注册失败: {e}")
        
        elif choice == "3":
            print("再见！")
            return
    
    # 对话模式
    conversation_id = None
    current_model = "deepseek-chat"
    
    print("\n" + "=" * 50)
    print("  输入 /help 查看命令列表")
    print("  输入 /quit 退出对话")
    print("=" * 50 + "\n")
    
    while True:
        try:
            user_input = input("你: ").strip()
            
            if not user_input:
                continue
            
            # 命令处理
            if user_input.startswith("/"):
                cmd = user_input[1:].split()[0].lower()
                
                if cmd == "quit" or cmd == "exit":
                    print("再见！")
                    break
                
                elif cmd == "help":
                    print("\n命令列表:")
                    print("  /help          - 显示帮助")
                    print("  /quit          - 退出")
                    print("  /new           - 新建对话")
                    print("  /list          - 查看对话列表")
                    print("  /model <name>  - 切换模型")
                    print("  /stream        - 切换流式/非流式")
                    print("  /search        - 切换联网搜索")
                    print("")
                    continue
                
                elif cmd == "new":
                    conversation_id = None
                    print("✓ 已新建对话\n")
                    continue
                
                elif cmd == "list":
                    try:
                        conversations = client.get_conversations()
                        print("\n对话列表:")
                        for conv in conversations[:10]:
                            print(f"  [{conv.id}] {conv.title or '未命名对话'}")
                        print("")
                    except Exception as e:
                        print(f"✗ 获取失败: {e}\n")
                    continue
                
                elif cmd == "model":
                    parts = user_input.split()
                    if len(parts) > 1:
                        current_model = parts[1]
                        print(f"✓ 已切换模型: {current_model}\n")
                    else:
                        print(f"当前模型: {current_model}\n")
                    continue
                
                else:
                    print("未知命令，输入 /help 查看帮助\n")
                    continue
            
            # 发送消息（流式）
            print("AI: ", end="", flush=True)
            full_response = []
            
            for chunk in client.chat_stream(
                content=user_input,
                conversation_id=conversation_id,
                model=current_model
            ):
                print(chunk, end="", flush=True)
                full_response.append(chunk)
            
            print("\n")
            
        except KeyboardInterrupt:
            print("\n\n再见！")
            break
        except Exception as e:
            print(f"\n✗ 错误: {e}\n")


if __name__ == "__main__":
    interactive_chat()
