// AI Chat Admin SPA
const API = {
  async request(method, url, body = null) {
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/login.html'; return; }
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    };
    if (body) opts.body = JSON.stringify(body);
    const resp = await fetch(url, opts);
    if (resp.status === 401) { localStorage.clear(); window.location.href = '/login.html'; return; }
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || '请求失败');
    return data;
  },
  get(url) { return this.request('GET', url); },
  post(url, body) { return this.request('POST', url, body); },
  put(url, body) { return this.request('PUT', url, body); },
  del(url) { return this.request('DELETE', url); },
};

function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'fixed top-4 right-4 z-50 bg-surface rounded-lg shadow-float px-4 py-3 text-sm font-medium border max-w-sm transition-all duration-300';
  if (type === 'success') t.className += ' border-success/30 text-success';
  else if (type === 'error') t.className += ' border-error/30 text-error';
  else t.className += ' border-outline/20 text-on-surface';
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 3000);
}

function doLogout() {
  localStorage.clear();
  window.location.href = '/login.html';
}

function getToken() { return localStorage.getItem('token'); }

// Check auth on load
(function() {
  if (!getToken()) { window.location.href = '/login.html'; return; }
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  document.getElementById('headerUser').textContent = user.username || '';
  if (user.role !== 'admin') {
    showToast('需要管理员权限', 'error');
    setTimeout(() => doLogout(), 2000);
    return;
  }
  navigateTo('dashboard');
})();

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo(item.dataset.page);
  });
});

function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.dataset.page === page) {
      item.className = 'flex items-center gap-3 px-3 py-2.5 rounded-md bg-primary/10 text-primary font-medium text-sm nav-item';
    } else {
      item.className = 'flex items-center gap-3 px-3 py-2.5 rounded-md text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-medium text-sm transition-colors nav-item';
    }
  });
}

async function navigateTo(page) {
  setActiveNav(page);
  const main = document.getElementById('mainContent');
  main.innerHTML = '<div class="flex items-center justify-center h-64"><div class="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div></div>';

  try {
    switch (page) {
      case 'dashboard': await renderDashboard(main); break;
      case 'conversations': await renderConversations(main); break;
      case 'users': await renderUsers(main); break;
      case 'permissions': await renderPermissions(main); break;
      case 'api-keys': await renderApiKeys(main); break;
      case 'settings': await renderSettings(main); break;
    }
  } catch (err) {
    main.innerHTML = `<div class="text-center py-12 text-error">加载失败: ${err.message}</div>`;
  }
  lucide.createIcons();
}

