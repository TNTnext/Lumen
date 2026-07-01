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
    settings_theme: '界面主题', settings_theme_light: '浅色', settings_theme_dark: '深色', settings_theme_system: '跟随系统',
    settings_reset_done: '系统已重置', settings_reset_failed: '重置失败',
    onboarding_welcome: '欢迎使用 Lumen', onboarding_subtitle: '首次使用，请完成以下初始配置',
    onboarding_skip: '跳过初始化',
    onboarding_step1: '管理员账户', onboarding_new_pw: '新密码', onboarding_pw_hint: '留空则不修改',
    onboarding_email: '邮箱', onboarding_step2: 'AI 模型厂商',
    onboarding_step3: '全局默认权限', onboarding_step4: '系统设置',
    onboarding_step5: '接口开关', onboarding_reg_open: '开放注册',
    onboarding_admin_view: '管理员可查看对话内容', onboarding_retention: '对话保留天数',
    onboarding_ep_auth: '认证接口', onboarding_ep_chat: '对话接口',
    onboarding_step6: '数据库配置', onboarding_db_type: '数据库类型', onboarding_db_host: '主机',
    onboarding_db_port: '端口', onboarding_db_name: '库名', onboarding_db_user: '用户名',
    onboarding_db_pass: '密码', onboarding_db_note: 'SQLite 无需额外配置，PostgreSQL/MySQL 需填写连接信息',
    onboarding_submit: '完成配置，进入管理后台',
    onboarding_done: '配置完成', onboarding_failed: '配置失败',
    need_admin: '需要管理员权限',
    // Vendor management
    nav_vendors: '厂商与密钥', nav_model_priority: '模型优先级', nav_plugins: '插件管理',
    vendor_title: '厂商与密钥',
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
    // Theme
    nav_themes: '主题', theme_create: '新建主题',
    theme_name: '主题名称', theme_name_placeholder: '输入主题名称...',
    theme_colors: '配色方案', theme_fonts: '字体设置',
    theme_radius: '圆角大小', theme_preview: '预览',
    theme_activate: '激活', theme_delete: '删除',
    theme_no_themes: '还没有自定义主题',
    theme_create_first: '创建你的第一个主题',
    theme_confirm_delete: '确定要删除此主题吗？',
    theme_cannot_delete_active: '不能删除当前激活的主题',
    theme_activated: '主题已激活',
    theme_saved: '主题已保存', theme_deleted: '主题已删除',
    theme_bg: '页面背景', theme_surface: '卡片背景',
    theme_surface_hover: '卡片悬停', theme_card: '卡片底色', theme_muted: '输入框背景', theme_border: '边框',
    theme_text: '主文字', theme_text_secondary: '次要文字',
    theme_text_tertiary: '辅助文字', theme_accent: '强调色',
    theme_accent_hover: '强调悬停', theme_danger: '危险色',
    theme_success: '成功色', theme_font_heading: '标题字体',
    theme_font_body: '正文字体', theme_font_mono: '等宽字体',
    theme_default: '默认主题', theme_light_colors: '浅色模式颜色',
	    theme_dark_colors: '深色模式颜色', theme_shadows: '阴影',
	    theme_custom_css: '自定义 CSS', theme_custom_css_hint: '输入自定义 CSS 覆盖样式',
	    theme_set_active: '保存后立即激活', theme_light: '浅色', theme_dark: '深色',
	    theme_warning: '警告色', theme_sidebar: '侧边栏背景', theme_sidebar_hover: '侧边栏悬停',
	    theme_sidebar_active: '侧边栏激活', theme_confirm_delete: '确认删除主题',
	    theme_create_first: '还没有主题，点击右上角创建第一个主题',
	    theme_cannot_delete_active: '无法删除已激活的主题',
    nav_plugins: '插件管理',
    plugin_title: '插件管理', plugin_enable: '启用', plugin_disable: '禁用',
    plugin_enabled: '已启用', plugin_disabled: '已禁用', plugin_desc: '热插拔插件系统，支持优先级和工具扩展',
    plugin_reload: '热重载', plugin_no_plugins: '暂无插件',
    plugin_config: '插件配置', plugin_save_config: '保存配置', plugin_none: '暂无安装插件',
    loading: '加载中...',
    nav_database: '数据库', db_title: '数据库配置', db_type: '数据库类型',
    db_host: '主机', db_port: '端口', db_name: '数据库名',
    db_user: '用户名', db_password: '密码', db_test: '测试连接',
    db_testing: '测试中...', db_connected: '连接成功', db_failed: '连接失败',
    db_save: '保存配置', db_saved: '配置已保存', db_restart_note: '修改数据库配置后需要重启服务生效',
    db_type_sqlite: 'SQLite', db_type_postgres: 'PostgreSQL', db_type_mysql: 'MySQL',
    db_current: '当前数据库',
    plugin_priority_hint: '拖拽调整插件优先级',
    plugin_type_builtin: '内置', plugin_type_custom: '自定义',
    plugin_desc_calculator: '数学计算器，支持表达式求值与单位换算',
    plugin_desc_websearch: '联网搜索，实时获取最新信息',
    plugin_desc_translator: '多语言翻译，支持中英日韩法等主流语言',
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
    settings_theme: 'Theme', settings_theme_light: 'Light', settings_theme_dark: 'Dark', settings_theme_system: 'System',
    onboarding_welcome: 'Welcome to Lumen', onboarding_subtitle: 'Please complete the initial setup',
    onboarding_skip: 'Skip Setup',
    onboarding_step1: 'Admin Account', onboarding_new_pw: 'New Password', onboarding_pw_hint: 'Leave empty to keep current',
    onboarding_email: 'Email', onboarding_step2: 'AI Provider',
    onboarding_step3: 'Global Default Permissions', onboarding_step4: 'System Settings',
    onboarding_step5: 'Endpoint Toggles', onboarding_reg_open: 'Open Registration',
    onboarding_admin_view: 'Admin Can View Content', onboarding_retention: 'Retention Days',
    onboarding_ep_auth: 'Auth Endpoints', onboarding_ep_chat: 'Chat Endpoints',
    onboarding_step6: 'Database', onboarding_db_type: 'Database Type', onboarding_db_host: 'Host',
    onboarding_db_port: 'Port', onboarding_db_name: 'Name', onboarding_db_user: 'Username',
    onboarding_db_pass: 'Password', onboarding_db_note: 'SQLite needs no config; PostgreSQL/MySQL require connection info',
    onboarding_submit: 'Complete Setup & Enter Admin',
    onboarding_done: 'Setup complete', onboarding_failed: 'Setup failed',
    need_admin: 'Admin privileges required',
    // Vendor management
    nav_vendors: 'Vendors', nav_model_priority: 'Model Priority', vendor_title: 'Vendor Management',
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
    // Theme
    nav_themes: 'Themes', theme_create: 'New Theme',
    theme_name: 'Theme Name', theme_name_placeholder: 'Enter theme name...',
    theme_colors: 'Color Scheme', theme_fonts: 'Font Settings',
    theme_radius: 'Border Radius', theme_preview: 'Preview',
    theme_activate: 'Activate', theme_delete: 'Delete',
    theme_no_themes: 'No custom themes yet',
    theme_create_first: 'Create your first theme',
    theme_confirm_delete: 'Are you sure you want to delete this theme?',
    theme_cannot_delete_active: 'Cannot delete the active theme',
    theme_activated: 'Theme activated', theme_saved: 'Theme saved',
    theme_deleted: 'Theme deleted',
    theme_bg: 'Page Background', theme_surface: 'Card Background',
    theme_surface_hover: 'Card Hover', theme_card: 'Card Base', theme_muted: 'Input BG', theme_border: 'Border',
    theme_text: 'Primary Text', theme_text_secondary: 'Secondary Text',
    theme_text_tertiary: 'Tertiary Text', theme_accent: 'Accent',
    theme_accent_hover: 'Accent Hover', theme_danger: 'Danger',
    theme_success: 'Success', theme_font_heading: 'Heading Font',
    theme_font_body: 'Body Font', theme_font_mono: 'Mono Font',
    theme_default: 'Default Theme', theme_light_colors: 'Light Colors',
	    theme_dark_colors: 'Dark Colors', theme_shadows: 'Shadows',
	    theme_custom_css: 'Custom CSS', theme_custom_css_hint: 'Enter custom CSS to override styles',
	    theme_set_active: 'Activate after save', theme_light: 'Light', theme_dark: 'Dark',
	    theme_warning: 'Warning', theme_sidebar: 'Sidebar BG', theme_sidebar_hover: 'Sidebar Hover',
	    theme_sidebar_active: 'Sidebar Active', theme_confirm_delete: 'Confirm delete theme',
	    theme_create_first: 'No themes yet, click button above to create',
	    theme_cannot_delete_active: 'Cannot delete active theme',
    nav_plugins: 'Plugins', plugin_title: 'Plugin Management', plugin_enable: 'Enable',
    plugin_disable: 'Disable', plugin_enabled: 'Enabled', plugin_disabled: 'Disabled',
    plugin_desc: 'Hot-pluggable plugin system with priority and tool extensions',
    plugin_reload: 'Hot Reload', plugin_no_plugins: 'No plugins installed',
    plugin_config: 'Plugin Config', plugin_save_config: 'Save Config', plugin_none: 'No plugins installed',
    loading: 'Loading...',
    plugin_priority_hint: 'Drag to reorder plugin priority',
    plugin_type_builtin: 'Built-in', plugin_type_custom: 'Custom',
    plugin_desc_calculator: 'Math calculator with expression evaluation and unit conversion',
    plugin_desc_websearch: 'Web search for real-time information',
    plugin_desc_translator: 'Multi-language translation supporting Chinese, English, Japanese, Korean, French',
    nav_database: 'Database', db_title: 'Database Configuration', db_type: 'Database Type',
    db_host: 'Host', db_port: 'Port', db_name: 'Database Name',
    db_user: 'Username', db_password: 'Password', db_test: 'Test Connection',
    db_testing: 'Testing...', db_connected: 'Connected', db_failed: 'Failed',
    db_save: 'Save Configuration', db_saved: 'Configuration Saved', db_restart_note: 'Restart required after changing database settings',
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
      <input id="onb-baseurl-${idx}" type="text" value="${escapeAttr(baseUrl)}" class="px-3 py-2 rounded-xl border border-border/60 bg-bg text-sm font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent placeholder:text-text-tertiary/50" placeholder="Base URL">
      <select id="onb-model-${idx}" class="px-3 py-2 rounded-xl border border-border/60 bg-bg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent"></select>
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
function getTheme() { return localStorage.getItem('lumen_theme') || 'light'; }
function changeTheme(theme) {
  localStorage.setItem('lumen_theme', theme);
  applyTheme();
}
function applyTheme() {
  const theme = getTheme();
  if (theme === 'system') {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}

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
  { id: 'model-priority', labelKey: 'nav_model_priority', icon: 'layers' },
  { id: 'plugins', labelKey: 'nav_plugins', icon: 'puzzle' },
  { id: 'endpoints', labelKey: 'nav_endpoints', icon: 'toggle-right' },
  { id: 'themes', labelKey: 'nav_themes', icon: 'palette' },
  { id: 'database', labelKey: 'nav_database', icon: 'database' },
  { id: 'settings', labelKey: 'nav_settings', icon: 'settings' },
];

