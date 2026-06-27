// ─── State ────────────────────────────────────────────────
const state = {
  token: localStorage.getItem('admin_token') || '',
  user: null,
  page: 'dashboard',
  needsOnboarding: false,
};

// ─── API ──────────────────────────────────────────────────
async function api(path, opts = {}) {
  const headers = { ...opts.headers };
  if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
  if (opts.body && typeof opts.body === 'object') {
    headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(opts.body);
  }
  const res = await fetch(path, { ...opts, headers });
  if (res.status === 401) { localStorage.removeItem('admin_token'); location.href = '/login'; return null; }
  return res.json();
}

// ─── Toast ────────────────────────────────────────────────
function toast(msg, type = 'info') {
  const el = document.getElementById('toast');
  const colors = { info: 'bg-text text-white', success: 'bg-success text-white', error: 'bg-danger text-white' };
  el.className = `fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-lg text-sm font-medium shadow-lg transition-all duration-300 z-50 ${colors[type]}`;
  el.textContent = msg;
  el.style.opacity = '1';
  el.style.transform = 'translate(-50%, 0)';
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translate(-50%, 8px)'; }, 2500);
}

// ─── Auth ─────────────────────────────────────────────────
async function checkAuth() {
  if (!state.token) { location.href = '/login'; return; }
  const res = await api('/api/auth/me');
  if (!res || !res.success) { localStorage.removeItem('admin_token'); location.href = '/login'; return; }
  state.user = res.user;
  if (state.user.role !== 'admin') { toast('需要管理员权限', 'error'); location.href = '/login'; return; }
  document.getElementById('sidebar-user').textContent = state.user.username;
  // Check onboarding
  const onb = await api('/api/admin/onboarding/status');
  if (onb && onb.needs_onboarding) {
    state.needsOnboarding = true;
    renderOnboarding();
  } else {
    state.needsOnboarding = false;
    renderNav();
    navigate('dashboard');
  }
}

async function doLogout() {
  await api('/api/auth/logout', { method: 'POST' });
  localStorage.removeItem('admin_token');
  location.href = '/login';
}

// ─── Navigation ───────────────────────────────────────────
const navItems = [
  { id: 'dashboard', label: '数据看板', icon: 'bar-chart-3' },
  { id: 'conversations', label: '对话记录', icon: 'message-square' },
  { id: 'users', label: '用户管理', icon: 'users' },
  { id: 'permissions', label: '权限设置', icon: 'shield' },
  { id: 'api-keys', label: 'API 配置', icon: 'key' },
  { id: 'endpoints', label: '接口开关', icon: 'toggle-right' },
  { id: 'settings', label: '系统设置', icon: 'settings' },
];

function renderNav() {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = navItems.map(item => `
    <button onclick="navigate('${item.id}')" data-nav="${item.id}"
      class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors
      ${state.page === item.id ? 'bg-sidebar-active text-text font-medium' : 'text-text-secondary hover:bg-sidebar-hover'}">
      <i data-lucide="${item.icon}" class="w-4 h-4"></i>
      <span>${item.label}</span>
    </button>
  `).join('');
  lucide.createIcons();
}

function navigate(page) {
  state.page = page;
  renderNav();
  const container = document.getElementById('page-container');
  container.innerHTML = '';
  const fn = window['render' + page.charAt(0).toUpperCase() + page.slice(1).replace(/-./g, x => x[1].toUpperCase())];
  if (fn) fn();
}