// ═══════════════════════════════════════════
//  Dashboard Page
// ═══════════════════════════════════════════
async function renderDashboard(main) {
  const data = await API.get('/api/admin/dashboard');
  const s = data.stats;
  const trendBars = s.daily_trend.map((d, i) => {
    const max = Math.max(...s.daily_trend.map(x => x.count), 1);
    const h = Math.max((d.count / max) * 120, 4);
    const isToday = i === s.daily_trend.length - 1;
    return `<div class="flex flex-col items-center gap-1 flex-1">
      <span class="text-xs text-on-surface-variant">${d.count}</span>
      <div class="w-full rounded-sm ${isToday ? 'bg-primary' : 'bg-primary/30'}" style="height:${h}px"></div>
      <span class="text-xs text-on-surface-variant">${d.date.slice(5)}</span>
    </div>`;
  }).join('');

  const models = s.model_distribution.map(m => {
    const total = s.model_distribution.reduce((a, b) => a + b.count, 0) || 1;
    const pct = Math.round((m.count / total) * 100);
    return `<div class="flex items-center justify-between py-2">
      <span class="text-sm text-on-surface">${m.model}</span>
      <div class="flex items-center gap-2">
        <div class="w-24 h-2 bg-surface-container rounded-full overflow-hidden"><div class="h-full bg-primary rounded-full" style="width:${pct}%"></div></div>
        <span class="text-xs text-on-surface-variant w-10 text-right">${pct}%</span>
      </div>
    </div>`;
  }).join('');

  main.innerHTML = `
    <h1 class="text-2xl font-bold text-on-surface mb-6">数据看板</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-surface rounded-xl shadow-card p-5">
        <div class="flex items-center gap-3 mb-3"><div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><i data-lucide="users" class="w-5 h-5 text-primary"></i></div></div>
        <div class="text-2xl font-bold text-on-surface">${s.total_users}</div><div class="text-xs text-on-surface-variant mt-1">总用户数</div>
      </div>
      <div class="bg-surface rounded-xl shadow-card p-5">
        <div class="flex items-center gap-3 mb-3"><div class="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center"><i data-lucide="user-check" class="w-5 h-5 text-success"></i></div></div>
        <div class="text-2xl font-bold text-on-surface">${s.active_today}</div><div class="text-xs text-on-surface-variant mt-1">今日活跃用户</div>
      </div>
      <div class="bg-surface rounded-xl shadow-card p-5">
        <div class="flex items-center gap-3 mb-3"><div class="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center"><i data-lucide="message-square" class="w-5 h-5 text-warning"></i></div></div>
        <div class="text-2xl font-bold text-on-surface">${s.total_conversations}</div><div class="text-xs text-on-surface-variant mt-1">总对话数</div>
      </div>
      <div class="bg-surface rounded-xl shadow-card p-5">
        <div class="flex items-center gap-3 mb-3"><div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><i data-lucide="zap" class="w-5 h-5 text-primary"></i></div></div>
        <div class="text-2xl font-bold text-on-surface">${s.today_api_calls}</div><div class="text-xs text-on-surface-variant mt-1">今日API调用</div>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 bg-surface rounded-xl shadow-card p-5">
        <h2 class="text-base font-semibold text-on-surface mb-4">近7天对话趋势</h2>
        <div class="flex items-end gap-1 h-40">${trendBars}</div>
      </div>
      <div class="bg-surface rounded-xl shadow-card p-5">
        <h2 class="text-base font-semibold text-on-surface mb-4">模型使用分布</h2>
        ${models || '<p class="text-sm text-on-surface-variant">暂无数据</p>'}
      </div>
    </div>`;
}

// ═══════════════════════════════════════════
//  Conversations Page
// ═══════════════════════════════════════════
async function renderConversations(main) {
  const data = await API.get('/api/admin/conversations?per_page=15');
  const rows = data.conversations.map(c => `
    <tr class="border-b border-outline/10 hover:bg-surface-container-lowest/50 transition-colors">
      <td class="px-4 py-3 text-sm text-on-surface-variant font-mono">#${c.id}</td>
      <td class="px-4 py-3 text-sm text-on-surface">${escHtml(c.username)}</td>
      <td class="px-4 py-3 text-sm text-on-surface max-w-48 truncate">${escHtml(c.title)}</td>
      <td class="px-4 py-3 text-sm text-on-surface-variant">${c.model}</td>
      <td class="px-4 py-3 text-sm text-on-surface">${c.message_count}</td>
      <td class="px-4 py-3 text-sm text-on-surface-variant">${c.total_tokens || 0}</td>
      <td class="px-4 py-3 text-xs text-on-surface-variant">${fmtDate(c.created_at)}</td>
      <td class="px-4 py-3"><button onclick="viewConversation(${c.id})" class="text-primary text-sm hover:underline">查看</button></td>
    </tr>`).join('');

  main.innerHTML = `
    <h1 class="text-2xl font-bold text-on-surface mb-6">对话记录</h1>
    <div class="bg-surface rounded-xl shadow-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead><tr class="bg-surface-container text-left">
            <th class="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">ID</th>
            <th class="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">用户</th>
            <th class="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">标题</th>
            <th class="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">模型</th>
            <th class="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">消息数</th>
            <th class="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">Token</th>
            <th class="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">时间</th>
            <th class="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">操作</th>
          </tr></thead>
          <tbody>${rows || '<tr><td colspan="8" class="px-4 py-8 text-center text-sm text-on-surface-variant">暂无对话记录</td></tr>'}</tbody>
        </table>
      </div>
      ${data.pages > 1 ? `<div class="flex items-center justify-between px-4 py-3 border-t border-outline/10"><span class="text-sm text-on-surface-variant">共 ${data.total} 条</span><div class="flex gap-1">${paginationHtml(data.page, data.pages)}</div></div>` : ''}
    </div>`;
}

