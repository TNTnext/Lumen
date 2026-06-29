// ─── i18n ──────────────────────────────────────────────────
const i18n = {
  zh: {
    nav_dashboard: '数据看板', nav_conversations: '对话记录', nav_users: '用户管理',
    nav_permissions: '权限设置', nav_api_keys: 'API 配置', nav_endpoints: '接口开关',
    nav_settings: '系统设置', logout: '退出登录',
    dashboard_title: '数据看板', total_users: '总用户', active_today: '今日活跃',
    total_convs: '总对话', today_calls: '今日 API 调用', today_tokens: '今日 Token',
    month_tokens: '本月 Token', new_users_week: '本周新增', admin_count: '管理员数',
    trend_7d: '7 天对话趋势', model_dist: '模型使用分布', user_ranking: '用户活跃排行',
    no_data: '暂无数据', unknown: '未知', conversations: '对话',
    conv_title: '对话记录', conv_id: 'ID', conv_user: '用户', conv_title_col: '标题',
    conv_model: '模型', conv_msgs: '消息数', conv_tokens: 'Token', conv_time: '时间',
    conv_actions: '操作', conv_detail: '详情', conv_delete: '删除', conv_none: '暂无对话记录',
    conv_new: '新对话', conv_back: '返回', conv_detail_title: '对话详情',
    confirm_delete: '确认删除此对话？', deleted: '已删除', delete_failed: '删除失败',
    user_title: '用户管理', user_add: '添加用户', user_id: 'ID', user_username: '用户名',
    user_email: '邮箱', user_role: '角色', user_status: '状态', user_daily_limit: '日限额',
    user_today_chats: '今日对话', user_actions: '操作', user_edit: '编辑',
    user_reset_pw: '重置密码', user_enable: '启用', user_disable: '禁用',
    user_default: '默认', user_role_admin: '管理员', user_role_user: '普通用户',
    add_user_title: '添加用户', add_user_username: '用户名', add_user_email: '邮箱',
    add_user_password: '密码', add_user_role: '角色', add_user_daily_limit: '日限额（留空为默认）',
    cancel: '取消', add: '添加', user_added: '用户已添加', add_failed: '添加失败',
    edit_user_title: '编辑用户', save: '保存', saved: '已保存', save_failed: '保存失败',
    reset_pw_prompt: '输入新密码（至少6位）：', pw_reset: '密码已重置', reset_failed: '重置失败',
    enabled: '已启用', disabled: '已禁用', op_failed: '操作失败',
    perm_title: '权限设置', perm_global: '全局默认权限', perm_daily_chats: '每日对话次数',
    perm_max_tokens: '单次最大 Token', perm_rate_limit: '每分钟频率限制',
    perm_allow_export: '允许导出', perm_allow_upload: '允许文件上传',
    perm_save_global: '保存全局权限', perm_global_saved: '全局权限已保存',
    perm_user_title: '用户单独权限', perm_no_users: '暂无普通用户',
    perm_config: '配置权限', perm_custom: '使用自定义权限',
    perm_saved: '权限已保存',
    apikey_title: 'API 配置', apikey_vendor: '模型厂商', apikey_vendor_label: '厂商',
    apikey_key: 'API Key', apikey_baseurl: 'Base URL', apikey_model: '默认模型',
    apikey_save: '保存配置', apikey_test: '测试连接', apikey_saved: '配置已保存',
    apikey_today_calls: '今日调用', apikey_month_calls: '本月调用',
    apikey_month_tokens: '本月 Token', apikey_cap_matrix: '厂商能力矩阵',
    apikey_cap_vendor: '厂商', apikey_cap_model: '模型',
    cap_text: '文本', cap_vision: '视觉', cap_streaming: '流式', cap_thinking: '思考',
    cap_tools: '工具', cap_file: '文件', cap_search: '搜索',
    test_success: '连接成功', test_failed: '连接失败',
    ep_title: '接口开关', ep_all_on: '全部开启', ep_all_off: '全部关闭',
    ep_group_auth: '认证接口', ep_group_chat: '对话接口', ep_group_admin: '管理接口',
    ep_on: '全开', ep_off: '全关', ep_toggled_on: '已开启', ep_toggled_off: '已关闭',
    settings_title: '系统设置', settings_reg: '开放注册', settings_admin_view: '管理员可查看对话内容',
    settings_retention: '对话保留天数', settings_save: '保存设置', settings_saved: '设置已保存',
    settings_danger: '危险操作', settings_reset_desc: '重置将清空所有对话数据、系统配置和非管理员用户。',
    settings_reset: '重置系统', settings_reset_confirm: '确认重置系统？此操作不可撤销！',
    settings_reset_done: '系统已重置', settings_reset_failed: '重置失败',
    onboarding_welcome: '欢迎使用 Lumen', onboarding_subtitle: '首次使用，请完成以下初始配置',
    onboarding_skip: '跳过初始化',
    onboarding_step1: '管理员账户', onboarding_new_pw: '新密码', onboarding_pw_hint: '留空则不修改',
    onboarding_email: '邮箱', onboarding_step2: 'AI 模型厂商',
    onboarding_step3: '全局默认权限', onboarding_step4: '系统设置',
    onboarding_step5: '接口开关', onboarding_reg_open: '开放注册',
    onboarding_admin_view: '管理员可查看对话内容', onboarding_retention: '对话保留天数',
    onboarding_ep_auth: '认证接口', onboarding_ep_chat: '对话接口',
    onboarding_submit: '完成配置，进入管理后台',
    onboarding_done: '配置完成', onboarding_failed: '配置失败',
    need_admin: '需要管理员权限',
    // Vendor management
    nav_vendors: '厂商与密钥', vendor_title: '厂商与密钥',
    vendor_enable: '启用', vendor_disable: '禁用',
    vendor_add: '添加厂商', vendor_save: '保存', vendor_cancel: '取消',
    vendor_delete: '删除', vendor_delete_confirm: '确定要删除此厂商吗？',
    vendor_display_name: '显示名称', vendor_api_key: 'API Key',
    vendor_base_url: 'Base URL', vendor_default_model: '默认模型',
    vendor_priority: '优先级', vendor_model_priority: '模型优先级',
    vendor_test_connection: '测试连接', vendor_testing: '测试中...',
    vendor_test_success: '连接成功', vendor_test_failed: '连接失败',
    vendor_no_models: '暂未配置模型优先级',
    vendor_drag_hint: '拖拽调整模型优先级',
  },
  en: {
    nav_dashboard: 'Dashboard', nav_conversations: 'Conversations', nav_users: 'Users',
    nav_permissions: 'Permissions', nav_api_keys: 'API Config', nav_endpoints: 'Endpoints',
    nav_settings: 'Settings', logout: 'Logout',
    dashboard_title: 'Dashboard', total_users: 'Total Users', active_today: 'Active Today',
    total_convs: 'Total Conversations', today_calls: 'API Calls Today', today_tokens: 'Tokens Today',
    month_tokens: 'Tokens This Month', new_users_week: 'New Users This Week', admin_count: 'Admins',
    trend_7d: '7-Day Conversation Trend', model_dist: 'Model Distribution', user_ranking: 'User Ranking',
    no_data: 'No data', unknown: 'Unknown', conversations: 'conversations',
    conv_title: 'Conversations', conv_id: 'ID', conv_user: 'User', conv_title_col: 'Title',
    conv_model: 'Model', conv_msgs: 'Messages', conv_tokens: 'Tokens', conv_time: 'Time',
    conv_actions: 'Actions', conv_detail: 'Detail', conv_delete: 'Delete', conv_none: 'No conversations',
    conv_new: 'New Chat', conv_back: 'Back', conv_detail_title: 'Conversation Detail',
    confirm_delete: 'Delete this conversation?', deleted: 'Deleted', delete_failed: 'Delete failed',
    user_title: 'User Management', user_add: 'Add User', user_id: 'ID', user_username: 'Username',
    user_email: 'Email', user_role: 'Role', user_status: 'Status', user_daily_limit: 'Daily Limit',
    user_today_chats: 'Today Chats', user_actions: 'Actions', user_edit: 'Edit',
    user_reset_pw: 'Reset PW', user_enable: 'Enable', user_disable: 'Disable',
    user_default: 'Default', user_role_admin: 'Admin', user_role_user: 'User',
    add_user_title: 'Add User', add_user_username: 'Username', add_user_email: 'Email',
    add_user_password: 'Password', add_user_role: 'Role', add_user_daily_limit: 'Daily limit (empty=default)',
    cancel: 'Cancel', add: 'Add', user_added: 'User added', add_failed: 'Add failed',
    edit_user_title: 'Edit User', save: 'Save', saved: 'Saved', save_failed: 'Save failed',
    reset_pw_prompt: 'Enter new password (min 6 chars):', pw_reset: 'Password reset', reset_failed: 'Reset failed',
    enabled: 'Enabled', disabled: 'Disabled', op_failed: 'Operation failed',
    perm_title: 'Permissions', perm_global: 'Global Default Permissions', perm_daily_chats: 'Daily Chat Limit',
    perm_max_tokens: 'Max Tokens/Request', perm_rate_limit: 'Rate Limit/min',
    perm_allow_export: 'Allow Export', perm_allow_upload: 'Allow File Upload',
    perm_save_global: 'Save Global Permissions', perm_global_saved: 'Global permissions saved',
    perm_user_title: 'User-Specific Permissions', perm_no_users: 'No regular users',
    perm_config: 'Configure', perm_custom: 'Use custom permissions',
    perm_saved: 'Permissions saved',
    apikey_title: 'API Configuration', apikey_vendor: 'Model Providers', apikey_vendor_label: 'Provider',
    apikey_key: 'API Key', apikey_baseurl: 'Base URL', apikey_model: 'Default Model',
    apikey_save: 'Save Config', apikey_test: 'Test Connection', apikey_saved: 'Config saved',
    apikey_today_calls: 'Today Calls', apikey_month_calls: 'Monthly Calls',
    apikey_month_tokens: 'Monthly Tokens', apikey_cap_matrix: 'Capability Matrix',
    apikey_cap_vendor: 'Vendor', apikey_cap_model: 'Model',
    cap_text: 'Text', cap_vision: 'Vision', cap_streaming: 'Streaming', cap_thinking: 'Thinking',
    cap_tools: 'Tools', cap_file: 'File', cap_search: 'Search',
    test_success: 'Connection successful', test_failed: 'Connection failed',
    ep_title: 'Endpoint Toggles', ep_all_on: 'Enable All', ep_all_off: 'Disable All',
    ep_group_auth: 'Auth', ep_group_chat: 'Chat', ep_group_admin: 'Admin',
    ep_on: 'On', ep_off: 'Off', ep_toggled_on: 'Enabled', ep_toggled_off: 'Disabled',
    settings_title: 'System Settings', settings_reg: 'Open Registration', settings_admin_view: 'Admin Can View Content',
    settings_retention: 'Retention Days', settings_save: 'Save Settings', settings_saved: 'Settings saved',
    settings_danger: 'Danger Zone', settings_reset_desc: 'Reset will clear all conversations, configs, and non-admin users.',
    settings_reset: 'Reset System', settings_reset_confirm: 'Confirm system reset? This cannot be undone!',
    settings_reset_done: 'System reset', settings_reset_failed: 'Reset failed',
    onboarding_welcome: 'Welcome to Lumen', onboarding_subtitle: 'Please complete the initial setup',
    onboarding_skip: 'Skip Setup',
    onboarding_step1: 'Admin Account', onboarding_new_pw: 'New Password', onboarding_pw_hint: 'Leave empty to keep current',
    onboarding_email: 'Email', onboarding_step2: 'AI Provider',
    onboarding_step3: 'Global Default Permissions', onboarding_step4: 'System Settings',
    onboarding_step5: 'Endpoint Toggles', onboarding_reg_open: 'Open Registration',
    onboarding_admin_view: 'Admin Can View Content', onboarding_retention: 'Retention Days',
    onboarding_ep_auth: 'Auth Endpoints', onboarding_ep_chat: 'Chat Endpoints',
    onboarding_submit: 'Complete Setup & Enter Admin',
    onboarding_done: 'Setup complete', onboarding_failed: 'Setup failed',
    need_admin: 'Admin privileges required',
    // Vendor management
    nav_vendors: 'Vendors', vendor_title: 'Vendor Management',
    vendor_enable: 'Enable', vendor_disable: 'Disable',
    vendor_add: 'Add Vendor', vendor_save: 'Save', vendor_cancel: 'Cancel',
    vendor_delete: 'Delete', vendor_delete_confirm: 'Are you sure you want to delete this vendor?',
    vendor_display_name: 'Display Name', vendor_api_key: 'API Key',
    vendor_base_url: 'Base URL', vendor_default_model: 'Default Model',
    vendor_priority: 'Priority', vendor_model_priority: 'Model Priority',
    vendor_test_connection: 'Test Connection', vendor_testing: 'Testing...',
    vendor_test_success: 'Connection successful', vendor_test_failed: 'Connection failed',
    vendor_no_models: 'No models configured',
    vendor_drag_hint: 'Drag to reorder model priority',
  }
};