// ─── Onboarding ───────────────────────────────────────────
async function renderOnboarding() {
  document.getElementById('sidebar-nav').innerHTML = '';
  const container = document.getElementById('page-container');
  const vendorsRes = await api('/api/admin/vendors');
  const vendors = vendorsRes?.vendors || [];

  container.innerHTML = `
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-2xl font-semibold tracking-tight mb-2">欢迎使用 Lumen</h1>
        <p class="text-text-secondary text-sm">首次使用，请完成以下初始配置</p>
      </div>
      <div class="space-y-8">
        <!-- Step 1: Admin Account -->
        <div class="bg-surface rounded-xl border border-border p-6">
          <h2 class="text-sm font-semibold mb-4 flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium">1</span>
            管理员账户
          </h2>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1.5">新密码</label>
              <input id="onb-password" type="password" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition" placeholder="留空则不修改">
            </div>
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1.5">邮箱</label>
              <input id="onb-email" type="email" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition" placeholder="admin@example.com">
            </div>
          </div>
        </div>

        <!-- Step 2: AI Provider -->
        <div class="bg-surface rounded-xl border border-border p-6">
          <h2 class="text-sm font-semibold mb-4 flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium">2</span>
            AI 模型厂商
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1.5">厂商</label>
              <select id="onb-vendor" onchange="onOnboardingVendorChange()" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
                ${vendors.map(v => `<option value="${v.id}">${v.name}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1.5">API Key</label>
              <input id="onb-apikey" type="password" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition font-mono" placeholder="sk-...">
            </div>
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1.5">Base URL</label>
              <input id="onb-baseurl" type="text" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition font-mono">
            </div>
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1.5">默认模型</label>
              <select id="onb-model" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition"></select>
            </div>
          </div>
        </div>

        <!-- Step 3: Permissions -->
        <div class="bg-surface rounded-xl border border-border p-6">
          <h2 class="text-sm font-semibold mb-4 flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium">3</span>
            全局默认权限
          </h2>
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1.5">每日对话次数</label>
              <input id="onb-max-chats" type="number" value="100" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
            </div>
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1.5">单次最大 Token</label>
              <input id="onb-max-tokens" type="number" value="4096" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
            </div>
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1.5">每分钟频率限制</label>
              <input id="onb-rate-limit" type="number" value="10" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
            </div>
          </div>
        </div>

        <!-- Step 4: System Settings -->
        <div class="bg-surface rounded-xl border border-border p-6">
          <h2 class="text-sm font-semibold mb-4 flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium">4</span>
            系统设置
          </h2>
          <div class="grid grid-cols-2 gap-4">
            <label class="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-bg cursor-pointer hover:bg-surface-hover transition">
              <input id="onb-reg-open" type="checkbox" checked class="w-4 h-4 rounded accent-accent">
              <span class="text-sm">开放注册</span>
            </label>
            <label class="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-bg cursor-pointer hover:bg-surface-hover transition">
              <input id="onb-admin-view" type="checkbox" class="w-4 h-4 rounded accent-accent">
              <span class="text-sm">管理员可查看对话内容</span>
            </label>
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1.5">对话保留天数</label>
              <input id="onb-retention" type="number" value="90" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
            </div>
          </div>
        </div>

        <!-- Step 5: Endpoint Toggles -->
        <div class="bg-surface rounded-xl border border-border p-6">
          <h2 class="text-sm font-semibold mb-4 flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium">5</span>
            接口开关
          </h2>
          <div class="grid grid-cols-3 gap-3">
            <label class="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-bg cursor-pointer hover:bg-surface-hover transition">
              <input id="onb-ep-auth" type="checkbox" checked class="w-4 h-4 rounded accent-accent">
              <span class="text-sm">认证接口</span>
            </label>
            <label class="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-bg cursor-pointer hover:bg-surface-hover transition">
              <input id="onb-ep-chat" type="checkbox" checked class="w-4 h-4 rounded accent-accent">
              <span class="text-sm">对话接口</span>
            </label>
          </div>
        </div>

        <button onclick="submitOnboarding()" class="w-full py-3 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">
          完成配置，进入管理后台
        </button>
      </div>
    </div>
  `;

  // Init vendor data
  window._onbVendors = vendors;
  onOnboardingVendorChange();
  lucide.createIcons();
}

function onOnboardingVendorChange() {
  const vendorId = document.getElementById('onb-vendor').value;
  const vendor = (window._onbVendors || []).find(v => v.id === vendorId);
  if (vendor) {
    document.getElementById('onb-baseurl').value = vendor.base_url;
    const modelSel = document.getElementById('onb-model');
    modelSel.innerHTML = vendor.models.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
  }
}

async function submitOnboarding() {
  const vendorId = document.getElementById('onb-vendor').value;
  const body = {
    new_password: document.getElementById('onb-password').value || undefined,
    email: document.getElementById('onb-email').value || undefined,
    vendor_id: vendorId,
    api_key: document.getElementById('onb-apikey').value || undefined,
    base_url: document.getElementById('onb-baseurl').value || undefined,
    model: document.getElementById('onb-model').value || undefined,
    permissions: {
      max_daily_chats: parseInt(document.getElementById('onb-max-chats').value) || 100,
      max_tokens_per_request: parseInt(document.getElementById('onb-max-tokens').value) || 4096,
      rate_limit_per_minute: parseInt(document.getElementById('onb-rate-limit').value) || 10,
    },
    open_registration: document.getElementById('onb-reg-open').checked,
    admin_can_view_content: document.getElementById('onb-admin-view').checked,
    conversation_retention_days: parseInt(document.getElementById('onb-retention').value) || 90,
    endpoint_toggles: {
      auth: document.getElementById('onb-ep-auth').checked,
      chat: document.getElementById('onb-ep-chat').checked,
    },
  };
  const res = await api('/api/admin/onboarding/complete', { method: 'POST', body });
  if (res && res.success) {
    toast('配置完成', 'success');
    state.needsOnboarding = false;
    renderNav();
    navigate('dashboard');
  } else {
    toast(res?.error || '配置失败', 'error');
  }
}

// ─── Dashboard ────────────────────────────────────────────
async function renderDashboard() {
  const res = await api('/api/admin/dashboard');
  if (!res || !res.success) return;
  const s = res.stats;

  document.getElementById('page-container').innerHTML = `
    <h1 class="text-xl font-semibold tracking-tight mb-6">数据看板</h1>
    <div class="grid grid-cols-4 gap-4 mb-8">
      ${statCard('总用户', s.total_users, 'users')}
      ${statCard('今日活跃', s.active_today, 'user-check')}
      ${statCard('总对话', s.total_conversations, 'message-square')}
      ${statCard('今日 API 调用', s.today_api_calls, 'zap')}
    </div>
    <div class="grid grid-cols-4 gap-4 mb-8">
      ${statCard('今日 Token', s.today_tokens, 'hash')}
      ${statCard('本月 Token', s.month_tokens, 'bar-chart-2')}
      ${statCard('本周新增', s.new_users_week, 'user-plus')}
      ${statCard('管理员数', s.admin_count, 'shield')}
    </div>

    <!-- Daily trend chart -->
    <div class="bg-surface rounded-xl border border-border p-6 mb-6">
      <h2 class="text-sm font-semibold mb-4">7 天对话趋势</h2>
      <div class="h-48 flex items-end gap-2" id="daily-trend-chart"></div>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <div class="bg-surface rounded-xl border border-border p-6">
        <h2 class="text-sm font-semibold mb-4">模型使用分布</h2>
        <div class="space-y-3" id="model-dist"></div>
      </div>
      <div class="bg-surface rounded-xl border border-border p-6">
        <h2 class="text-sm font-semibold mb-4">用户活跃排行</h2>
        <div class="space-y-3" id="user-ranking"></div>
      </div>
    </div>
  `;

  // Render daily trend bars
  const chart = document.getElementById('daily-trend-chart');
  if (s.daily_trend && s.daily_trend.length) {
    const maxVal = Math.max(...s.daily_trend.map(d => d.count), 1);
    chart.innerHTML = s.daily_trend.map(d => {
      const h = Math.max((d.count / maxVal) * 100, 2);
      return `<div class="flex-1 flex flex-col items-center gap-1">
        <span class="text-xs text-text-tertiary">${d.count}</span>
        <div class="w-full bg-accent rounded-t-sm transition-all" style="height:${h}%"></div>
        <span class="text-xs text-text-tertiary">${d.date.slice(5)}</span>
      </div>`;
    }).join('');
  } else {
    chart.innerHTML = '<p class="text-sm text-text-tertiary">暂无数据</p>';
  }

  // Model distribution
  const md = document.getElementById('model-dist');
  if (s.model_distribution && s.model_distribution.length) {
    const total = s.model_distribution.reduce((a, b) => a + b.count, 0);
    md.innerHTML = s.model_distribution.map(m => `
      <div class="flex items-center gap-3">
        <span class="text-sm flex-1 truncate">${m.model || 'unknown'}</span>
        <span class="text-sm text-text-secondary">${m.count}</span>
        <div class="w-24 h-1.5 bg-bg rounded-full overflow-hidden">
          <div class="h-full bg-accent rounded-full" style="width:${(m.count/total)*100}%"></div>
        </div>
      </div>
    `).join('');
  } else {
    md.innerHTML = '<p class="text-sm text-text-tertiary">暂无数据</p>';
  }

  // User ranking
  const ur = document.getElementById('user-ranking');
  if (s.user_ranking && s.user_ranking.length) {
    ur.innerHTML = s.user_ranking.map((u, i) => `
      <div class="flex items-center gap-3">
        <span class="text-xs font-mono text-text-tertiary w-5">${i + 1}</span>
        <span class="text-sm flex-1 truncate">${u.username}</span>
        <span class="text-sm text-text-secondary">${u.conversation_count} 对话</span>
      </div>
    `).join('');
  } else {
    ur.innerHTML = '<p class="text-sm text-text-tertiary">暂无数据</p>';
  }

  lucide.createIcons();
}

function statCard(label, value, icon) {
  return `
    <div class="bg-surface rounded-xl border border-border p-4">
      <div class="flex items-center gap-2 mb-1.5">
        <i data-lucide="${icon}" class="w-4 h-4 text-text-tertiary"></i>
        <span class="text-xs text-text-secondary">${label}</span>
      </div>
      <div class="text-2xl font-semibold tracking-tight">${value ?? 0}</div>
    </div>`;
}

// ─── Conversations ────────────────────────────────────────
async function renderConversations() {
  const res = await api('/api/admin/conversations?page=1&per_page=50');
  const convs = res?.conversations || [];

  document.getElementById('page-container').innerHTML = `
    <h1 class="text-xl font-semibold tracking-tight mb-6">对话记录</h1>
    <div class="bg-surface rounded-xl border border-border overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border">
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">ID</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">用户</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">标题</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">模型</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">消息数</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">Token</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">时间</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">操作</th>
          </tr>
        </thead>
        <tbody id="conv-table"></tbody>
      </table>
    </div>
  `;

  const tbody = document.getElementById('conv-table');
  if (!convs.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="px-4 py-8 text-center text-sm text-text-tertiary">暂无对话记录</td></tr>';
  } else {
    tbody.innerHTML = convs.map(c => `
      <tr class="border-b border-border hover:bg-surface-hover transition-colors">
        <td class="px-4 py-3 text-xs font-mono text-text-tertiary">${c.id}</td>
        <td class="px-4 py-3">${esc(c.username || '-')}</td>
        <td class="px-4 py-3 max-w-48 truncate">${esc(c.title || '新对话')}</td>
        <td class="px-4 py-3 text-xs text-text-secondary">${esc(c.model || '-')}</td>
        <td class="px-4 py-3">${c.message_count || 0}</td>
        <td class="px-4 py-3 text-xs text-text-secondary">${c.total_tokens || 0}</td>
        <td class="px-4 py-3 text-xs text-text-tertiary">${fmtDate(c.created_at)}</td>
        <td class="px-4 py-3">
          <button onclick="viewConversation(${c.id})" class="text-accent hover:underline text-xs">详情</button>
          <button onclick="deleteConversation(${c.id})" class="text-danger hover:underline text-xs ml-3">删除</button>
        </td>
      </tr>
    `).join('');
  }
}

async function viewConversation(id) {
  const res = await api(`/api/admin/conversations/${id}`);
  if (!res || !res.success) return;
  const c = res.conversation;
  const msgs = res.messages || [];

  document.getElementById('page-container').innerHTML = `
    <div class="flex items-center gap-3 mb-6">
      <button onclick="navigate('conversations')" class="text-accent hover:underline text-sm flex items-center gap-1">
        <i data-lucide="arrow-left" class="w-4 h-4"></i> 返回
      </button>
      <h1 class="text-xl font-semibold tracking-tight">${esc(c.title || '对话详情')}</h1>
    </div>
    <div class="bg-surface rounded-xl border border-border p-6 space-y-4">
      ${msgs.map(m => `
        <div class="${m.role === 'user' ? 'ml-8' : 'mr-8'}">
          <div class="text-xs text-text-tertiary mb-1">${m.role === 'user' ? '用户' : 'AI'} · ${m.tokens || 0} tokens</div>
          <div class="text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-bg rounded-lg px-4 py-2.5' : ''}">${esc(m.content)}</div>
        </div>
      `).join('')}
    </div>
  `;
  lucide.createIcons();
}

async function deleteConversation(id) {
  if (!confirm('确认删除此对话？')) return;
  const res = await api(`/api/admin/conversations/${id}`, { method: 'DELETE' });
  if (res && res.success) { toast('已删除', 'success'); renderConversations(); }
  else toast(res?.error || '删除失败', 'error');
}

// ─── Users ────────────────────────────────────────────────
async function renderUsers() {
  const res = await api('/api/admin/users?page=1&per_page=100');
  const users = res?.users || [];

  document.getElementById('page-container').innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold tracking-tight">用户管理</h1>
      <button onclick="showAddUser()" class="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">添加用户</button>
    </div>
    <div class="bg-surface rounded-xl border border-border overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border">
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">ID</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">用户名</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">邮箱</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">角色</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">状态</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">日限额</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">今日对话</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">操作</th>
          </tr>
        </thead>
        <tbody id="user-table"></tbody>
      </table>
    </div>
  `;

  const tbody = document.getElementById('user-table');
  tbody.innerHTML = users.map(u => `
    <tr class="border-b border-border hover:bg-surface-hover transition-colors">
      <td class="px-4 py-3 text-xs font-mono text-text-tertiary">${u.id}</td>
      <td class="px-4 py-3 font-medium">${esc(u.username)}</td>
      <td class="px-4 py-3 text-xs text-text-secondary">${esc(u.email || '-')}</td>
      <td class="px-4 py-3"><span class="text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-bg text-text-secondary'}">${u.role}</span></td>
      <td class="px-4 py-3"><span class="text-xs px-2 py-0.5 rounded-full ${u.is_active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}">${u.is_active ? '启用' : '禁用'}</span></td>
      <td class="px-4 py-3 text-xs">${u.daily_limit != null ? u.daily_limit : '默认'}</td>
      <td class="px-4 py-3 text-xs">${u.daily_chat_count || 0}</td>
      <td class="px-4 py-3">
        <button onclick="editUser(${u.id},'${esc(u.username)}','${esc(u.email||'')}','${u.role}',${u.is_active},${u.daily_limit ?? 'null'})" class="text-accent hover:underline text-xs">编辑</button>
        <button onclick="resetUserPassword(${u.id})" class="text-warning hover:underline text-xs ml-2">重置密码</button>
        <button onclick="toggleUserActive(${u.id},${!u.is_active})" class="text-xs ml-2 hover:underline ${u.is_active ? 'text-danger' : 'text-success'}">${u.is_active ? '禁用' : '启用'}</button>
      </td>
    </tr>
  `).join('');
}