async function viewConversation(id) {
  try {
    const data = await API.get(`/api/admin/conversations/${id}`);
    const msgs = (data.messages || []).map(m => `
      <div class="mb-3 ${m.role === 'user' ? 'text-right' : ''}">
        <div class="inline-block max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}">${escHtml(m.content)}</div>
        <div class="text-xs text-on-surface-variant mt-1">${fmtDate(m.created_at)}</div>
      </div>`).join('');

    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4';
    overlay.innerHTML = `<div class="bg-surface rounded-2xl shadow-dialog w-full max-w-2xl max-h-[80vh] flex flex-col">
      <div class="flex items-center justify-between p-5 border-b border-outline/10">
        <h3 class="text-lg font-semibold">对话详情 #${id}</h3>
        <button class="text-on-surface-variant hover:text-on-surface" onclick="this.closest('.fixed').remove()"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <div class="flex-1 overflow-y-auto p-5">${msgs || '<p class="text-sm text-on-surface-variant">无消息记录</p>'}</div>
    </div>`;
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
    lucide.createIcons();
  } catch (err) { showToast(err.message, 'error'); }
}

// ═══════════════════════════════════════════
//  Users Page
// ═══════════════════════════════════════════
let usersPage = 1, usersSearch = '', usersStatus = '';

async function renderUsers(main) {
  const params = new URLSearchParams({ page: usersPage, per_page: 15, search: usersSearch, status: usersStatus });
  const data = await API.get(`/api/auth/users?${params}`);
  const rows = data.users.map(u => `
    <tr class="border-b border-outline/10 hover:bg-surface-container-lowest/50 transition-colors">
      <td class="px-4 py-3"><div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center"><span class="text-xs font-semibold text-primary">${escHtml(u.username[0])}</span></div>
        <div><span class="text-sm font-medium text-on-surface">${escHtml(u.username)}</span>${u.role === 'admin' ? '<span class="ml-1.5 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">管理员</span>' : ''}</div>
      </div></td>
      <td class="px-4 py-3 text-sm text-on-surface-variant">${escHtml(u.email || '-')}</td>
      <td class="px-4 py-3 text-sm text-on-surface-variant">${fmtDate(u.created_at)}</td>
      <td class="px-4 py-3 text-sm text-on-surface">${u.conversation_count || 0}</td>
      <td class="px-4 py-3"><span class="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${u.is_active ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}">${u.is_active ? '启用' : '禁用'}</span></td>
	      <td class="px-4 py-3 text-sm text-on-surface">${u.daily_limit != null ? u.daily_limit : chr(39) + "默认" + chr(39)}</td>
      <td class="px-4 py-3">
        <div class="flex items-center gap-2">
          <button onclick="editUser(${u.id},'${escHtml(u.username)}','${escHtml(u.email||'')}','${u.role}',${u.is_active})" class="text-primary text-sm hover:underline">编辑</button>
          <button onclick="resetUserPwd(${u.id})" class="text-warning text-sm hover:underline">重置密码</button>
          <button onclick="deleteUser(${u.id},'${escHtml(u.username)}')" class="text-error text-sm hover:underline">删除</button>
        </div>
      </td>
    </tr>`).join('');

  main.innerHTML = `
    <h1 class="text-2xl font-bold text-on-surface mb-6">用户管理</h1>
    <div class="bg-surface rounded-xl shadow-card p-4 mb-4 flex flex-wrap gap-3 items-center">
      <input type="text" id="userSearch" placeholder="搜索用户名或邮箱..." value="${escHtml(usersSearch)}"
        class="border-none bg-surface-container rounded-lg px-4 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 w-64" />
      <select id="userStatus" class="border-none bg-surface-container rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30">
        <option value="">全部状态</option><option value="active" ${usersStatus==='active'?'selected':''}>已启用</option><option value="disabled" ${usersStatus==='disabled'?'selected':''}>已禁用</option>
      </select>
      <button onclick="usersSearch=document.getElementById('userSearch').value;usersStatus=document.getElementById('userStatus').value;usersPage=1;navigateTo('users')" class="bg-primary text-on-primary rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90">筛选</button>
      <button onclick="usersSearch='';usersStatus='';usersPage=1;navigateTo('users')" class="text-on-surface-variant text-sm hover:text-on-surface">重置</button>
      <button onclick="showAddUserModal()" class="ml-auto bg-primary text-on-primary rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 flex items-center gap-1"><i data-lucide="plus" class="w-4 h-4"></i>新增用户</button>
    </div>
    <div class="bg-surface rounded-xl shadow-card overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead><tr class="bg-surface-container text-left">
            <th class="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">用户</th>
            <th class="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">邮箱</th>
            <th class="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">注册时间</th>
            <th class="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">对话数</th>
            <th class="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">状态</th>
            <th class="px-4 py-3 text-xs font-semibold text-on-surface-variant uppercase">操作</th>
          </tr></thead>
          <tbody>${rows || '<tr><td colspan="7" class="px-4 py-8 text-center text-sm text-on-surface-variant">暂无用户</td></tr>'}</tbody>
        </table>
      </div>
      ${data.pages > 1 ? `<div class="flex items-center justify-between px-4 py-3 border-t border-outline/10"><span class="text-sm text-on-surface-variant">共 ${data.total} 条</span><div class="flex gap-1">${paginationHtml(data.page, data.pages)}</div></div>` : ''}
    </div>`;
}

