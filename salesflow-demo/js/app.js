/* SalesFlow demo — app shell, router and pages. */
(function () {
  'use strict';
  var S = window.SFStore;
  var C = window.SFCharts;

  // ------------------------------------------------------------------ helpers
  var ICONS = {
    logo: '<path d="M4 17l5-5 4 4 7-8"/>',
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    logout: '<path d="M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l5-5-5-5M15 12H3"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4L21 8M21 3v5h-5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    eyeOff: '<path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M9.9 9.9a3 3 0 0 0 4.2 4.2"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a1 1 0 0 1 1-1h10"/>',
    arrowDown: '<path d="M12 5v14M6 13l6 6 6-6"/>',
    arrowUp: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  };
  function icon(name, size, sw) {
    return '<svg width="' + (size || 18) + '" height="' + (size || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.8) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
  }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function cur() { return S.settings().currency || 'Ks'; }
  function money(n) { return cur() + ' ' + Math.round(n).toLocaleString('en-US'); }
  function moneyShort(n) { return cur() + ' ' + (n >= 1e6 ? (n / 1e6).toFixed(2).replace(/0$/, '') + 'M' : n >= 1e4 ? Math.round(n / 1e3) + 'K' : Math.round(n).toLocaleString('en-US')); }
  function num(n) { return Math.round(n).toLocaleString('en-US'); }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function fmtDate(isoDate, withYear) {
    var d = S.parseIso(isoDate);
    return d.getDate() + ' ' + MONTHS[d.getMonth()] + (withYear ? ' ' + d.getFullYear() : '');
  }
  function fmtMonth(key) { var p = key.split('-'); return MONTHS[+p[1] - 1] + ' ' + p[0]; }
  function fmtRange(a, b) { return fmtDate(a, a.slice(0, 4) !== b.slice(0, 4)) + ' – ' + fmtDate(b, true); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var TONE = { Pending: 'tone-pending', Delivered: 'tone-ok', Returned: 'tone-bad' };
  function badge(st) { return '<span class="badge ' + TONE[st] + '">' + esc(st) + '</span>'; }
  function lineText(l) { return esc(l.item) + ' <span class="sub">· ' + esc(l.size) + ' · ' + esc(l.color) + ' × ' + num(l.qty) + '</span>'; }

  function toast(msg, tone) {
    var t = document.createElement('div');
    t.className = 'toast' + (tone === 'bad' ? ' bad' : '');
    t.setAttribute('role', tone === 'bad' ? 'alert' : 'status');
    t.innerHTML = icon(tone === 'bad' ? 'x' : 'check', 16, 2.2) + '<span></span>';
    t.querySelector('span').textContent = msg;
    $('#toasts').appendChild(t);
    setTimeout(function () { t.remove(); }, 3200);
  }

  function openDialog(html) {
    var d = document.createElement('dialog');
    d.innerHTML = '<div class="dlg">' + html + '</div>';
    document.body.appendChild(d);
    d.addEventListener('close', function () { d.remove(); });
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
    $$('[data-close]', d).forEach(function (b) { b.addEventListener('click', function () { d.close(); }); });
    d.showModal();
    return d;
  }
  function confirmDialog(o) {
    return new Promise(function (resolve) {
      var d = openDialog(
        '<div class="dlg-head"><h2>' + esc(o.title) + '</h2></div><p class="muted">' + esc(o.body) + '</p>' +
        '<div class="dlg-foot"><button type="button" class="btn" data-close>Cancel</button><button type="button" class="btn ' + (o.danger ? 'btn-danger' : 'btn-primary') + '" data-ok>' + esc(o.confirm) + '</button></div>');
      var ok = false;
      $('[data-ok]', d).addEventListener('click', function () { ok = true; d.close(); });
      d.addEventListener('close', function () { resolve(ok); });
    });
  }
  function busy(btn, on, label) {
    if (on) { btn.dataset.label = btn.innerHTML; btn.disabled = true; btn.innerHTML = '<span class="spinner" aria-hidden="true"></span>' + esc(label || 'Saving…'); }
    else { btn.disabled = false; if (btn.dataset.label) btn.innerHTML = btn.dataset.label; }
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  // ------------------------------------------------------------------ boot
  var root = document.getElementById('root');

  function boot() {
    if (S.session()) showApp(); else showLogin();
  }

  // ------------------------------------------------------------------ login
  function showLogin() {
    root.innerHTML =
      '<div class="login">' +
      '<section class="login-hero">' +
      '<div class="brand"><div class="brand-mark" style="width:36px;height:36px;border-radius:10px">' + icon('logo', 20, 2.2) + '</div><span class="brand-name" style="font-size:18px">SalesFlow</span></div>' +
      '<div class="copy"><h1>Every order, recorded once and counted right.</h1><p>Log multi-item sales in seconds, track delivery status, and see your numbers update the moment you save.</p></div>' +
      '<span class="login-foot">Sales entry &amp; reporting</span>' +
      '</section>' +
      '<section class="login-panel"><form class="login-form" id="login-form" novalidate>' +
      '<div class="stack" style="gap:6px"><h2>Sign in</h2><p class="muted">Use the account your administrator gave you.</p></div>' +
      '<div class="form-error" id="login-error" role="alert" hidden></div>' +
      '<div class="field" id="f-user"><label for="login-user">Username</label><input class="input" id="login-user" name="username" autocomplete="username" value="demo" required><span class="error" hidden></span></div>' +
      '<div class="field" id="f-pass"><label for="login-pass">Password</label><div class="pw-wrap"><input class="input" id="login-pass" name="password" type="password" autocomplete="current-password" value="demo1234" required><button type="button" id="pw-toggle" aria-label="Show password" aria-pressed="false">' + icon('eye') + '</button></div><span class="error" hidden></span></div>' +
      '<button type="submit" class="btn btn-primary btn-block" style="height:48px;font-size:15px">Sign in</button>' +
      '<div class="notice">' + icon('lock', 16, 2) + '<span>Demo mode. Any username and password work, and sales you add are saved only in this browser.</span></div>' +
      '</form></section></div>';

    var pass = $('#login-pass');
    $('#pw-toggle').addEventListener('click', function () {
      var show = pass.type === 'password';
      pass.type = show ? 'text' : 'password';
      this.setAttribute('aria-pressed', String(show));
      this.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      this.innerHTML = icon(show ? 'eyeOff' : 'eye');
    });
    $('#login-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var u = $('#login-user').value.trim(); var p = pass.value;
      var ok = true;
      [['#f-user', u, 'Enter your username.'], ['#f-pass', p, 'Enter your password.']].forEach(function (f) {
        var box = $(f[0]); var err = $('.error', box);
        box.classList.toggle('invalid', !f[1]); err.hidden = !!f[1]; err.textContent = f[2];
        if (!f[1]) ok = false;
      });
      if (!ok) return;
      var btn = $('button[type=submit]', this);
      busy(btn, true, 'Signing in…');
      wait(550).then(function () { S.signIn(u); showApp(); toast('Signed in as ' + u); });
    });
  }

  // ------------------------------------------------------------------ app shell
  var NAV = [
    ['dashboard', 'dashboard', 'Dashboard'],
    ['new-sale', 'plus', 'New Sale'],
    ['history', 'list', 'Sales History'],
    ['reports', 'chart', 'Reports'],
    ['preferences', 'settings', 'Settings'],
  ];

  function showApp() {
    var sess = S.session() || { username: 'demo' };
    var biz = S.settings().businessName;
    root.innerHTML =
      '<div class="app">' +
      '<aside class="sidebar" id="sidebar" aria-label="Main navigation">' +
      '<div class="brand"><div class="brand-mark">' + icon('logo', 18, 2.2) + '</div><div><span class="brand-name">SalesFlow</span><span class="brand-sub" id="biz-name">' + esc(biz) + '</span></div></div>' +
      '<nav class="nav" aria-label="Main"><span class="nav-label">Menu</span>' +
      NAV.map(function (n) { return '<a href="#' + n[0] + '" data-route="' + n[0] + '">' + icon(n[1]) + n[2] + '</a>'; }).join('') +
      '</nav>' +
      '<div class="user-chip"><div class="avatar">' + esc(sess.username.charAt(0).toUpperCase()) + '</div><div style="min-width:0"><div class="who">' + esc(sess.username) + '</div><div class="role">Administrator</div></div>' +
      '<button type="button" class="btn btn-ghost btn-icon btn-sm" id="logout" aria-label="Sign out">' + icon('logout') + '</button></div>' +
      '</aside><div class="scrim" id="scrim"></div>' +
      '<div class="main">' +
      '<header class="topbar"><button type="button" class="btn btn-ghost btn-icon" id="menu-btn" aria-label="Open menu" aria-controls="sidebar" aria-expanded="false">' + icon('menu', 20, 2) + '</button><span class="topbar-title" id="topbar-title">Dashboard</span><span class="demo-badge">Demo</span></header>' +
      '<main class="content" id="content" tabindex="-1"></main>' +
      '</div>' +
      '<a class="fab" href="#new-sale" aria-label="New sale" id="fab">' + icon('plus', 22, 2.4) + '</a>' +
      '</div>';

    var sb = $('#sidebar'), scrim = $('#scrim'), mb = $('#menu-btn');
    var setMenu = function (open) { sb.classList.toggle('open', open); scrim.classList.toggle('show', open); mb.setAttribute('aria-expanded', String(open)); };
    mb.addEventListener('click', function () { setMenu(!sb.classList.contains('open')); });
    scrim.addEventListener('click', function () { setMenu(false); });
    $$('.nav a', sb).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && sb.classList.contains('open')) setMenu(false); });
    $('#logout').addEventListener('click', function () {
      confirmDialog({ title: 'Sign out?', body: 'You will return to the sign-in screen. Your demo sales stay saved in this browser.', confirm: 'Sign out' })
        .then(function (ok) { if (ok) { S.signOut(); location.hash = ''; showLogin(); } });
    });
    route();
  }

  // ------------------------------------------------------------------ router
  function route() {
    if (!$('#content')) return;
    var h = (location.hash || '').replace(/^#/, '') || 'dashboard';
    var page, key = h;
    if (h.indexOf('edit-') === 0) { page = function (c) { pageSaleForm(c, h.slice(5)); }; key = 'history'; }
    else page = { dashboard: pageDashboard, 'new-sale': function (c) { pageSaleForm(c, null); }, history: pageHistory, reports: pageReports, preferences: pagePreferences }[h];
    if (!page) { page = pageDashboard; key = 'dashboard'; }
    $$('.nav a').forEach(function (a) { if (a.dataset.route === key) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    var label = (NAV.find(function (n) { return n[0] === key; }) || NAV[0])[2];
    $('#topbar-title').textContent = h.indexOf('edit-') === 0 ? 'Edit sale' : label;
    $('#fab').hidden = key === 'new-sale' || h.indexOf('edit-') === 0;
    document.title = (h.indexOf('edit-') === 0 ? 'Edit sale' : label) + ' · SalesFlow';
    var c = $('#content');
    c.innerHTML = '';
    page(c);
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);

  function pageHead(title, sub, actions) {
    return '<header class="page-head"><div class="titles"><h1>' + esc(title) + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div>' + (actions ? '<div class="actions">' + actions + '</div>' : '') + '</header>';
  }

  // ------------------------------------------------------------------ dashboard
  var dashPreset = '30';
  var PRESETS = [['7', '7 days'], ['30', '30 days'], ['90', '90 days'], ['month', 'This month']];
  function presetRange(id) {
    var to = S.todayIso();
    if (id === 'month') return { from: to.slice(0, 8) + '01', to: to };
    return { from: S.addDays(to, -(+id - 1)), to: to };
  }

  function statusStrip(byStatus, link) {
    var conf = [['Pending', 'clock', 'Awaiting delivery'], ['Delivered', 'check', 'Completed'], ['Returned', 'undo', 'Not counted in totals']];
    return '<section class="status-strip" aria-label="Delivery status">' + conf.map(function (c) {
      var b = byStatus[c[0]];
      var tag = link ? 'a href="#history" data-status="' + c[0] + '"' : 'div';
      return '<' + tag + ' class="card status-card"><span class="status-ico ' + TONE[c[0]] + '">' + icon(c[1], 18, 2.2) + '</span>' +
        '<span class="t"><b>' + c[0] + '</b><span>' + c[2] + '</span></span>' +
        '<span class="v"><b>' + num(b.orders) + '</b><span>' + esc(money(b.amount)) + '</span></span></' + (link ? 'a' : 'div') + '>';
    }).join('') + '</section>';
  }

  function recentTable(orders) {
    if (!orders.length) return '<div class="empty"><b>No sales yet</b><span>New orders will appear here.</span></div>';
    return '<div class="table-wrap"><table class="table table-cards"><thead><tr><th scope="col">Date</th><th scope="col">Customer</th><th scope="col">Items</th><th scope="col" class="right">Qty</th><th scope="col" class="right">Total</th><th scope="col">Status</th></tr></thead><tbody>' +
      orders.map(function (o) {
        var more = o.items.length > 2 ? '<div class="sub">+' + (o.items.length - 2) + ' more</div>' : '';
        return '<tr class="clickable" tabindex="0" data-id="' + esc(o.id) + '"><td data-label="Date" class="nowrap">' + fmtDate(o.date) + '</td>' +
          '<td data-label="Customer"><div><div class="cust">' + esc(o.name) + '</div><div class="sub">' + esc(o.phone) + '</div></div></td>' +
          '<td data-label="Items"><div>' + o.items.slice(0, 2).map(function (l) { return '<div>' + lineText(l) + '</div>'; }).join('') + more + '</div></td>' +
          '<td data-label="Qty" class="right num">' + num(S.orderQty(o)) + '</td>' +
          '<td data-label="Total" class="right num nowrap">' + esc(money(S.orderTotal(o))) + '</td>' +
          '<td data-label="Status">' + badge(o.status) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }
  function bindRowOpen(container) {
    $$('tr[data-id]', container).forEach(function (tr) {
      var open = function () { viewSale(tr.dataset.id); };
      tr.addEventListener('click', open);
      tr.addEventListener('keydown', function (e) { if (e.key === 'Enter') open(); });
    });
  }

  function pageDashboard(c) {
    var r = presetRange(dashPreset);
    var len = S.daysBetween(r.from, r.to) + 1;
    var all = S.orders();
    var cur30 = C.summarize(all, r.from, r.to);
    var prev = C.summarize(all, S.addDays(r.from, -len), S.addDays(r.from, -1));
    var today = S.todayIso();
    var t = C.summarize(all, today, today);
    var delta = prev.total ? ((cur30.total - prev.total) / prev.total) * 100 : 0;
    var lastToday = t.inRange.map(function (o) { return o.time; }).sort().pop();
    var recent = all.slice().sort(function (a, b) { return (b.date + b.time).localeCompare(a.date + a.time); }).slice(0, 6);

    c.innerHTML = pageHead('Dashboard', esc(fmtRange(r.from, r.to)) + ' · ' + esc(S.settings().timezone),
      '<div class="segmented" role="group" aria-label="Date range">' + PRESETS.map(function (p) { return '<button type="button" data-preset="' + p[0] + '" aria-pressed="' + (p[0] === dashPreset) + '">' + p[1] + '</button>'; }).join('') + '</div>' +
      '<button type="button" class="btn btn-icon" id="refresh" aria-label="Refresh">' + icon('refresh') + '</button>' +
      '<a class="btn btn-primary" href="#new-sale">' + icon('plus', 16, 2.2) + 'New sale</a>') +
      '<section class="grid-kpi" aria-label="Key figures">' +
      '<div class="card stat"><span class="stat-label">Total sales</span><span class="stat-value">' + esc(money(cur30.total)) + '</span><span class="stat-sub ' + (delta >= 0 ? 'up' : 'down') + '">' + (delta >= 0 ? '+' : '') + delta.toFixed(1) + '% vs previous ' + len + ' days</span></div>' +
      '<div class="card stat"><span class="stat-label">Orders</span><span class="stat-value">' + num(cur30.orders) + '</span><span class="stat-sub">Avg. ' + esc(money(cur30.avg)) + ' per order</span></div>' +
      '<div class="card stat"><span class="stat-label">Items sold</span><span class="stat-value">' + num(cur30.qty) + '</span><span class="stat-sub">' + (cur30.orders ? (cur30.qty / cur30.orders).toFixed(1) : '0') + ' items per order</span></div>' +
      '<div class="card stat hero"><span class="stat-label">Today</span><span class="stat-value">' + esc(money(t.total)) + '</span><span class="stat-sub">' + num(t.orders) + ' orders' + (lastToday ? ' · last at ' + esc(lastToday) : '') + '</span></div>' +
      '</section>' +
      statusStrip(cur30.byStatus, true) +
      '<section class="row"><div class="card grow-2"><div class="card-head"><h2>Sales trend</h2><span class="muted">Daily, ' + esc(cur()) + '</span></div><div id="trend"></div></div>' +
      '<div class="card grow-1"><div class="card-head"><h2>Sales by item</h2><span class="muted">Top 5</span></div><div id="by-item"></div></div></section>' +
      '<section class="card"><div class="card-head"><h2>Recent sales</h2><a href="#history" style="font-size:14px;font-weight:500;text-decoration:none">View all</a></div>' + recentTable(recent) + '</section>';

    $$('[data-preset]', c).forEach(function (b) { b.addEventListener('click', function () { dashPreset = b.dataset.preset; route(); }); });
    $('#refresh', c).addEventListener('click', function () { route(); toast('Dashboard refreshed'); });
    $$('[data-status]', c).forEach(function (a) { a.addEventListener('click', function () { historyState = freshHistoryState(); historyState.status = a.dataset.status; historyState.from = r.from; historyState.to = r.to; }); });

    var pts = C.buckets(cur30.counted, r.from, r.to, len > 100 ? 'weekly' : 'daily').map(function (b) { return { label: fmtDate(b.key), tip: fmtDate(b.key, true) + ' · ' + b.orders + ' orders', value: b.amount }; });
    C.lineChart($('#trend', c), pts, { format: money, label: 'Daily sales from ' + fmtRange(r.from, r.to) + ', total ' + money(cur30.total) });
    var top = cur30.items.slice(0, 5);
    var bi = $('#by-item', c);
    if (top.length) bi.appendChild(C.barList(top.map(function (i) { return { label: i.item, value: i.amount, display: moneyShort(i.amount) }; })));
    else bi.innerHTML = '<div class="empty"><b>No sales in this range</b></div>';
    bindRowOpen(c);
  }

  // ------------------------------------------------------------------ view sale
  function viewSale(id) {
    var o = S.get(id);
    if (!o) { toast('That sale no longer exists.', 'bad'); return; }
    var d = openDialog(
      '<div class="dlg-head"><div><h2>' + esc(o.name) + '</h2><p class="muted" style="font-size:14px">' + esc(fmtDate(o.date, true)) + ' at ' + esc(o.time) + ' · #' + esc(o.id) + '</p></div><button type="button" class="btn btn-ghost btn-icon btn-sm" data-close aria-label="Close">' + icon('x') + '</button></div>' +
      '<dl class="kv"><dt>Phone</dt><dd>' + esc(o.phone) + '</dd><dt>Address</dt><dd>' + esc(o.address || '—') + '</dd><dt>Status</dt><dd>' + badge(o.status) + '</dd></dl>' +
      '<div class="lines">' + o.items.map(function (l) { return '<div><span>' + lineText(l) + '</span><span class="num">' + esc(money(l.amount)) + '</span></div>'; }).join('') + '</div>' +
      '<div class="total-row"><span class="muted">Total · ' + num(S.orderQty(o)) + ' items</span><span class="num" style="font-size:20px;font-weight:600">' + esc(money(S.orderTotal(o))) + '</span></div>' +
      '<div class="dlg-foot"><button type="button" class="btn" data-del>' + icon('trash', 16) + 'Delete</button><a class="btn btn-primary" href="#edit-' + esc(o.id) + '" data-edit>' + icon('edit', 16) + 'Edit</a></div>');
    $('[data-edit]', d).addEventListener('click', function () { d.close(); });
    $('[data-del]', d).addEventListener('click', function () { d.close(); deleteSale(o.id); });
  }
  function deleteSale(id) {
    var o = S.get(id); if (!o) return;
    confirmDialog({ title: 'Delete this sale?', body: o.name + ' · ' + money(S.orderTotal(o)) + ' on ' + fmtDate(o.date, true) + '. This removes all of its items and cannot be undone.', confirm: 'Delete sale', danger: true })
      .then(function (ok) { if (ok) { S.remove(id); toast('Sale deleted'); route(); } });
  }

  // ------------------------------------------------------------------ new / edit sale
  var PHONE_RE = /^[+]?[0-9][0-9 -]{5,19}$/;
  var LIMITS = { name: 100, phone: 30, address: 300, item: 100, color: 40, items: 30 };

  function pageSaleForm(c, editId) {
    var st = S.settings();
    var editing = editId ? S.get(editId) : null;
    if (editId && !editing) {
      c.innerHTML = pageHead('Sale not found') + '<div class="card empty"><b>This sale no longer exists.</b><span>It may have been deleted.</span><a class="btn" href="#history">Back to history</a></div>';
      return;
    }
    var o = editing ? JSON.parse(JSON.stringify(editing)) : { date: S.todayIso(), name: '', phone: '', address: '', status: 'Pending', items: [{ item: '', size: st.sizes[2] || st.sizes[0], color: '', qty: 1, amount: '' }] };

    c.innerHTML = pageHead(editing ? 'Edit sale' : 'New sale', editing ? 'Sale #' + esc(editing.id) + ' · changes update every report.' : 'One order can hold several items. Each item is saved as its own line.') +
      '<datalist id="dl-items">' + S.knownItems().map(function (i) { return '<option value="' + esc(i) + '"></option>'; }).join('') + '</datalist>' +
      '<datalist id="dl-colors">' + st.colors.map(function (i) { return '<option value="' + esc(i) + '"></option>'; }).join('') + '</datalist>' +
      '<form id="sale-form" class="row" novalidate>' +
      '<div class="grow-2 stack" style="gap:20px">' +
      '<fieldset class="fieldset"><legend>Customer</legend><div class="grid-3">' +
      field('date', 'Date', '<input class="input" type="date" id="s-date" name="date" required max="' + S.todayIso() + '" value="' + esc(o.date) + '">') +
      field('name', 'Name', '<input class="input" id="s-name" name="name" autocomplete="off" maxlength="' + LIMITS.name + '" value="' + esc(o.name) + '" placeholder="Customer name">') +
      field('phone', 'Phone', '<input class="input" id="s-phone" name="phone" inputmode="tel" autocomplete="off" maxlength="' + LIMITS.phone + '" value="' + esc(o.phone) + '" placeholder="09 7712 3348">') +
      '</div>' + field('address', 'Address', '<textarea class="textarea" id="s-address" name="address" rows="2" maxlength="' + LIMITS.address + '" placeholder="Delivery address (optional)">' + esc(o.address) + '</textarea>') + '</fieldset>' +
      '<fieldset class="fieldset"><legend>Items</legend><div class="stack" id="lines" style="gap:12px"></div>' +
      '<button type="button" class="btn add-line" id="add-line">' + icon('plus', 16, 2) + 'Add item</button></fieldset>' +
      '</div>' +
      '<aside class="card grow-1 summary" aria-label="Order summary"><h2>Order summary</h2><div class="summary-lines" id="sum-lines"></div><div class="divider"></div>' +
      '<div class="total-row"><span class="muted" id="sum-count"></span><span class="num" id="sum-total"></span></div>' +
      '<fieldset style="border:0;margin:0;padding:0;display:flex;flex-direction:column;gap:8px"><legend class="label" style="padding:0;margin-bottom:8px">Delivery status</legend><div class="status-pick">' +
      S.STATUSES.map(function (s) { return '<label><input type="radio" name="status" value="' + s + '"' + (o.status === s ? ' checked' : '') + '><span>' + s + '</span></label>'; }).join('') + '</div></fieldset>' +
      '<div class="form-error" id="form-error" role="alert" hidden></div>' +
      '<button type="submit" class="btn btn-primary btn-block" id="save-btn" style="height:48px;font-size:15px">' + (editing ? 'Save changes' : 'Save sale') + '</button>' +
      (editing ? '<a class="btn btn-block" href="#history">Cancel</a>' : '<button type="button" class="btn btn-block" id="clear-btn">Clear form</button>') +
      '</aside></form>';

    var linesEl = $('#lines', c);
    var lineSeq = 0;
    function addLine(l) {
      var i = ++lineSeq;
      var div = document.createElement('div');
      div.className = 'line-item';
      div.innerHTML = '<div class="line-head"><span class="line-title"></span><button type="button" class="btn btn-sm btn-icon" data-remove>' + icon('x', 16, 2) + '</button></div>' +
        '<div class="line-grid">' +
        '<div class="field f-item"><label for="l' + i + '-item">Item</label><input class="input" id="l' + i + '-item" data-f="item" list="dl-items" maxlength="' + LIMITS.item + '" autocomplete="off" placeholder="Type or pick" value="' + esc(l.item) + '"><span class="error" hidden></span></div>' +
        '<div class="field"><label for="l' + i + '-size">Size</label><select class="select" id="l' + i + '-size" data-f="size">' + st.sizes.concat(st.sizes.indexOf(l.size) < 0 && l.size ? [l.size] : []).map(function (s) { return '<option' + (s === l.size ? ' selected' : '') + '>' + esc(s) + '</option>'; }).join('') + '</select></div>' +
        '<div class="field"><label for="l' + i + '-color">Color</label><input class="input" id="l' + i + '-color" data-f="color" list="dl-colors" maxlength="' + LIMITS.color + '" autocomplete="off" placeholder="Type or pick" value="' + esc(l.color) + '"><span class="error" hidden></span></div>' +
        '<div class="field"><label for="l' + i + '-qty">Qty</label><input class="input mono" id="l' + i + '-qty" data-f="qty" inputmode="numeric" value="' + esc(l.qty) + '"><span class="error" hidden></span></div>' +
        '<div class="field f-amount"><label for="l' + i + '-amount">Amount (' + esc(cur()) + ')</label><input class="input mono" id="l' + i + '-amount" data-f="amount" inputmode="numeric" placeholder="Line total" value="' + (l.amount === '' ? '' : esc(num(l.amount))) + '"><span class="error" hidden></span></div>' +
        '</div>';
      linesEl.appendChild(div);
      $('[data-remove]', div).addEventListener('click', function () { div.remove(); renumber(); refresh(); });
      $('[data-f=amount]', div).addEventListener('blur', function () { var v = parseAmount(this.value); if (v != null && v > 0) this.value = num(v); });
      renumber();
    }
    function renumber() {
      var items = $$('.line-item', linesEl);
      items.forEach(function (d, k) {
        $('.line-title', d).textContent = 'Item ' + (k + 1);
        var rm = $('[data-remove]', d); rm.hidden = items.length === 1; rm.setAttribute('aria-label', 'Remove item ' + (k + 1));
      });
      $('#add-line', c).hidden = items.length >= LIMITS.items;
    }
    function parseAmount(v) { var s = String(v).replace(/[,\s]/g, ''); if (!/^\d+(\.\d{1,2})?$/.test(s)) return null; return Number(s); }
    function readForm() {
      var f = $('#sale-form', c);
      return {
        date: f.date.value, name: f.name.value.trim(), phone: f.phone.value.trim(), address: f.address.value.trim(),
        status: (f.querySelector('input[name=status]:checked') || {}).value || 'Pending',
        lines: $$('.line-item', linesEl).map(function (d) {
          var g = function (k) { return $('[data-f=' + k + ']', d).value; };
          return { el: d, item: g('item').trim(), size: g('size'), color: g('color').trim(), qtyRaw: g('qty').trim(), amountRaw: g('amount').trim() };
        }),
      };
    }
    function refresh() {
      var v = readForm(); var total = 0, qty = 0;
      $('#sum-lines', c).innerHTML = v.lines.map(function (l, k) {
        var a = parseAmount(l.amountRaw); var q = parseInt(l.qtyRaw, 10) || 0;
        if (a) total += a; qty += q;
        return '<div' + (a ? '' : ' class="muted"') + '><span>' + esc(l.item || 'Item ' + (k + 1)) + ' · ' + esc(l.size) + ' × ' + q + '</span><span class="mono">' + (a ? esc(money(a)) : '—') + '</span></div>';
      }).join('');
      $('#sum-count', c).textContent = 'Total · ' + qty + (qty === 1 ? ' item' : ' items');
      $('#sum-total', c).textContent = money(total);
    }
    function setErr(box, msg) {
      var e = $('.error', box); box.classList.toggle('invalid', !!msg);
      if (e) { e.hidden = !msg; e.textContent = msg || ''; }
    }
    function validate(v) {
      var bad = [];
      var check = function (id, msg) { var box = $('#f-' + id, c); setErr(box, msg); if (msg) bad.push(box); };
      check('date', !v.date ? 'Pick the sale date.' : v.date > S.todayIso() ? 'The date can’t be in the future.' : '');
      check('name', !v.name ? 'Enter the customer’s name.' : '');
      check('phone', !v.phone ? 'Enter a phone number.' : !PHONE_RE.test(v.phone) ? 'Use digits only, e.g. 09 7712 3348.' : '');
      check('address', '');
      v.lines.forEach(function (l) {
        var fields = {
          item: !l.item ? 'Item is required.' : '',
          color: !l.color ? 'Color is required.' : '',
          qty: !/^\d+$/.test(l.qtyRaw) || +l.qtyRaw < 1 ? 'Whole number, 1 or more.' : +l.qtyRaw > 100000 ? 'Too large.' : '',
          amount: !l.amountRaw ? 'Amount is required.' : !(parseAmount(l.amountRaw) > 0) ? 'Enter an amount above 0.' : '',
        };
        Object.keys(fields).forEach(function (k) { var box = $('[data-f=' + k + ']', l.el).closest('.field'); setErr(box, fields[k]); if (fields[k]) bad.push(box); });
      });
      return bad;
    }

    o.items.forEach(addLine);
    refresh();
    var form = $('#sale-form', c);
    form.addEventListener('input', refresh);
    form.addEventListener('change', refresh);
    $('#add-line', c).addEventListener('click', function () {
      var last = readForm().lines.pop();
      addLine({ item: '', size: last ? last.size : st.sizes[0], color: '', qty: 1, amount: '' });
      refresh();
      var items = $$('.line-item', linesEl); $('[data-f=item]', items[items.length - 1]).focus();
    });
    var clear = $('#clear-btn', c);
    if (clear) clear.addEventListener('click', function () { route(); });

    var saving = false;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (saving) return;
      var v = readForm();
      var bad = validate(v);
      var fe = $('#form-error', c);
      if (bad.length) {
        fe.hidden = false; fe.textContent = bad.length === 1 ? 'One field needs attention.' : bad.length + ' fields need attention.';
        var inp = $('input, select, textarea', bad[0]); if (inp) inp.focus();
        return;
      }
      fe.hidden = true;
      var rec = {
        date: v.date, name: v.name, phone: v.phone, address: v.address, status: v.status,
        items: v.lines.map(function (l) { return { item: l.item, size: l.size, color: l.color, qty: parseInt(l.qtyRaw, 10), amount: parseAmount(l.amountRaw) }; }),
      };
      var btn = $('#save-btn', c);
      saving = true; busy(btn, true);
      wait(450).then(function () {
        try {
          if (editing) { S.update(editing.id, rec, editing.updatedAt); toast('Changes saved'); location.hash = 'history'; }
          else { S.add(rec); toast('Sale saved · ' + money(S.orderTotal(rec))); route(); }
        } catch (err) {
          fe.hidden = false; fe.textContent = err.message; busy(btn, false); saving = false;
        }
      });
    });
  }
  function field(id, label, control) {
    return '<div class="field" id="f-' + id + '"><label for="s-' + id + '">' + label + '</label>' + control + '<span class="error" hidden></span></div>';
  }

  // ------------------------------------------------------------------ history
  var PAGE_SIZE = 10;
  function freshHistoryState() { return { q: '', field: 'all', size: '', color: '', status: '', from: '', to: '', sort: 'desc', page: 1 }; }
  var historyState = freshHistoryState();

  function filterOrders(hs) {
    var q = hs.q.toLowerCase();
    return S.orders().filter(function (o) {
      if (hs.status && o.status !== hs.status) return false;
      if (hs.from && o.date < hs.from) return false;
      if (hs.to && o.date > hs.to) return false;
      if (hs.size && !o.items.some(function (l) { return l.size === hs.size; })) return false;
      if (hs.color && !o.items.some(function (l) { return l.color.toLowerCase() === hs.color.toLowerCase(); })) return false;
      if (q) {
        var name = o.name.toLowerCase().indexOf(q) >= 0;
        var phone = o.phone.replace(/\D/g, '').indexOf(q.replace(/\D/g, '') || '\u0000') >= 0 || o.phone.indexOf(q) >= 0;
        var item = o.items.some(function (l) { return l.item.toLowerCase().indexOf(q) >= 0; });
        var hit = hs.field === 'name' ? name : hs.field === 'phone' ? phone : hs.field === 'item' ? item : name || phone || item || o.address.toLowerCase().indexOf(q) >= 0;
        if (!hit) return false;
      }
      return true;
    }).sort(function (a, b) {
      var k = (a.date + a.time).localeCompare(b.date + b.time);
      return hs.sort === 'asc' ? k : -k;
    });
  }

  function pageHistory(c) {
    var st = S.settings();
    var hs = historyState;
    c.innerHTML = pageHead('Sales history', '<span id="h-count"></span>',
      '<button type="button" class="btn" id="export">' + icon('download', 16, 2) + 'Export CSV</button><a class="btn btn-primary" href="#new-sale">' + icon('plus', 16, 2.2) + 'New sale</a>') +
      '<section class="card filters collapsed" id="h-filters" aria-label="Filters">' +
      '<button type="button" class="btn filters-toggle" id="h-more" aria-expanded="false" aria-controls="h-filters">Filters</button>' +
      '<div class="field search"><label for="h-q">Search</label><div class="search-wrap">' + icon('search', 16, 2) + '<input class="input" type="search" id="h-q" placeholder="Name, phone or item" value="' + esc(hs.q) + '"></div></div>' +
      selectField('h-field', 'Search in', [['all', 'All fields'], ['name', 'Name'], ['phone', 'Phone'], ['item', 'Item']], hs.field) +
      selectField('h-size', 'Size', [['', 'All sizes']].concat(st.sizes.map(function (s) { return [s, s]; })), hs.size) +
      selectField('h-color', 'Color', [['', 'All colors']].concat(st.colors.map(function (s) { return [s, s]; })), hs.color) +
      selectField('h-status', 'Status', [['', 'All statuses']].concat(S.STATUSES.map(function (s) { return [s, s]; })), hs.status) +
      '<div class="field" style="flex:1.4 1 240px"><span class="label" style="font-size:13px" id="h-range-l">Date range</span><div class="date-pair" role="group" aria-labelledby="h-range-l"><input class="input" type="date" id="h-from" aria-label="From date" value="' + esc(hs.from) + '"><input class="input" type="date" id="h-to" aria-label="To date" value="' + esc(hs.to) + '"></div></div>' +
      '<button type="button" class="btn" id="h-reset">Clear filters</button>' +
      '</section>' +
      '<section class="card table-card" id="h-table"></section>';

    var draw = function () {
      var rows = filterOrders(hs);
      var pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
      if (hs.page > pages) hs.page = pages;
      var slice = rows.slice((hs.page - 1) * PAGE_SIZE, hs.page * PAGE_SIZE);
      var total = rows.filter(function (o) { return o.status !== 'Returned'; }).reduce(function (s, o) { return s + S.orderTotal(o); }, 0);
      $('#h-count', c).textContent = num(rows.length) + (rows.length === 1 ? ' order · ' : ' orders · ') + money(total) + ' excluding returns';
      var box = $('#h-table', c);
      if (!rows.length) { box.innerHTML = '<div class="empty"><b>No sales match these filters</b><span>Try a wider date range or clear the search.</span></div>'; return; }
      box.innerHTML = '<div class="table-wrap"><table class="table table-cards"><thead><tr>' +
        '<th scope="col" aria-sort="' + (hs.sort === 'asc' ? 'ascending' : 'descending') + '"><button type="button" id="h-sort">Date ' + icon(hs.sort === 'asc' ? 'arrowUp' : 'arrowDown', 13, 2) + '</button></th>' +
        '<th scope="col">Customer</th><th scope="col">Items</th><th scope="col" class="right">Qty</th><th scope="col" class="right">Total</th><th scope="col">Status</th><th scope="col"><span class="sr-only">Actions</span></th></tr></thead><tbody>' +
        slice.map(function (o) {
          return '<tr data-row="' + esc(o.id) + '"><td data-label="Date" class="nowrap">' + fmtDate(o.date, true) + '<div class="sub">' + esc(o.time) + '</div></td>' +
            '<td data-label="Customer"><div><div class="cust">' + esc(o.name) + '</div><div class="sub">' + esc(o.phone) + '</div></div></td>' +
            '<td data-label="Items"><div>' + o.items.map(function (l) { return '<div>' + lineText(l) + '</div>'; }).join('') + '</div></td>' +
            '<td data-label="Qty" class="right num">' + num(S.orderQty(o)) + '</td>' +
            '<td data-label="Total" class="right num nowrap">' + esc(money(S.orderTotal(o))) + '</td>' +
            '<td data-label="Status"><label class="sr-only" for="st-' + esc(o.id) + '">Delivery status for ' + esc(o.name) + '</label><select class="status-select ' + TONE[o.status] + '" id="st-' + esc(o.id) + '" data-status-of="' + esc(o.id) + '">' +
            S.STATUSES.map(function (s) { return '<option' + (s === o.status ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select></td>' +
            '<td data-label="Actions"><div class="row-actions">' +
            '<button type="button" class="btn btn-sm btn-icon" data-view="' + esc(o.id) + '" aria-label="View sale for ' + esc(o.name) + '">' + icon('eye', 15, 2) + '</button>' +
            '<a class="btn btn-sm btn-icon" href="#edit-' + esc(o.id) + '" aria-label="Edit sale for ' + esc(o.name) + '">' + icon('edit', 15, 2) + '</a>' +
            '<button type="button" class="btn btn-sm btn-icon" data-del="' + esc(o.id) + '" aria-label="Delete sale for ' + esc(o.name) + '" style="color:var(--bad)">' + icon('trash', 15, 2) + '</button></div></td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<div class="pager"><span>Showing ' + ((hs.page - 1) * PAGE_SIZE + 1) + '–' + Math.min(rows.length, hs.page * PAGE_SIZE) + ' of ' + num(rows.length) + '</span><div>' +
        '<button type="button" class="btn btn-sm" id="pg-prev"' + (hs.page <= 1 ? ' disabled' : '') + '>Previous</button>' +
        '<span style="align-self:center;padding:0 6px" class="mono">' + hs.page + ' / ' + pages + '</span>' +
        '<button type="button" class="btn btn-sm" id="pg-next"' + (hs.page >= pages ? ' disabled' : '') + '>Next</button></div></div>';

      $('#h-sort', box).addEventListener('click', function () { hs.sort = hs.sort === 'asc' ? 'desc' : 'asc'; hs.page = 1; draw(); });
      $('#pg-prev', box).addEventListener('click', function () { hs.page--; draw(); box.scrollIntoView({ block: 'start' }); });
      $('#pg-next', box).addEventListener('click', function () { hs.page++; draw(); box.scrollIntoView({ block: 'start' }); });
      $$('[data-status-of]', box).forEach(function (sel) {
        sel.addEventListener('change', function () {
          var o = S.update(sel.dataset.statusOf, { status: sel.value });
          sel.className = 'status-select ' + TONE[o.status];
          toast(o.name + ' marked ' + o.status.toLowerCase());
          var rowsNow = filterOrders(hs);
          $('#h-count', c).textContent = num(rowsNow.length) + ' orders · ' + money(rowsNow.filter(function (x) { return x.status !== 'Returned'; }).reduce(function (s, x) { return s + S.orderTotal(x); }, 0)) + ' excluding returns';
        });
      });
      $$('[data-view]', box).forEach(function (b) { b.addEventListener('click', function () { viewSale(b.dataset.view); }); });
      $$('[data-del]', box).forEach(function (b) { b.addEventListener('click', function () { deleteSale(b.dataset.del); }); });
    };

    var debounce;
    $('#h-q', c).addEventListener('input', function () { var v = this.value; clearTimeout(debounce); debounce = setTimeout(function () { hs.q = v.trim(); hs.page = 1; draw(); }, 150); });
    [['h-field', 'field'], ['h-size', 'size'], ['h-color', 'color'], ['h-status', 'status'], ['h-from', 'from'], ['h-to', 'to']].forEach(function (p) {
      $('#' + p[0], c).addEventListener('change', function () { hs[p[1]] = this.value; hs.page = 1; draw(); });
    });
    $('#h-reset', c).addEventListener('click', function () { historyState = freshHistoryState(); route(); });
    var active = ['size', 'color', 'status', 'from', 'to'].filter(function (k) { return hs[k]; }).length + (hs.field !== 'all' ? 1 : 0);
    var more = $('#h-more', c);
    if (active) more.textContent = 'Filters (' + active + ')';
    more.addEventListener('click', function () {
      var open = $('#h-filters', c).classList.toggle('collapsed') === false;
      more.setAttribute('aria-expanded', String(open));
    });
    $('#export', c).addEventListener('click', function () { exportCsv(filterOrders(hs)); });
    draw();
  }
  function selectField(id, label, opts, val) {
    return '<div class="field"><label for="' + id + '">' + label + '</label><select class="select" id="' + id + '">' +
      opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === val ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></div>';
  }

  /** CSV with one row per item line. Cells starting with = + - @ are prefixed so spreadsheets never run them as formulas. */
  function csvCell(v) {
    var s = String(v == null ? '' : v);
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }
  function exportCsv(rows) {
    var head = ['Order ID', 'Date', 'Time', 'Name', 'Phone', 'Address', 'Item', 'Size', 'Color', 'Qty', 'Amount', 'Status'];
    var lines = [head.join(',')];
    rows.forEach(function (o) { o.items.forEach(function (l) { lines.push([o.id, o.date, o.time, o.name, o.phone, o.address, l.item, l.size, l.color, l.qty, l.amount, o.status].map(csvCell).join(',')); }); });
    var csv = lines.join('\r\n');
    var name = 'salesflow-sales-' + S.todayIso() + '.csv';
    var d = openDialog('<div class="dlg-head"><div><h2>Export CSV</h2><p class="muted" style="font-size:14px">' + num(rows.length) + ' orders · ' + num(lines.length - 1) + ' item rows, matching your filters.</p></div><button type="button" class="btn btn-ghost btn-icon btn-sm" data-close aria-label="Close">' + icon('x') + '</button></div>' +
      '<label class="sr-only" for="csv-text">CSV preview</label><textarea class="csv-box" id="csv-text" readonly></textarea>' +
      '<div class="dlg-foot"><button type="button" class="btn" data-copy>' + icon('copy', 16) + 'Copy</button><button type="button" class="btn btn-primary" data-dl>' + icon('download', 16, 2) + 'Download ' + esc(name) + '</button></div>');
    $('#csv-text', d).value = csv;
    $('[data-copy]', d).addEventListener('click', function () {
      var ta = $('#csv-text', d);
      var fallback = function () { ta.focus(); ta.select(); toast('Text selected. Press Ctrl+C or ⌘C to copy.'); };
      try { navigator.clipboard.writeText(csv).then(function () { toast('CSV copied'); }, fallback); } catch (e) { fallback(); }
    });
    $('[data-dl]', d).addEventListener('click', function () {
      try {
        var url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
        var a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
        toast('Download started. If nothing appears, use Copy instead.');
      } catch (e) { toast('Download is blocked here. Use Copy instead.', 'bad'); }
    });
  }

  // ------------------------------------------------------------------ reports
  var reportState = { period: 'weekly', from: '', to: '' };
  function pageReports(c) {
    var rs = reportState;
    var today = S.todayIso();
    if (!rs.from) { rs.from = S.addDays(today, -89); rs.to = today; }
    var sum = C.summarize(S.orders(), rs.from, rs.to);
    var b = C.buckets(sum.counted, rs.from, rs.to, rs.period);
    var label = function (k) { return rs.period === 'monthly' ? fmtMonth(k) : rs.period === 'weekly' ? 'Wk of ' + fmtDate(k) : fmtDate(k); };
    var best = b.slice().sort(function (x, y) { return y.amount - x.amount; })[0];
    var unit = { daily: 'day', weekly: 'week', monthly: 'month' }[rs.period];

    c.innerHTML = pageHead('Reports', esc(fmtRange(rs.from, rs.to)) + ' · returns excluded',
      '<div class="segmented" role="group" aria-label="Group by">' + [['daily', 'Daily'], ['weekly', 'Weekly'], ['monthly', 'Monthly']].map(function (p) { return '<button type="button" data-period="' + p[0] + '" aria-pressed="' + (p[0] === rs.period) + '">' + p[1] + '</button>'; }).join('') + '</div>') +
      '<section class="card filters" aria-label="Report range">' +
      '<div class="field"><label for="r-from">From</label><input class="input" type="date" id="r-from" value="' + rs.from + '" max="' + today + '"></div>' +
      '<div class="field"><label for="r-to">To</label><input class="input" type="date" id="r-to" value="' + rs.to + '" max="' + today + '"></div>' +
      '<div class="segmented" role="group" aria-label="Quick ranges" style="align-self:flex-end">' + [['30', 'Last 30 days'], ['90', 'Last 90 days'], ['120', 'All sample data']].map(function (p) { return '<button type="button" data-quick="' + p[0] + '" aria-pressed="false">' + p[1] + '</button>'; }).join('') + '</div>' +
      '</section>' +
      '<section class="grid-kpi">' +
      '<div class="card stat"><span class="stat-label">Revenue</span><span class="stat-value">' + esc(money(sum.total)) + '</span><span class="stat-sub">' + num(sum.byStatus.Returned.orders) + ' returned orders excluded</span></div>' +
      '<div class="card stat"><span class="stat-label">Orders</span><span class="stat-value">' + num(sum.orders) + '</span><span class="stat-sub">' + num(sum.qty) + ' items sold</span></div>' +
      '<div class="card stat"><span class="stat-label">Average order</span><span class="stat-value">' + esc(money(sum.avg)) + '</span><span class="stat-sub">Per counted order</span></div>' +
      '<div class="card stat hero"><span class="stat-label">Best ' + unit + '</span><span class="stat-value">' + (best && best.amount ? esc(money(best.amount)) : '—') + '</span><span class="stat-sub">' + (best && best.amount ? esc(label(best.key)) + ' · ' + best.orders + ' orders' : 'No sales') + '</span></div>' +
      '</section>' +
      statusStrip(sum.byStatus, false) +
      '<section class="card"><div class="card-head"><h2>Revenue by ' + unit + '</h2><span class="muted">' + esc(cur()) + '</span></div><div id="r-chart"></div></section>' +
      '<section class="row">' +
      '<div class="card grow-1"><div class="card-head"><h2>Best-selling items</h2><span class="muted">By revenue</span></div>' +
      (sum.items.length ? '<div class="table-wrap"><table class="table"><thead><tr><th scope="col">Item</th><th scope="col" class="right">Qty</th><th scope="col" class="right">Revenue</th><th scope="col" class="right">Share</th></tr></thead><tbody>' +
        sum.items.map(function (i) { return '<tr><td>' + esc(i.item) + '</td><td class="right num">' + num(i.qty) + '</td><td class="right num nowrap">' + esc(money(i.amount)) + '</td><td class="right num">' + (sum.total ? ((i.amount / sum.total) * 100).toFixed(1) : '0') + '%</td></tr>'; }).join('') +
        '</tbody></table></div>' : '<div class="empty"><b>No sales in this range</b></div>') + '</div>' +
      '<div class="card grow-1"><div class="card-head"><h2>Breakdown</h2><span class="muted">' + b.length + ' ' + unit + 's</span></div>' +
      '<div class="table-wrap" style="max-height:420px;overflow-y:auto"><table class="table"><thead><tr><th scope="col">' + unit.charAt(0).toUpperCase() + unit.slice(1) + '</th><th scope="col" class="right">Orders</th><th scope="col" class="right">Qty</th><th scope="col" class="right">Revenue</th></tr></thead><tbody>' +
      b.slice().reverse().map(function (x) { return '<tr><td class="nowrap">' + esc(label(x.key)) + '</td><td class="right num">' + num(x.orders) + '</td><td class="right num">' + num(x.qty) + '</td><td class="right num nowrap">' + esc(money(x.amount)) + '</td></tr>'; }).join('') +
      '</tbody></table></div></div></section>';

    $$('[data-period]', c).forEach(function (btn) { btn.addEventListener('click', function () { rs.period = btn.dataset.period; route(); }); });
    $$('[data-quick]', c).forEach(function (btn) { btn.addEventListener('click', function () { rs.to = today; rs.from = S.addDays(today, -(+btn.dataset.quick - 1)); route(); }); });
    var setRange = function () {
      var f = $('#r-from', c).value, t = $('#r-to', c).value;
      if (!f || !t) return;
      if (f > t) { toast('“From” must be on or before “To”.', 'bad'); return; }
      rs.from = f; rs.to = t; route();
    };
    $('#r-from', c).addEventListener('change', setRange);
    $('#r-to', c).addEventListener('change', setRange);
    C.lineChart($('#r-chart', c), b.map(function (x) { return { label: rs.period === 'monthly' ? fmtMonth(x.key) : fmtDate(x.key), tip: label(x.key) + ' · ' + x.orders + ' orders', value: x.amount }; }), { format: money, label: 'Revenue by ' + unit + ', ' + fmtRange(rs.from, rs.to) });
  }

  // ------------------------------------------------------------------ settings ("preferences" route)
  function pagePreferences(c) {
    var st = S.settings();
    var sess = S.session() || { username: 'demo', since: Date.now() };
    c.innerHTML = pageHead('Settings', 'Business details and the options offered on the sale form.') +
      '<section class="row">' +
      '<form class="card grow-1 stack" id="biz-form" novalidate><h2>Business</h2>' +
      '<div class="field" id="f-biz"><label for="p-biz">Business name</label><input class="input" id="p-biz" maxlength="60" value="' + esc(st.businessName) + '"><span class="error" hidden></span></div>' +
      '<div class="field"><label for="p-cur">Currency label</label><select class="select" id="p-cur">' + ['Ks', 'MMK', '$', 'THB', '€'].map(function (x) { return '<option' + (x === st.currency ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('') + '</select></div>' +
      '<div class="field"><label for="p-tz">Timezone</label><select class="select" id="p-tz">' + ['Asia/Yangon', 'Asia/Bangkok', 'Asia/Singapore', 'UTC'].map(function (x) { return '<option' + (x === st.timezone ? ' selected' : '') + '>' + x + '</option>'; }).join('') + '</select><span class="hint">Used to decide what counts as “today”.</span></div>' +
      '<button type="submit" class="btn btn-primary" style="align-self:flex-start">Save business details</button></form>' +
      '<div class="card grow-1 stack"><h2>Sale form options</h2>' + optionEditor('sizes', 'Sizes', st.sizes) + optionEditor('colors', 'Colors', st.colors) + '</div>' +
      '</section>' +
      '<section class="row">' +
      '<div class="card grow-1 stack"><h2>Session</h2><dl class="kv"><dt>Signed in as</dt><dd>' + esc(sess.username) + '</dd><dt>Role</dt><dd>Administrator</dd><dt>Since</dt><dd>' + esc(new Date(sess.since).toLocaleString()) + '</dd><dt>Data</dt><dd>' + num(S.orders().length) + ' sales saved in this browser</dd></dl>' +
      '<button type="button" class="btn" id="p-signout" style="align-self:flex-start">' + icon('logout', 16) + 'Sign out</button></div>' +
      '<div class="card grow-1 stack"><h2>Demo data</h2><p class="muted">Put back the original sample sales and settings. Anything you added or changed in this browser is replaced.</p>' +
      '<button type="button" class="btn" id="p-reset" style="align-self:flex-start;color:var(--bad)">' + icon('refresh', 16) + 'Reset demo data</button></div>' +
      '</section>';

    $('#biz-form', c).addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#p-biz', c).value.trim();
      var box = $('#f-biz', c); var err = $('.error', box);
      box.classList.toggle('invalid', !name); err.hidden = !!name; err.textContent = 'Enter a business name.';
      if (!name) return;
      S.saveSettings({ businessName: name, currency: $('#p-cur', c).value, timezone: $('#p-tz', c).value });
      $('#biz-name').textContent = name;
      toast('Business details saved');
    });
    ['sizes', 'colors'].forEach(function (key) {
      var wrap = $('#opt-' + key, c);
      var draw = function () {
        var list = S.settings()[key];
        $('.chips', wrap).innerHTML = list.map(function (v, i) { return '<span class="chip">' + esc(v) + '<button type="button" data-i="' + i + '" aria-label="Remove ' + esc(v) + '">' + icon('x', 13, 2.2) + '</button></span>'; }).join('');
        $$('[data-i]', wrap).forEach(function (b) {
          b.addEventListener('click', function () {
            var l = S.settings()[key].slice();
            if (l.length <= 1) { toast('Keep at least one option.', 'bad'); return; }
            var removed = l.splice(+b.dataset.i, 1)[0]; var p = {}; p[key] = l; S.saveSettings(p); draw(); toast('Removed ' + removed);
          });
        });
      };
      $('form', wrap).addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = $('input', wrap); var v = inp.value.trim(); if (!v) return;
        var l = S.settings()[key].slice();
        if (l.some(function (x) { return x.toLowerCase() === v.toLowerCase(); })) { toast(v + ' is already in the list.', 'bad'); return; }
        l.push(v.slice(0, 40)); var p = {}; p[key] = l; S.saveSettings(p); inp.value = ''; draw(); toast('Added ' + v);
      });
      draw();
    });
    $('#p-signout', c).addEventListener('click', function () { $('#logout').click(); });
    $('#p-reset', c).addEventListener('click', function () {
      confirmDialog({ title: 'Reset demo data?', body: 'All sales and settings in this browser go back to the original sample data.', confirm: 'Reset data', danger: true })
        .then(function (ok) {
          if (!ok) return;
          S.reset(); historyState = freshHistoryState(); reportState = { period: 'weekly', from: '', to: '' };
          $('#biz-name').textContent = S.settings().businessName; route(); toast('Demo data reset');
        });
    });
  }
  function optionEditor(key, label, list) {
    return '<div class="stack" id="opt-' + key + '" style="gap:10px"><span class="label">' + label + '</span><div class="chips"></div>' +
      '<form class="add-inline" novalidate><label class="sr-only" for="add-' + key + '">Add to ' + label.toLowerCase() + '</label><input class="input" id="add-' + key + '" maxlength="40" placeholder="Add ' + label.toLowerCase().replace(/s$/, '') + '"><button type="submit" class="btn">Add</button></form></div>';
  }

  boot();
})();