function renderNav() {
  const nav = document.getElementById('sidebar-nav');
  nav.innerHTML = navItems.map(item => `
    <button onclick="navigate('${item.id}')" data-nav="${item.id}"
      class="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] nav-item
      ${state.page === item.id ? 'active' : 'text-text-secondary'}">
      <i data-lucide="${item.icon}" class="w-4 h-4"></i>
      <span>${t(item.labelKey)}</span>
    </button>
  `).join('');
  const logoutBtn = document.querySelector('#sidebar button[onclick="doLogout()"] span');
  if (logoutBtn) logoutBtn.textContent = t('logout');
  lucide.createIcons();
  // Inject plugin custom pages into nav
  loadPluginPages();
}

async function loadPluginPages() {
  try {
    const res = await api('/api/admin/plugins/pages');
    if (!res || !res.pages) return;
    const nav = document.getElementById('sidebar-nav');
    res.pages.forEach(p => {
      const id = 'plugin-page-' + p.plugin_name + '-' + p.page_id;
      const btn = document.createElement('button');
      btn.onclick = () => navigatePluginPage(p.plugin_name, p.page_id, p.js_handler);
      btn.setAttribute('data-nav', id);
      btn.className = 'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] nav-item ' + (state.page === id ? 'active' : 'text-text-secondary');
      btn.innerHTML = '<i data-lucide="' + esc(p.icon) + '" class="w-4 h-4"></i><span>' + esc(p.title) + '</span>';
      nav.appendChild(btn);
    });
    lucide.createIcons();
  } catch (e) { /* plugin pages optional */ }
}

async function navigatePluginPage(pluginName, pageId, jsHandler) {
  const id = 'plugin-page-' + pluginName + '-' + pageId;
  state.page = id;
  renderNav();
  const container = document.getElementById('page-container');
  container.style.opacity = '0';
  container.innerHTML = '<div class="text-center py-12 text-text-tertiary text-sm"><div class="animate-spin w-5 h-5 border-2 border-accent border-t-transparent rounded-full mx-auto mb-3"></div>' + t('loading') + '</div>';
  requestAnimationFrame(async () => {
    try {
      const res = await api('/api/admin/plugins/page/' + encodeURIComponent(pluginName) + '/' + encodeURIComponent(pageId));
      container.innerHTML = typeof res === 'string' ? res : (res.html || res.content || '<p class="text-text-tertiary">Empty page</p>');
      enhanceContainer(container);
      if (jsHandler && typeof window[jsHandler] === 'function') {
        setTimeout(() => window[jsHandler](container, pluginName, pageId), 100);
      }
    } catch (e) {
      container.innerHTML = '<div class="text-center py-12 text-danger text-sm">Failed to load plugin page</div>';
    }
    container.style.opacity = '1';
  });
}

async function navigate(page) {
  if (page === 'api-keys') page = 'vendors';
  // Handle plugin custom pages
  if (page.startsWith('plugin-page-')) {
    const parts = page.replace('plugin-page-', '').split('-');
    const pluginName = parts[0];
    const pageId = parts.slice(1).join('-');
    await navigatePluginPage(pluginName, pageId, null);
    return;
  }
  state.page = page;
  renderNav();
  const container = document.getElementById('page-container');
  container.style.opacity = '0';
  container.innerHTML = '';
  const fn = window['render' + page.charAt(0).toUpperCase() + page.slice(1).replace(/-./g, x => x[1].toUpperCase())];
  if (fn) await fn();
  // Auto-enhance all pages with animations
  requestAnimationFrame(() => {
    // Cards: lift on hover
    container.querySelectorAll('.bg-surface.rounded-2xl, .bg-surface.rounded-xl').forEach((el, i) => {
      el.classList.add('card-lift');
      el.style.setProperty('--i', i);
      el.style.animation = 'fadeInUp 0.4s var(--ease-out) both';
      el.style.animationDelay = (i * 50) + 'ms';
    });
    // Table rows: smooth hover
    container.querySelectorAll('tbody tr').forEach(el => el.classList.add('table-row'));
    // Fade in page
    container.style.transition = 'opacity 0.25s ease-out';
    container.style.opacity = '1';
  });
  closeSidebar();
  container.scrollTop = 0;
}