async function showAddUserModal() {
  showModal('新增用户', `
    <div class="space-y-3">
      <div><label class="block text-sm font-medium mb-1">用户名</label><input id="mu_username" class="w-full border-none bg-surface-container rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
      <div><label class="block text-sm font-medium mb-1">邮箱</label><input id="mu_email" type="email" class="w-full border-none bg-surface-container rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
      <div><label class="block text-sm font-medium mb-1">密码</label><input id="mu_password" type="password" class="w-full border-none bg-surface-container rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
      <div><label class="block text-sm font-medium mb-1">角色</label><select id="mu_role" class="w-full border-none bg-surface-container rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"><option value="user">普通用户</option><option value="admin">管理员</option></select></div>
    </div>`,
    async () => {
      const username = document.getElementById('mu_username').value.trim();
      const email = document.getElementById('mu_email').value.trim();
      const password = document.getElementById('mu_password').value;
      const role = document.getElementById('mu_role').value;
      if (!username || !password) { showToast('用户名和密码不能为空', 'error'); return; }
      const dlVal = document.getElementById('mu_daily_limit').value; const dl = dlVal ? parseInt(dlVal) : null; await API.post('/api/auth/register', { username, email, password, daily_limit: dl });
      showToast('用户创建成功', 'success');
      closeModal();
      navigateTo('users');
    });
}

async function editUser(id, username, email, role, isActive, dailyLimit) {
  showModal(`编辑用户: ${username}`, `
    <div class="space-y-3">
      <div><label class="block text-sm font-medium mb-1">邮箱</label><input id="eu_email" type="email" value="${escHtml(email)}" class="w-full border-none bg-surface-container rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
      <div><label class="block text-sm font-medium mb-1">角色</label><select id="eu_role" class="w-full border-none bg-surface-container rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"><option value="user" ${role==='user'?'selected':''}>普通用户</option><option value="admin" ${role==='admin'?'selected':''}>管理员</option></select></div>
      <div class="flex items-center gap-2"><input type="checkbox" id="eu_active" ${isActive?'checked':''} class="rounded" /><label for="eu_active" class="text-sm">启用账号</label></div>
    </div>`,
    async () => {
      const edlVal = document.getElementById('eu_daily_limit').value; const edl = edlVal ? parseInt(edlVal) : null; await API.put(`/api/auth/users/${id}`, {
        email: document.getElementById('eu_email').value.trim(),
        role: document.getElementById('eu_role').value,
        is_active: document.getElementById('eu_active').checked,
          daily_limit: edl,
      });
      showToast('用户已更新', 'success');
      closeModal();
      navigateTo('users');
    });
}