function showAddUser() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/20 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-surface rounded-xl border border-border p-6 w-96 shadow-lg">
      <h2 class="text-sm font-semibold mb-4">添加用户</h2>
      <div class="space-y-3">
        <input id="add-username" placeholder="用户名" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        <input id="add-email" type="email" placeholder="邮箱" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        <input id="add-password" type="password" placeholder="密码" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        <select id="add-role" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
          <option value="user">普通用户</option>
          <option value="admin">管理员</option>
        </select>
        <input id="add-daily-limit" type="number" placeholder="日限额（留空为默认）" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
      </div>
      <div class="flex gap-3 mt-4">
        <button onclick="this.closest('.fixed').remove()" class="flex-1 py-2 rounded-md border border-border text-sm hover:bg-surface-hover transition-colors">取消</button>
        <button onclick="addUser(this)" class="flex-1 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">添加</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

async function addUser(btn) {
  const modal = btn.closest('.fixed');
  const body = {
    username: modal.querySelector('#add-username').value,
    email: modal.querySelector('#add-email').value,
    password: modal.querySelector('#add-password').value,
    role: modal.querySelector('#add-role').value,
    daily_limit: modal.querySelector('#add-daily-limit').value || null,
  };
  const res = await api('/api/auth/register', { method: 'POST', body });
  if (res && res.success) { toast('用户已添加', 'success'); modal.remove(); renderUsers(); }
  else toast(res?.error || '添加失败', 'error');
}