// ─── Onboarding ───────────────────────────────────────────
async function renderOnboarding() {
  document.getElementById('sidebar-nav').innerHTML = '';
  const container = document.getElementById('page-container');
  const vendorsRes = await api('/api/admin/vendors');
  const vendors = vendorsRes?.vendors || [];

  container.innerHTML = `
    <div class="max-w-2xl mx-auto relative">
      <div class="text-center mb-10">
        <h1 class="text-2xl font-semibold tracking-tight mb-2">${t('onboarding_welcome')}</h1>
        <p class="text-text-secondary text-sm">${t('onboarding_subtitle')}</p>
      </div>
      <button onclick="skipOnboarding()" class="absolute top-0 right-0 text-xs text-text-tertiary/25 hover:text-text-tertiary/50 transition-colors duration-300" style="background:none;border:none;cursor:pointer;padding:0;">${t('onboarding_skip')}</button>
      <div class="space-y-6">
        <!-- Step 1: Admin Account -->
        <div class="bg-surface rounded-2xl border border-border/50 p-6 card-lift stagger-1">
          <h2 class="text-[11px] font-semibold text-text-tertiary uppercase tracking-widest mb-5">${t('onboarding_step1')}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label class="block text-[11px] font-medium text-text-secondary mb-1.5 uppercase tracking-wide">${t('onboarding_new_pw')}</label>
              <input id="onb-password" type="password" class="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent placeholder:text-text-tertiary/50" placeholder="${t('onboarding_pw_hint')}">
            </div>
            <div>
              <label class="block text-[11px] font-medium text-text-secondary mb-1.5 uppercase tracking-wide">${t('onboarding_email')}</label>
              <input id="onb-email" type="email" class="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent placeholder:text-text-tertiary/50" placeholder="admin@example.com">
            </div>
          </div>
        </div>

        <!-- Step 2: AI Providers -->
        <div class="bg-surface rounded-2xl border border-border/50 p-6 card-lift stagger-2">
          <h2 class="text-[11px] font-semibold text-text-tertiary uppercase tracking-widest mb-5">${t('onboarding_step2')}</h2>
          <div id="onb-vendors-container" class="space-y-4">
          </div>
          <button onclick="addOnboardingVendor()" class="mt-3 text-xs text-accent hover:text-accent-hover transition-colors flex items-center gap-1" style="background:none;border:none;cursor:pointer;padding:0;">
            <i data-lucide="plus" class="w-3.5 h-3.5"></i> ${lang === 'zh' ? '添加厂商' : 'Add Provider'}
          </button>
        </div>

        <!-- Step 3: Permissions -->
        <div class="bg-surface rounded-2xl border border-border/50 p-6 card-lift stagger-3">
          <h2 class="text-[11px] font-semibold text-text-tertiary uppercase tracking-widest mb-5">${t('onboarding_step3')}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label class="block text-[11px] font-medium text-text-secondary mb-1.5 uppercase tracking-wide">${t('perm_daily_chats')}</label>
              <input id="onb-max-chats" type="number" value="100" class="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent">
            </div>
            <div>
              <label class="block text-[11px] font-medium text-text-secondary mb-1.5 uppercase tracking-wide">${t('perm_max_tokens')}</label>
              <input id="onb-max-tokens" type="number" value="4096" class="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent">
            </div>
            <div>
              <label class="block text-[11px] font-medium text-text-secondary mb-1.5 uppercase tracking-wide">${t('perm_rate_limit')}</label>
              <input id="onb-rate-limit" type="number" value="10" class="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent">
            </div>
          </div>
        </div>

        <!-- Step 4: System Settings -->
        <div class="bg-surface rounded-2xl border border-border/50 p-6 card-lift stagger-4">
          <h2 class="text-[11px] font-semibold text-text-tertiary uppercase tracking-widest mb-5">${t('onboarding_step4')}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/60 bg-bg cursor-pointer hover:bg-surface-hover transition-all duration-200">
              <input id="onb-reg-open" type="checkbox" checked class="apple-switch">
              <span class="text-sm">${t('onboarding_reg_open')}</span>
            </label>
            <label class="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/60 bg-bg cursor-pointer hover:bg-surface-hover transition-all duration-200">
              <input id="onb-admin-view" type="checkbox" class="apple-switch">
              <span class="text-sm">${t('onboarding_admin_view')}</span>
            </label>
            <div class="sm:col-span-2">
              <label class="block text-[11px] font-medium text-text-secondary mb-1.5 uppercase tracking-wide">${t('onboarding_retention')}</label>
              <input id="onb-retention" type="number" value="90" class="w-full px-4 py-2.5 rounded-xl border border-border/60 bg-bg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent">
            </div>
          </div>
        </div>

        <!-- Step 5: Endpoint Toggles -->
        <div class="bg-surface rounded-2xl border border-border/50 p-6 card-lift stagger-5">
          <h2 class="text-[11px] font-semibold text-text-tertiary uppercase tracking-widest mb-5">${t('onboarding_step5')}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label class="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/60 bg-bg cursor-pointer hover:bg-surface-hover transition-all duration-200">
              <input id="onb-ep-auth" type="checkbox" checked class="apple-switch">
              <span class="text-sm">${t('onboarding_ep_auth')}</span>
            </label>
            <label class="flex items-center gap-3 px-4 py-3 rounded-xl border border-border/60 bg-bg cursor-pointer hover:bg-surface-hover transition-all duration-200">
              <input id="onb-ep-chat" type="checkbox" checked class="apple-switch">
              <span class="text-sm">${t('onboarding_ep_chat')}</span>
            </label>
          </div>
        </div>

        <!-- Step 6: Database Config -->
        <div class="bg-surface rounded-2xl border border-border/50 p-6 card-lift stagger-6">
          <h2 class="text-[11px] font-semibold text-text-tertiary uppercase tracking-widest mb-3">${t('onboarding_step6')}</h2>
          <p class="text-xs text-text-tertiary mb-4">${t('onboarding_db_note')}</p>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[10px] font-medium text-text-secondary mb-1">${t('onboarding_db_type')}</label>
              <select id="onb-db-type" class="w-full px-3 py-2 rounded-lg border border-border/60 bg-bg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/20">
                <option value="sqlite">SQLite</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
              </select>
            </div>
            <div id="onb-db-host-div" style="display:none">
              <label class="block text-[10px] font-medium text-text-secondary mb-1">${t('onboarding_db_host')}</label>
              <input id="onb-db-host" class="w-full px-3 py-2 rounded-lg border border-border/60 bg-bg text-sm" placeholder="localhost">
            </div>
            <div id="onb-db-port-div" style="display:none">
              <label class="block text-[10px] font-medium text-text-secondary mb-1">${t('onboarding_db_port')}</label>
              <input id="onb-db-port" class="w-full px-3 py-2 rounded-lg border border-border/60 bg-bg text-sm" placeholder="5432">
            </div>
            <div>
              <label class="block text-[10px] font-medium text-text-secondary mb-1">${t('onboarding_db_name')}</label>
              <input id="onb-db-name" class="w-full px-3 py-2 rounded-lg border border-border/60 bg-bg text-sm" placeholder="lumen">
            </div>
            <div id="onb-db-user-div" style="display:none">
              <label class="block text-[10px] font-medium text-text-secondary mb-1">${t('onboarding_db_user')}</label>
              <input id="onb-db-user" class="w-full px-3 py-2 rounded-lg border border-border/60 bg-bg text-sm" placeholder="lumen">
            </div>
            <div id="onb-db-pass-div" style="display:none">
              <label class="block text-[10px] font-medium text-text-secondary mb-1">${t('onboarding_db_pass')}</label>
              <input id="onb-db-password" type="password" class="w-full px-3 py-2 rounded-lg border border-border/60 bg-bg text-sm" placeholder="">
            </div>
          </div>
        </div>

        <button onclick="submitOnboarding()" class="w-full py-3 rounded-2xl bg-text text-white text-sm font-semibold transition-all duration-300 hover:opacity-90 active:scale-[0.98]">
          ${t('onboarding_submit')}
        </button>
      </div>
    </div>
  `;

  window._onbVendors = vendors;
  addOnboardingVendor('deepseek', '', '', 'deepseek-chat');
  // Database type toggle
  const onbDbType = document.getElementById('onb-db-type');
  if (onbDbType) {
    onbDbType.addEventListener('change', function() {
      const isSQLite = this.value === 'sqlite';
      ['onb-db-host-div', 'onb-db-port-div', 'onb-db-user-div', 'onb-db-pass-div'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = isSQLite ? 'none' : '';
      });
      const portEl = document.getElementById('onb-db-port');
      if (this.value === 'postgresql') portEl.value = '5432';
      if (this.value === 'mysql') portEl.value = '3306';
    });
  }
  // Auto-enhance: card animations
  requestAnimationFrame(() => {
    container.querySelectorAll('.bg-surface.rounded-2xl, .bg-surface.rounded-xl').forEach((el, i) => {
      el.classList.add('card-lift');
      el.style.animation = 'fadeInUp 0.4s var(--ease-out) both';
      el.style.animationDelay = (i * 50) + 'ms';
    });
    container.querySelectorAll('tbody tr').forEach(el => el.classList.add('table-row'));
  });
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
    database: {
      db_type: document.getElementById('onb-db-type')?.value || 'sqlite',
      db_host: document.getElementById('onb-db-host')?.value || '',
      db_port: document.getElementById('onb-db-port')?.value || '',
      db_name: document.getElementById('onb-db-name')?.value || '',
      db_user: document.getElementById('onb-db-user')?.value || '',
      db_password: document.getElementById('onb-db-password')?.value || '',
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
    <div class="stagger">
    <h1 class="text-[22px] font-semibold tracking-tight mb-6">${t('dashboard_title')}</h1>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      ${statCard(t('total_users'), s.total_users, 'users')}
      ${statCard(t('active_today'), s.active_today, 'user-check')}
      ${statCard(t('total_convs'), s.total_conversations, 'message-square')}
      ${statCard(t('today_calls'), s.today_api_calls, 'zap')}
      ${statCard(t('today_tokens'), s.today_tokens, 'hash')}
      ${statCard(t('month_tokens'), s.month_tokens, 'bar-chart-2')}
      ${statCard(t('new_users_week'), s.new_users_week, 'user-plus')}
      ${statCard(t('admin_count'), s.admin_count, 'shield')}
    </div>

    <div class="bg-surface rounded-2xl border border-border/50 p-5 lg:p-6 mb-6 card-lift">
      <h2 class="text-[13px] font-medium text-text-secondary mb-5">${t('trend_7d')}</h2>
      <div class="h-48 flex items-end gap-1.5" id="daily-trend-chart"></div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-surface rounded-2xl border border-border/50 p-5 lg:p-6 card-lift">
        <h2 class="text-[13px] font-medium text-text-secondary mb-5">${t('model_dist')}</h2>
        <div class="space-y-3" id="model-dist"></div>
      </div>
      <div class="bg-surface rounded-2xl border border-border/50 p-5 lg:p-6 card-lift">
        <h2 class="text-[13px] font-medium text-text-secondary mb-5">${t('user_ranking')}</h2>
        <div class="space-y-3" id="user-ranking"></div>
      </div>
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
    <div class="bg-surface rounded-2xl border border-border/50 p-4 card-lift">
      <div class="flex items-center gap-2 mb-2">
        <i data-lucide="${icon}" class="w-4 h-4 text-text-tertiary"></i>
        <span class="text-[11px] text-text-secondary font-medium tracking-wide uppercase">${label}</span>
      </div>
      <div class="text-[28px] font-semibold tracking-tight leading-none">${(value ?? 0).toLocaleString()}</div>
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
        <label class="flex items-center gap-2 text-sm"><input id="gp-export" type="checkbox" ${gp.allow_export ? 'checked' : ''} class="apple-switch"> ${t('perm_allow_export')}</label>
        <label class="flex items-center gap-2 text-sm"><input id="gp-upload" type="checkbox" ${gp.allow_file_upload ? 'checked' : ''} class="apple-switch"> ${t('perm_allow_upload')}</label>
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
        <input id="up-custom" type="checkbox" ${up.use_custom ? 'checked' : ''} class="apple-switch" onchange="document.getElementById('up-fields').style.display=this.checked?'block':'none'">
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
        <button onclick="batchToggleAll(true)" class="btn-press px-3 py-1.5 rounded-md border border-border text-xs text-accent hover:bg-accent/10 transition-all duration-200 active:scale-95">${t('ep_all_on')}</button>
        <button onclick="batchToggleAll(false)" class="btn-press px-3 py-1.5 rounded-md border border-border text-xs text-text-secondary hover:bg-surface-hover transition-all duration-200 active:scale-95">${t('ep_all_off')}</button>
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
          <button onclick="batchToggleGroup('${key}', true)" class="btn-press px-2 py-0.5 rounded text-xs text-accent hover:bg-accent/10 transition-all duration-200 active:scale-95">${t('ep_on')}</button>
          <span class="text-border">|</span>
          <button onclick="batchToggleGroup('${key}', false)" class="btn-press px-2 py-0.5 rounded text-xs text-text-secondary hover:bg-surface-hover transition-all duration-200 active:scale-95">${t('ep_off')}</button>
        </div>
      </div>
      <div class="space-y-1">
        ${group.endpoints.map(ep => `
          <div class="flex items-center justify-between py-2 px-3 rounded-md hover:bg-surface-hover transition-colors">
            <div>
              <span class="text-sm font-mono text-xs text-text-secondary mr-3">${ep.endpoint}</span>
              <span class="text-xs text-text-tertiary">${ep.description}</span>
            </div>
            <button data-ep-id="${ep.id}" data-ep-group="${key}" onclick="toggleEndpoint(${ep.id}, ${!ep.enabled})" class="relative w-9 h-5 rounded-full transition-all duration-200 active:scale-95 ${ep.enabled ? 'bg-accent' : 'bg-border'}">
              <span class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${ep.enabled ? 'translate-x-4' : ''}"></span>
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
  if (!res || !res.success) return;
  // In-place DOM update — preserves CSS transitions
  const btn = document.querySelector(`[data-ep-id="${id}"]`);
  if (!btn) return;
  // Animate the background
  btn.classList.toggle('bg-accent', enabled);
  btn.classList.toggle('bg-border', !enabled);
  // Update onclick to toggle to opposite state
  btn.setAttribute('onclick', `toggleEndpoint(${id}, ${!enabled})`);
  // Animate the dot
  const dot = btn.querySelector('span');
  if (dot) {
    dot.classList.toggle('translate-x-4', enabled);
  }
}

async function batchToggleGroup(group, enabled) {
  const res = await api('/api/admin/endpoints/batch', { method: 'PUT', body: { group, enabled } });
  if (!res || !res.success) return;
  toast(enabled ? t('ep_toggled_on') : t('ep_toggled_off'), 'success');
  // In-place DOM update for toggles in this group only
  document.querySelectorAll(`[data-ep-group="${group}"]`).forEach(btn => {
    const id = parseInt(btn.getAttribute('data-ep-id'));
    if (!isNaN(id)) {
      btn.classList.toggle('bg-accent', enabled);
      btn.classList.toggle('bg-border', !enabled);
      btn.setAttribute('onclick', `toggleEndpoint(${id}, ${!enabled})`);
      const dot = btn.querySelector('span');
      if (dot) dot.classList.toggle('translate-x-4', enabled);
    }
  });
}

async function batchToggleAll(enabled) {
  let allOk = true;
  for (const group of ['auth', 'chat', 'admin']) {
    const res = await api('/api/admin/endpoints/batch', { method: 'PUT', body: { group, enabled } });
    if (!res || !res.success) allOk = false;
  }
  if (!allOk) { toast(t('save_failed'), 'error'); return; }
  toast(enabled ? t('ep_toggled_on') : t('ep_toggled_off'), 'success');
  // In-place DOM update for ALL toggles
  document.querySelectorAll(`[data-ep-id]`).forEach(btn => {
    const id = parseInt(btn.getAttribute('data-ep-id'));
    if (!isNaN(id)) {
      btn.classList.toggle('bg-accent', enabled);
      btn.classList.toggle('bg-border', !enabled);
      btn.setAttribute('onclick', `toggleEndpoint(${id}, ${!enabled})`);
      const dot = btn.querySelector('span');
      if (dot) dot.classList.toggle('translate-x-4', enabled);
    }
  });
}

// ─── Settings ─────────────────────────────────────────────
async function renderSettings() {
  const res = await api('/api/admin/config');
  const configs = res?.configs || {};

  document.getElementById('page-container').innerHTML = `
    <h1 class="text-xl font-semibold tracking-tight mb-6">${t('settings_title')}</h1>
    <div class="bg-surface rounded-xl border border-border p-6 space-y-4">
      <div class="flex items-center justify-between py-2">
        <span class="text-sm font-medium">${t('settings_theme')}</span>
        <select id="set-theme" onchange="changeTheme(this.value)" class="px-3 py-1.5 rounded-lg bg-muted border border-border text-sm input-apple focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all">
          <option value="light" ${getTheme() === 'light' ? 'selected' : ''}>${t('settings_theme_light')}</option>
          <option value="dark" ${getTheme() === 'dark' ? 'selected' : ''}>${t('settings_theme_dark')}</option>
          <option value="system" ${getTheme() === 'system' ? 'selected' : ''}>${t('settings_theme_system')}</option>
        </select>
      </div>
      <hr class="border-border" />
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

        <!-- API Key + Base URL -->
        <div class="flex items-center justify-between mt-2">
          <span class="text-xs text-text-secondary flex items-center gap-3">
            <span>${hasApiKey ? (cfg.api_key.substring(0,4) + '***') : (lang === 'zh' ? '未配置 API Key' : 'No API Key')}</span>
            ${cfg.base_url ? '<span class="text-text-secondary/60 font-mono text-[10px] truncate max-w-[180px]">' + esc(cfg.base_url) + '</span>' : ''}
          </span>
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

// ─── 跨厂商模型优先级 ──────────────────────────────────────
async function renderModelPriority(container) {
  container = container || document.getElementById('page-container');
  const res = await api('/api/admin/model-priority-order');
  const saved = (res && res.order) ? res.order : [];
  // Filter by enabled vendors
  const cfgRes = await api('/api/admin/vendor-configs');
  const configs = cfgRes?.configs || [];
  const enabledVendorIds = new Set(configs.filter(c => c.enabled).map(c => c.vendor_id));
  const vRes = await api('/api/admin/vendors');
  const vendors = (vRes && vRes.vendors) ? vRes.vendors : [];
  // Build flat model list from enabled vendors only
  const allModels = [];
  vendors.filter(v => enabledVendorIds.has(v.id)).forEach(v => {
    (v.models || []).forEach(m => {
      allModels.push({ id: m.id, name: m.name, vendor: v.name });
    });
  });
  // Separate selected vs available
  const selected = saved.map(id => allModels.find(m => m.id === id)).filter(Boolean);
  const available = allModels.filter(m => !saved.includes(m.id));
  container.innerHTML = '<div class="animate-fade-in-up"><div class="mb-8"><h1 class="text-2xl font-semibold text-text tracking-tight">' + t('nav_model_priority') + '</h1><p class="text-text-secondary text-sm mt-1">' + (lang === 'zh' ? '拖拽或点击按钮调整跨厂商故障转移优先级，保存后生效' : 'Drag or click buttons to adjust cross-vendor fallback priority, save to apply') + '</p></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-6"><div class="bg-surface rounded-2xl p-6 shadow-sm border border-border/30"><h2 class="text-sm font-semibold text-text mb-4 uppercase tracking-wider">' + (lang === 'zh' ? '已排序模型' : 'Ordered Models') + ' <span id="ordered-count" class="text-text-tertiary font-normal normal-case">(' + selected.length + ')</span></h2><div id="priority-list" class="space-y-2 min-h-[60px]">' + selected.map((m, i) => '<div class="flex items-center gap-3 bg-bg rounded-xl px-4 py-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-sm border border-border/20" draggable="true" data-model-id="' + m.id + '" data-idx="' + i + '"><span class="text-text-tertiary text-xs font-mono w-6">' + (i + 1) + '</span><span class="flex-1 text-sm font-medium text-text">' + m.name + '</span><span class="text-xs text-text-tertiary px-2 py-0.5 bg-surface rounded-md">' + m.vendor + '</span><button onclick="moveToAvailable(\'' + m.id + '\')" class="p-1 rounded-md text-text-tertiary/40 hover:text-danger hover:bg-danger/10 transition-all flex-shrink-0" title="' + (lang === 'zh' ? '移除' : 'Remove') + '"><i data-lucide="x" class="w-3.5 h-3.5"></i></button></div>').join('') + '</div><button onclick="saveModelPriority()" class="mt-4 w-full bg-text text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:shadow-md active:scale-[0.98]">' + (lang === 'zh' ? '保存排序' : 'Save Order') + '</button></div><div class="bg-surface rounded-2xl p-6 shadow-sm border border-border/30"><h2 class="text-sm font-semibold text-text mb-4 uppercase tracking-wider">' + (lang === 'zh' ? '可用模型' : 'Available Models') + ' <span id="available-count" class="text-text-tertiary font-normal normal-case">(' + available.length + ')</span></h2><div id="available-list" class="space-y-2 min-h-[60px]">' + available.map(m => '<div class="flex items-center gap-3 bg-bg rounded-xl px-4 py-3 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-sm border border-border/20" draggable="true" data-model-id="' + m.id + '"><span class="flex-1 text-sm font-medium text-text">' + m.name + '</span><span class="text-xs text-text-tertiary px-2 py-0.5 bg-surface rounded-md">' + m.vendor + '</span><button onclick="moveToOrdered(\'' + m.id + '\')" class="text-accent hover:text-accent-hover transition-colors text-xs font-medium flex-shrink-0">' + (lang === 'zh' ? '添加 ↑' : 'Add ↑') + '</button></div>').join('') + '</div></div></div></div>';
  setupDragDrop();
  lucide.createIcons();
}

function setupDragDrop() {
  const ordered = document.getElementById('priority-list');
  const available = document.getElementById('available-list');
  if (!ordered || !available) return;
  let dragged = null;

  function bindList(list, targetList, onDrop) {
    list.querySelectorAll('[draggable]').forEach(el => {
      el.addEventListener('dragstart', e => { dragged = el; el.style.opacity = '0.5'; e.dataTransfer.effectAllowed = 'move'; });
      el.addEventListener('dragend', e => { el.style.opacity = '1'; dragged = null; });
      el.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
      el.addEventListener('drop', e => { e.preventDefault(); e.stopPropagation(); if (dragged && dragged !== el) onDrop(dragged, el); });
    });
    // Also allow dropping on the list container itself (empty area)
    list.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
    list.addEventListener('drop', e => {
      e.preventDefault();
      if (!dragged) return;
      // If dropped on the list container (not on a specific item), append to end
      if (e.target === list || e.target.id === list.id) {
        if (dragged.parentElement === list) return; // same list, already handled
        onDropToList(dragged, list);
      }
    });
  }

  function onDropToList(item, targetList) {
    if (targetList === ordered) moveToOrdered(item.getAttribute('data-model-id'));
    else moveToAvailable(item.getAttribute('data-model-id'));
  }

  bindList(ordered, available, (d, t) => {
    // Cross-list: dragged from available → move to ordered
    if (d.parentElement !== ordered) {
      moveToOrdered(d.getAttribute('data-model-id'));
      return;
    }
    // Reorder within ordered list
    const children = [...ordered.children];
    const from = children.indexOf(d);
    const to = children.indexOf(t);
    if (from !== -1 && to !== -1) {
      if (from < to) t.after(d);
      else t.before(d);
    }
    updatePriorityNumbers();
    updateCounters();
  });
  bindList(available, ordered, (d, t) => {
    // Cross-list: dragged from ordered → move to available
    if (d.parentElement !== available) {
      moveToAvailable(d.getAttribute('data-model-id'));
      return;
    }
    // Reorder within available list (cosmetic, just swap)
    const children = [...available.children];
    const from = children.indexOf(d);
    const to = children.indexOf(t);
    if (from !== -1 && to !== -1) {
      if (from < to) t.after(d);
      else t.before(d);
    }
  });
}

function updatePriorityNumbers() {
  const list = document.getElementById('priority-list');
  if (!list) return;
  [...list.children].forEach((el, i) => {
    const span = el.querySelector('span.w-6');
    if (span) span.textContent = i + 1;
    el.setAttribute('data-idx', i);
  });
}

function updateCounters() {
  const ordered = document.getElementById('priority-list');
  const available = document.getElementById('available-list');
  const oc = document.getElementById('ordered-count');
  const ac = document.getElementById('available-count');
  if (oc) oc.textContent = '(' + (ordered ? ordered.children.length : 0) + ')';
  if (ac) ac.textContent = '(' + (available ? available.children.length : 0) + ')';
}

async function saveModelPriority() {
  const list = document.getElementById('priority-list');
  const order = [...list.children].map(el => el.getAttribute('data-model-id'));
  const res = await api('/api/admin/model-priority-order', { method: 'PUT', body: { order } });
  if (res && res.success) toast(lang === 'zh' ? '优先级已保存' : 'Priority saved', 'success');
  else toast(lang === 'zh' ? '保存失败' : 'Save failed', 'error');
}

function moveToOrdered(modelId) {
  const list = document.getElementById('priority-list');
  const avail = document.getElementById('available-list');
  const item = avail.querySelector('[data-model-id="' + modelId + '"]');
  if (!item) return;
  item.querySelector('button')?.remove(); // Remove "Add" button
  const idx = list.children.length;
  // Rebuild inner HTML for ordered list format: number + name + vendor badge + remove btn
  const nameEl = item.querySelector('.text-text');
  const badgeEl = item.querySelector('.bg-surface');
  item.innerHTML = '<span class="text-text-tertiary text-xs font-mono w-6">' + (idx + 1) + '</span><span class="flex-1 text-sm font-medium text-text">' + (nameEl ? nameEl.textContent : '') + '</span>' + (badgeEl ? badgeEl.outerHTML : '') + '<button onclick="moveToAvailable(\'' + modelId + '\')" class="p-1 rounded-md text-text-tertiary/40 hover:text-danger hover:bg-danger/10 transition-all flex-shrink-0" title="' + (lang === 'zh' ? '移除' : 'Remove') + '"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>';
  list.appendChild(item);
  setupDragDrop();
  updatePriorityNumbers();
  updateCounters();
  lucide.createIcons();
}

function moveToAvailable(modelId) {
  const list = document.getElementById('priority-list');
  const avail = document.getElementById('available-list');
  const item = list.querySelector('[data-model-id="' + modelId + '"]');
  if (!item) return;
  // Remove the remove button and rebuild for available format
  const lastBtn = item.querySelector('button');
  if (lastBtn) lastBtn.remove();
  const nameEl = item.querySelector('.text-text');
  const badgeEl = item.querySelector('.bg-surface');
  item.innerHTML = '<span class="flex-1 text-sm font-medium text-text">' + (nameEl ? nameEl.textContent : '') + '</span>' + (badgeEl ? badgeEl.outerHTML : '') + '<button onclick="moveToOrdered(\'' + modelId + '\')" class="text-accent hover:text-accent-hover transition-colors text-xs font-medium flex-shrink-0">' + (lang === 'zh' ? '添加 ↑' : 'Add ↑') + '</button>';
  avail.appendChild(item);
  setupDragDrop();
  updatePriorityNumbers();
  updateCounters();
  lucide.createIcons();
}

// ─── Plugins ──────────────────────────────────────────────
async function renderPlugins() {
  const container = document.getElementById('page-container');
  container.innerHTML = `
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold">${t('plugin_title')}</h2>
        <p class="text-sm text-text-secondary mt-1">${t('plugin_desc')}</p>
      </div>
    </div>
    <div id="plugin-list" class="space-y-3">
      <div class="text-center py-12 text-text-tertiary text-sm"><div class="animate-spin w-5 h-5 border-2 border-accent border-t-transparent rounded-full mx-auto mb-3"></div>${t('loading')}</div>
    </div>
  `;
  enhanceContainer(container);
  const res = await api('/api/admin/plugins/');
  const list = document.getElementById('plugin-list');
  if (!res || !res.plugins || res.plugins.length === 0) {
    list.innerHTML = '<div class="text-center py-12 text-text-tertiary text-sm">' + t('plugin_none') + '</div>';
    return;
  }
  list.innerHTML = res.plugins.map((p, i) => {
    const name = p.display_name || p.name;
    const desc = p.description || '';
    const enabled = p.enabled;
    const priority = p.priority || 0;
    return '<div class="bg-card rounded-xl border border-border p-4 transition-all card-lift" id="plugin-card-' + esc(p.name) + '">' +
      '<div class="flex items-center justify-between">' +
        '<div class="flex items-center gap-3">' +
          '<div class="w-2 h-2 rounded-full ' + (enabled ? 'bg-success' : 'bg-border') + '"></div>' +
          '<div>' +
            '<h3 class="text-sm font-semibold">' + esc(name) + '</h3>' +
            '<p class="text-xs text-text-secondary">' + esc(desc) + '</p>' +
          '</div>' +
        '</div>' +
        '<div class="flex items-center gap-3">' +
          '<span class="text-xs text-text-tertiary font-mono">#' + priority + '</span>' +
          '<button onclick="togglePlugin(\'' + esc(p.name) + '\',' + enabled + ')" class="btn-press px-2 py-0.5 rounded text-xs ' + (enabled ? 'bg-success/10 text-success' : 'bg-border/50 text-text-tertiary') + ' hover:opacity-80 transition-all duration-200">' + (enabled ? t('plugin_enable') : t('plugin_disable')) + '</button>' +
        '</div>' +
      '</div>' +
      (p.config_schema ? '<div class="mt-3 pt-3 border-t border-border">' +
        '<p class="text-xs text-text-secondary mb-2">' + t('plugin_config') + '</p>' +
        Object.entries(p.config_schema).map(([k, v]) => {
          const val = (p.config && p.config[k]) ? esc(p.config[k]) : '';
          return '<div class="flex items-center gap-2 mb-1.5">' +
            '<label class="text-xs text-text-tertiary w-24 flex-shrink-0">' + esc(k) + '</label>' +
            '<input value="' + val + '" data-plugin="' + esc(p.name) + '" data-key="' + esc(k) + '" class="flex-1 px-2 py-1 text-xs rounded-md bg-muted border border-border input-apple plugin-config-input" placeholder="' + esc(v.description || '') + '" />' +
          '</div>';
        }).join('') +
        '<button onclick="savePluginConfig(\'' + esc(p.name) + '\')" class="btn-press mt-2 px-3 py-1 rounded-md text-xs bg-accent text-white hover:bg-accent/90 transition-all duration-200 active:scale-95">' + t('plugin_save_config') + '</button>' +
      '</div>' : '') +
    '</div>';
  }).join('');
  lucide.createIcons();
}

function togglePlugin(name, enabled) {
  api('/api/admin/plugins/' + encodeURIComponent(name) + '/toggle', { method: 'PUT', body: { enabled: !enabled } }).then(() => renderPlugins());
}

function savePluginConfig(name) {
  const inputs = document.querySelectorAll('.plugin-config-input[data-plugin="' + name + '"]');
  const config = {};
  inputs.forEach(inp => { if (inp.value.trim()) config[inp.dataset.key] = inp.value.trim(); });
  api('/api/admin/plugins/' + encodeURIComponent(name), { method: 'PUT', body: { config } }).then(() => renderPlugins());
}
async function renderDatabase() {
  const container = document.getElementById('page-container');
  container.innerHTML = `
    <div class="mb-6">
      <h2 class="text-lg font-semibold">${t('db_title')}</h2>
      <p class="text-sm text-text-secondary mt-1">${t('db_restart_note')}</p>
    </div>
    <div id="db-form-container">
      <div class="text-center py-12 text-text-tertiary text-sm"><div class="animate-spin w-5 h-5 border-2 border-accent border-t-transparent rounded-full mx-auto mb-3"></div>${t('loading')}</div>
    </div>
  `;
  enhanceContainer(container);

  const res = await api('/api/admin/config/database');
  const cfg = (res && res.config) ? res.config : {};
  const form = document.getElementById('db-form-container');
  form.innerHTML = `
    <div class="bg-card rounded-xl border border-border p-5 space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1">${t('db_type')}</label>
          <select id="db-type" class="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm input-apple focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all">
            <option value="sqlite" ${cfg.db_type === 'sqlite' ? 'selected' : ''}>SQLite</option>
            <option value="postgresql" ${cfg.db_type === 'postgresql' ? 'selected' : ''}>PostgreSQL</option>
            <option value="mysql" ${cfg.db_type === 'mysql' ? 'selected' : ''}>MySQL</option>
          </select>
        </div>
        <div id="db-host-group" ${cfg.db_type === 'sqlite' ? 'style="display:none"' : ''}>
          <label class="block text-xs font-medium text-text-secondary mb-1">${t('db_host')}</label>
          <input id="db-host" value="${esc(cfg.db_host || 'localhost')}" class="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm input-apple focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all" />
        </div>
        <div id="db-port-group" ${cfg.db_type === 'sqlite' ? 'style="display:none"' : ''}>
          <label class="block text-xs font-medium text-text-secondary mb-1">${t('db_port')}</label>
          <input id="db-port" value="${esc(cfg.db_port || (cfg.db_type === 'postgresql' ? '5432' : '3306'))}" class="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm input-apple focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all" />
        </div>
        <div>
          <label class="block text-xs font-medium text-text-secondary mb-1">${t('db_name')}</label>
          <input id="db-name" value="${esc(cfg.db_name || (cfg.db_type === 'sqlite' ? 'app.db' : 'lumen'))}" class="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm input-apple focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all" />
        </div>
        <div id="db-user-group" ${cfg.db_type === 'sqlite' ? 'style="display:none"' : ''}>
          <label class="block text-xs font-medium text-text-secondary mb-1">${t('db_user')}</label>
          <input id="db-user" value="${esc(cfg.db_user || '')}" class="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm input-apple focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all" />
        </div>
        <div id="db-pass-group" ${cfg.db_type === 'sqlite' ? 'style="display:none"' : ''}>
          <label class="block text-xs font-medium text-text-secondary mb-1">${t('db_password')}</label>
          <input id="db-password" type="password" value="${esc(cfg.db_password || '')}" class="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm input-apple focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all" />
        </div>
      </div>
      <div class="flex items-center gap-3 pt-2">
        <button id="btn-test-db" onclick="testDatabaseConnection()" class="btn-press px-4 py-2 rounded-lg text-sm border border-border hover:bg-muted transition-all duration-200 active:scale-95">
          <i data-lucide="zap" class="w-4 h-4 inline mr-1.5"></i>${t('db_test')}
        </button>
        <button onclick="saveDatabaseConfig()" class="btn-press px-4 py-2 rounded-lg text-sm bg-accent text-white hover:bg-accent/90 transition-all duration-200 active:scale-95">
          <i data-lucide="save" class="w-4 h-4 inline mr-1.5"></i>${t('db_save')}
        </button>
        <span id="db-test-result" class="text-sm"></span>
      </div>
    </div>
  `;
  lucide.createIcons();

  // Toggle fields based on db type
  document.getElementById('db-type').addEventListener('change', function() {
    const isSQLite = this.value === 'sqlite';
    ['db-host-group', 'db-port-group', 'db-user-group', 'db-pass-group'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = isSQLite ? 'none' : '';
    });
    const portEl = document.getElementById('db-port');
    if (this.value === 'postgresql') portEl.value = portEl.value || '5432';
    if (this.value === 'mysql') portEl.value = portEl.value || '3306';
  });
}

function getDbFormData() {
  const dbType = document.getElementById('db-type').value;
  const data = {
    db_type: dbType,
    db_host: document.getElementById('db-host').value,
    db_port: document.getElementById('db-port').value,
    db_name: document.getElementById('db-name').value,
    db_user: document.getElementById('db-user').value,
  };
  const pwd = document.getElementById('db-password').value;
  if (pwd && pwd !== '••••••••') data.db_password = pwd;
  return data;
}

async function testDatabaseConnection() {
  const btn = document.getElementById('btn-test-db');
  const result = document.getElementById('db-test-result');
  btn.disabled = true;
  btn.innerHTML = '<div class="animate-spin w-4 h-4 border-2 border-accent border-t-transparent rounded-full inline mr-1.5"></div>' + t('db_testing');
  result.innerHTML = '';

  const data = getDbFormData();
  if (data.db_type !== 'sqlite') {
    const pwdEl = document.getElementById('db-password');
    if (pwdEl.value === '••••••••') {
      try {
        const res = await api('/api/admin/config/database');
        if (res && res.config && res.config.db_password && res.config.db_password !== '••••••••') {
          data.db_password = res.config.db_password;
        }
      } catch (e) {}
    }
  }

  const res = await api('/api/admin/config/database/test', { method: 'POST', body: data });
  btn.disabled = false;
  btn.innerHTML = '<i data-lucide="zap" class="w-4 h-4 inline mr-1.5"></i>' + t('db_test');
  if (res && res.success) {
    result.innerHTML = '<span class="text-success"><i data-lucide="check-circle" class="w-4 h-4 inline mr-1"></i>' + t('db_connected') + '</span>';
  } else {
    result.innerHTML = '<span class="text-error"><i data-lucide="x-circle" class="w-4 h-4 inline mr-1"></i>' + t('db_failed') + ': ' + esc((res && res.message) || 'Unknown error') + '</span>';
  }
  lucide.createIcons();
}

async function saveDatabaseConfig() {
  const data = getDbFormData();
  const res = await api('/api/admin/config/database', { method: 'PUT', body: data });
  if (res && res.success) {
    showToast(t('db_saved'), 'success');
  } else {
    showToast((res && res.message) || 'Save failed', 'error');
  }
}


// ─── Theme Management ─────────────────────────────────────

async function renderThemes() {
  const res = await api("/api/admin/themes");
  const themes = (res && res.themes) || [];
  const active = themes.find(t => t.is_active);

  setPageHeader(t("nav_themes"), t("theme_create"), () => showThemeEditor(null));

  document.getElementById("main-content").innerHTML = `
    ${active ? `<div class="mb-5 p-4 rounded-xl border border-border bg-surface flex items-center gap-3">
      <div class="flex gap-1.5 flex-1">
        ${["bg","surface","surfaceHover","border","text","textSecondary","textTertiary","accent","danger","success"].map(k =>
          `<span class="w-5 h-5 rounded" style="background:${(active.colors||{})[k]||"#ccc"}" title="${t("theme_"+k)}"></span>`
        ).join("")}
      </div>
      <span class="text-sm text-text-secondary">${t("theme_activated")}: ${esc(active.name)}</span>
    </div>` : `<div class="mb-5 p-4 rounded-xl bg-surface-container/50 border border-border text-center text-sm text-text-secondary">
      <i data-lucide="palette" class="w-5 h-5 inline mr-2"></i>${t("theme_no_themes")}
    </div>`}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" id="theme-grid"></div>
  `;
  lucide.createIcons();

  const grid = document.getElementById("theme-grid");
  if (!themes.length) {
    grid.innerHTML = `<div class="col-span-full text-center py-12 text-text-tertiary text-sm">${t("theme_create_first")}</div>`;
    return;
  }

  themes.forEach(t => {
    const c = t.colors || {};
    const card = document.createElement("div");
    card.className = "p-4 rounded-xl border border-border bg-surface hover:bg-surface-hover transition-colors cursor-pointer group";
    card.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-semibold text-text">${esc(t.name)}${t.is_active ? " <span class=\"text-accent text-xs ml-1\">●</span>" : ""}</span>
        <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onclick="event.stopPropagation();showThemeEditor(${t.id})" class="p-1.5 rounded-md hover:bg-surface-container text-text-secondary" title="${t("edit")}"><i data-lucide="pencil" class="w-3.5 h-3.5"></i></button>
          ${!t.is_active ? `<button onclick="event.stopPropagation();deleteTheme(${t.id},"${esc(t.name)}")" class="p-1.5 rounded-md hover:bg-surface-container text-text-secondary hover:text-danger" title="${t("theme_delete")}"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>` : ""}
        </div>
      </div>
      <div class="flex gap-1 mb-2">${["bg","surface","text","accent"].map(k =>
        `<span class="w-6 h-6 rounded border border-border" style="background:${c[k]||"#ccc"}"></span>`
      ).join("")}</div>
      <div class="text-xs text-text-tertiary">${t.radius || "0.75rem"} | ${Object.keys(c).length} colors</div>
      ${!t.is_active ? `<button onclick="event.stopPropagation();activateTheme(${t.id})" class="mt-2 w-full py-1.5 text-xs rounded-lg border border-border text-text-secondary hover:text-accent hover:border-accent/30 transition-colors">${t("theme_activate")}</button>` : ""}
    `;
    card.onclick = () => showThemeEditor(t.id);
    grid.appendChild(card);
  });
  lucide.createIcons();
}

function showThemeEditor(id) {
  const modal = document.getElementById("modal");
  modal.innerHTML = `
    <div class="bg-surface rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-float">
      <div class="sticky top-0 bg-surface border-b border-border px-5 py-3.5 flex items-center justify-between z-10">
        <h3 class="text-base font-semibold text-text">${id ? t("edit") : t("theme_create")}</h3>
        <button onclick="closeModal()" class="p-1.5 rounded-lg hover:bg-surface-container text-text-secondary"><i data-lucide="x" class="w-4 h-4"></i></button>
      </div>
      <div class="p-5 space-y-5" id="theme-editor-body">
        <div class="flex items-center gap-2 text-sm text-text-secondary"><i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>${t("loading")}...</div>
      </div>
    </div>
  `;
  modal.classList.remove("hidden");
  lucide.createIcons();
  loadThemeEditor(id);
}

async function loadThemeEditor(id) {
  let theme = { name: "", colors: {}, darkColors: {}, fonts: {}, radius: "0.75rem", shadows: {}, customCSS: "" };
  if (id) {
    const res = await api("/api/admin/themes");
    const found = (res && res.themes || []).find(t => t.id === id);
    if (found) theme = found;
  }

  const colorFields = [
    ["bg","theme_bg","#f5f5f7"],["surface","theme_surface","#ffffff"],["surfaceHover","theme_surface_hover","#f0f0f2"],
    ["card","theme_card","#ffffff"],["muted","theme_muted","#f0f0f2"],["surfaceContainer","theme_muted","#f0f0f2"],
    ["border","theme_border","#e8e8ed"],["text","theme_text","#1d1d1f"],["textSecondary","theme_text_secondary","#86868b"],
    ["textTertiary","theme_text_tertiary","#aeaeb2"],["accent","theme_accent","#0071e3"],["accentHover","theme_accent_hover","#0066cc"],
    ["danger","theme_danger","#ff3b30"],["success","theme_success","#34c759"],["warning","theme_warning","#ff9500"],
    ["sidebar","theme_sidebar","#f5f5f7"],["sidebarHover","theme_sidebar_hover","#ebebf0"],["sidebarActive","theme_sidebar_active","#e0e0e5"],
  ];
  const darkColorFields = [
    ["bg","theme_bg","#1c1c1e"],["surface","theme_surface","#2c2c2e"],["surfaceHover","theme_surface_hover","#3a3a3c"],
    ["card","theme_card","#2c2c2e"],["muted","theme_muted","#3a3a3c"],["surfaceContainer","theme_muted","#3a3a3c"],
    ["border","theme_border","#38383a"],["text","theme_text","#f5f5f7"],["textSecondary","theme_text_secondary","#98989d"],
    ["textTertiary","theme_text_tertiary","#636366"],["accent","theme_accent","#0a84ff"],["accentHover","theme_accent_hover","#409cff"],
    ["danger","theme_danger","#ff453a"],["success","theme_success","#30d158"],["warning","theme_warning","#ff9f0a"],
    ["sidebar","theme_sidebar","#1c1c1e"],["sidebarHover","theme_sidebar_hover","#2c2c2e"],["sidebarActive","theme_sidebar_active","#3a3a3c"],
  ];
  const fontFields = [
    ["heading","theme_font_heading",'-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'],
    ["body","theme_font_body",'-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'],
    ["mono","theme_font_mono",'"SF Mono", "Fira Code", monospace'],
  ];

  const body = document.getElementById("theme-editor-body");
  body.innerHTML = `
    <div class="flex gap-3">
      <div class="flex-1">
        <label class="text-xs font-medium text-text-secondary mb-1.5 block">${t("theme_name")}</label>
        <input id="theme-name" value="${esc(theme.name)}" placeholder="${t("theme_name_placeholder")}" class="w-full px-3 py-2 rounded-lg border border-border bg-surface-container text-sm text-text focus:outline-none focus:border-accent/30 focus:ring-2 focus:ring-accent/10" />
      </div>
      <div class="w-24">
        <label class="text-xs font-medium text-text-secondary mb-1.5 block">${t("theme_radius")} (<span id="radius-val">${theme.radius}</span>)</label>
        <input type="range" id="theme-radius" min="0" max="2" step="0.125" value="${parseFloat(theme.radius) || 0.75}" class="w-full accent-accent" oninput="document.getElementById('radius-val').textContent = this.value + 'rem'" />
      </div>
    </div>

    <details open><summary class="text-sm font-semibold text-text cursor-pointer py-1 hover:text-accent transition-colors">${t("theme_light_colors")}</summary>
      <div class="grid grid-cols-3 gap-2 mt-2">
        ${colorFields.map(([k,l,def]) => `<div class="flex items-center gap-1.5"><input type="color" id="color-${k}" value="${theme.colors[k]||def}" class="w-7 h-7 rounded border border-border cursor-pointer p-0" /><label class="text-[10px] text-text-secondary truncate">${t(l)}</label></div>`).join("")}
      </div>
    </details>

    <details><summary class="text-sm font-semibold text-text cursor-pointer py-1 hover:text-accent transition-colors">${t("theme_dark_colors")}</summary>
      <div class="grid grid-cols-3 gap-2 mt-2">
        ${darkColorFields.map(([k,l,def]) => `<div class="flex items-center gap-1.5"><input type="color" id="dark-${k}" value="${(theme.darkColors||{})[k]||def}" class="w-7 h-7 rounded border border-border cursor-pointer p-0" /><label class="text-[10px] text-text-secondary truncate">${t(l)}</label></div>`).join("")}
      </div>
    </details>

    <details><summary class="text-sm font-semibold text-text cursor-pointer py-1 hover:text-accent transition-colors">${t("theme_fonts")}</summary>
      <div class="space-y-1.5 mt-2">
        ${fontFields.map(([k,l,def]) => `<div><label class="text-[10px] text-text-secondary mb-0.5 block">${t(l)}</label><input id="font-${k}" value="${(theme.fonts||{})[k]||def}" class="w-full px-2 py-1.5 rounded-lg border border-border bg-surface-container text-[11px] text-text font-mono focus:outline-none focus:border-accent/30" /></div>`).join("")}
      </div>
    </details>

    <details><summary class="text-sm font-semibold text-text cursor-pointer py-1 hover:text-accent transition-colors">${t("theme_shadows")}</summary>
      <div class="grid grid-cols-2 gap-1.5 mt-2">
        ${["sm","md","lg","xl"].map(s => `<div><label class="text-[10px] text-text-secondary mb-0.5 block">shadow-${s}</label><input id="shadow-${s}" value="${(theme.shadows||{})[s]||""}" placeholder="0 1px 2px rgba(0,0,0,0.1)" class="w-full px-2 py-1.5 rounded-lg border border-border bg-surface-container text-[11px] text-text font-mono focus:outline-none focus:border-accent/30" /></div>`).join("")}
      </div>
    </details>

    <details><summary class="text-sm font-semibold text-text cursor-pointer py-1 hover:text-accent transition-colors">${t("theme_custom_css")}</summary>
      <textarea id="custom-css" rows="8" placeholder="/* ${t("theme_custom_css_hint")} */\n.custom-class { color: var(--color-accent); }" class="w-full mt-2 px-3 py-2 rounded-lg border border-border bg-surface-container text-xs text-text font-mono focus:outline-none focus:border-accent/30 focus:ring-2 focus:ring-accent/10 resize-y">${esc(theme.customCSS||"")}</textarea>
    </details>

    <div>
      <h4 class="text-sm font-semibold text-text mb-2 flex items-center gap-2">
        ${t("theme_preview")}
        <button onclick="togglePreviewMode()" id="preview-mode-btn" class="text-[10px] px-2 py-0.5 rounded border border-border text-text-secondary hover:text-accent transition-colors">${t("theme_light")}</button>
      </h4>
      <div class="p-4 rounded-xl border border-border space-y-2 transition-colors duration-300" id="theme-preview" style="background:${theme.colors.bg||"#f5f5f7"};font-family:${(theme.fonts||{}).body||"system-ui"};border-radius:${theme.radius}">
        <div class="p-3 rounded-lg" style="background:${theme.colors.surface||"#fff"};border:1px solid ${theme.colors.border||"#e8e8ed"}">
          <h5 style="color:${theme.colors.text||"#1d1d1f"};font-family:${(theme.fonts||{}).heading||"system-ui"};font-weight:600;font-size:14px">${t("theme_preview")}</h5>
          <p style="color:${theme.colors.textSecondary||"#86868b"};font-size:12px;margin-top:4px">${t("theme_text_secondary")}</p>
          <div class="flex gap-1.5 mt-2">
            <span class="px-2 py-0.5 rounded text-xs" style="background:${theme.colors.accent||"#0071e3"};color:#fff">${t("theme_accent")}</span>
            <span class="px-2 py-0.5 rounded text-xs" style="background:${theme.colors.danger||"#ff3b30"};color:#fff">${t("theme_danger")}</span>
            <span class="px-2 py-0.5 rounded text-xs" style="background:${theme.colors.success||"#34c759"};color:#fff">${t("theme_success")}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center pt-2">
      <label class="flex items-center gap-2 text-xs text-text-secondary cursor-pointer">
        <input type="checkbox" id="set-as-active" class="apple-switch" checked /> ${t("theme_set_active")}
      </label>
      <div class="flex gap-2">
        <button onclick="closeModal()" class="px-4 py-2 rounded-lg border border-border text-sm text-text-secondary hover:bg-surface-container transition-colors">${t("cancel")}</button>
        <button onclick="saveTheme(${id||0})" class="px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors">${t("save")}</button>
      </div>
    </div>
  `;
  lucide.createIcons();

  // Preview mode toggle
  window._previewDark = false;
  window.togglePreviewMode = () => {
    window._previewDark = !window._previewDark;
    const btn = document.getElementById("preview-mode-btn");
    btn.textContent = window._previewDark ? t("theme_dark") : t("theme_light");
    updateThemePreview();
  };

  // Bind input listeners
  document.querySelectorAll('[id^="color-"], [id^="dark-"]').forEach(i => i.addEventListener("input", () => updateThemePreview()));
  document.getElementById("theme-radius")?.addEventListener("input", () => updateThemePreview());
  document.querySelectorAll('[id^="font-"]').forEach(i => i.addEventListener("input", () => updateThemePreview()));
  document.querySelectorAll('[id^="shadow-"]').forEach(i => i.addEventListener("input", () => updateThemePreview()));
}

function updateThemePreview() {
  const isDark = window._previewDark;
  const prefix = isDark ? "dark-" : "color-";
  const getColor = (key) => document.getElementById(prefix + key)?.value || "";
  const getFont = (key) => document.getElementById("font-" + key)?.value || "system-ui";
  const radius = (document.getElementById("theme-radius")?.value || "0.75") + "rem";
  const preview = document.getElementById("theme-preview");
  if (!preview) return;
  preview.style.background = getColor("bg");
  preview.style.borderRadius = radius;
  const inner = preview.querySelector("div");
  if (inner) { inner.style.background = getColor("surface"); inner.style.borderColor = getColor("border"); }
  const h5 = preview.querySelector("h5");
  if (h5) { h5.style.color = getColor("text"); h5.style.fontFamily = getFont("heading"); }
  const p = preview.querySelector("p");
  if (p) p.style.color = getColor("textSecondary");
  const spans = preview.querySelectorAll("span");
  if (spans[0]) spans[0].style.background = getColor("accent");
  if (spans[1]) spans[1].style.background = getColor("danger");
  if (spans[2]) spans[2].style.background = getColor("success");
  const rv = document.getElementById("radius-val");
  if (rv) rv.textContent = radius;
}

function collectThemeData() {
  const colorFields = ["bg","surface","surfaceHover","card","muted","surfaceContainer","border","text","textSecondary","textTertiary","accent","accentHover","danger","error","success","warning","sidebar","sidebarHover","sidebarActive"];
  const fontFields = ["heading","body","mono"];
  const shadowFields = ["sm","md","lg","xl"];
  const colors = {}, darkColors = {}, fonts = {}, shadows = {};
  colorFields.forEach(k => { const v = document.getElementById("color-"+k)?.value; if (v) colors[k] = v; });
  colorFields.forEach(k => { const v = document.getElementById("dark-"+k)?.value; if (v) darkColors[k] = v; });
  fontFields.forEach(k => { const v = document.getElementById("font-"+k)?.value; if (v) fonts[k] = v; });
  shadowFields.forEach(k => { const v = document.getElementById("shadow-"+k)?.value; if (v && v.trim()) shadows[k] = v; });
  const customCSS = document.getElementById("custom-css")?.value || "";
  return {
    name: document.getElementById("theme-name")?.value || "",
    colors, darkColors, fonts, shadows, customCSS,
    radius: (document.getElementById("theme-radius")?.value || "0.75") + "rem",
  };
}

async function saveTheme(id) {
  const data = collectThemeData();
  if (!data.name.trim()) { showToast(t("theme_name_placeholder"), "error"); return; }
  const url = id ? "/api/admin/themes/" + id : "/api/admin/themes";
  const method = id ? "PUT" : "POST";
  const res = await api(url, { method, body: data });
  if (res && res.success) {
    const shouldActivate = document.getElementById("set-as-active")?.checked;
    if (shouldActivate && res.theme) {
      const tid = res.theme.id || id;
      await api("/api/admin/themes/" + tid + "/activate", { method: "PUT" });
      reloadAllThemes();
    }
    closeModal();
    showToast(t("theme_saved"), "success");
    renderThemes();
  } else {
    showToast((res && res.message) || "Save failed", "error");
  }
}

async function activateTheme(id) {
  const res = await api("/api/admin/themes/" + id + "/activate", { method: "PUT" });
  if (res && res.success) {
    showToast(t("theme_activated"), "success");
    reloadAllThemes();
    renderThemes();
  } else {
    showToast((res && res.message) || "Activation failed", "error");
  }
}

async function deleteTheme(id, name) {
  if (!confirm(t("theme_confirm_delete") + " (" + name + ")")) return;
  const res = await api("/api/admin/themes/" + id, { method: "DELETE" });
  if (res && res.success) {
    showToast(t("theme_deleted"), "success");
    renderThemes();
  } else {
    showToast((res && res.message) || t("theme_cannot_delete_active"), "error");
  }
}

function applyCustomTheme(theme) {
  if (!theme || !theme.colors) return;
  const c = theme.colors;
  const f = theme.fonts || {};
  const r = theme.radius || "0.75rem";
  const darkC = theme.darkColors || {};
  const customCSS = theme.customCSS || "";

  let css = ":root {\n";
  const map = {
    bg: "--color-bg", surface: "--color-surface", surfaceHover: "--color-surface-hover",
    card: "--color-card", muted: "--color-muted", surfaceContainer: "--color-surface-container",
    border: "--color-border", text: "--color-text", textSecondary: "--color-text-secondary",
    textTertiary: "--color-text-tertiary", accent: "--color-accent", accentHover: "--color-accent-hover",
    danger: "--color-danger", error: "--color-error", success: "--color-success", warning: "--color-warning",
    sidebar: "--color-sidebar", sidebarHover: "--color-sidebar-hover", sidebarActive: "--color-sidebar-active",
  };
  Object.entries(map).forEach(([k, v]) => { if (c[k]) css += "  " + v + ": " + c[k] + ";\n"; });
  if (f.heading) css += "  --font-sans: " + f.heading + ";\n";
  if (f.body) css += "  --font-body: " + f.body + ";\n";
  if (f.mono) css += "  --font-mono: " + f.mono + ";\n";
  css += "  --radius-sm: " + r + ";\n";
  css += "  --radius-md: calc(" + r + " + 2px);\n";
  css += "  --radius-lg: calc(" + r + " + 6px);\n";
  css += "  --radius-xl: calc(" + r + " + 10px);\n";
  css += "  --radius-2xl: calc(" + r + " + 14px);\n";
  if (theme.shadows) {
    const s = theme.shadows;
    if (s.sm) css += "  --shadow-sm: " + s.sm + ";\n";
    if (s.md) css += "  --shadow-md: " + s.md + ";\n";
    if (s.lg) css += "  --shadow-lg: " + s.lg + ";\n";
    if (s.xl) css += "  --shadow-xl: " + s.xl + ";\n";
  }
  css += "}\n";

  // Dark mode: auto-generate if darkColors provided, else derive from light
  if (Object.keys(darkC).length > 0) {
    css += "\n[data-theme=\"dark\"] {\n";
    Object.entries(map).forEach(([k, v]) => { if (darkC[k]) css += "  " + v + ": " + darkC[k] + ";\n"; });
    css += "}\n";
  }

  // Custom CSS from user
  if (customCSS.trim()) {
    css += "\n/* Custom CSS */\n" + customCSS + "\n";
  }

  // Inject/update <style> element
  let styleEl = document.getElementById("custom-theme-style");
  if (!styleEl) {
    styleEl = document.createElement("style");
    styleEl.id = "custom-theme-style";
    document.head.appendChild(styleEl);
  }
  styleEl.textContent = css;
}

function clearCustomTheme() {
  const styleEl = document.getElementById("custom-theme-style");
  if (styleEl) styleEl.remove();
}

async function loadActiveTheme() {
  try {
    const res = await api("/api/admin/themes/active");
    if (res && res.success && res.theme) {
      applyCustomTheme(res.theme);
    }
  } catch (e) { /* no active theme */ }
}

async function reloadAllThemes() {
  clearCustomTheme();
  await loadActiveTheme();
}


// ─── Init ─────────────────────────────────────────────────
applyTheme();
loadActiveTheme();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (getTheme() === 'system') applyTheme();
});
checkAuth();