async function resetUserPwd(id) {
  if (!confirm('确定重置该用户密码为 admin123 吗？')) return;
  await API.post(`/api/auth/users/${id}/reset-password`, { new_password: 'admin123' });
  showToast('密码已重置为 admin123', 'success');
}

async function deleteUser(id, username) {
  if (!confirm(`确定删除用户 "${username}" 吗？此操作不可撤销。`)) return;
  try {
    await API.del(`/api/auth/users/${id}`);
    showToast('用户已删除', 'success');
    navigateTo('users');
  } catch (err) { showToast(err.message, 'error'); }
}

// ═══════════════════════════════════════════
//  Permissions Page
// ═══════════════════════════════════════════
let permTab = 'global';

async function renderPermissions(main) {
  const globalData = await API.get('/api/admin/permissions/global');
  const gp = globalData.permissions;
  const usersData = await API.get('/api/auth/users?per_page=100');
  const userOpts = usersData.users.map(u => `<option value="${u.id}">${escHtml(u.username)}${u.role==='admin'?' (管理员)':''}</option>`).join('');

  main.innerHTML = `
    <h1 class="text-2xl font-bold text-on-surface mb-6">权限设置</h1>
    <div class="bg-surface rounded-xl shadow-card overflow-hidden">
      <div class="flex border-b border-outline/10">
        <button class="px-6 py-3 text-sm font-medium ${permTab==='global'?'text-primary border-b-2 border-primary':'text-on-surface-variant hover:text-on-surface'}" onclick="permTab='global';navigateTo('permissions')">全局默认权限</button>
        <button class="px-6 py-3 text-sm font-medium ${permTab==='user'?'text-primary border-b-2 border-primary':'text-on-surface-variant hover:text-on-surface'}" onclick="permTab='user';navigateTo('permissions')">用户单独权限</button>
      </div>
      <div class="p-5" id="permContent"></div>
    </div>`;

  const pc = document.getElementById('permContent');
  if (permTab === 'global') {
    pc.innerHTML = renderPermForm('global', gp, null);
    document.getElementById('saveGlobalPerm')?.addEventListener('click', async () => {
      await API.put('/api/admin/permissions/global', readPermForm('global'));
      showToast('全局权限已保存', 'success');
    });
    document.getElementById('resetGlobalPerm')?.addEventListener('click', () => {
      document.getElementById('gp_max_daily').value = 100;
      document.getElementById('gp_max_tokens').value = 4096;
      document.getElementById('gp_rate_limit').value = 10;
      document.getElementById('gp_models').value = 'deepseek-chat,deepseek-reasoner';
      document.getElementById('gp_export').checked = false;
      document.getElementById('gp_upload').checked = false;
    });
  } else {
    pc.innerHTML = `
      <div class="mb-4"><label class="block text-sm font-medium mb-1">选择用户</label>
        <select id="permUserSelect" class="border-none bg-surface-container rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-64">
          <option value="">-- 请选择 --</option>${userOpts}
        </select>
      </div>
      <div id="userPermDetail"><p class="text-sm text-on-surface-variant">请先选择用户</p></div>`;

    document.getElementById('permUserSelect').addEventListener('change', async (e) => {
      const uid = e.target.value;
      if (!uid) { document.getElementById('userPermDetail').innerHTML = '<p class="text-sm text-on-surface-variant">请先选择用户</p>'; return; }
      const data = await API.get(`/api/admin/permissions/user/${uid}`);
      const up = data.custom_permissions || {};
      document.getElementById('userPermDetail').innerHTML = renderPermForm('user', data.effective_permissions, up, uid);
      document.getElementById('saveUserPerm')?.addEventListener('click', async () => {
        const payload = readPermForm('user');
        payload.use_custom = document.getElementById('up_use_custom').checked;
        await API.put(`/api/admin/permissions/user/${uid}`, payload);
        showToast('用户权限已保存', 'success');
      });
      lucide.createIcons();
    });
  }
  lucide.createIcons();
}