let lang = localStorage.getItem('lumen_lang') || (navigator.language && navigator.language.startsWith('zh') ? 'zh' : 'en');
function t(key) { return (i18n[lang] && i18n[lang][key]) || i18n.zh[key] || key; }
function toggleLang() {
  lang = lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('lumen_lang', lang);
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中';
  // Re-render current page - keep onboarding if active
  if (state.needsOnboarding) {
    renderOnboarding();
    return;
  }
  renderNav();
  const fn = window['render' + state.page.charAt(0).toUpperCase() + state.page.slice(1).replace(/-./g, x => x[1].toUpperCase())];
  if (fn) fn();
}

async function skipOnboarding() {
  try {
    await api('/api/admin/onboarding/complete', 'POST');
    state.needsOnboarding = false;
    state.page = 'dashboard';
    renderNav();
    loadDashboard();
  } catch (e) {
    showToast(t('onboarding_failed'), 'error');
  }
}

let onbVendorIdx = 0;
function addOnboardingVendor(vendorId = '', apiKey = '', baseUrl = '', model = '') {
  const idx = onbVendorIdx++;
  const vlist = window._onbVendors || [];
  const vendorOpts = vlist.map(v => `<option value="${v.id}" ${v.id === vendorId ? 'selected' : ''}>${v.name}</option>`).join('');
  const div = document.createElement('div');
  div.id = `onb-vendor-row-${idx}`;
  div.className = 'flex flex-col gap-2 p-3 rounded-md border border-border bg-bg/50';
  div.innerHTML = `
    <div class="flex items-center justify-between gap-2">
      <select id="onb-vendor-${idx}" class="flex-1 px-2 py-1.5 rounded border border-border bg-bg text-sm focus:outline-none focus:ring-1 focus:ring-accent/20" onchange="onOnboardingVendorModelChange(${idx})">
        ${vendorOpts}
      </select>
      <button onclick="document.getElementById('onb-vendor-row-${idx}').remove()" class="text-text-tertiary/40 hover:text-danger transition-colors" style="background:none;border:none;cursor:pointer;padding:2px;" title="${lang === 'zh' ? '移除' : 'Remove'}">
        <i data-lucide="x" class="w-4 h-4"></i>
      </button>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
      <input id="onb-apikey-${idx}" type="password" value="${escapeAttr(apiKey)}" class="px-2 py-1.5 rounded border border-border bg-bg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-accent/20" placeholder="API Key">
      <input id="onb-baseurl-${idx}" type="text" value="${escapeAttr(baseUrl)}" class="px-2 py-1.5 rounded border border-border bg-bg text-sm font-mono focus:outline-none focus:ring-1 focus:ring-accent/20" placeholder="Base URL">
      <select id="onb-model-${idx}" class="px-2 py-1.5 rounded border border-border bg-bg text-sm focus:outline-none focus:ring-1 focus:ring-accent/20"></select>
    </div>
  `;
  document.getElementById('onb-vendors-container').appendChild(div);
  onOnboardingVendorModelChange(idx, model);
  lucide.createIcons();
}