function editUser(id, username, email, role, isActive, dailyLimit) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/20 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-surface rounded-xl border border-border p-6 w-96 shadow-lg">
      <h2 class="text-sm font-semibold mb-4">编辑用户: ${esc(username)}</h2>
      <div class="space-y-3">
        <input id="edit-email" type="email" value="${esc(email)}" placeholder="邮箱" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        <select id="edit-role" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
          <option value="user" ${role==='user'?'selected':''}>普通用户</option>
          <option value="admin" ${role==='admin'?'selected':''}>管理员</option>
        </select>
        <input id="edit-daily-limit" type="number" value="${dailyLimit != null ? dailyLimit : ''}" placeholder="日限额（留空为默认）" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
      </div>
      <div class="flex gap-3 mt-4">
        <button onclick="this.closest('.fixed').remove()" class="flex-1 py-2 rounded-md border border-border text-sm hover:bg-surface-hover transition-colors">取消</button>
        <button onclick="saveUser(${id}, this)" class="flex-1 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">保存</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

async function saveUser(id, btn) {
  const modal = btn.closest('.fixed');
  const body = {
    email: modal.querySelector('#edit-email').value,
    role: modal.querySelector('#edit-role').value,
    daily_limit: modal.querySelector('#edit-daily-limit').value ? parseInt(modal.querySelector('#edit-daily-limit').value) : null,
  };
  const res = await api(`/api/admin/users/${id}`, { method: 'PUT', body });
  if (res && res.success) { toast('已保存', 'success'); modal.remove(); renderUsers(); }
  else toast(res?.error || '保存失败', 'error');
}