function renderPermForm(type, effective, custom, userId) {
  const prefix = type === 'global' ? 'gp' : 'up';
  const models = (custom?.allowed_models || effective.allowed_models || []).join(',');
  const useCustom = custom?.use_custom ?? false;
  return `
    <div class="space-y-4">
      ${type === 'user' ? `<div class="flex items-center gap-2 mb-4"><input type="checkbox" id="up_use_custom" ${useCustom?'checked':''} class="rounded" /><label for="up_use_custom" class="text-sm font-medium">使用自定义权限（覆盖全局默认）</label></div>` : ''}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label class="block text-sm font-medium mb-1">每日对话上限</label><input id="${prefix}_max_daily" type="number" value="${custom?.max_daily_chats ?? effective.max_daily_chats}" class="w-full border-none bg-surface-container rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
        <div><label class="block text-sm font-medium mb-1">单次最大Token</label><input id="${prefix}_max_tokens" type="number" value="${custom?.max_tokens_per_request ?? effective.max_tokens_per_request}" class="w-full border-none bg-surface-container rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
        <div><label class="block text-sm font-medium mb-1">每分钟频率限制</label><input id="${prefix}_rate_limit" type="number" value="${custom?.rate_limit_per_minute ?? effective.rate_limit_per_minute}" class="w-full border-none bg-surface-container rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
        <div><label class="block text-sm font-medium mb-1">可用模型（逗号分隔）</label><input id="${prefix}_models" type="text" value="${escHtml(models)}" class="w-full border-none bg-surface-container rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
      </div>
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-2"><input type="checkbox" id="${prefix}_export" ${(custom?.allow_export ?? effective.allow_export)?'checked':''} class="rounded" /><label for="${prefix}_export" class="text-sm">允许导出对话</label></div>
        <div class="flex items-center gap-2"><input type="checkbox" id="${prefix}_upload" ${(custom?.allow_file_upload ?? effective.allow_file_upload)?'checked':''} class="rounded" /><label for="${prefix}_upload" class="text-sm">允许文件上传</label></div>
      </div>
      <div class="flex gap-2 pt-2">
        <button id="save${type === 'global' ? 'Global' : 'User'}Perm" class="bg-primary text-on-primary rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90">保存</button>
        ${type === 'global' ? '<button id="resetGlobalPerm" class="text-on-surface-variant text-sm hover:text-on-surface px-4 py-2">恢复默认</button>' : ''}
      </div>
    </div>`;
}

function readPermForm(type) {
  const prefix = type === 'global' ? 'gp' : 'up';
  return {
    max_daily_chats: parseInt(document.getElementById(`${prefix}_max_daily`).value) || 100,
    max_tokens_per_request: parseInt(document.getElementById(`${prefix}_max_tokens`).value) || 4096,
    rate_limit_per_minute: parseInt(document.getElementById(`${prefix}_rate_limit`).value) || 10,
    allowed_models: document.getElementById(`${prefix}_models`).value,
    allow_export: document.getElementById(`${prefix}_export`).checked,
    allow_file_upload: document.getElementById(`${prefix}_upload`).checked,
  };
}