function onOnboardingVendorModelChange(idx, preselectedModel = '') {
  const vendorId = document.getElementById(`onb-vendor-${idx}`)?.value;
  const sel = document.getElementById(`onb-model-${idx}`);
  if (!sel) return;
  const vlist = window._onbVendors || [];
  const vendor = vlist.find(v => v.id === vendorId);
  sel.innerHTML = (vendor?.models || []).map(m => `<option value="${m.id}" ${m.id === preselectedModel ? 'selected' : ''}>${m.name}</option>`).join('');
}

function escapeAttr(s) { return (s || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

// ─── Sidebar Mobile ─────────────────────────────────────
function openSidebar() {
  document.getElementById('sidebar').classList.remove('-translate-x-full');
  document.getElementById('sidebar-overlay').classList.remove('hidden');
}
function closeSidebar() {
  document.getElementById('sidebar').classList.add('-translate-x-full');
  document.getElementById('sidebar-overlay').classList.add('hidden');
}

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
  if (state.user.role !== 'admin') { toast(t('need_admin'), 'error'); location.href = '/login'; return; }
  document.getElementById('sidebar-user').textContent = state.user.username;
  // Init lang toggle
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = lang === 'zh' ? 'EN' : '中';
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
  { id: 'dashboard', labelKey: 'nav_dashboard', icon: 'bar-chart-3' },
  { id: 'conversations', labelKey: 'nav_conversations', icon: 'message-square' },
  { id: 'users', labelKey: 'nav_users', icon: 'users' },
  { id: 'permissions', labelKey: 'nav_permissions', icon: 'shield' },
  { id: 'vendors', labelKey: 'nav_vendors', icon: 'cpu' },
  { id: 'endpoints', labelKey: 'nav_endpoints', icon: 'toggle-right' },
  { id: 'settings', labelKey: 'nav_settings', icon: 'settings' },
];

function renderNav() {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = navItems.map(item => `
    <button onclick="navigate('${item.id}')" data-nav="${item.id}"
      class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors
      ${state.page === item.id ? 'bg-sidebar-active text-text font-medium' : 'text-text-secondary hover:bg-sidebar-hover'}">
      <i data-lucide="${item.icon}" class="w-4 h-4"></i>
      <span>${t(item.labelKey)}</span>
    </button>
  `).join('');
  // Update logout button
  const logoutBtn = document.querySelector('#sidebar button[onclick="doLogout()"] span');
  if (logoutBtn) logoutBtn.textContent = t('logout');
  lucide.createIcons();
}

function navigate(page) {
  if (page === 'api-keys') page = 'vendors';
  state.page = page;
  renderNav();
  const container = document.getElementById('page-container');
  container.innerHTML = '';
  const fn = window['render' + page.charAt(0).toUpperCase() + page.slice(1).replace(/-./g, x => x[1].toUpperCase())];
  if (fn) fn();
  closeSidebar(); // Close mobile sidebar on navigation
  container.scrollTop = 0;
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
        <h1 class="text-2xl font-semibold tracking-tight mb-2">${t('onboarding_welcome')}</h1>
        <p class="text-text-secondary text-sm">${t('onboarding_subtitle')}</p>
      </div>
      <button onclick="skipOnboarding()" class="text-xs text-text-tertiary/40 hover:text-text-tertiary/70 transition-colors self-start" style="background:none;border:none;cursor:pointer;padding:0;">${t('onboarding_skip')}</button>
      <div class="space-y-8">
        <!-- Step 1: Admin Account -->
        <div class="bg-surface rounded-xl border border-border p-6">
          <h2 class="text-sm font-semibold mb-4 flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium">1</span>
            ${t('onboarding_step1')}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1.5">${t('onboarding_new_pw')}</label>
              <input id="onb-password" type="password" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition" placeholder="${t('onboarding_pw_hint')}">
            </div>
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1.5">${t('onboarding_email')}</label>
              <input id="onb-email" type="email" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition" placeholder="admin@example.com">
            </div>
          </div>
        </div>

        <!-- Step 2: AI Providers -->
        <div class="bg-surface rounded-xl border border-border p-6">
          <h2 class="text-sm font-semibold mb-4 flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium">2</span>
            ${t('onboarding_step2')}
          </h2>
          <div id="onb-vendors-container" class="space-y-3">
          </div>
          <button onclick="addOnboardingVendor()" class="mt-3 text-xs text-accent hover:text-accent-hover transition-colors flex items-center gap-1" style="background:none;border:none;cursor:pointer;padding:0;">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i> ${lang === 'zh' ? '添加厂商' : 'Add Provider'}
          </button>
        </div>

        <!-- Step 3: Permissions -->
        <div class="bg-surface rounded-xl border border-border p-6">
          <h2 class="text-sm font-semibold mb-4 flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium">3</span>
            ${t('onboarding_step3')}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1.5">${t('perm_daily_chats')}</label>
              <input id="onb-max-chats" type="number" value="100" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
            </div>
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1.5">${t('perm_max_tokens')}</label>
              <input id="onb-max-tokens" type="number" value="4096" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
            </div>
            <div>
              <label class="block text-xs font-medium text-text-secondary mb-1.5">${t('perm_rate_limit')}</label>
              <input id="onb-rate-limit" type="number" value="10" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
            </div>
          </div>
        </div>

        <!-- Step 4: System Settings -->
        <div class="bg-surface rounded-xl border border-border p-6">
          <h2 class="text-sm font-semibold mb-4 flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium">4</span>
            ${t('onboarding_step4')}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-bg cursor-pointer hover:bg-surface-hover transition">
              <input id="onb-reg-open" type="checkbox" checked class="w-4 h-4 rounded accent-accent">
              <span class="text-sm">${t('onboarding_reg_open')}</span>
            </label>
            <label class="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-bg cursor-pointer hover:bg-surface-hover transition">
              <input id="onb-admin-view" type="checkbox" class="w-4 h-4 rounded accent-accent">
              <span class="text-sm">${t('onboarding_admin_view')}</span>
            </label>
            <div class="sm:col-span-2">
              <label class="block text-xs font-medium text-text-secondary mb-1.5">${t('onboarding_retention')}</label>
              <input id="onb-retention" type="number" value="90" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
            </div>
          </div>
        </div>

        <!-- Step 5: Endpoint Toggles -->
        <div class="bg-surface rounded-xl border border-border p-6">
          <h2 class="text-sm font-semibold mb-4 flex items-center gap-2">
            <span class="w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-medium">5</span>
            ${t('onboarding_step5')}
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label class="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-bg cursor-pointer hover:bg-surface-hover transition">
              <input id="onb-ep-auth" type="checkbox" checked class="w-4 h-4 rounded accent-accent">
              <span class="text-sm">${t('onboarding_ep_auth')}</span>
            </label>
            <label class="flex items-center gap-3 px-3 py-2 rounded-md border border-border bg-bg cursor-pointer hover:bg-surface-hover transition">
              <input id="onb-ep-chat" type="checkbox" checked class="w-4 h-4 rounded accent-accent">
              <span class="text-sm">${t('onboarding_ep_chat')}</span>
            </label>
          </div>
        </div>

        <button onclick="submitOnboarding()" class="w-full py-3 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">
          ${t('onboarding_submit')}
        </button>
      </div>
    </div>
  `;

  window._onbVendors = vendors;
  addOnboardingVendor('deepseek', '', '', 'deepseek-chat');
  lucide.createIcons();
}

async function submitOnboarding() {
  const vendorConfigs = [];
  const rows = document.getElementById('onb-vendors-container').querySelectorAll('[id^="onb-vendor-row-"]');
  rows.forEach(row => {
    const idx = row.id.replace('onb-vendor-row-', '');
    const vendorId = document.getElementById(`onb-vendor-${idx}`)?.value;
    const apiKey = document.getElementById(`onb-apikey-${idx}`)?.value;
    const baseUrl = document.getElementById(`onb-baseurl-${idx}`)?.value;
    const model = document.getElementById(`onb-model-${idx}`)?.value;
    if (vendorId) {
      vendorConfigs.push({
        vendor_id: vendorId,
        api_key: apiKey || '',
        base_url: baseUrl || '',
        model: model || '',
      });
    }
  });
  const body = {
    new_password: document.getElementById('onb-password').value || undefined,
    email: document.getElementById('onb-email').value || undefined,
    vendor_configs: vendorConfigs,
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
    toast(t('onboarding_done'), 'success');
    state.needsOnboarding = false;
    renderNav();
    navigate('dashboard');
  } else {
    toast(res?.error || t('onboarding_failed'), 'error');
  }
}

// ─── Dashboard ────────────────────────────────────────────
async function renderDashboard() {
  const res = await api('/api/admin/dashboard');
  if (!res || !res.success) return;
  const s = res.stats;

  document.getElementById('page-container').innerHTML = `
    <h1 class="text-xl font-semibold tracking-tight mb-6">${t('dashboard_title')}</h1>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
      ${statCard(t('total_users'), s.total_users, 'users')}
      ${statCard(t('active_today'), s.active_today, 'user-check')}
      ${statCard(t('total_convs'), s.total_conversations, 'message-square')}
      ${statCard(t('today_calls'), s.today_api_calls, 'zap')}
    </div>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
      ${statCard(t('today_tokens'), s.today_tokens, 'hash')}
      ${statCard(t('month_tokens'), s.month_tokens, 'bar-chart-2')}
      ${statCard(t('new_users_week'), s.new_users_week, 'user-plus')}
      ${statCard(t('admin_count'), s.admin_count, 'shield')}
    </div>

    <div class="bg-surface rounded-xl border border-border p-4 lg:p-6 mb-6">
      <h2 class="text-sm font-semibold mb-4">${t('trend_7d')}</h2>
      <div class="h-48 flex items-end gap-1 lg:gap-2" id="daily-trend-chart"></div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
      <div class="bg-surface rounded-xl border border-border p-4 lg:p-6">
        <h2 class="text-sm font-semibold mb-4">${t('model_dist')}</h2>
        <div class="space-y-3" id="model-dist"></div>
      </div>
      <div class="bg-surface rounded-xl border border-border p-4 lg:p-6">
        <h2 class="text-sm font-semibold mb-4">${t('user_ranking')}</h2>
        <div class="space-y-3" id="user-ranking"></div>
      </div>
    </div>
  `;

  const chart = document.getElementById('daily-trend-chart');
  if (s.daily_trend && s.daily_trend.length) {
    const maxVal = Math.max(...s.daily_trend.map(d => d.count), 1);
    chart.innerHTML = s.daily_trend.map(d => {
      const h = Math.max((d.count / maxVal) * 100, 2);
      return `<div class="flex-1 h-full flex flex-col items-center gap-1">
        <span class="text-xs text-text-tertiary">${d.count}</span>
        <div class="flex-1 w-full flex flex-col justify-end">
          <div class="w-full bg-accent rounded-t-sm transition-all" style="height:${h}%"></div>
        </div>
        <span class="text-xs text-text-tertiary">${d.date.slice(5)}</span>
      </div>`;
    }).join('');
  } else {
    chart.innerHTML = `<p class="text-sm text-text-tertiary">${t('no_data')}</p>`;
  }

  const md = document.getElementById('model-dist');
  if (s.model_distribution && s.model_distribution.length) {
    const total = s.model_distribution.reduce((a, b) => a + b.count, 0);
    md.innerHTML = s.model_distribution.map(m => `
      <div class="flex items-center gap-3">
        <span class="text-sm flex-1 truncate">${m.model || t('unknown')}</span>
        <span class="text-sm text-text-secondary">${m.count}</span>
        <div class="w-24 h-1.5 bg-bg rounded-full overflow-hidden">
          <div class="h-full bg-accent rounded-full" style="width:${(m.count/total)*100}%"></div>
        </div>
      </div>
    `).join('');
  } else {
    md.innerHTML = `<p class="text-sm text-text-tertiary">${t('no_data')}</p>`;
  }

  const ur = document.getElementById('user-ranking');
  if (s.user_ranking && s.user_ranking.length) {
    ur.innerHTML = s.user_ranking.map((u, i) => `
      <div class="flex items-center gap-3">
        <span class="text-xs font-mono text-text-tertiary w-5">${i + 1}</span>
        <span class="text-sm flex-1 truncate">${u.username}</span>
        <span class="text-sm text-text-secondary">${u.conversation_count} ${t('conversations')}</span>
      </div>
    `).join('');
  } else {
    ur.innerHTML = `<p class="text-sm text-text-tertiary">${t('no_data')}</p>`;
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
    <h1 class="text-xl font-semibold tracking-tight mb-6">${t('conv_title')}</h1>
    <div class="bg-surface rounded-xl border border-border overflow-hidden overflow-x-auto">
      <table class="w-full text-sm min-w-[700px]" role="table" aria-label="${t('conv_title')}">
        <thead>
          <tr class="border-b border-border">
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('conv_id')}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('conv_user')}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('conv_title_col')}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('conv_model')}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('conv_msgs')}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('conv_tokens')}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('conv_time')}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('conv_actions')}</th>
          </tr>
        </thead>
        <tbody id="conv-table"></tbody>
      </table>
    </div>
  `;

  const tbody = document.getElementById('conv-table');
  if (!convs.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="px-4 py-8 text-center text-sm text-text-tertiary">${t('conv_none')}</td></tr>`;
  } else {
    tbody.innerHTML = convs.map(c => `
      <tr class="border-b border-border hover:bg-surface-hover transition-colors">
        <td class="px-4 py-3 text-xs font-mono text-text-tertiary">${c.id}</td>
        <td class="px-4 py-3">${esc(c.username || '-')}</td>
        <td class="px-4 py-3 max-w-48 truncate">${esc(c.title || t('conv_new'))}</td>
        <td class="px-4 py-3 text-xs text-text-secondary">${esc(c.model || '-')}</td>
        <td class="px-4 py-3">${c.message_count || 0}</td>
        <td class="px-4 py-3 text-xs text-text-secondary">${c.total_tokens || 0}</td>
        <td class="px-4 py-3 text-xs text-text-tertiary">${fmtDate(c.created_at)}</td>
        <td class="px-4 py-3">
          <button onclick="viewConversation(${c.id})" class="text-accent hover:underline text-xs">${t('conv_detail')}</button>
          <button onclick="deleteConversation(${c.id})" class="text-danger hover:underline text-xs ml-3">${t('conv_delete')}</button>
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
        <i data-lucide="arrow-left" class="w-4 h-4"></i> ${t('conv_back')}
      </button>
      <h1 class="text-xl font-semibold tracking-tight">${esc(c.title || t('conv_detail_title'))}</h1>
    </div>
    <div class="bg-surface rounded-xl border border-border p-6 space-y-4">
      ${msgs.map(m => `
        <div class="${m.role === 'user' ? 'ml-8' : 'mr-8'}">
          <div class="text-xs text-text-tertiary mb-1">${m.role === 'user' ? (lang === 'zh' ? '用户' : 'User') : 'AI'} · ${m.tokens || 0} tokens</div>
          <div class="text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-bg rounded-lg px-4 py-2.5' : ''}">${esc(m.content)}</div>
        </div>
      `).join('')}
    </div>
  `;
  lucide.createIcons();
}

async function deleteConversation(id) {
  if (!confirm(t('confirm_delete'))) return;
  const res = await api(`/api/admin/conversations/${id}`, { method: 'DELETE' });
  if (res && res.success) { toast(t('deleted'), 'success'); renderConversations(); }
  else toast(res?.error || t('delete_failed'), 'error');
}

// ─── Users ────────────────────────────────────────────────
async function renderUsers() {
  const res = await api('/api/admin/users?page=1&per_page=100');
  const users = res?.users || [];

  document.getElementById('page-container').innerHTML = `
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-xl font-semibold tracking-tight">${t('user_title')}</h1>
      <button onclick="showAddUser()" class="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">${t('user_add')}</button>
    </div>
    <div class="bg-surface rounded-xl border border-border overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border">
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('user_id')}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('user_username')}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('user_email')}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('user_role')}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('user_status')}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('user_daily_limit')}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('user_today_chats')}</th>
            <th class="text-left px-4 py-3 text-xs font-medium text-text-secondary">${t('user_actions')}</th>
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
      <td class="px-4 py-3"><span class="text-xs px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-accent/10 text-accent' : 'bg-bg text-text-secondary'}">${u.role === 'admin' ? t('user_role_admin') : t('user_role_user')}</span></td>
      <td class="px-4 py-3"><span class="text-xs px-2 py-0.5 rounded-full ${u.is_active ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}">${u.is_active ? t('user_enable') : t('user_disable')}</span></td>
      <td class="px-4 py-3 text-xs">${u.daily_limit != null ? u.daily_limit : t('user_default')}</td>
      <td class="px-4 py-3 text-xs">${u.daily_chat_count || 0}</td>
      <td class="px-4 py-3">
        <button onclick="editUser(${u.id},'${esc(u.username)}','${esc(u.email||'')}','${u.role}',${u.is_active},${u.daily_limit ?? 'null'})" class="text-accent hover:underline text-xs">${t('user_edit')}</button>
        <button onclick="resetUserPassword(${u.id})" class="text-warning hover:underline text-xs ml-2">${t('user_reset_pw')}</button>
        <button onclick="toggleUserActive(${u.id},${!u.is_active})" class="text-xs ml-2 hover:underline ${u.is_active ? 'text-danger' : 'text-success'}">${u.is_active ? t('user_disable') : t('user_enable')}</button>
      </td>
    </tr>
  `).join('');
}

function showAddUser() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/20 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-surface rounded-xl border border-border p-6 w-96 shadow-lg">
      <h2 class="text-sm font-semibold mb-4">${t('add_user_title')}</h2>
      <div class="space-y-3">
        <input id="add-username" placeholder="${t('add_user_username')}" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        <input id="add-email" type="email" placeholder="${t('add_user_email')}" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        <input id="add-password" type="password" placeholder="${t('add_user_password')}" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        <select id="add-role" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
          <option value="user">${t('user_role_user')}</option>
          <option value="admin">${t('user_role_admin')}</option>
        </select>
        <input id="add-daily-limit" type="number" placeholder="${t('add_user_daily_limit')}" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
      </div>
      <div class="flex gap-3 mt-4">
        <button onclick="this.closest('.fixed').remove()" class="flex-1 py-2 rounded-md border border-border text-sm hover:bg-surface-hover transition-colors">${t('cancel')}</button>
        <button onclick="addUser(this)" class="flex-1 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">${t('add')}</button>
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
  if (res && res.success) { toast(t('user_added'), 'success'); modal.remove(); renderUsers(); }
  else toast(res?.error || t('add_failed'), 'error');
}

function editUser(id, username, email, role, isActive, dailyLimit) {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/20 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-surface rounded-xl border border-border p-6 w-96 shadow-lg">
      <h2 class="text-sm font-semibold mb-4">${t('edit_user_title')}: ${esc(username)}</h2>
      <div class="space-y-3">
        <input id="edit-email" type="email" value="${esc(email)}" placeholder="${t('add_user_email')}" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        <select id="edit-role" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
          <option value="user" ${role==='user'?'selected':''}>${t('user_role_user')}</option>
          <option value="admin" ${role==='admin'?'selected':''}>${t('user_role_admin')}</option>
        </select>
        <input id="edit-daily-limit" type="number" value="${dailyLimit != null ? dailyLimit : ''}" placeholder="${t('add_user_daily_limit')}" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
      </div>
      <div class="flex gap-3 mt-4">
        <button onclick="this.closest('.fixed').remove()" class="flex-1 py-2 rounded-md border border-border text-sm hover:bg-surface-hover transition-colors">${t('cancel')}</button>
        <button onclick="saveUser(${id}, this)" class="flex-1 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">${t('save')}</button>
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
  if (res && res.success) { toast(t('saved'), 'success'); modal.remove(); renderUsers(); }
  else toast(res?.error || t('save_failed'), 'error');
}

async function resetUserPassword(id) {
  const pw = prompt(t('reset_pw_prompt'));
  if (!pw) return;
  const res = await api(`/api/admin/users/${id}/reset-password`, { method: 'POST', body: { password: pw } });
  if (res && res.success) toast(t('pw_reset'), 'success');
  else toast(res?.error || t('reset_failed'), 'error');
}

async function toggleUserActive(id, active) {
  const res = await api(`/api/admin/users/${id}`, { method: 'PUT', body: { is_active: active } });
  if (res && res.success) { toast(active ? t('enabled') : t('disabled'), 'success'); renderUsers(); }
  else toast(res?.error || t('op_failed'), 'error');
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
    <h1 class="text-xl font-semibold tracking-tight mb-6">${t('perm_title')}</h1>

    <div class="bg-surface rounded-xl border border-border p-6 mb-6">
      <h2 class="text-sm font-semibold mb-4">${t('perm_global')}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">${t('perm_daily_chats')}</label>
          <input id="gp-max-chats" type="number" value="${gp.max_daily_chats || 100}" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        </div>
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">${t('perm_max_tokens')}</label>
          <input id="gp-max-tokens" type="number" value="${gp.max_tokens_per_request || 4096}" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        </div>
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">${t('perm_rate_limit')}</label>
          <input id="gp-rate-limit" type="number" value="${gp.rate_limit_per_minute || 10}" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        </div>
      </div>
      <div class="flex gap-4 mt-4">
        <label class="flex items-center gap-2 text-sm"><input id="gp-export" type="checkbox" ${gp.allow_export ? 'checked' : ''} class="w-4 h-4 rounded accent-accent"> ${t('perm_allow_export')}</label>
        <label class="flex items-center gap-2 text-sm"><input id="gp-upload" type="checkbox" ${gp.allow_file_upload ? 'checked' : ''} class="w-4 h-4 rounded accent-accent"> ${t('perm_allow_upload')}</label>
      </div>
      <button onclick="saveGlobalPermissions()" class="mt-4 px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">${t('perm_save_global')}</button>
    </div>

    <div class="bg-surface rounded-xl border border-border p-6">
      <h2 class="text-sm font-semibold mb-4">${t('perm_user_title')}</h2>
      <div class="space-y-3" id="user-perm-list"></div>
    </div>
  `;

  const upl = document.getElementById('user-perm-list');
  upl.innerHTML = users.filter(u => u.role !== 'admin').map(u => `
    <div class="flex items-center justify-between p-3 rounded-md border border-border bg-bg">
      <span class="text-sm font-medium">${esc(u.username)}</span>
      <button onclick="editUserPermissions(${u.id},'${esc(u.username)}')" class="text-accent hover:underline text-xs">${t('perm_config')}</button>
    </div>
  `).join('') || `<p class="text-sm text-text-tertiary">${t('perm_no_users')}</p>`;
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
  if (res && res.success) toast(t('perm_global_saved'), 'success');
  else toast(res?.error || t('save_failed'), 'error');
}