async function resetUserPassword(id) {
  const pw = prompt('输入新密码（至少6位）：');
  if (!pw) return;
  const res = await api(`/api/admin/users/${id}/reset-password`, { method: 'POST', body: { password: pw } });
  if (res && res.success) toast('密码已重置', 'success');
  else toast(res?.error || '重置失败', 'error');
}

async function toggleUserActive(id, active) {
  const res = await api(`/api/admin/users/${id}`, { method: 'PUT', body: { is_active: active } });
  if (res && res.success) { toast(active ? '已启用' : '已禁用', 'success'); renderUsers(); }
  else toast(res?.error || '操作失败', 'error');
}

// ─── Permissions ──────────────────────────────────────────
async function renderPermissions() {
  const [globalRes, usersRes] = await Promise.all([
    api('/api/admin/permissions/global'),
    api('/api/admin/users?page=1&per_page=100'),
  ]);
  const gp = globalRes?.permissions || {};
  const users = usersRes?.users || [];

  document.getElementById('page-container').innerHTML = `
    <h1 class="text-xl font-semibold tracking-tight mb-6">权限设置</h1>

    <div class="bg-surface rounded-xl border border-border p-6 mb-6">
      <h2 class="text-sm font-semibold mb-4">全局默认权限</h2>
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">每日对话次数</label>
          <input id="gp-max-chats" type="number" value="${gp.max_daily_chats || 100}" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        </div>
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">单次最大 Token</label>
          <input id="gp-max-tokens" type="number" value="${gp.max_tokens_per_request || 4096}" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        </div>
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">每分钟频率限制</label>
          <input id="gp-rate-limit" type="number" value="${gp.rate_limit_per_minute || 10}" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        </div>
      </div>
      <div class="flex gap-4 mt-4">
        <label class="flex items-center gap-2 text-sm"><input id="gp-export" type="checkbox" ${gp.allow_export ? 'checked' : ''} class="w-4 h-4 rounded accent-accent"> 允许导出</label>
        <label class="flex items-center gap-2 text-sm"><input id="gp-upload" type="checkbox" ${gp.allow_file_upload ? 'checked' : ''} class="w-4 h-4 rounded accent-accent"> 允许文件上传</label>
      </div>
      <button onclick="saveGlobalPermissions()" class="mt-4 px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">保存全局权限</button>
    </div>

    <div class="bg-surface rounded-xl border border-border p-6">
      <h2 class="text-sm font-semibold mb-4">用户单独权限</h2>
      <div class="space-y-3" id="user-perm-list"></div>
    </div>
  `;

  const upl = document.getElementById('user-perm-list');
  upl.innerHTML = users.filter(u => u.role !== 'admin').map(u => `
    <div class="flex items-center justify-between p-3 rounded-md border border-border bg-bg">
      <span class="text-sm font-medium">${esc(u.username)}</span>
      <button onclick="editUserPermissions(${u.id},'${esc(u.username)}')" class="text-accent hover:underline text-xs">配置权限</button>
    </div>
  `).join('') || '<p class="text-sm text-text-tertiary">暂无普通用户</p>';
}