// ═══════════════════════════════════════════
//  API Keys Page
// ═══════════════════════════════════════════
async function renderApiKeys(main) {
  const [configs, apiKeyData] = await Promise.all([
    API.get('/api/admin/config'),
    API.get('/api/admin/config/api-key'),
  ]);
  const cfg = configs.configs || {};
  const realApiKey = apiKeyData.api_key || '';
  const realBaseUrl = apiKeyData.base_url || 'https://api.deepseek.com';
  main.innerHTML = `
    <h1 class="text-2xl font-bold text-on-surface mb-6">API 密钥配置</h1>
    <div class="bg-surface rounded-xl shadow-card p-5 mb-6">
      <h2 class="text-base font-semibold mb-4 flex items-center gap-2"><i data-lucide="info" class="w-4 h-4 text-primary"></i>配置说明</h2>
      <p class="text-sm text-on-surface-variant">在此配置 DeepSeek API 密钥与连接参数。API Key 将以加密形式存储。配置完成后请使用"测试连接"验证。</p>
    </div>
    <div class="bg-surface rounded-xl shadow-card p-5">
      <div class="space-y-4 max-w-xl">
        <div><label class="block text-sm font-medium mb-1">API Key</label>
          <div class="relative"><input id="apiKey" type="password" value="${escHtml(realApiKey)}" class="w-full border-none bg-surface-container rounded-lg px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button onclick="toggleApiKey()" class="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface-variant"><i data-lucide="eye" class="w-4 h-4"></i></button>
          </div>
        </div>
        <div><label class="block text-sm font-medium mb-1">Base URL</label><input id="baseUrl" type="text" value="${escHtml(realBaseUrl)}" class="w-full border-none bg-surface-container rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" /></div>
        <div class="flex gap-3 pt-2">
          <button onclick="saveApiConfig()" class="bg-primary text-on-primary rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90">保存配置</button>
          <button onclick="testConnection()" id="testBtn" class="border border-outline/30 text-on-surface rounded-lg px-4 py-2 text-sm font-medium hover:bg-surface-container transition-colors flex items-center gap-1"><i data-lucide="plug" class="w-4 h-4"></i>测试连接</button>
          <span id="testResult" class="text-sm self-center"></span>
        </div>
      </div>
    </div>`;
}