async function editUserPermissions(userId, username) {
  const res = await api(`/api/admin/permissions/user/${userId}`);
  const up = res?.permissions || {};

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/20 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-surface rounded-xl border border-border p-6 w-96 shadow-lg">
      <h2 class="text-sm font-semibold mb-4">${esc(username)} ${t('perm_title')}</h2>
      <label class="flex items-center gap-2 mb-4 text-sm">
        <input id="up-custom" type="checkbox" ${up.use_custom ? 'checked' : ''} class="w-4 h-4 rounded accent-accent" onchange="document.getElementById('up-fields').style.display=this.checked?'block':'none'">
        ${t('perm_custom')}
      </label>
      <div id="up-fields" style="display:${up.use_custom?'block':'none'}" class="space-y-3">
        <input id="up-max-chats" type="number" value="${up.max_daily_chats || ''}" placeholder="${t('perm_daily_chats')}" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        <input id="up-max-tokens" type="number" value="${up.max_tokens_per_request || ''}" placeholder="${t('perm_max_tokens')}" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        <input id="up-rate-limit" type="number" value="${up.rate_limit_per_minute || ''}" placeholder="${t('perm_rate_limit')}" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
      </div>
      <div class="flex gap-3 mt-4">
        <button onclick="this.closest('.fixed').remove()" class="flex-1 py-2 rounded-md border border-border text-sm hover:bg-surface-hover transition-colors">${t('cancel')}</button>
        <button onclick="saveUserPermissions(${userId}, this)" class="flex-1 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">${t('save')}</button>
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
  if (res && res.success) { toast(t('perm_saved'), 'success'); modal.remove(); }
  else toast(res?.error || t('save_failed'), 'error');
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
    <h1 class="text-xl font-semibold tracking-tight mb-6">${t('apikey_title')}</h1>

    <div class="bg-surface rounded-xl border border-border p-6 mb-6">
      <h2 class="text-sm font-semibold mb-4">${t('apikey_vendor')}</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">${t('apikey_vendor_label')}</label>
          <select id="apikey-vendor" onchange="onApiKeyVendorChange()" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
            ${vendors.map(v => `<option value="${v.id}">${v.name}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">${t('apikey_key')}</label>
          <div class="flex gap-2">
            <input id="apikey-key" type="password" class="flex-1 px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition font-mono" placeholder="sk-...">
            <button onclick="toggleApiKeyVisibility()" class="px-3 py-2 rounded-md border border-border text-sm hover:bg-surface-hover transition-colors">
              <i data-lucide="eye" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">${t('apikey_baseurl')}</label>
          <input id="apikey-baseurl" type="text" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition font-mono">
        </div>
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1.5">${t('apikey_model')}</label>
          <select id="apikey-model" class="w-full px-3 py-2 rounded-md border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition"></select>
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button onclick="saveApiKeyConfig()" class="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">${t('apikey_save')}</button>
        <button onclick="testApiConnection()" class="px-4 py-2 rounded-md border border-border text-sm hover:bg-surface-hover transition-colors">${t('apikey_test')}</button>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 mb-6">
      ${statCard(t('apikey_today_calls'), usage.today_calls || 0, 'zap')}
      ${statCard(t('apikey_month_calls'), usage.monthly_calls || 0, 'bar-chart-2')}
      ${statCard(t('apikey_month_tokens'), usage.monthly_tokens || 0, 'hash')}
    </div>

    <div class="bg-surface rounded-xl border border-border p-6">
      <h2 class="text-sm font-semibold mb-4">${t('apikey_cap_matrix')}</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm" id="capability-matrix"></table>
      </div>
    </div>
  `;

  window._apikeyVendors = vendors;
  const currentVendor = configRes?.vendor_id || 'deepseek';
  const vendorSel = document.getElementById('apikey-vendor');
  if (vendorSel) vendorSel.value = currentVendor;
  onApiKeyVendorChange();
  document.getElementById('apikey-key').value = configRes?.api_key || '';
  document.getElementById('apikey-baseurl').value = configRes?.base_url || '';

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
  if (res && res.success) toast(t('apikey_saved'), 'success');
  else toast(res?.error || t('save_failed'), 'error');
}

async function testApiConnection() {
  const body = {
    api_key: document.getElementById('apikey-key').value,
    base_url: document.getElementById('apikey-baseurl').value,
    model: document.getElementById('apikey-model').value,
  };
  const res = await api('/api/admin/config/test-connection', { method: 'POST', body });
  if (res && res.success) toast(t('test_success'), 'success');
  else toast(res?.error || t('test_failed'), 'error');
}

function renderCapabilityMatrix(vendors) {
  const caps = ['text', 'vision', 'streaming', 'thinking', 'tools', 'file_upload', 'web_search'];
  const capKeys = { text: 'cap_text', vision: 'cap_vision', streaming: 'cap_streaming', thinking: 'cap_thinking', tools: 'cap_tools', file_upload: 'cap_file', web_search: 'cap_search' };

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
        <th class="text-left px-3 py-2 text-xs font-medium text-text-secondary">${t('apikey_cap_vendor')}</th>
        <th class="text-left px-3 py-2 text-xs font-medium text-text-secondary">${t('apikey_cap_model')}</th>
        ${caps.map(c => `<th class="text-center px-2 py-2 text-xs font-medium text-text-secondary">${t(capKeys[c])}</th>`).join('')}
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
      <h1 class="text-xl font-semibold tracking-tight">${t('ep_title')}</h1>
      <div class="flex gap-2">
        <button onclick="batchToggleAll(true)" class="px-3 py-1.5 rounded-md border border-border text-xs text-accent hover:bg-accent/10 transition-colors">${t('ep_all_on')}</button>
        <button onclick="batchToggleAll(false)" class="px-3 py-1.5 rounded-md border border-border text-xs text-text-secondary hover:bg-surface-hover transition-colors">${t('ep_all_off')}</button>
      </div>
    </div>
    <div class="space-y-4" id="endpoint-groups"></div>
  `;

  const container = document.getElementById('endpoint-groups');
  const groupNames = { auth: t('ep_group_auth'), chat: t('ep_group_chat'), admin: t('ep_group_admin') };

  Object.entries(groups).forEach(([key, group]) => {
    const div = document.createElement('div');
    div.className = 'bg-surface rounded-xl border border-border p-5';
    div.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-sm font-semibold">${groupNames[key] || key}</h2>
        <div class="flex items-center gap-1">
          <button onclick="batchToggleGroup('${key}', true)" class="px-2 py-0.5 rounded text-xs text-accent hover:bg-accent/10 transition-colors">${t('ep_on')}</button>
          <span class="text-border">|</span>
          <button onclick="batchToggleGroup('${key}', false)" class="px-2 py-0.5 rounded text-xs text-text-secondary hover:bg-surface-hover transition-colors">${t('ep_off')}</button>
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
  if (res && res.success) { toast(enabled ? t('ep_toggled_on') : t('ep_toggled_off'), 'success'); renderEndpoints(); }
}

async function batchToggleAll(enabled) {
  // Batch toggle all groups (auth, chat, admin)
  let allOk = true;
  for (const group of ['auth', 'chat', 'admin']) {
    const res = await api('/api/admin/endpoints/batch', { method: 'PUT', body: { group, enabled } });
    if (!res || !res.success) allOk = false;
  }
  if (allOk) { toast(enabled ? t('ep_toggled_on') : t('ep_toggled_off'), 'success'); renderEndpoints(); }
  else toast(t('save_failed'), 'error');
}

// ─── Settings ─────────────────────────────────────────────
async function renderSettings() {
  const res = await api('/api/admin/config');
  const configs = res?.configs || {};

  document.getElementById('page-container').innerHTML = `
    <h1 class="text-xl font-semibold tracking-tight mb-6">${t('settings_title')}</h1>
    <div class="bg-surface rounded-xl border border-border p-6 space-y-4">
      <label class="flex items-center justify-between py-2">
        <span class="text-sm">${t('settings_reg')}</span>
        <button id="set-reg" onclick="toggleSetting('open_registration', this)" class="relative w-9 h-5 rounded-full transition-colors ${configs.open_registration === 'true' ? 'bg-accent' : 'bg-border'}">
          <span class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${configs.open_registration === 'true' ? 'translate-x-4' : ''}"></span>
        </button>
      </label>
      <label class="flex items-center justify-between py-2">
        <span class="text-sm">${t('settings_admin_view')}</span>
        <button id="set-admin-view" onclick="toggleSetting('admin_can_view_content', this)" class="relative w-9 h-5 rounded-full transition-colors ${configs.admin_can_view_content === 'true' ? 'bg-accent' : 'bg-border'}">
          <span class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${configs.admin_can_view_content === 'true' ? 'translate-x-4' : ''}"></span>
        </button>
      </label>
      <div class="flex items-center justify-between py-2">
        <span class="text-sm">${t('settings_retention')}</span>
        <input id="set-retention" type="number" value="${configs.conversation_retention_days || '90'}" class="w-20 px-2 py-1 rounded-md border border-border bg-bg text-sm text-center focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
      </div>
      <button onclick="saveSettings()" class="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">${t('settings_save')}</button>
    </div>

    <div class="bg-surface rounded-xl border border-border p-6 mt-6">
      <h2 class="text-sm font-semibold mb-4 text-danger">${t('settings_danger')}</h2>
      <p class="text-xs text-text-secondary mb-4">${t('settings_reset_desc')}</p>
      <button onclick="resetSystem()" class="px-4 py-2 rounded-md bg-danger hover:bg-danger/90 text-white text-sm font-medium transition-colors">${t('settings_reset')}</button>
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
  if (res && res.success) toast(t('settings_saved'), 'success');
  else toast(res?.error || t('save_failed'), 'error');
}

async function resetSystem() {
  if (!confirm(t('settings_reset_confirm'))) return;
  const res = await api('/api/admin/reset', { method: 'POST', body: { scope: 'all', keep_admin: true } });
  if (res && res.success) toast(t('settings_reset_done'), 'success');
  else toast(res?.error || t('settings_reset_failed'), 'error');
}

// ─── Vendor Management ─────────────────────────────────────
async function renderVendors() {
  const container = document.getElementById('page-container');
  const res = await api('/api/admin/vendor-configs');
  const configs = res?.configs || [];
  const vendorsRes = await api('/api/admin/vendors');
  const allVendors = vendorsRes?.vendors || [];

  container.innerHTML = `
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold tracking-tight">${t('vendor_title')}</h1>
        <p class="text-xs text-text-secondary mt-1">${lang === 'zh' ? '管理 AI 厂商配置与模型优先级' : 'Manage AI vendor configurations and model priority'}</p>
      </div>
      <button onclick="showAddVendor()" class="px-3 py-1.5 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors flex items-center gap-1.5">
        <i data-lucide="plus" class="w-4 h-4"></i>${t('vendor_add')}
      </button>
    </div>
    <div id="vendor-list" class="space-y-3">
      ${configs.length === 0 ? `<div class="text-center text-text-secondary text-sm py-12">${lang === 'zh' ? '暂未配置厂商' : 'No vendors configured'}</div>` : ''}
    </div>
  `;
  lucide.createIcons();
  renderVendorList(configs, allVendors);
}

function renderVendorList(configs, allVendors) {
  const list = document.getElementById('vendor-list');
  list.innerHTML = configs.map((cfg, idx) => {
    const vendorInfo = allVendors.find(v => v.id === cfg.vendor_id);
    const models = cfg.model_priorities || [];
    const hasApiKey = cfg.api_key && cfg.api_key.trim() !== '';
    return `
      <div class="bg-surface rounded-xl border ${cfg.enabled ? 'border-border' : 'border-border opacity-60'} p-4 transition-all" id="vendor-card-${cfg.id}">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full ${cfg.enabled ? 'bg-success' : 'bg-border'}"></div>
            <div>
              <h3 class="text-sm font-semibold">${esc(cfg.display_name)}</h3>
              <p class="text-xs text-text-secondary">${cfg.vendor_id}${cfg.default_model ? ' · ' + esc(cfg.default_model) : ''}</p>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-xs text-text-secondary px-1.5">#${cfg.priority}</span>
            <button onclick="toggleVendor(${cfg.id}, ${!cfg.enabled})" class="px-2 py-1 rounded-md text-xs font-medium transition-colors ${cfg.enabled ? 'bg-success/10 text-success hover:bg-success/20' : 'bg-border/50 text-text-secondary hover:bg-border'}">
              ${cfg.enabled ? t('vendor_enable') : t('vendor_disable')}
            </button>
            <button onclick="editVendor(${cfg.id})" class="p-1.5 rounded-md hover:bg-sidebar-hover text-text-secondary hover:text-text transition-colors" title="${lang === 'zh' ? '编辑' : 'Edit'}">
              <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
            </button>
            ${cfg.vendor_id !== 'deepseek' ? `<button onclick="deleteVendor(${cfg.id}, '${esc(cfg.display_name)}')" class="p-1.5 rounded-md hover:bg-danger/10 text-text-secondary hover:text-danger transition-colors" title="${t('vendor_delete')}">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>` : ''}
          </div>
        </div>
        <!-- Model Priority -->
        <div class="bg-bg rounded-lg p-3 border border-border/50">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-text-secondary">${t('vendor_model_priority')}</span>
            <button onclick="editVendor(${cfg.id})" class="text-xs text-accent hover:underline">${lang === 'zh' ? '编辑' : 'Edit'}</button>
          </div>
          ${models.length === 0 ? `<div class="text-xs text-text-secondary py-2 text-center">${t('vendor_no_models')}</div>` :
            `<div class="flex flex-wrap gap-1.5">
              ${models.map((m, mi) => `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sidebar-hover text-xs ${mi === 0 ? 'ring-1 ring-accent/30 font-medium' : ''}">
                <span class="w-3.5 h-3.5 rounded-full bg-accent/10 text-accent text-[10px] flex items-center justify-center font-medium">${mi + 1}</span>
                ${esc(m.model)}
              </span>`).join('')}
            </div>`
          }
        </div>
        <!-- Status line -->
        <div class="flex items-center justify-between mt-2">
          <span class="text-xs text-text-secondary">${hasApiKey ? (cfg.api_key.substring(0,4) + '***') : (lang === 'zh' ? '未配置 API Key' : 'No API Key')}</span>
          <button onclick="testVendorConnection(${cfg.id})" class="text-xs text-accent hover:underline flex items-center gap-1" id="test-btn-${cfg.id}">
            <i data-lucide="zap" class="w-3 h-3"></i>${t('vendor_test_connection')}
          </button>
        </div>
      </div>
    `;
  }).join('');
  lucide.createIcons();
}

function showAddVendor() {
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/30 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-surface rounded-2xl border border-border p-6 w-full max-w-md shadow-2xl mx-4">
      <h2 class="text-lg font-semibold mb-4">${t('vendor_add')}</h2>
      <div class="space-y-3">
        <div>
          <label class="text-xs font-medium text-text-secondary">${t('vendor_display_name')}</label>
          <input id="new-display-name" class="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition" placeholder="My Vendor">
        </div>
        <div>
          <label class="text-xs font-medium text-text-secondary">Vendor ID</label>
          <input id="new-vendor-id" class="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition" placeholder="my-vendor">
        </div>
        <div>
          <label class="text-xs font-medium text-text-secondary">${t('vendor_api_key')}</label>
          <input id="new-api-key" type="password" class="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition" placeholder="sk-...">
        </div>
        <div>
          <label class="text-xs font-medium text-text-secondary">${t('vendor_base_url')}</label>
          <input id="new-base-url" class="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition" placeholder="https://api.example.com">
        </div>
        <div>
          <label class="text-xs font-medium text-text-secondary">${t('vendor_default_model')}</label>
          <input id="new-default-model" class="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition" placeholder="gpt-4o">
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-5">
        <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 rounded-md border border-border text-sm font-medium hover:bg-sidebar-hover transition-colors">${t('vendor_cancel')}</button>
        <button onclick="saveNewVendor()" class="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">${t('vendor_save')}</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

async function saveNewVendor() {
  const displayName = document.getElementById('new-display-name').value.trim();
  const vendorId = document.getElementById('new-vendor-id').value.trim();
  const apiKey = document.getElementById('new-api-key').value.trim();
  const baseUrl = document.getElementById('new-base-url').value.trim();
  const defaultModel = document.getElementById('new-default-model').value.trim();
  if (!displayName || !vendorId) { toast(lang === 'zh' ? '请填写显示名称和 Vendor ID' : 'Display name and Vendor ID required', 'error'); return; }
  const res = await api('/api/admin/vendor-configs', {
    method: 'POST',
    body: { vendor_id: vendorId, display_name: displayName, api_key: apiKey, base_url: baseUrl, default_model: defaultModel }
  });
  if (res && res.success) {
    document.querySelector('.fixed').remove();
    toast(lang === 'zh' ? '厂商已添加' : 'Vendor added', 'success');
    renderVendors();
  } else {
    toast(res?.error || t('save_failed'), 'error');
  }
}

async function editVendor(id) {
  const res = await api('/api/admin/vendor-configs');
  const cfg = res?.configs?.find(c => c.id === id);
  if (!cfg) return;
  const models = cfg.model_priorities || [];

  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/30 flex items-center justify-center z-50 overflow-y-auto py-8';
  modal.innerHTML = `
    <div class="bg-surface rounded-2xl border border-border p-6 w-full max-w-lg shadow-2xl mx-4">
      <h2 class="text-lg font-semibold mb-4">${lang === 'zh' ? '编辑' : 'Edit'} ${esc(cfg.display_name)}</h2>
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium text-text-secondary flex items-center gap-1.5">
            <input type="checkbox" id="edit-enabled" ${cfg.enabled ? 'checked' : ''} class="rounded">
            ${lang === 'zh' ? '启用' : 'Enabled'}
          </label>
        </div>
        <div>
          <label class="text-xs font-medium text-text-secondary">${t('vendor_display_name')}</label>
          <input id="edit-display-name" value="${esc(cfg.display_name)}" class="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        </div>
        <div>
          <label class="text-xs font-medium text-text-secondary">${t('vendor_api_key')}</label>
          <input id="edit-api-key" type="password" value="${esc(cfg.api_key || '')}" class="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition" placeholder="sk-...">
        </div>
        <div>
          <label class="text-xs font-medium text-text-secondary">${t('vendor_base_url')}</label>
          <input id="edit-base-url" value="${esc(cfg.base_url || '')}" class="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        </div>
        <div>
          <label class="text-xs font-medium text-text-secondary">${t('vendor_default_model')}</label>
          <input id="edit-default-model" value="${esc(cfg.default_model || '')}" class="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-bg text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition">
        </div>
        <div>
          <label class="text-xs font-medium text-text-secondary mb-2 block">${t('vendor_model_priority')} <span class="text-text-secondary/50">(${t('vendor_drag_hint')})</span></label>
          <div id="model-priority-list" class="space-y-1.5 max-h-64 overflow-y-auto">
            ${models.map((m, i) => `
              <div class="flex items-center gap-2 bg-bg border border-border rounded-lg px-3 py-2" draggable="true" data-index="${i}">
                <i data-lucide="grip-vertical" class="w-3.5 h-3.5 text-text-secondary/50 cursor-grab"></i>
                <span class="text-xs font-medium w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center">${i + 1}</span>
                <input value="${esc(m.model)}" class="flex-1 bg-transparent text-sm border-none focus:outline-none" data-model-input="${i}">
                <button onclick="this.closest('.flex').remove()" class="p-0.5 text-text-secondary/50 hover:text-danger transition-colors">
                  <i data-lucide="x" class="w-3 h-3"></i>
                </button>
              </div>
            `).join('')}
          </div>
          <button onclick="addModelRow()" class="mt-2 text-xs text-accent hover:underline flex items-center gap-1">
            <i data-lucide="plus" class="w-3 h-3"></i>${lang === 'zh' ? '添加模型' : 'Add Model'}
          </button>
        </div>
      </div>
      <div class="flex justify-end gap-2 mt-5">
        <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 rounded-md border border-border text-sm font-medium hover:bg-sidebar-hover transition-colors">${t('vendor_cancel')}</button>
        <button onclick="saveVendorEdit(${id})" class="px-4 py-2 rounded-md bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">${t('vendor_save')}</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  lucide.createIcons();
  // Drag & drop
  initModelDragDrop();
}

function initModelDragDrop() {
  const list = document.getElementById('model-priority-list');
  if (!list) return;
  let dragged = null;
  list.querySelectorAll('[draggable]').forEach(el => {
    el.addEventListener('dragstart', e => { dragged = el; el.classList.add('opacity-50'); });
    el.addEventListener('dragend', e => { el.classList.remove('opacity-50'); dragged = null; });
    el.addEventListener('dragover', e => { e.preventDefault(); });
    el.addEventListener('drop', e => {
      e.preventDefault();
      if (dragged && dragged !== el) {
        const items = [...list.children];
        const from = items.indexOf(dragged);
        const to = items.indexOf(el);
        if (from < to) list.insertBefore(dragged, el.nextSibling);
        else list.insertBefore(dragged, el);
        updateModelNumbers();
      }
    });
  });
}

function updateModelNumbers() {
  const list = document.getElementById('model-priority-list');
  if (!list) return;
  [...list.children].forEach((el, i) => {
    const span = el.querySelector('.rounded-full');
    if (span) span.textContent = i + 1;
  });
}

function addModelRow() {
  const list = document.getElementById('model-priority-list');
  if (!list) return;
  const div = document.createElement('div');
  div.className = 'flex items-center gap-2 bg-bg border border-border rounded-lg px-3 py-2';
  div.draggable = true;
  div.innerHTML = `
    <i data-lucide="grip-vertical" class="w-3.5 h-3.5 text-text-secondary/50 cursor-grab"></i>
    <span class="text-xs font-medium w-5 h-5 rounded-full bg-accent/10 text-accent flex items-center justify-center">${list.children.length + 1}</span>
    <input value="" class="flex-1 bg-transparent text-sm border-none focus:outline-none" placeholder="${lang === 'zh' ? '模型 ID' : 'Model ID'}">
    <button onclick="this.closest('.flex').remove();updateModelNumbers();" class="p-0.5 text-text-secondary/50 hover:text-danger transition-colors">
      <i data-lucide="x" class="w-3 h-3"></i>
    </button>
  `;
  list.appendChild(div);
  lucide.createIcons();
  initModelDragDrop();
}

async function saveVendorEdit(id) {
  const enabled = document.getElementById('edit-enabled').checked;
  const displayName = document.getElementById('edit-display-name').value.trim();
  const apiKey = document.getElementById('edit-api-key').value.trim();
  const baseUrl = document.getElementById('edit-base-url').value.trim();
  const defaultModel = document.getElementById('edit-default-model').value.trim();
  // Collect model priorities
  const modelInputs = document.querySelectorAll('#model-priority-list input[data-model-input]');
  const existingModels = [...modelInputs].map(inp => inp.value.trim()).filter(Boolean);
  // Also get any manually added model inputs
  const extraInputs = document.querySelectorAll('#model-priority-list input:not([data-model-input])');
  const extraModels = [...extraInputs].map(inp => inp.value.trim()).filter(Boolean);
  const allModels = [...existingModels, ...extraModels];
  const modelPriorities = allModels.map((m, i) => ({ model: m, priority: i + 1 }));

  const res = await api(`/api/admin/vendor-configs/${id}`, {
    method: 'PUT',
    body: { enabled, display_name: displayName, api_key: apiKey, base_url: baseUrl, default_model: defaultModel, model_priorities: modelPriorities }
  });
  if (res && res.success) {
    document.querySelector('.fixed').remove();
    toast(t('saved'), 'success');
    renderVendors();
  } else {
    toast(res?.error || t('save_failed'), 'error');
  }
}

async function toggleVendor(id, enabled) {
  const res = await api(`/api/admin/vendor-configs/${id}`, { method: 'PUT', body: { enabled } });
  if (res && res.success) {
    toast(enabled ? t('enabled') : t('disabled'), 'success');
    renderVendors();
  } else {
    toast(res?.error || t('save_failed'), 'error');
  }
}

async function deleteVendor(id, name) {
  if (!confirm(t('vendor_delete_confirm') + ` (${name})`)) return;
  const res = await api(`/api/admin/vendor-configs/${id}`, { method: 'DELETE' });
  if (res && res.success) { toast(t('deleted'), 'success'); renderVendors(); }
  else toast(res?.error || t('save_failed'), 'error');
}

async function testVendorConnection(id) {
  const btn = document.getElementById(`test-btn-${id}`);
  if (!btn) return;
  btn.innerHTML = `<i data-lucide="loader" class="w-3 h-3 animate-spin"></i>${t('vendor_testing')}`;
  lucide.createIcons();
  const res = await api(`/api/admin/config/test-connection`, { method: 'POST', body: { vendor_config_id: id } });
  if (res && res.success) {
    toast(t('vendor_test_success'), 'success');
  } else {
    toast((res?.error || t('vendor_test_failed')), 'error');
  }
  renderVendors();
}

// ─── Helpers ──────────────────────────────────────────────
function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function fmtDate(d) { if (!d) return '-'; return new Date(d).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }); }

// ─── Init ─────────────────────────────────────────────────
checkAuth();