async function saveGlobalPermissions() {
  const body = {
    max_daily_chats: parseInt(document.getElementById('gp-max-chats').value) || 100,
    max_tokens_per_request: parseInt(document.getElementById('gp-max-tokens').value) || 4096,
    rate_limit_per_minute: parseInt(document.getElementById('gp-rate-limit').value) || 10,
    allow_export: document.getElementById('gp-export').checked,
    allow_file_upload: document.getElementById('gp-upload').checked,
  };
  const res = await api('/api/admin/permissions/global', { method: 'PUT', body });
  if (res && res.success) toast('全局权限已保存', 'success');
  else toast(res?.error || '保存失败', 'error');
}

async function editUserPermissions(userId, username) {
  const res = await api(`/api/admin/permissions/user/${userId}`);
  const up = res?.permissions || {};

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/20 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-surface rounded-xl border border-border p-6 w-96 shadow-lg">
      <h2 class="text-sm font-semibold mb-4">${esc(username)} 的权限</h2>
      <label class="flex items-center gap-2 mb-4 text-sm">
        <input id="up-custom" type="checkbox" ${up.use_custom ? 'checked' : ''} class="w-4 h-4 rounded accent-accent" onchange="document.getElementById('up-fields').style.display=this.checked?'block':'none'">
        使用自定义权限
      </label>
      <div id="up-fields" style="display:${up.use_custom?'block':'none'}" class="space-y-3">
        <input id="up-max-chats" type="number" value="${up.max_daily_chats || ''}" placeholder="每日对话次数" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        <input id="up-max-tokens" type="number" value="${up.max_tokens_per_request || ''}" placeholder="单次最大 Token" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        <input id="up-rate-limit" type="number" value="${up.rate_limit_per_minute || ''}" placeholder="每分钟频率限制" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
      </div>
      <div class="flex gap-3 mt-4">
        <button onclick="this.closest('.fixed').remove()" class="flex-1 py-2 rounded-md border border-border text-sm hover:bg-surface-hover transition-colors">取消</button>
        <button onclick="saveUserPermissions(${userId}, this)" class="flex-1 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">保存</button>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

async function saveUserPermissions(userId, btn) {
  const modal = btn.closest('.fixed');
  const useCustom = modal.querySelector('#up-custom').checked;
  const body = { use_custom: useCustom };
  if (useCustom) {
    body.max_daily_chats = parseInt(modal.querySelector('#up-max-chats').value) || null;
    body.max_tokens_per_request = parseInt(modal.querySelector('#up-max-tokens').value) || null;
    body.rate_limit_per_minute = parseInt(modal.querySelector('#up-rate-limit').value) || null;
  }
  const res = await api(`/api/admin/permissions/user/${userId}`, { method: 'PUT', body });
  if (res && res.success) { toast('权限已保存', 'success'); modal.remove(); }
  else toast(res?.error || '保存失败', 'error');
}

// ─── API Keys ─────────────────────────────────────────────
async function renderApiKeys() {
  const [configRes, vendorsRes] = await Promise.all([
    api('/api/admin/config/api-key'),
    api('/api/admin/vendors'),
  ]);
  const vendors = vendorsRes?.vendors || [];
  const usage = configRes?.usage || {};

  document.getElementById('page-container').innerHTML = `
    <h1 class="text-xl font-semibold tracking-tight mb-6">API 配置</h1>

    <div class="bg-surface rounded-xl border border-border p-6 mb-6">
      <h2 class="text-sm font-semibold mb-4">模型厂商</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">厂商</label>
          <select id="apikey-vendor" onchange="onApiKeyVendorChange()" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
            ${vendors.map(v => `<option value="${v.id}">${v.name}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">API Key</label>
          <div class="flex gap-2">
            <input id="apikey-key" type="password" class="flex-1 px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition font-mono" placeholder="sk-...">
            <button onclick="toggleApiKeyVisibility()" class="px-3 py-2 rounded-md border border-border text-sm hover:bg-surface-hover transition-colors">
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">Base URL</label>
          <input id="apikey-baseurl" type="text" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition font-mono">
        </div>
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">默认模型</label>
          <select id="apikey-model" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition"></select>
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button onclick="saveApiKeyConfig()" class="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">保存配置</button>
        <button onclick="testApiConnection()" class="px-4 py-2 rounded-md border border-border text-sm hover:bg-surface-hover transition-colors">测试连接</button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 mb-6">
      ${statCard('今日调用', usage.today_calls || 0, 'zap')}
      ${statCard('本月调用', usage.monthly_calls || 0, 'bar-chart-2')}
      ${statCard('本月 Token', usage.monthly_tokens || 0, 'hash')}
    </div>

    <div class="bg-surface rounded-xl border border-border p-6">
      <h2 class="text-sm font-semibold mb-4">厂商能力矩阵</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm" id="capability-matrix"></table>
      </div>
    </div>
  `;

  // Init vendor data
  window._apikeyVendors = vendors;
  // Try to set current vendor from config
  const currentVendor = configRes?.vendor_id || 'deepseek';
  const vendorSel = document.getElementById('apikey-vendor');
  if (vendorSel) vendorSel.value = currentVendor;
  onApiKeyVendorChange();
  // Set current values
  document.getElementById('apikey-key').value = configRes?.api_key || '';
  document.getElementById('apikey-baseurl').value = configRes?.base_url || '';

  // Render capability matrix
  renderCapabilityMatrix(vendors);

  lucide.createIcons();
}

function onApiKeyVendorChange() {
  const vendorId = document.getElementById('apikey-vendor').value;
  const vendor = (window._apikeyVendors || []).find(v => v.id === vendorId);
  if (vendor) {
    document.getElementById('apikey-baseurl').value = vendor.base_url;
    const modelSel = document.getElementById('apikey-model');
    modelSel.innerHTML = vendor.models.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
  }
}

function toggleApiKeyVisibility() {
  const inp = document.getElementById('apikey-key');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

async function saveApiKeyConfig() {
  const body = {
    vendor_id: document.getElementById('apikey-vendor').value,
    api_key: document.getElementById('apikey-key').value,
    base_url: document.getElementById('apikey-baseurl').value,
    model: document.getElementById('apikey-model').value,
  };
  const res = await api('/api/admin/config', { method: 'PUT', body });
  if (res && res.success) toast('配置已保存', 'success');
  else toast(res?.error || '保存失败', 'error');
}

async function testApiConnection() {
  const body = {
    api_key: document.getElementById('apikey-key').value,
    base_url: document.getElementById('apikey-baseurl').value,
    model: document.getElementById('apikey-model').value,
  };
  const res = await api('/api/admin/config/test-connection', { method: 'POST', body });
  if (res && res.success) toast('连接成功', 'success');
  else toast(res?.error || '连接失败', 'error');
}

function renderCapabilityMatrix(vendors) {
  const caps = ['text', 'vision', 'streaming', 'thinking', 'tools', 'file_upload', 'web_search'];
  const capLabels = { text: '文本', vision: '视觉', streaming: '流式', thinking: '思考', tools: '工具', file_upload: '文件', web_search: '搜索' };

  const allModels = [];
  vendors.forEach(v => {
    v.models.forEach(m => {
      allModels.push({ vendor: v.name, model: m.name, capabilities: m.capabilities });
    });
  });

  const matrix = document.getElementById('capability-matrix');
  matrix.innerHTML = `
    <thead>
      <tr class="border-b border-border">
        <th class="text-left px-3 py-2 text-xs font-medium text-text-secondary">厂商</th>
        <th class="text-left px-3 py-2 text-xs font-medium text-text-secondary">模型</th>
        ${caps.map(c => `<th class="text-center px-2 py-2 text-xs font-medium text-text-secondary">${capLabels[c]}</th>`).join('')}
      </tr>
    </thead>
    <tbody>
      ${allModels.map(m => `
        <tr class="border-b border-border hover:bg-surface-hover transition-colors">
          <td class="px-3 py-2 text-xs text-text-secondary">${esc(m.vendor)}</td>
          <td class="px-3 py-2 text-xs font-medium">${esc(m.model)}</td>
          ${caps.map(c => `<td class="text-center px-2 py-2">${m.capabilities.includes(c) ? '<span class="text-success text-xs">●</span>' : '<span class="text-text-tertiary text-xs">—</span>'}</td>`).join('')}
        </tr>
      `).join('')}
    </tbody>
  `;
}

// ─── Endpoints ────────────────────────────────────────────
async function renderEndpoints() {
  const res = await api('/api/admin/endpoints');
  const groups = res?.groups || {};

  document.getElementById('page-container').innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold tracking-tight">接口开关</h1>
      <div class="flex gap-2">
        <button disabled class="px-3 py-1.5 rounded-md border border-border text-xs text-text-tertiary cursor-not-allowed opacity-50">全部开启</button>
        <button disabled class="px-3 py-1.5 rounded-md border border-border text-xs text-text-tertiary cursor-not-allowed opacity-50">全部关闭</button>
      </div>
    </div>
    <div class="space-y-4" id="endpoint-groups"></div>
  `;

  const container = document.getElementById('endpoint-groups');
  const groupNames = { auth: '认证接口', chat: '对话接口', admin: '管理接口' };

  Object.entries(groups).forEach(([key, group]) => {
    const div = document.createElement('div');
    div.className = 'bg-surface rounded-xl border border-border p-5';
    div.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold">${groupNames[key] || key}</h2>
        <div class="flex items-center gap-1">
          <button onclick="batchToggleGroup('${key}', true)" class="px-2 py-0.5 rounded text-xs text-accent hover:bg-accent/10 transition-colors">全开</button>
          <span class="text-border">|</span>
          <button onclick="batchToggleGroup('${key}', false)" class="px-2 py-0.5 rounded text-xs text-text-secondary hover:bg-surface-hover transition-colors">全关</button>
        </div>
      </div>
      <div class="space-y-1">
        ${group.endpoints.map(ep => `
          <div class="flex items-center justify-between py-2 px-3 rounded-md hover:bg-surface-hover transition-colors">
            <div>
              <span class="text-sm font-mono text-xs text-text-secondary mr-3">${ep.endpoint}</span>
              <span class="text-xs text-text-tertiary">${ep.description}</span>
            </div>
            <button onclick="toggleEndpoint(${ep.id}, ${!ep.enabled})" class="relative w-9 h-5 rounded-full transition-colors ${ep.enabled ? 'bg-accent' : 'bg-border'}">
              <span class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${ep.enabled ? 'translate-x-4' : ''}"></span>
            </button>
          </div>
        `).join('')}
      </div>
    `;
    container.appendChild(div);
  });
}

async function toggleEndpoint(id, enabled) {
  const res = await api(`/api/admin/endpoints/${id}`, { method: 'PUT', body: { enabled } });
  if (res && res.success) renderEndpoints();
}

async function batchToggleGroup(group, enabled) {
  const res = await api('/api/admin/endpoints/batch', { method: 'PUT', body: { group, enabled } });
  if (res && res.success) { toast(`已${enabled ? '开启' : '关闭'}`, 'success'); renderEndpoints(); }
}

async function batchToggleEndpoints(enabled) {
  const res = await api('/api/admin/endpoints/batch', { method: 'PUT', body: { group: 'all', enabled } });
  if (res && res.success) { toast(`已${enabled ? '开启' : '关闭'}`, 'success'); renderEndpoints(); }
}

// ─── Settings ─────────────────────────────────────────────
async function renderSettings() {
  const res = await api('/api/admin/config');
  const configs = res?.configs || {};

  document.getElementById('page-container').innerHTML = `
    <h1 class="text-xl font-semibold tracking-tight mb-6">系统设置</h1>
    <div class="bg-surface rounded-xl border border-border p-6 space-y-4">
      <label class="flex items-center justify-between py-2">
        <span class="text-sm">开放注册</span>
        <button id="set-reg" onclick="toggleSetting('open_registration', this)" class="relative w-9 h-5 rounded-full transition-colors ${configs.open_registration === 'true' ? 'bg-accent' : 'bg-border'}">
          <span class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${configs.open_registration === 'true' ? 'translate-x-4' : ''}"></span>
        </button>
      </label>
      <label class="flex items-center justify-between py-2">
        <span class="text-sm">管理员可查看对话内容</span>
        <button id="set-admin-view" onclick="toggleSetting('admin_can_view_content', this)" class="relative w-9 h-5 rounded-full transition-colors ${configs.admin_can_view_content === 'true' ? 'bg-accent' : 'bg-border'}">
          <span class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${configs.admin_can_view_content === 'true' ? 'translate-x-4' : ''}"></span>
        </button>
      </label>
      <div class="flex items-center justify-between py-2">
        <span class="text-sm">对话保留天数</span>
        <input id="set-retention" type="number" value="${configs.conversation_retention_days || '90'}" class="w-20 px-2 py-1 rounded-md border border-border bg-bg text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
      </div>
      <button onclick="saveSettings()" class="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">保存设置</button>
    </div>

    <div class="bg-surface rounded-xl border border-border p-6 mt-6">
      <h2 class="text-sm font-semibold mb-4 text-danger">危险操作</h2>
      <p class="text-xs text-text-secondary mb-4">重置将清空所有对话数据、系统配置和非管理员用户。</p>
      <button onclick="resetSystem()" class="px-4 py-2 rounded-md bg-danger hover:bg-danger/90 text-white text-sm font-medium transition-colors">重置系统</button>
    </div>
  `;
}

async function toggleSetting(key, btn) {
  const isActive = btn.classList.contains('bg-accent');
  const enabled = !isActive;
  const res = await api('/api/admin/config', { method: 'PUT', body: { [key]: String(enabled) } });
  if (res && res.success) {
    btn.className = `relative w-9 h-5 rounded-full transition-colors ${enabled ? 'bg-accent' : 'bg-border'}`;
    btn.querySelector('span').className = `absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${enabled ? 'translate-x-4' : ''}`;
  }
}

async function saveSettings() {
  const retention = document.getElementById('set-retention').value;
  const res = await api('/api/admin/config', { method: 'PUT', body: { conversation_retention_days: retention } });
  if (res && res.success) toast('设置已保存', 'success');
  else toast(res?.error || '保存失败', 'error');
}

async function resetSystem() {
  if (!confirm('确认重置系统？此操作不可撤销！')) return;
  const res = await api('/api/admin/reset', { method: 'POST', body: { scope: 'all', keep_admin: true } });
  if (res && res.success) toast('系统已重置', 'success');
  else toast(res?.error || '重置失败', 'error');
}

// ─── Helpers ──────────────────────────────────────────────
function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtDate(d) { if (!d) return '-'; return new Date(d).toLocaleDateString('zh-CN', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }); }

// ─── Init ─────────────────────────────────────────────────
checkAuth();