function toggleApiKey() {
  const inp = document.getElementById('apiKey');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

async function saveApiConfig() {
  await API.put('/api/admin/config', {
    deepseek_api_key: document.getElementById('apiKey').value,
    deepseek_base_url: document.getElementById('baseUrl').value,
  });
  showToast('配置已保存', 'success');
}

async function testConnection() {
  const btn = document.getElementById('testBtn');
  const result = document.getElementById('testResult');
  btn.disabled = true;
  btn.innerHTML = '<div class="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div> 测试中...';
  result.textContent = '';
  try {
    const data = await API.post('/api/admin/config/test-connection', {
      api_key: document.getElementById('apiKey').value,
      base_url: document.getElementById('baseUrl').value,
    });
    if (data.success) {
      result.innerHTML = '<span class="text-success flex items-center gap-1"><i data-lucide="check-circle" class="w-4 h-4"></i>连接成功</span>';
    } else {
      result.innerHTML = `<span class="text-error flex items-center gap-1"><i data-lucide="x-circle" class="w-4 h-4"></i>${escHtml(data.error)}</span>`;
    }
  } catch (err) {
    result.innerHTML = `<span class="text-error">${escHtml(err.message)}</span>`;
  }
  btn.disabled = false;
  btn.innerHTML = '<i data-lucide="plug" class="w-4 h-4"></i>测试连接';
  lucide.createIcons();
}

// ═══════════════════════════════════════════
//  Settings Page
// ═══════════════════════════════════════════
async function renderSettings(main) {
  const configs = await API.get('/api/admin/config');
  const cfg = configs.configs || {};
  const regData = await API.get('/api/admin/config/open-registration');
  main.innerHTML = `
    <h1 class="text-2xl font-bold text-on-surface mb-6">系统设置</h1>
    <div class="space-y-6 max-w-xl">
      <div class="bg-surface rounded-xl shadow-card p-5">
        <h2 class="text-base font-semibold mb-4">开放注册</h2>
        <div class="flex items-center gap-3">
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="openReg" ${regData.open_registration ? 'checked' : ''} class="sr-only peer" onchange="toggleRegistration(this.checked)" />
            <div class="w-10 h-5 bg-surface-container-high rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
          <span class="text-sm text-on-surface-variant" id="regStatus">${regData.open_registration ? '当前开放注册' : '当前关闭注册'}</span>
        </div>
      </div>
      <div class="bg-surface rounded-xl shadow-card p-5">
        <h2 class="text-base font-semibold mb-4">对话历史保留天数</h2>
        <input id="retentionDays" type="number" value="${cfg.conversation_retention_days || '90'}" class="w-32 border-none bg-surface-container rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <button onclick="saveRetention()" class="ml-3 bg-primary text-on-primary rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90">保存</button>
      </div>
      <div class="bg-surface rounded-xl shadow-card p-5">
        <h2 class="text-base font-semibold mb-4">管理员查看对话内容</h2>
        <div class="flex items-center gap-3">
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" id="adminViewContent" ${cfg.admin_can_view_content === 'true' ? 'checked' : ''} class="sr-only peer" onchange="toggleAdminView(this.checked)" />
            <div class="w-10 h-5 bg-surface-container-high rounded-full peer peer-checked:bg-primary peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
          </label>
          <span class="text-sm text-on-surface-variant">允许管理员查看用户对话内容</span>
        </div>
      </div>
    </div>`;
}

async function toggleRegistration(val) {
  await API.put('/api/admin/config/open-registration', { open_registration: val });
  document.getElementById('regStatus').textContent = val ? '当前开放注册' : '当前关闭注册';
  showToast(val ? '已开放注册' : '已关闭注册', 'success');
}

async function saveRetention() {
  const days = document.getElementById('retentionDays').value;
  await API.put('/api/admin/config', { conversation_retention_days: days });
  showToast('保存成功', 'success');
}

async function toggleAdminView(val) {
  await API.put('/api/admin/config', { admin_can_view_content: val ? 'true' : 'false' });
  showToast('设置已保存', 'success');
}

// ═══════════════════════════════════════════
//  Utility Functions
// ═══════════════════════════════════════════
function escHtml(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtDate(d) {
  if (!d) return '-';
  const dt = new Date(d);
  return dt.toLocaleDateString('zh-CN', { month:'2-digit', day:'2-digit' }) + ' ' + dt.toLocaleTimeString('zh-CN', { hour:'2-digit', minute:'2-digit' });
}

function paginationHtml(page, total) {
  let html = '';
  for (let i = 1; i <= total; i++) {
    html += `<button onclick="usersPage=${i};navigateTo('users')" class="px-3 py-1 text-sm rounded-md ${i===page?'bg-primary text-on-primary':'text-on-surface-variant hover:bg-surface-container'}">${i}</button>`;
  }
  return html;
}

let modalCallback = null;
function showModal(title, bodyHtml, onConfirm) {
  const overlay = document.createElement('div');
  overlay.id = 'modalOverlay';
  overlay.className = 'fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4';
  overlay.innerHTML = `<div class="bg-surface rounded-2xl shadow-dialog w-full max-w-md">
    <div class="flex items-center justify-between p-5 border-b border-outline/10">
      <h3 class="text-lg font-semibold">${title}</h3>
      <button onclick="closeModal()" class="text-on-surface-variant hover:text-on-surface"><i data-lucide="x" class="w-5 h-5"></i></button>
    </div>
    <div class="p-5">${bodyHtml}</div>
    <div class="flex justify-end gap-2 p-5 pt-0 border-t border-outline/10 mt-4">
      <button onclick="closeModal()" class="border border-outline/30 text-on-surface rounded-lg px-4 py-2 text-sm hover:bg-surface-container transition-colors">取消</button>
      <button id="modalConfirm" class="bg-primary text-on-primary rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90">确认</button>
    </div>
  </div>`;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.body.appendChild(overlay);
  document.getElementById('modalConfirm').addEventListener('click', async () => {
    if (onConfirm) await onConfirm();
  });
  modalCallback = onConfirm;
  lucide.createIcons();
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.remove();
  modalCallback = null;
}
