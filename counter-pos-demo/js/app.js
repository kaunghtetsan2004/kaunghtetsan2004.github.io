/* =========================================================================
   Counter POS — static front-end demo (vanilla JS, no frameworks, no CDNs)
   Everything runs in the browser. Changes are kept in localStorage so the
   demo survives a refresh; "Reset demo" in the top ribbon clears them.
   ========================================================================= */
(function () {
  'use strict';

  var D = window.DemoData;
  var STORE_KEY = 'counter-pos-demo-v1';
  var PORTFOLIO_URL = 'https://kaunghtetsan.online';
  var BRAND = 'Counter'; // product name shown in the app — change it here

  /* ------------------------------------------------------------------ icons */
  var ICONS = {
    home: 'M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9.5Z',
    pos: 'M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.76L20.5 8H6.2M9 20.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Zm9 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1Z',
    receipt: 'M6 3h12v18l-3-2-3 2-3-2-3 2V3Zm3 5h6M9 12h6M9 16h3',
    box: 'M21 8 12 3 3 8m18 0-9 5m9-5v8l-9 5m0-8L3 8m9 5v8M3 8v8l9 5',
    layers: 'm12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5',
    truck: 'M3 6h11v10H3V6Zm11 4h4l3 3v3h-7v-6ZM7 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
    users: 'M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm13 9v-1a4 4 0 0 0-3-3.87M16 3.13A3.5 3.5 0 0 1 16 10',
    user: 'M20 21v-1a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v1m8-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
    wallet: 'M3 7a2 2 0 0 1 2-2h13v4M3 7v11a2 2 0 0 0 2 2h15V9H5a2 2 0 0 1-2-2Zm14 7h.01',
    chart: 'M4 20V10m6 10V4m6 16v-7m4 7H2',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2-1.2L14.5 3h-5l-.4 2.6a7.5 7.5 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1a7.5 7.5 0 0 0 2 1.2l.4 2.6h5l.4-2.6a7.5 7.5 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6c.07-.4.1-.8.1-1.2Z',
    shield: 'M12 3 4 6v6c0 5 3.4 8.3 8 9 4.6-.7 8-4 8-9V6l-8-3Zm-3 9 2 2 4-4',
    card: 'M3 6h18v12H3V6Zm0 4h18M7 15h3',
    logout: 'M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 16l-4-4 4-4m-4 4h11',
    menu: 'M4 6h16M4 12h16M4 18h16',
    x: 'M6 6l12 12M18 6 6 18',
    search: 'm21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z',
    plus: 'M12 5v14m-7-7h14',
    minus: 'M5 12h14',
    trash: 'M4 7h16m-10 4v6m4-6v6M6 7l1 13h10l1-13M9 7V4h6v3',
    pencil: 'm4 20 4-1 11-11-3-3L5 16l-1 4Zm10-13 3 3',
    print: 'M7 9V3h10v6M7 17H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2m-10-3h10v7H7v-7Z',
    download: 'M12 4v11m0 0 4-4m-4 4-4-4M4 20h16',
    check: 'm5 12 5 5 9-10',
    alert: 'M12 9v4m0 4h.01M10.3 3.9 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z',
    info: 'M12 11v6m0-10h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    'chevron-right': 'm9 6 6 6-6 6',
    'arrow-left': 'M19 12H5m6-7-7 7 7 7',
    pause: 'M8 5v14m8-14v14',
    play: 'M7 4v16l13-8L7 4Z',
    tag: 'M3 3h8l10 10-8 8L3 11V3Zm5 5h.01',
    globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z',
    clock: 'M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
    barcode: 'M3 5v14m3-14v14m4-14v14m3-14v14m4-14v14m4-14v14',
    building: 'M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16m0-10h2a2 2 0 0 1 2 2v8M2 21h20M8 7h4m-4 4h4m-4 4h4',
    return: 'M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-3',
    cash: 'M2 7h20v10H2V7Zm10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 10v4m12-4v4',
    lock: 'M6 11h12v10H6V11Zm2 0V8a4 4 0 1 1 8 0v3',
    sparkles: 'M12 3v4m0 10v4M3 12h4m10 0h4M6 6l2 2m8 8 2 2M6 18l2-2m8-8 2-2',
    shirt: 'M8 3 3 6l2 4 3-1v12h8V9l3 1 2-4-5-3a4 4 0 0 1-8 0Z',
    shoe: 'M3 17V8h5l2 3h3l7 3v1a2 2 0 0 1-2 2H3Zm0 0v2h18',
    bag: 'M5 8h14l-1 13H6L5 8Zm4 0V6a3 3 0 0 1 6 0v2',
    phone: 'M8 2h8a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm3 17h2',
    external: 'M14 4h6v6m0-6-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
    up: 'm6 15 6-6 6 6',
    down: 'm6 9 6 6 6-6'
  };
  function icon(name, cls) {
    return '<svg class="i ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + (ICONS[name] || ICONS.info) + '"/></svg>';
  }
  function logo() {
    return '<svg class="logo" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="POS">' +
      '<rect width="40" height="40" rx="11" fill="#ea5959"/><path d="M13 10h14v20l-2.33-1.5L22.33 30 20 28.5 17.67 30l-2.34-1.5L13 30V10Z" fill="#fff"/><path d="M16.5 15.5h7M16.5 19.5h7M16.5 23.5h4" stroke="#ea5959" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';
  }

  /* ---------------------------------------------------------------- helpers */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function money(n) { var neg = n < 0; return (neg ? '−' : '') + Math.round(Math.abs(n)).toLocaleString('en-US') + ' Ks'; }
  function num(n) { return Number(n).toLocaleString('en-US'); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function time12(d) { var h = d.getHours(), m = d.getMinutes(); return ((h % 12) || 12) + ':' + String(m).padStart(2, '0') + ' ' + (h < 12 ? 'AM' : 'PM'); }
  function fmtDate(iso, withTime) { var d = new Date(iso); return d.getDate() + ' ' + MONTHS[d.getMonth()] + (withTime === false ? ' ' + d.getFullYear() : ', ' + time12(d)); }
  function dayKey(d) { return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function daysAgo(n) { var d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - n); return d; }
  function initials(name) { return name.replace(/[^\p{L}\p{N}\s]/gu, '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase(); }
  function catOf(id) { return D.categories.find(function (c) { return c.id === id; }) || D.categories[0]; }

  /* ------------------------------------------------------------------ state */
  var saved = load();
  var state = {
    user: saved.user || null,
    extraSales: saved.extraSales || [],
    stockDelta: saved.stockDelta || {},
    addedProducts: saved.addedProducts || [],
    addedCustomers: saved.addedCustomers || [],
    held: saved.held || [],
    cart: saved.cart || { lines: [], customer: null, orderDiscount: { type: 'none', value: '' }, notes: '' },
    range: 'today',
    posCategory: null, posQuery: '', mobileCart: false, sidebar: false,
    salesFilter: { q: '', status: '', method: '' },
    productFilter: { q: '', cat: '' },
    pay: null
  };
  var baseSales = D.generateSales();

  function load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; } }
  function persist() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        user: state.user, extraSales: state.extraSales, stockDelta: state.stockDelta, addedProducts: state.addedProducts,
        addedCustomers: state.addedCustomers, held: state.held, cart: state.cart
      }));
    } catch (e) { /* storage unavailable: demo still works in memory */ }
  }

  // Merge added products into catalog once.
  state.addedProducts.forEach(function (p) { if (!D.products.find(function (x) { return x.id === p.id; })) { D.products.push(p); p.variants.forEach(function (v) { D.variants.push(v); }); } });
  function allCustomers() { return D.customers.concat(state.addedCustomers); }
  function allSales() { return baseSales.concat(state.extraSales).sort(function (a, b) { return a.at < b.at ? 1 : -1; }); }
  function variantById(id) { return D.variants.find(function (v) { return v.id === id; }); }
  function productOf(v) { return D.products.find(function (p) { return p.id === v.productId; }); }
  function stockOf(v) { return v.stock + (state.stockDelta[v.id] || 0); }
  function productStock(p) { return p.variants.reduce(function (a, v) { return a + stockOf(v); }, 0); }
  function variantLabel(v) { var p = productOf(v); return p.name + (v.name ? ' — ' + v.name : ''); }

  /* ----------------------------------------------------------------- roles */
  var ROLES = {
    Owner: { name: 'Daw Khin Myat', all: true },
    Manager: { name: 'U Aung Ko', hide: ['staff', 'settings'] },
    Cashier: { name: 'Ma Thida', hide: ['dashboard', 'products', 'inventory', 'purchases', 'expenses', 'reports', 'staff', 'settings'] }
  };
  function can(route) { var r = state.user && ROLES[state.user.role]; return r && (r.all || (r.hide || []).indexOf(route) === -1); }

  var NAV = [
    { section: 'Sell' },
    { r: 'dashboard', icon: 'home', label: 'Dashboard' },
    { r: 'pos', icon: 'pos', label: 'Point of Sale' },
    { r: 'sales', icon: 'receipt', label: 'Sales' },
    { r: 'customers', icon: 'users', label: 'Customers' },
    { section: 'Stock' },
    { r: 'products', icon: 'box', label: 'Products' },
    { r: 'inventory', icon: 'layers', label: 'Inventory' },
    { r: 'purchases', icon: 'truck', label: 'Purchases' },
    { section: 'Business' },
    { r: 'expenses', icon: 'wallet', label: 'Expenses' },
    { r: 'reports', icon: 'chart', label: 'Reports' },
    { r: 'staff', icon: 'user', label: 'Staff' },
    { r: 'settings', icon: 'settings', label: 'Settings' }
  ];
  var TITLES = { dashboard: 'Dashboard', pos: 'Point of Sale', sales: 'Sales', customers: 'Customers', products: 'Products', inventory: 'Inventory', purchases: 'Purchases', expenses: 'Expenses', reports: 'Reports', staff: 'Staff', settings: 'Settings' };

  /* ---------------------------------------------------------------- router */
  function route() { return (location.hash.replace(/^#\/?/, '') || '').split('?')[0]; }
  function go(r) { if (location.hash !== '#/' + r) location.hash = '#/' + r; else render(); }
  window.addEventListener('hashchange', function () { state.sidebar = false; state.mobileCart = false; render(); });

  var app = document.getElementById('app');

  function render() {
    closeModal();
    var r = route();
    if (!state.user) { if (r !== 'login') { history.replaceState(null, '', '#/login'); } app.innerHTML = viewLogin(); return; }
    if (!TITLES[r] || !can(r)) { var home = can('dashboard') ? 'dashboard' : 'pos'; history.replaceState(null, '', '#/' + home); r = home; }
    var views = { dashboard: viewDashboard, pos: viewPos, sales: viewSales, customers: viewCustomers, products: viewProducts, inventory: viewInventory, purchases: viewPurchases, expenses: viewExpenses, reports: viewReports, staff: viewStaff, settings: viewSettings };
    app.innerHTML = shell(r, views[r]());
    document.title = TITLES[r] + ' · ' + BRAND + ' POS Demo';
    if (r === 'pos') { renderPosGrid(); renderCart(); var s = $('#pos-search'); if (s && window.innerWidth >= 1024) s.focus(); }
    window.scrollTo(0, 0);
  }

  function shell(r, content) {
    var u = state.user;
    var nav = '';
    var pendingSection = null;
    NAV.forEach(function (n) {
      if (n.section) { pendingSection = n.section; return; }
      if (!can(n.r)) return;
      if (pendingSection) { nav += '<div class="nav-section">' + pendingSection + '</div>'; pendingSection = null; }
      nav += '<a href="#/' + n.r + '" class="nav-link' + (r === n.r ? ' active' : '') + '">' + icon(n.icon) + '<span class="truncate">' + n.label + '</span></a>';
    });
    return '' +
      (state.sidebar ? '<div class="sidebar-overlay" data-a="sidebar-close"></div>' : '') +
      '<div class="shell">' +
      '<aside class="sidebar' + (state.sidebar ? ' open' : '') + '" aria-label="Main navigation">' +
        '<div class="brand">' + logo() + '<div class="grow"><div class="brand-name">' + BRAND + ' <span>POS</span></div><div class="brand-sub">' + esc(D.business.name) + '</div></div>' +
        '<button class="icon-btn close-btn" data-a="sidebar-close" aria-label="Close menu">' + icon('x') + '</button></div>' +
        '<nav>' + nav + '</nav>' +
        '<div class="sidebar-user"><div><div class="avatar">' + esc(u.name[0]) + '</div><div class="grow"><div class="name truncate">' + esc(u.name) + '</div><div class="role">' + esc(u.role) + '</div></div>' +
        '<button class="icon-btn" data-a="logout" title="Sign out" aria-label="Sign out">' + icon('logout', 'i-sm') + '</button></div></div>' +
      '</aside>' +
      '<div class="main">' +
        demoBar() + '<header class="topbar">' +
          '<button class="menu-btn" data-a="sidebar-open" aria-label="Open menu">' + icon('menu') + '</button>' +
          '<span class="mobile-logo" style="display:flex">' + logo().replace('class="logo"', 'class="logo" style="width:28px;height:28px"') + '</span>' +
          '<h1>' + TITLES[r] + '</h1>' +
          '<span class="pill">' + icon('building', 'i-xs') + D.locations[0].name + '</span>' +
          '<button class="btn btn-ghost btn-sm" data-a="lang" title="Language">' + icon('globe', 'i-sm') + 'EN</button>' +
        '</header>' +
        '<main class="content' + (r === 'pos' ? ' full' : '') + '">' + content + '</main>' +
      '</div></div>';
  }

  function demoBar() {
    return '<div class="demo-bar"><span><b>Live demo</b> · sample data, runs entirely in your browser</span>' +
      '<a href="' + PORTFOLIO_URL + '" target="_blank" rel="noopener">← Back to portfolio</a>' +
      '<button type="button" data-a="reset">Reset demo</button></div>';
  }

  /* ----------------------------------------------------------------- login */
  function viewLogin() {
    var feats = [['pos', 'Fast checkout & barcode'], ['layers', 'Multi-location stock'], ['chart', 'Profit & sales reports'], ['shield', 'Roles & audit log']];
    return demoBar() + '<div class="auth">' +
      '<section class="auth-art">' +
        '<div style="position:relative" class="brand">' + logo() + '<div><div class="brand-name">' + BRAND + ' <span>POS</span></div><div class="brand-sub">Portfolio demo project</div></div></div>' +
        '<div><h2>Retail point-of-sale for <span>Myanmar shops</span>.</h2>' +
        '<p class="lead">Clothing, shoes, cosmetics, mini-markets and mobile accessories — sell, track stock and see profit from one place. English &amp; Burmese.</p></div>' +
        '<div class="auth-feats">' + feats.map(function (f) { return '<div>' + icon(f[0], 'i-sm') + f[1] + '</div>'; }).join('') + '</div>' +
      '</section>' +
      '<section class="auth-form"><div>' +
        '<div class="brand">' + logo() + '<div><div class="brand-name">' + BRAND + ' <span>POS</span></div><div class="brand-sub">' + esc(D.business.name) + '</div></div></div>' +
        '<h1>Sign in</h1><p class="page-subtitle">Pick a demo role — each one sees a different set of screens.</p>' +
        '<form data-form="login">' +
          '<div class="roles">' + ['Owner', 'Manager', 'Cashier'].map(function (r, i) {
            return '<button type="button" class="choice' + (i === 0 ? ' active' : '') + '" data-a="pick-role" data-role="' + r + '">' + icon(r === 'Cashier' ? 'pos' : r === 'Manager' ? 'users' : 'building', 'i-sm') + r + '<small>' + (r === 'Owner' ? 'Full access' : r === 'Manager' ? 'No staff/settings' : 'Checkout only') + '</small></button>';
          }).join('') + '</div>' +
          '<input type="hidden" name="role" value="Owner">' +
          '<div><label class="label" for="email">Email</label><input class="input" id="email" name="email" value="owner@demo.test" autocomplete="off"></div>' +
          '<div><label class="label" for="pw">Password</label><input class="input" id="pw" type="password" name="password" value="password"></div>' +
          '<button class="btn btn-primary btn-lg btn-block" type="submit">Sign in</button>' +
          '<div class="note">' + icon('info', 'i-sm') + '<span>Portfolio demo. Data is sample data stored only in your browser — nothing is sent anywhere.</span></div>' +
        '</form>' +
      '</div></section></div>';
  }

  /* ------------------------------------------------------------ analytics */
  function rangeStart(range) { return range === 'today' ? daysAgo(0) : range === '7d' ? daysAgo(6) : daysAgo(29); }
  function rangeLabel(range) {
    var s = rangeStart(range), e = new Date();
    return range === 'today' ? 'Today, ' + fmtDate(e.toISOString(), false) : fmtDate(s.toISOString(), false) + ' – ' + fmtDate(e.toISOString(), false);
  }
  function salesIn(range) { var s = rangeStart(range).toISOString(); return allSales().filter(function (x) { return x.at >= s; }); }
  function prevSalesIn(range) {
    var len = range === 'today' ? 1 : range === '7d' ? 7 : 30;
    var s = rangeStart(range), ps = new Date(s); ps.setDate(ps.getDate() - len);
    var now = new Date(), pe = new Date(now); pe.setDate(pe.getDate() - len);
    return allSales().filter(function (x) { var t = new Date(x.at); return t >= ps && t <= pe; });
  }
  function summarize(list, range) {
    var o = { gross: 0, discounts: 0, tax: 0, refunds: 0, cost: 0, count: 0, expenses: 0 };
    list.forEach(function (s) {
      if (s.status === 'voided') return;
      o.gross += s.subtotal; o.discounts += s.discount;
      if (s.status === 'refunded') { o.refunds += s.subtotal - s.discount; return; }
      o.tax += s.tax; o.count++;
      o.cost += s.lines.reduce(function (a, l) { return a + l.cost * l.qty; }, 0);
    });
    o.net = o.gross - o.discounts - o.refunds;
    o.profit = o.net - o.cost;
    o.avg = o.count ? o.net / o.count : 0;
    o.margin = o.net ? Math.round(o.profit / o.net * 1000) / 10 : null;
    if (range) {
      var startDays = range === 'today' ? 0 : range === '7d' ? 6 : 29;
      o.expenses = D.expenses.filter(function (e) { return -e.date <= startDays; }).reduce(function (a, e) { return a + e.amount; }, 0);
    }
    return o;
  }
  function lowStock() {
    var out = [];
    D.products.forEach(function (p) { p.variants.forEach(function (v) { if (stockOf(v) <= p.low) out.push({ p: p, v: v }); }); });
    return out;
  }
  function series(days) {
    var buckets = [];
    for (var i = days - 1; i >= 0; i--) { var d = daysAgo(i); buckets.push({ d: d, key: dayKey(d), net: 0, profit: 0 }); }
    var map = {}; buckets.forEach(function (b) { map[b.key] = b; });
    allSales().forEach(function (s) {
      if (s.status !== 'completed') return;
      var b = map[dayKey(new Date(s.at))]; if (!b) return;
      var net = s.subtotal - s.discount;
      b.net += net; b.profit += net - s.lines.reduce(function (a, l) { return a + l.cost * l.qty; }, 0);
    });
    return buckets;
  }
  function byMethod(list) {
    var m = {};
    list.forEach(function (s) { if (s.status !== 'completed') return; s.payments.forEach(function (p) { m[p.method] = m[p.method] || { method: p.method, amount: 0, count: 0 }; m[p.method].amount += p.amount; m[p.method].count++; }); });
    return Object.keys(m).map(function (k) { return m[k]; }).sort(function (a, b) { return b.amount - a.amount; });
  }
  function topProducts(list, n) {
    var m = {};
    list.forEach(function (s) { if (s.status !== 'completed') return; s.lines.forEach(function (l) { m[l.name] = m[l.name] || { name: l.name, qty: 0, net: 0 }; m[l.name].qty += l.qty; m[l.name].net += l.qty * l.price; }); });
    return Object.keys(m).map(function (k) { return m[k]; }).sort(function (a, b) { return b.net - a.net; }).slice(0, n);
  }
  function delta(cur, prev) {
    if (!prev) return '';
    var pct = Math.round((cur - prev) / prev * 100);
    return '<span class="stat-delta' + (pct < 0 ? ' down' : '') + '">' + icon(pct < 0 ? 'down' : 'up', 'i-xs') + Math.abs(pct) + '%</span> vs previous · ';
  }

  /* ------------------------------------------------------------- partials */
  function pageHeader(title, sub, actions) {
    return '<div class="page-header"><div><h2 class="page-title">' + title + '</h2>' + (sub ? '<p class="page-subtitle">' + sub + '</p>' : '') + '</div>' + (actions ? '<div class="actions">' + actions + '</div>' : '') + '</div>';
  }
  function stat(label, value, ic, hint, accent) {
    return '<div class="card stat' + (accent ? ' accent' : '') + '"><div class="stat-top"><span class="stat-label">' + label + '</span><span class="stat-icon">' + icon(ic, 'i-sm') + '</span></div>' +
      '<div class="stat-value">' + value + '</div>' + (hint ? '<div class="stat-hint">' + hint + '</div>' : '') + '</div>';
  }
  function rangeTabs() {
    return '<div class="tabs mb-6">' + [['today', 'Today'], ['7d', 'Last 7 days'], ['30d', 'Last 30 days']].map(function (t) {
      return '<button class="tab' + (state.range === t[0] ? ' active' : '') + '" data-a="range" data-v="' + t[0] + '">' + t[1] + '</button>';
    }).join('') + '</div>';
  }
  function statusBadge(s) {
    return s === 'completed' ? '<span class="badge badge-green">Completed</span>' : s === 'refunded' ? '<span class="badge badge-amber">Refunded</span>' : '<span class="badge badge-gray">Voided</span>';
  }
  function barChart(data) {
    var max = Math.max.apply(null, data.map(function (b) { return b.net; }).concat([1]));
    var step = Math.ceil(data.length / 7);
    return '<div class="chart">' + data.map(function (b) {
      return '<div class="col"><div class="tip"><b>' + fmtDate(b.d.toISOString(), false).replace(/ \d{4}$/, '') + '</b><br>Net ' + money(b.net) + '<br>Profit ' + money(b.profit) + '</div>' +
        '<div class="bar" style="height:' + Math.max(1, b.net / max * 100) + '%"></div><div class="bar b2" style="height:' + Math.max(1, b.profit / max * 100) + '%"></div></div>';
    }).join('') + '</div><div class="chart-x">' + data.map(function (b, i) { return '<span>' + ((data.length - 1 - i) % step === 0 ? b.d.getDate() + ' ' + MONTHS[b.d.getMonth()] : '') + '</span>'; }).join('') + '</div>';
  }
  function thumb(name, color, size) {
    return '<span class="thumb" style="background:' + color + '1a;color:' + color + (size ? ';width:' + size + 'px;height:' + size + 'px' : '') + '">' + esc(initials(name)) + '</span>';
  }
  function empty(ic, title, msg) { return '<div class="empty"><div class="ic">' + icon(ic) + '</div><b>' + title + '</b>' + (msg ? '<p>' + msg + '</p>' : '') + '</div>'; }

  /* ------------------------------------------------------------- dashboard */
  function viewDashboard() {
    var list = salesIn(state.range), sum = summarize(list, state.range), prev = summarize(prevSalesIn(state.range));
    var low = lowStock(), methods = byMethod(list), payTotal = methods.reduce(function (a, m) { return a + m.amount; }, 0) || 1;
    var hour = new Date().getHours();
    var greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    var top = topProducts(list, 5);
    var recent = allSales().slice(0, 7);
    var sdays = state.range === '30d' ? 30 : 14;

    return pageHeader(greet + ', ' + esc(state.user.name.split(' ').slice(-1)[0]), rangeLabel(state.range), '<a href="#/pos" class="btn btn-primary">' + icon('pos', 'i-sm') + 'Open POS</a>') +
      rangeTabs() +
      '<a href="#/inventory" class="alert-row mb-6">' + icon('alert') + '<span>' + low.length + ' items are at or below their low-stock level</span>' + icon('chevron-right', 'i-sm') + '</a>' +
      '<div class="grid grid-stats">' +
        stat('Net sales', money(sum.net), 'cash', delta(sum.net, prev.net) + 'After discounts & refunds', true) +
        stat('Transactions', num(sum.count), 'receipt', delta(sum.count, prev.count) + 'Avg ' + money(sum.avg)) +
        stat('Gross profit', money(sum.profit), 'chart', sum.margin !== null ? sum.margin + '% margin' : 'No sales yet') +
        stat('Low stock', num(low.length), 'alert', 'of ' + D.variants.length + ' product variants', low.length > 0) +
      '</div>' +
      '<div class="card mt-6"><div class="breakdown">' +
        [['Gross sales', sum.gross], ['Discounts', -sum.discounts], ['Tax collected', sum.tax], ['Refunds', -sum.refunds], ['Net sales', sum.net], ['Expenses', sum.expenses]].map(function (b) {
          return '<div><p>' + b[0] + '</p><p class="' + (b[1] < 0 ? 'neg' : '') + '">' + money(b[1]) + '</p></div>';
        }).join('') +
      '</div></div>' +
      '<div class="grid grid-2-1 mt-6">' +
        '<div class="card"><div class="card-header"><div><h3 class="card-title">Sales — last ' + sdays + ' days</h3><p class="sub">Hover a bar for details</p></div><div class="legend"><span><i></i>Net sales</span><span><i class="c"></i>Gross profit</span></div></div>' +
          '<div class="card-body">' + barChart(series(sdays)) + '</div></div>' +
        '<div class="card"><div class="card-header"><h3 class="card-title">Payment methods</h3></div><div class="card-body" style="display:flex;flex-direction:column;gap:16px">' +
          (methods.length ? methods.map(function (m, i) {
            return '<div><div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:14px"><span style="font-weight:500">' + D.methodLabels[m.method] + ' <span class="muted">· ' + m.count + '</span></span><span class="tnum">' + money(m.amount) + '</span></div>' +
              '<div class="meter"><div class="' + (i === 0 ? 'c' : '') + '" style="width:' + (m.amount / payTotal * 100).toFixed(1) + '%"></div></div></div>';
          }).join('') : '<p class="muted" style="text-align:center;padding:32px 0">No payments in this period</p>') +
        '</div></div>' +
      '</div>' +
      '<div class="grid grid-3-2 mt-6">' +
        '<div class="card"><div class="card-header"><h3 class="card-title">Recent sales</h3><a href="#/sales" class="link" style="font-size:14px">View all</a></div><div class="table-wrap"><table class="table"><thead><tr><th>Receipt</th><th class="hide-sm">Cashier</th><th>Status</th><th class="num">Total</th></tr></thead><tbody>' +
          recent.map(function (s) { return '<tr class="clickable" data-a="sale" data-no="' + s.no + '"><td><b style="font-weight:500">' + s.no + '</b><div class="sub">' + fmtDate(s.at) + '</div></td><td class="hide-sm muted">' + esc(s.cashier) + '</td><td>' + statusBadge(s.status) + '</td><td class="num" style="font-weight:500">' + money(s.total) + '</td></tr>'; }).join('') +
        '</tbody></table></div></div>' +
        '<div class="card"><div class="card-header"><h3 class="card-title">Best sellers</h3></div><ul>' +
          (top.length ? top.map(function (p, i) { return '<li class="list-row"><span class="rank' + (i === 0 ? ' first' : '') + '">' + (i + 1) + '</span><div class="grow"><p class="truncate" style="font-weight:500">' + esc(p.name) + '</p><p class="sub">' + p.qty + ' units sold</p></div><span class="tnum" style="font-weight:600">' + money(p.net) + '</span></li>'; }).join('') : '<li>' + empty('box', 'No sales yet') + '</li>') +
        '</ul></div>' +
      '</div>';
  }

  /* ------------------------------------------------------------------- POS */
  function viewPos() {
    return '<div class="pos">' +
      '<section class="pos-catalog">' +
        '<div class="pos-head">' +
          '<div class="pos-search"><label class="search-wrap"><span class="sr-only">Search products</span>' + icon('search') +
            '<input id="pos-search" class="input" type="search" autocomplete="off" placeholder="Search name, SKU or scan barcode…" value="' + esc(state.posQuery) + '">' +
            '<span class="kbd">' + icon('barcode', 'i-xs') + 'F2</span></label>' +
            '<button class="btn btn-secondary" data-a="held" title="Held carts">' + icon('pause') + '<span class="hide-md">Held (' + state.held.length + ')</span></button></div>' +
          '<div class="tabs" id="pos-cats"></div>' +
        '</div>' +
        '<div class="pos-grid-wrap"><div class="pos-grid" id="pos-grid"></div></div>' +
      '</section>' +
      '<button class="cart-fab" data-a="cart-open" id="cart-fab"></button>' +
      '<aside class="cart' + (state.mobileCart ? ' open' : '') + '" id="cart" aria-label="Cart"></aside>' +
    '</div>';
  }

  function filteredProducts() {
    var q = state.posQuery.trim().toLowerCase();
    return D.products.filter(function (p) {
      if (state.posCategory && p.category !== state.posCategory) return false;
      if (!q) return true;
      return p.name.toLowerCase().indexOf(q) > -1 || p.variants.some(function (v) { return v.sku.toLowerCase().indexOf(q) > -1 || v.barcode.indexOf(q) > -1; });
    });
  }

  function renderPosGrid() {
    var cats = $('#pos-cats'), grid = $('#pos-grid');
    if (!grid) return;
    cats.innerHTML = '<button class="tab' + (!state.posCategory ? ' active' : '') + '" data-a="pos-cat" data-v="">All items</button>' +
      D.categories.map(function (c) { return '<button class="tab' + (state.posCategory === c.id ? ' active' : '') + '" data-a="pos-cat" data-v="' + c.id + '">' + c.name + '</button>'; }).join('');
    var list = filteredProducts();
    grid.innerHTML = list.length ? list.map(function (p) {
      var c = catOf(p.category), st = productStock(p), out = st <= 0;
      return '<button class="product' + (out ? ' out' : '') + '" data-a="add" data-id="' + p.id + '">' +
        '<div class="ph" style="background:' + c.color + '1a;color:' + c.color + '">' + esc(initials(p.name)) + icon(c.icon) +
          '<span class="stock">' + (out ? 'Out' : st + ' left') + '</span></div>' +
        '<div class="info"><span class="nm">' + esc(p.name) + '</span><span class="sku">' + (p.variants.length > 1 ? '<span class="var">' + p.variants.length + ' variants</span>' : esc(p.variants[0].sku)) + '</span>' +
        '<span class="price">' + money(p.price) + '</span></div></button>';
    }).join('') : '<div style="grid-column:1/-1">' + empty('search', 'No products found', 'Try a different name, SKU or barcode.') + '</div>';
  }

  function quote() {
    var c = state.cart, lines = [], subtotal = 0, lineDisc = 0;
    c.lines.forEach(function (l) {
      var v = variantById(l.variantId); if (!v) return;
      var gross = v.price * l.qty, d = 0;
      if (l.discType === 'percent') d = Math.round(gross * Math.min(100, Number(l.discValue) || 0) / 100);
      if (l.discType === 'amount') d = Math.min(gross, Math.round(Number(l.discValue) || 0));
      lines.push({ v: v, p: productOf(v), gross: gross, disc: d, total: gross - d });
      subtotal += gross; lineDisc += d;
    });
    var afterLine = subtotal - lineDisc, od = 0;
    if (c.orderDiscount.type === 'percent') od = Math.round(afterLine * Math.min(100, Number(c.orderDiscount.value) || 0) / 100);
    if (c.orderDiscount.type === 'amount') od = Math.min(afterLine, Math.round(Number(c.orderDiscount.value) || 0));
    var ratio = afterLine ? (afterLine - od) / afterLine : 1;
    var tax = Math.round(lines.reduce(function (a, x) { return a + (x.p.taxable ? x.total * ratio * 0.05 : 0); }, 0));
    var discount = lineDisc + od;
    return { lines: lines, subtotal: subtotal, discount: discount, tax: tax, total: subtotal - discount + tax };
  }

  function renderCart() {
    var el = $('#cart'); if (!el) return;
    var c = state.cart, q = quote();
    var cust = c.customer ? allCustomers().find(function (x) { return x.id === c.customer; }) : null;
    var fab = $('#cart-fab');
    fab.innerHTML = '<b>' + c.lines.length + '</b><span>' + (c.lines.length ? money(q.total) : 'Cart') + '</span>';
    fab.classList.toggle('hidden', state.mobileCart);
    el.classList.toggle('open', state.mobileCart);
    el.innerHTML =
      '<div class="cart-head"><button class="btn btn-ghost back" style="padding:8px;margin-left:-8px" data-a="cart-close" aria-label="Back">' + icon('arrow-left') + '</button>' +
        '<h2>Current sale</h2><span class="badge badge-gray">' + c.lines.length + '</span>' +
        (c.lines.length ? '<button class="btn btn-ghost btn-sm" style="margin-left:auto;color:var(--coral-600)" data-a="clear">' + icon('trash', 'i-sm') + 'Clear</button>' : '') + '</div>' +
      '<div class="cart-cust"><button data-a="customer"><span class="cust-ic">' + icon('user', 'i-sm') + '</span><span class="grow"><span style="display:block;font-weight:500">' + (cust ? esc(cust.name) : 'Walk-in customer') + '</span><span class="sub">' + (cust ? esc(cust.phone) + ' · ' + cust.points + ' pts' : 'Tap to add a customer') + '</span></span>' + icon('chevron-right', 'i-sm') + '</button></div>' +
      '<div class="cart-lines">' + (c.lines.length ? q.lines.map(function (x, i) {
        var l = c.lines[i], st = stockOf(x.v);
        return '<div class="cart-line"><div class="top"><button data-a="edit-line" data-i="' + i + '"><p class="nm">' + esc(x.p.name) + (x.v.name ? ' <span class="muted" style="font-weight:500">' + esc(x.v.name) + '</span>' : '') + '</p>' +
          '<p class="meta">' + money(x.v.price) + (x.disc ? '<span class="d">− ' + (l.discType === 'percent' ? l.discValue + '%' : money(x.disc)) + '</span>' : '') + '</p></button>' +
          '<p class="lt">' + money(x.total) + '</p></div>' +
          '<div class="ctl"><div class="stepper"><button data-a="dec" data-i="' + i + '" aria-label="Decrease">' + icon('minus', 'i-sm') + '</button>' +
          '<input type="number" min="0" data-in="qty" data-i="' + i + '" value="' + l.qty + '" aria-label="Quantity"><button data-a="inc" data-i="' + i + '" aria-label="Increase">' + icon('plus', 'i-sm') + '</button></div>' +
          (l.qty > st ? '<span class="badge badge-red">Only ' + Math.max(0, st) + ' left</span>' : '') +
          '<button class="del-btn" data-a="remove" data-i="' + i + '" aria-label="Remove">' + icon('trash', 'i-sm') + '</button></div></div>';
      }).join('') : '<div class="cart-empty"><div class="ic">' + icon('barcode') + '</div><b>Cart is empty</b><p>Scan a barcode or tap a product to start a sale.</p></div>') + '</div>' +
      '<div class="totals"><dl>' +
        '<div><dt>Subtotal</dt><dd class="tnum">' + (c.lines.length ? money(q.subtotal) : '—') + '</dd></div>' +
        '<div><dt>Discount ' + (c.lines.length ? '<button class="link" style="font-size:12px;margin-left:4px" data-a="order-discount">Edit</button>' : '') + '</dt><dd class="tnum' + (q.discount ? ' neg' : '') + '">' + (c.lines.length ? (q.discount ? '− ' : '') + money(q.discount) : '—') + '</dd></div>' +
        '<div><dt>Tax <span style="font-size:12px">(5% on accessories)</span></dt><dd class="tnum">' + (c.lines.length ? money(q.tax) : '—') + '</dd></div>' +
        '<div class="total"><dt>Total</dt><dd>' + (c.lines.length ? money(q.total) : '—') + '</dd></div></dl>' +
        '<div class="bar"><button class="btn btn-secondary" data-a="hold" title="Hold cart"' + (c.lines.length ? '' : ' disabled') + '>' + icon('pause') + '</button>' +
        '<button class="btn btn-primary btn-lg" data-a="charge"' + (c.lines.length ? '' : ' disabled') + '><span>Charge</span><span class="tnum">' + (c.lines.length ? money(q.total) : '') + '</span></button></div>' +
        '<p class="shortcuts">F2 search · F9 charge · Esc close</p></div>';
  }

  function cartChanged() { persist(); renderCart(); }

  function addVariant(v) {
    var c = state.cart;
    var ex = c.lines.find(function (l) { return l.variantId === v.id; });
    if (ex) ex.qty++; else c.lines.push({ variantId: v.id, qty: 1, discType: 'none', discValue: '' });
    if (stockOf(v) <= 0) toast(variantLabel(v) + ' is out of stock — added anyway', 'error');
    cartChanged();
    pulse();
  }
  function pulse() { var f = $('#cart-fab'); if (f && f.animate) f.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 250 }); }

  function variantPicker(p) {
    var c = catOf(p.category);
    openModal('<div class="modal sm"><div class="modal-head"><div style="display:flex;gap:12px;align-items:center">' + thumb(p.name, c.color) + '<div><h3>' + esc(p.name) + '</h3><p class="sub">' + money(p.price) + ' · Choose a variant</p></div></div><button class="btn btn-ghost" style="padding:8px" data-a="close">' + icon('x') + '</button></div>' +
      '<ul class="pick-list" style="overflow-y:auto">' + p.variants.map(function (v) {
        var st = stockOf(v);
        return '<li><button data-a="add-variant" data-id="' + v.id + '" style="display:flex;align-items:center;gap:12px"><span class="grow"><b style="font-weight:600">' + esc(v.name) + '</b><span class="sub" style="display:block">' + esc(v.sku) + '</span></span>' +
          (st <= 0 ? '<span class="badge badge-red">Out</span>' : '<span class="badge ' + (st <= p.low ? 'badge-amber' : 'badge-gray') + '">' + st + ' left</span>') + '</button></li>';
      }).join('') + '</ul></div>');
  }

  function openPayment() {
    var q = quote(); if (!state.cart.lines.length) return;
    state.pay = { method: 'cash', amount: String(q.total), provider: '', ref: '', payments: [], total: q.total };
    renderPayment();
  }
  function payPaid() { return state.pay.payments.reduce(function (a, p) { return a + p.amount; }, 0); }
  function quickCash(due) {
    var notes = [1000, 5000, 10000, 50000], out = [due];
    notes.forEach(function (n) { var v = Math.ceil(due / n) * n; if (out.indexOf(v) === -1 && v > due) out.push(v); });
    return out.sort(function (a, b) { return a - b; }).slice(0, 5);
  }
  function renderPayment() {
    var p = state.pay, paid = payPaid(), remaining = Math.max(0, p.total - paid), amt = Math.round(Number(p.amount) || 0);
    var change = p.method === 'cash' ? Math.max(0, amt - remaining) : 0;
    var canComplete = paid + amt >= p.total;
    var html = '<div class="modal" id="pay-modal"><div class="modal-head"><h3>Payment</h3><button class="btn btn-ghost" style="padding:8px" data-a="close">' + icon('x') + '</button></div>' +
      '<div class="modal-body">' +
        '<div class="due"><div><small>Amount due</small><div class="amt">' + money(p.total) + '</div></div>' + (p.payments.length ? '<div><small style="text-align:right">Remaining</small><div class="rem' + (remaining ? '' : ' ok') + '">' + money(remaining) + '</div></div>' : '') + '</div>' +
        '<div class="methods">' + D.methods.map(function (m) { return '<button class="choice' + (p.method === m ? ' active' : '') + '" data-a="pay-method" data-v="' + m + '">' + D.methodLabels[m] + '</button>'; }).join('') + '</div>' +
        (p.method === 'mobile_payment' || p.method === 'bank_transfer' ? '<div class="row2"><div><label class="label">Provider</label><input class="input" data-in="pay-provider" list="providers" value="' + esc(p.provider) + '" placeholder="' + (p.method === 'mobile_payment' ? 'KBZPay' : 'Bank name') + '"><datalist id="providers">' + D.providers.map(function (x) { return '<option value="' + x + '">'; }).join('') + '</datalist></div><div><label class="label">Reference</label><input class="input" data-in="pay-ref" value="' + esc(p.ref) + '" placeholder="Transaction ID"></div></div>' : '') +
        '<div><label class="label">' + (p.method === 'cash' ? 'Amount received' : 'Amount') + '</label><div style="display:flex;gap:8px"><input id="pay-amount" class="input amount-input" inputmode="numeric" data-in="pay-amount" value="' + esc(p.amount) + '">' +
          '<button class="btn btn-secondary" data-a="split" title="Split payment"' + (remaining && amt > 0 && amt < remaining ? '' : ' disabled') + '>' + icon('plus', 'i-sm') + 'Split</button></div>' +
          (p.method === 'cash' ? '<div class="quick">' + quickCash(remaining || p.total).map(function (v) { return '<button class="btn btn-secondary btn-sm" data-a="quick-cash" data-v="' + v + '">' + money(v) + '</button>'; }).join('') + '</div>' : '') + '</div>' +
        (p.payments.length ? '<ul class="paylist">' + p.payments.map(function (x, i) { return '<li><span style="font-weight:500">' + D.methodLabels[x.method] + (x.provider ? ' · ' + esc(x.provider) : '') + '</span><span class="tnum" style="margin-left:auto">' + money(x.amount) + '</span><button class="muted" data-a="pay-remove" data-i="' + i + '">' + icon('x', 'i-sm') + '</button></li>'; }).join('') + '</ul>' : '') +
        (change > 0 ? '<div class="change"><span>Change</span><span>' + money(change) + '</span></div>' : '') +
        (!canComplete && amt > 0 ? '<p class="err">' + money(p.total - paid - amt) + ' still to pay. Use Split to add another method.</p>' : '') +
      '</div>' +
      '<div class="modal-foot"><button class="btn btn-primary btn-lg btn-block" data-a="complete"' + (canComplete ? '' : ' disabled') + '>Complete sale</button></div></div>';
    var existing = $('#pay-modal');
    if (existing) {
      var focused = document.activeElement && document.activeElement.dataset ? document.activeElement.dataset.in : null;
      var caret = focused && document.activeElement.selectionStart;
      existing.outerHTML = html;
      if (focused) { var f = $('[data-in="' + focused + '"]'); if (f) { f.focus(); try { f.setSelectionRange(caret, caret); } catch (e) { } } }
    } else { openModal(html); var a = $('#pay-amount'); if (a) { a.focus(); a.select(); } }
  }

  function completeSale() {
    var p = state.pay, q = quote(), paid = payPaid(), remaining = p.total - paid, amt = Math.round(Number(p.amount) || 0);
    var payments = p.payments.slice();
    if (remaining > 0) payments.push({ method: p.method, amount: Math.min(amt, remaining), provider: p.provider || null });
    var change = p.method === 'cash' ? Math.max(0, amt - remaining) : 0;
    var cust = state.cart.customer ? allCustomers().find(function (x) { return x.id === state.cart.customer; }) : null;
    var lastNo = allSales().reduce(function (a, s) { return Math.max(a, Number(s.no.split('-')[1])); }, 0);
    var sale = {
      no: 'MDY-' + String(lastNo + 1).padStart(6, '0'), at: new Date().toISOString(), cashier: state.user.name, customer: cust ? cust.name : null,
      lines: q.lines.map(function (x, i) { var l = state.cart.lines[i]; return { variantId: x.v.id, name: variantLabel(x.v), qty: l.qty, price: x.v.price, cost: x.v.cost, taxable: x.p.taxable, category: x.p.category, discount: x.disc }; }),
      subtotal: q.subtotal, discount: q.discount, tax: q.tax, total: q.total, payments: payments, change: change, status: 'completed', demo: true
    };
    sale.lines.forEach(function (l) { state.stockDelta[l.variantId] = (state.stockDelta[l.variantId] || 0) - l.qty; });
    state.extraSales.push(sale);
    state.cart = { lines: [], customer: null, orderDiscount: { type: 'none', value: '' }, notes: '' };
    state.pay = null;
    persist();
    renderCart(); renderPosGrid();
    openModal('<div class="modal md"><div class="success"><div class="ok">' + icon('check') + '</div><h3>Sale complete</h3><p class="sub">' + sale.no + '</p>' +
      '<div class="tiles"><div><small>Total</small><p>' + money(sale.total) + '</p></div><div class="g"><small>Change</small><p>' + money(sale.change) + '</p></div></div>' +
      '<p class="eyebrow">Print receipt</p><div class="grid3">' + ['58mm', '80mm', 'A4'].map(function (s) { return '<button class="btn btn-secondary" data-a="receipt" data-no="' + sale.no + '" data-size="' + s + '">' + icon('print', 'i-sm') + s + '</button>'; }).join('') + '</div>' +
      '<button class="btn btn-primary btn-lg btn-block" style="margin-top:20px" data-a="close" id="new-sale">New sale</button></div></div>');
    var ns = $('#new-sale'); if (ns) ns.focus();
  }

  function receiptHtml(sale, size) {
    var cls = size === '58mm' ? 'w58' : size === 'A4' ? 'a4' : '';
    return '<div class="receipt ' + cls + '">' + logo() +
      '<div class="c"><b>' + esc(D.business.name) + '</b><br>' + esc(D.business.address) + '<br>Tel ' + D.business.phone + '</div><hr>' +
      '<div class="r"><span>Receipt</span><span>' + sale.no + '</span></div><div class="r"><span>Date</span><span>' + fmtDate(sale.at) + '</span></div><div class="r"><span>Cashier</span><span>' + esc(sale.cashier) + '</span></div>' +
      (sale.customer ? '<div class="r"><span>Customer</span><span>' + esc(sale.customer) + '</span></div>' : '') + '<hr>' +
      sale.lines.map(function (l) { return '<div>' + esc(l.name) + '</div><div class="r"><span>&nbsp;' + l.qty + ' × ' + num(l.price) + (l.discount ? ' (−' + num(l.discount) + ')' : '') + '</span><span>' + num(l.qty * l.price - (l.discount || 0)) + '</span></div>'; }).join('') + '<hr>' +
      '<div class="r"><span>Subtotal</span><span>' + num(sale.subtotal) + '</span></div>' +
      (sale.discount ? '<div class="r"><span>Discount</span><span>−' + num(sale.discount) + '</span></div>' : '') +
      '<div class="r"><span>Tax</span><span>' + num(sale.tax) + '</span></div>' +
      '<div class="r big"><span>TOTAL</span><span>' + money(sale.total) + '</span></div><hr>' +
      sale.payments.map(function (p) { return '<div class="r"><span>' + D.methodLabels[p.method] + (p.provider ? ' · ' + esc(p.provider) : '') + '</span><span>' + num(p.amount) + '</span></div>'; }).join('') +
      (sale.change ? '<div class="r"><span>Change</span><span>' + num(sale.change) + '</span></div>' : '') +
      '<hr><div class="c">Thank you, please come again!<br><small>Powered by ' + BRAND + ' POS</small></div></div>';
  }
  function showReceipt(no, size) {
    var sale = allSales().find(function (s) { return s.no === no; }); if (!sale) return;
    openModal('<div class="modal md"><div class="modal-head"><h3>Receipt · ' + size + '</h3><button class="btn btn-ghost" style="padding:8px" data-a="close">' + icon('x') + '</button></div>' +
      '<div class="modal-body" style="background:var(--ink-50)">' + receiptHtml(sale, size) + '</div>' +
      '<div class="modal-foot"><button class="btn btn-secondary" data-a="close">Close</button><button class="btn btn-dark" data-a="print">' + icon('print', 'i-sm') + 'Print</button></div></div>');
  }

  /* ----------------------------------------------------------------- sales */
  function viewSales() {
    var f = state.salesFilter;
    return pageHeader('Sales', 'Every receipt, with refunds and voids kept on record.', '<a href="#/pos" class="btn btn-primary">' + icon('plus', 'i-sm') + 'New sale</a>') +
      '<div class="card"><div class="toolbar"><label class="search-wrap">' + icon('search', 'i-sm') + '<input class="input" type="search" data-in="sales-q" placeholder="Receipt no, customer or cashier" value="' + esc(f.q) + '"></label>' +
        '<select class="input" data-in="sales-status"><option value="">All statuses</option>' + ['completed', 'refunded', 'voided'].map(function (s) { return '<option value="' + s + '"' + (f.status === s ? ' selected' : '') + '>' + s[0].toUpperCase() + s.slice(1) + '</option>'; }).join('') + '</select>' +
        '<select class="input" data-in="sales-method"><option value="">All payment methods</option>' + D.methods.map(function (m) { return '<option value="' + m + '"' + (f.method === m ? ' selected' : '') + '>' + D.methodLabels[m] + '</option>'; }).join('') + '</select></div>' +
        '<div id="sales-table"></div></div>';
  }
  function renderSalesTable() {
    var el = $('#sales-table'); if (!el) return;
    var f = state.salesFilter, q = f.q.toLowerCase();
    var list = allSales().filter(function (s) {
      if (f.status && s.status !== f.status) return false;
      if (f.method && !s.payments.some(function (p) { return p.method === f.method; })) return false;
      if (q && (s.no + ' ' + (s.customer || '') + ' ' + s.cashier).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });
    var shown = list.slice(0, 40);
    el.innerHTML = shown.length ? '<div class="table-wrap"><table class="table"><thead><tr><th>Receipt</th><th class="hide-sm">Customer</th><th class="hide-md">Cashier</th><th class="hide-md">Payment</th><th>Status</th><th class="num">Total</th></tr></thead><tbody>' +
      shown.map(function (s) {
        return '<tr class="clickable" data-a="sale" data-no="' + s.no + '"><td><b style="font-weight:500">' + s.no + '</b>' + (s.demo ? ' <span class="badge badge-blue">New</span>' : '') + '<div class="sub">' + fmtDate(s.at) + '</div></td><td class="hide-sm">' + (s.customer ? esc(s.customer) : '<span class="muted">Walk-in</span>') + '</td><td class="hide-md muted">' + esc(s.cashier) + '</td>' +
          '<td class="hide-md">' + s.payments.map(function (p) { return D.methodLabels[p.method] + (p.provider ? ' <span class="muted">· ' + p.provider + '</span>' : ''); }).join(', ') + '</td><td>' + statusBadge(s.status) + '</td><td class="num" style="font-weight:600">' + money(s.total) + '</td></tr>';
      }).join('') + '</tbody></table></div><p class="sub" style="padding:12px 16px;border-top:1px solid var(--ink-100)">Showing ' + shown.length + ' of ' + num(list.length) + ' sales</p>'
      : empty('receipt', 'No sales match', 'Clear the filters to see all receipts.');
  }
  function showSale(no) {
    var s = allSales().find(function (x) { return x.no === no; }); if (!s) return;
    openModal('<div class="modal"><div class="modal-head"><div><h3>' + s.no + '</h3><p class="sub">' + fmtDate(s.at) + ' · ' + esc(s.cashier) + '</p></div><div style="display:flex;gap:8px;align-items:center">' + statusBadge(s.status) + '<button class="btn btn-ghost" style="padding:8px" data-a="close">' + icon('x') + '</button></div></div>' +
      '<div class="modal-body"><table class="table items-table"><thead><tr><th style="background:none;padding-left:0">Item</th><th class="num" style="background:none">Qty</th><th class="num" style="background:none;padding-right:0">Amount</th></tr></thead><tbody>' +
      s.lines.map(function (l) { return '<tr><td style="padding-left:0">' + esc(l.name) + '<div class="sub">' + money(l.price) + ' each</div></td><td class="num">' + l.qty + '</td><td class="num" style="padding-right:0">' + money(l.qty * l.price - (l.discount || 0)) + '</td></tr>'; }).join('') +
      '</tbody></table><dl class="kv"><dt>Customer</dt><dd>' + (s.customer ? esc(s.customer) : 'Walk-in') + '</dd><dt>Subtotal</dt><dd>' + money(s.subtotal) + '</dd><dt>Discount</dt><dd class="' + (s.discount ? 'neg' : '') + '">' + (s.discount ? '− ' : '') + money(s.discount) + '</dd><dt>Tax</dt><dd>' + money(s.tax) + '</dd><dt style="font-weight:700;color:var(--ink-900)">Total</dt><dd style="font-weight:800;font-size:18px">' + money(s.total) + '</dd>' +
      s.payments.map(function (p) { return '<dt>Paid · ' + D.methodLabels[p.method] + (p.provider ? ' (' + esc(p.provider) + ')' : '') + '</dt><dd>' + money(p.amount) + '</dd>'; }).join('') + '</dl></div>' +
      '<div class="modal-foot" style="flex-wrap:wrap">' + (s.status === 'completed' && state.user.role !== 'Cashier' ? '<button class="btn btn-danger-outline" data-a="refund" data-no="' + s.no + '" style="margin-right:auto">' + icon('return', 'i-sm') + 'Refund</button>' : '') +
      ['58mm', '80mm', 'A4'].map(function (z) { return '<button class="btn btn-secondary btn-sm" data-a="receipt" data-no="' + s.no + '" data-size="' + z + '">' + icon('print', 'i-xs') + z + '</button>'; }).join('') + '</div></div>');
  }

  /* -------------------------------------------------------------- products */
  function viewProducts() {
    return pageHeader('Products', D.products.length + ' products · ' + D.variants.length + ' variants across ' + D.categories.length + ' categories', '<button class="btn btn-secondary" data-a="demo-only">' + icon('download', 'i-sm') + 'Export CSV</button><button class="btn btn-primary" data-a="new-product">' + icon('plus', 'i-sm') + 'Add product</button>') +
      '<div class="tabs mb-6">' + '<button class="tab' + (!state.productFilter.cat ? ' active' : '') + '" data-a="prod-cat" data-v="">All</button>' + D.categories.map(function (c) { return '<button class="tab' + (state.productFilter.cat === c.id ? ' active' : '') + '" data-a="prod-cat" data-v="' + c.id + '">' + c.name + '</button>'; }).join('') + '</div>' +
      '<div class="card"><div class="toolbar"><label class="search-wrap">' + icon('search', 'i-sm') + '<input class="input" type="search" data-in="prod-q" placeholder="Search products or SKU" value="' + esc(state.productFilter.q) + '"></label></div><div id="prod-table"></div></div>';
  }
  function renderProductTable() {
    var el = $('#prod-table'); if (!el) return;
    var f = state.productFilter, q = f.q.toLowerCase();
    var list = D.products.filter(function (p) { return (!f.cat || p.category === f.cat) && (!q || (p.name + ' ' + p.variants.map(function (v) { return v.sku; }).join(' ')).toLowerCase().indexOf(q) > -1); });
    el.innerHTML = list.length ? '<div class="table-wrap"><table class="table"><thead><tr><th>Product</th><th class="hide-sm">Category</th><th class="num hide-md">Cost</th><th class="num">Price</th><th class="num hide-md">Margin</th><th class="num">Stock</th></tr></thead><tbody>' +
      list.map(function (p) {
        var c = catOf(p.category), st = productStock(p), low = p.variants.some(function (v) { return stockOf(v) <= p.low; });
        return '<tr><td><div style="display:flex;gap:12px;align-items:center">' + thumb(p.name, c.color) + '<div class="grow"><b style="font-weight:600">' + esc(p.name) + '</b><div class="sub">' + (p.variants.length > 1 ? p.variants.length + ' variants' : esc(p.variants[0].sku)) + (p.taxable ? ' · Taxed 5%' : '') + '</div></div></div></td>' +
          '<td class="hide-sm"><span class="badge" style="background:' + c.color + '14;color:' + c.color + '">' + c.name + '</span></td><td class="num hide-md muted">' + money(p.cost) + '</td><td class="num" style="font-weight:600">' + money(p.price) + '</td>' +
          '<td class="num hide-md">' + Math.round((p.price - p.cost) / p.price * 100) + '%</td><td class="num">' + (st <= 0 ? '<span class="badge badge-red">Out</span>' : low ? '<span class="badge badge-amber">' + st + ' · Low</span>' : num(st) + ' <span class="muted">' + p.unit + '</span>') + '</td></tr>';
      }).join('') + '</tbody></table></div>' : empty('box', 'No products found');
  }
  function newProductModal() {
    openModal('<div class="modal md"><div class="modal-head"><h3>Add product</h3><button class="btn btn-ghost" style="padding:8px" data-a="close">' + icon('x') + '</button></div>' +
      '<form data-form="product"><div class="modal-body">' +
        '<div><label class="label">Product name</label><input class="input" name="name" required maxlength="80" placeholder="e.g. Silk Scarf"></div>' +
        '<div><label class="label">Category</label><select class="input" name="category">' + D.categories.map(function (c) { return '<option value="' + c.id + '">' + c.name + '</option>'; }).join('') + '</select></div>' +
        '<div class="row2"><div><label class="label">Cost price (Ks)</label><input class="input" name="cost" type="number" min="0" required value="5000"></div><div><label class="label">Selling price (Ks)</label><input class="input" name="price" type="number" min="1" required value="9500"></div></div>' +
        '<div><label class="label">Opening stock</label><input class="input" name="stock" type="number" min="0" value="20"><p class="help">It appears in the POS right away.</p></div>' +
      '</div><div class="modal-foot"><button type="button" class="btn btn-secondary" data-a="close">Cancel</button><button class="btn btn-primary">Save product</button></div></form></div>');
  }

  /* ------------------------------------------------------------- inventory */
  function viewInventory() {
    var rows = [], value = 0, units = 0;
    D.products.forEach(function (p) { p.variants.forEach(function (v) { var st = stockOf(v); value += Math.max(0, st) * v.cost; units += Math.max(0, st); rows.push({ p: p, v: v, st: st }); }); });
    rows.sort(function (a, b) { return a.st - b.st; });
    var low = rows.filter(function (r) { return r.st <= r.p.low; });
    return pageHeader('Inventory', 'Stock on hand at ' + D.locations[0].name, '<button class="btn btn-secondary" data-a="demo-only">' + icon('truck', 'i-sm') + 'Transfer</button><button class="btn btn-primary" data-a="adjust">' + icon('pencil', 'i-sm') + 'Adjust stock</button>') +
      '<div class="grid grid-stats mb-6">' + stat('Stock value (at cost)', money(value), 'wallet', 'Across ' + rows.length + ' variants', true) + stat('Units on hand', num(units), 'layers', D.locations[0].name) + stat('Low stock', num(low.length), 'alert', 'At or below threshold', low.length > 0) + stat('Out of stock', num(rows.filter(function (r) { return r.st <= 0; }).length), 'box', 'Need re-order') + '</div>' +
      '<div class="card"><div class="card-header"><h3 class="card-title">Stock levels</h3><span class="sub">Lowest first</span></div><div class="table-wrap"><table class="table"><thead><tr><th>Item</th><th class="hide-sm">SKU</th><th class="num hide-md">Re-order at</th><th class="num">On hand</th><th>Status</th></tr></thead><tbody>' +
      rows.map(function (r) {
        var c = catOf(r.p.category);
        return '<tr><td><div style="display:flex;gap:12px;align-items:center">' + thumb(r.p.name, c.color, 34) + '<div><b style="font-weight:500">' + esc(r.p.name) + '</b>' + (r.v.name ? '<div class="sub">' + esc(r.v.name) + '</div>' : '') + '</div></div></td><td class="hide-sm muted">' + esc(r.v.sku) + '</td><td class="num hide-md muted">' + r.p.low + '</td><td class="num" style="font-weight:600">' + num(r.st) + '</td>' +
          '<td>' + (r.st <= 0 ? '<span class="badge badge-red">Out of stock</span>' : r.st <= r.p.low ? '<span class="badge badge-amber">Low</span>' : '<span class="badge badge-green">In stock</span>') + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }
  function adjustModal() {
    openModal('<div class="modal md"><div class="modal-head"><h3>Adjust stock</h3><button class="btn btn-ghost" style="padding:8px" data-a="close">' + icon('x') + '</button></div>' +
      '<form data-form="adjust"><div class="modal-body">' +
        '<div><label class="label">Item</label><select class="input" name="variant">' + D.variants.map(function (v) { return '<option value="' + v.id + '">' + esc(variantLabel(v)) + ' (' + stockOf(v) + ')</option>'; }).join('') + '</select></div>' +
        '<div class="row2"><div><label class="label">Change</label><select class="input" name="dir"><option value="1">Add (+)</option><option value="-1">Remove (−)</option></select></div><div><label class="label">Quantity</label><input class="input" type="number" name="qty" min="1" value="10" required></div></div>' +
        '<div><label class="label">Reason</label><select class="input" name="reason"><option>Stock received</option><option>Damaged</option><option>Lost / stolen</option><option>Count correction</option></select><p class="help">Every adjustment is written to the stock movement log.</p></div>' +
      '</div><div class="modal-foot"><button type="button" class="btn btn-secondary" data-a="close">Cancel</button><button class="btn btn-primary">Save adjustment</button></div></form></div>');
  }

  /* ------------------------------------------------------------- customers */
  function viewCustomers() {
    var sales = allSales();
    var list = allCustomers().map(function (c) {
      var mine = sales.filter(function (s) { return s.customer === c.name && s.status === 'completed'; });
      return { c: c, visits: mine.length, spent: mine.reduce(function (a, s) { return a + s.total; }, 0), last: mine[0] ? mine[0].at : null };
    }).sort(function (a, b) { return b.spent - a.spent; });
    return pageHeader('Customers', list.length + ' customers with loyalty points', '<button class="btn btn-primary" data-a="new-customer">' + icon('plus', 'i-sm') + 'Add customer</button>') +
      '<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Customer</th><th class="hide-sm">Phone</th><th class="num">Visits</th><th class="num">Total spent</th><th class="num hide-md">Points</th><th class="hide-md">Last visit</th></tr></thead><tbody>' +
      list.map(function (x) {
        return '<tr><td><div style="display:flex;gap:12px;align-items:center"><span class="avatar" style="width:32px;height:32px;font-size:12px;background:var(--ink-100);color:var(--ink-700)">' + esc(initials(x.c.name)) + '</span><b style="font-weight:500">' + esc(x.c.name) + '</b></div></td><td class="hide-sm muted">' + esc(x.c.phone) + '</td><td class="num">' + x.visits + '</td><td class="num" style="font-weight:600">' + money(x.spent) + '</td><td class="num hide-md"><span class="badge badge-red">' + num(x.c.points) + ' pts</span></td><td class="hide-md muted">' + (x.last ? fmtDate(x.last) : '—') + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }
  function customerModal(fromPos) {
    var custs = allCustomers();
    if (fromPos) {
      openModal('<div class="modal md"><div class="modal-head"><h3>Select customer</h3><button class="btn btn-ghost" style="padding:8px" data-a="close">' + icon('x') + '</button></div>' +
        '<div style="padding:16px 24px 8px"><label class="search-wrap">' + icon('search', 'i-sm') + '<input class="input" data-in="cust-q" placeholder="Search name or phone"></label></div>' +
        '<ul class="pick-list" id="cust-list" style="overflow-y:auto;flex:1"></ul>' +
        '<form data-form="customer" style="padding:16px 24px;border-top:1px solid var(--ink-100)"><p class="eyebrow" style="margin-top:0">Quick add</p><div style="display:flex;gap:8px"><input class="input" name="name" placeholder="Name" required maxlength="60"><input class="input" name="phone" placeholder="Phone" maxlength="30"><button class="btn btn-dark" aria-label="Add">' + icon('plus', 'i-sm') + '</button></div><input type="hidden" name="pos" value="1"></form></div>');
      renderCustList('');
    } else {
      openModal('<div class="modal sm"><div class="modal-head"><h3>Add customer</h3><button class="btn btn-ghost" style="padding:8px" data-a="close">' + icon('x') + '</button></div>' +
        '<form data-form="customer"><div class="modal-body"><div><label class="label">Name</label><input class="input" name="name" required maxlength="60"></div><div><label class="label">Phone</label><input class="input" name="phone" maxlength="30" placeholder="09 …"></div></div>' +
        '<div class="modal-foot"><button type="button" class="btn btn-secondary" data-a="close">Cancel</button><button class="btn btn-primary">Save</button></div></form></div>');
    }
    return custs;
  }
  function renderCustList(q) {
    var el = $('#cust-list'); if (!el) return;
    q = q.toLowerCase();
    el.innerHTML = '<li><button data-a="pick-customer" data-id="" class="muted" style="font-weight:500">Walk-in customer</button></li>' +
      allCustomers().filter(function (c) { return !q || (c.name + c.phone).toLowerCase().indexOf(q) > -1; }).map(function (c) {
        return '<li><button data-a="pick-customer" data-id="' + c.id + '"><b style="font-weight:600;display:block">' + esc(c.name) + '</b><span class="sub">' + esc(c.phone) + ' · ' + c.points + ' pts</span></button></li>';
      }).join('');
  }

  /* --------------------------------------------------- purchases / expenses */
  function dateFromOffset(o) { var d = daysAgo(-o); return fmtDate(d.toISOString(), false); }
  function viewPurchases() {
    return pageHeader('Purchases', 'Stock received from suppliers', '<button class="btn btn-primary" data-a="demo-only">' + icon('plus', 'i-sm') + 'New purchase</button>') +
      '<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>PO number</th><th class="hide-sm">Supplier</th><th class="num hide-sm">Items</th><th>Status</th><th class="num">Total</th></tr></thead><tbody>' +
      D.purchases.map(function (p) { return '<tr><td><b style="font-weight:500">' + p.no + '</b><div class="sub">' + dateFromOffset(p.date) + '</div></td><td class="hide-sm">' + esc(p.supplier) + '</td><td class="num hide-sm">' + p.items + '</td><td>' + (p.status === 'Received' ? '<span class="badge badge-green">Received</span>' : '<span class="badge badge-amber">' + p.status + '</span>') + '</td><td class="num" style="font-weight:600">' + money(p.total) + '</td></tr>'; }).join('') +
      '</tbody></table></div></div>';
  }
  function viewExpenses() {
    var total = D.expenses.reduce(function (a, e) { return a + e.amount; }, 0);
    return pageHeader('Expenses', 'Last 30 days · ' + money(total), '<button class="btn btn-primary" data-a="demo-only">' + icon('plus', 'i-sm') + 'Record expense</button>') +
      '<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Date</th><th>Category</th><th class="hide-sm">Note</th><th class="num">Amount</th></tr></thead><tbody>' +
      D.expenses.map(function (e) { return '<tr><td class="muted">' + dateFromOffset(e.date) + '</td><td><span class="badge badge-gray">' + e.category + '</span></td><td class="hide-sm">' + esc(e.note) + '</td><td class="num" style="font-weight:600">' + money(e.amount) + '</td></tr>'; }).join('') +
      '</tbody></table></div></div>';
  }

  /* ---------------------------------------------------------------- reports */
  function viewReports() {
    var list = salesIn(state.range), sum = summarize(list, state.range);
    var cats = {}; list.forEach(function (s) { if (s.status !== 'completed') return; s.lines.forEach(function (l) { cats[l.category] = (cats[l.category] || 0) + l.qty * l.price; }); });
    var catRows = D.categories.map(function (c) { return { c: c, v: cats[c.id] || 0 }; }).sort(function (a, b) { return b.v - a.v; });
    var catMax = Math.max.apply(null, catRows.map(function (x) { return x.v; }).concat([1]));
    var cashiers = {}; list.forEach(function (s) { if (s.status !== 'completed') return; cashiers[s.cashier] = cashiers[s.cashier] || { n: 0, v: 0 }; cashiers[s.cashier].n++; cashiers[s.cashier].v += s.total; });
    var top = topProducts(list, 8);
    var net = sum.profit - sum.expenses;
    return pageHeader('Reports', rangeLabel(state.range), '<button class="btn btn-secondary" data-a="print">' + icon('print', 'i-sm') + 'Print</button>') + rangeTabs() +
      '<div class="grid grid-stats">' + stat('Net sales', money(sum.net), 'cash', sum.count + ' transactions', true) + stat('Gross profit', money(sum.profit), 'chart', sum.margin !== null ? sum.margin + '% margin' : '—') + stat('Expenses', money(sum.expenses), 'wallet', 'Rent, salaries, utilities…') + stat('Net profit', money(net), 'sparkles', 'Gross profit − expenses', net < 0) + '</div>' +
      '<div class="grid grid-2-1 mt-6"><div class="card"><div class="card-header"><h3 class="card-title">Sales by category</h3></div><div class="card-body" style="display:flex;flex-direction:column;gap:16px">' +
        catRows.map(function (x) { return '<div><div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:14px"><span style="display:flex;gap:8px;align-items:center;font-weight:500"><i style="width:10px;height:10px;border-radius:3px;background:' + x.c.color + '"></i>' + x.c.name + '</span><span class="tnum">' + money(x.v) + '</span></div><div class="meter"><div style="width:' + (x.v / catMax * 100).toFixed(1) + '%;background:' + x.c.color + '"></div></div></div>'; }).join('') +
      '</div></div>' +
      '<div class="card"><div class="card-header"><h3 class="card-title">By cashier</h3></div><ul>' + Object.keys(cashiers).sort(function (a, b) { return cashiers[b].v - cashiers[a].v; }).map(function (k) { return '<li class="list-row"><span class="avatar" style="width:32px;height:32px;font-size:12px">' + k[0] + '</span><div class="grow"><p style="font-weight:500">' + esc(k) + '</p><p class="sub">' + cashiers[k].n + (cashiers[k].n === 1 ? ' sale' : ' sales') + '</p></div><span class="tnum" style="font-weight:600">' + money(cashiers[k].v) + '</span></li>'; }).join('') + '</ul></div></div>' +
      '<div class="card mt-6"><div class="card-header"><h3 class="card-title">Top products</h3></div><div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Product</th><th class="num">Units</th><th class="num">Sales</th></tr></thead><tbody>' +
      top.map(function (p, i) { return '<tr><td><span class="rank' + (i === 0 ? ' first' : '') + '">' + (i + 1) + '</span></td><td style="font-weight:500">' + esc(p.name) + '</td><td class="num">' + p.qty + '</td><td class="num" style="font-weight:600">' + money(p.net) + '</td></tr>'; }).join('') + '</tbody></table></div></div>';
  }

  /* ------------------------------------------------------- staff / settings */
  function viewStaff() {
    return pageHeader('Staff', 'Who can sign in, and what each role can do', '<button class="btn btn-primary" data-a="demo-only">' + icon('plus', 'i-sm') + 'Invite staff</button>') +
      '<div class="card"><div class="table-wrap"><table class="table"><thead><tr><th>Name</th><th class="hide-sm">Email</th><th>Role</th><th class="hide-sm">Status</th><th class="hide-md">Last sign-in</th></tr></thead><tbody>' +
      D.staff.map(function (s) { return '<tr><td><div style="display:flex;gap:12px;align-items:center"><span class="avatar" style="width:32px;height:32px;font-size:12px">' + s.name[0] + '</span><b style="font-weight:500">' + esc(s.name) + '</b></div></td><td class="hide-sm muted">' + s.email + '</td><td><span class="badge ' + (s.role === 'Owner' ? 'badge-red' : s.role === 'Manager' ? 'badge-blue' : 'badge-gray') + '">' + s.role + '</span></td><td class="hide-sm">' + (s.status === 'Active' ? '<span class="badge badge-green">Active</span>' : '<span class="badge badge-amber">Invited</span>') + '</td><td class="hide-md muted">' + s.last + '</td></tr>'; }).join('') +
      '</tbody></table></div></div>' +
      '<div class="grid mt-6" style="grid-template-columns:repeat(auto-fit,minmax(240px,1fr))">' + [['Owner', 'Everything, including staff, settings, subscription and the audit log.'], ['Manager', 'Products, stock, purchases, refunds approval, expenses and reports.'], ['Cashier', 'Point of sale, own sales, cash shift and refund requests only.']].map(function (r) { return '<div class="card card-body"><b>' + r[0] + '</b><p class="sub" style="margin-top:4px;font-size:13px">' + r[1] + '</p></div>'; }).join('') + '</div>';
  }
  function viewSettings() {
    var b = D.business;
    return pageHeader('Settings', 'Business details printed on receipts') +
      '<form class="card" data-form="settings" style="max-width:720px"><div class="card-body" style="display:grid;gap:16px">' +
        '<div><label class="label">Business name</label><input class="input" value="' + esc(b.name) + '"></div>' +
        '<div class="row2"><div><label class="label">Phone</label><input class="input" value="' + b.phone + '"></div><div><label class="label">Currency</label><select class="input"><option>MMK — Kyat (Ks)</option><option>USD — Dollar ($)</option><option>THB — Baht (฿)</option></select></div></div>' +
        '<div><label class="label">Address</label><input class="input" value="' + esc(b.address) + '"></div>' +
        '<div class="row2"><div><label class="label">Default tax</label><select class="input"><option>' + b.taxName + '</option><option>No tax</option></select></div><div><label class="label">Receipt size</label><select class="input"><option>80 mm thermal</option><option>58 mm thermal</option><option>A4 invoice</option></select></div></div>' +
        '<div><label class="label">Receipt footer</label><input class="input" value="Thank you, please come again!"></div>' +
      '</div><div class="modal-foot" style="border-top:1px solid var(--ink-100)"><button class="btn btn-primary">Save settings</button></div></form>';
  }

  /* ---------------------------------------------------------------- modals */
  function openModal(inner) {
    var root = document.getElementById('modal-root');
    root.innerHTML = '<div class="modal-backdrop" data-a="backdrop" role="dialog" aria-modal="true">' + inner + '</div>';
  }
  function closeModal() { var root = document.getElementById('modal-root'); if (root) root.innerHTML = ''; state.pay = null; }
  function modalOpen() { return !!$('#modal-root .modal-backdrop'); }

  function toast(msg, type) {
    var root = document.getElementById('toasts');
    var el = document.createElement('div');
    el.className = 'toast' + (type === 'error' ? ' error' : '');
    el.innerHTML = '<span class="dot">' + icon(type === 'error' ? 'alert' : 'check', 'i-xs').replace('stroke-width="1.75"', 'stroke-width="3" style="color:#fff;width:12px;height:12px"') + '</span><p style="flex:1">' + esc(msg) + '</p>';
    root.appendChild(el);
    setTimeout(function () { el.style.transition = 'opacity .3s'; el.style.opacity = '0'; setTimeout(function () { el.remove(); }, 300); }, 3200);
  }

  /* ---------------------------------------------------------------- events */
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-a]'); if (!t) return;
    var a = t.dataset.a, c = state.cart;
    if (a === 'backdrop' && e.target !== t) return;
    switch (a) {
      case 'backdrop': case 'close': closeModal(); break;
      case 'sidebar-open': state.sidebar = true; render(); break;
      case 'sidebar-close': state.sidebar = false; render(); break;
      case 'logout': state.user = null; persist(); go('login'); break;
      case 'lang': toast('Burmese translation ships with the full app — this demo is English only.'); break;
      case 'reset':
        try { localStorage.removeItem(STORE_KEY); } catch (er) { }
        location.hash = '#/login'; location.reload(); break;
      case 'pick-role':
        document.querySelectorAll('[data-a="pick-role"]').forEach(function (b) { b.classList.toggle('active', b === t); });
        var f = t.closest('form'); f.role.value = t.dataset.role; f.email.value = t.dataset.role.toLowerCase() + '@demo.test'; break;
      case 'range': state.range = t.dataset.v; render(); break;
      case 'demo-only': toast('This action is part of the full Laravel app — not included in the static demo.'); break;
      case 'print': window.print(); break;

      // POS
      case 'pos-cat': state.posCategory = t.dataset.v || null; renderPosGrid(); break;
      case 'add': var p = D.products.find(function (x) { return x.id === Number(t.dataset.id); }); if (p.variants.length > 1) variantPicker(p); else addVariant(p.variants[0]); break;
      case 'add-variant': addVariant(variantById(Number(t.dataset.id))); closeModal(); break;
      case 'inc': c.lines[t.dataset.i].qty++; cartChanged(); break;
      case 'dec': var l = c.lines[t.dataset.i]; l.qty--; if (l.qty <= 0) c.lines.splice(t.dataset.i, 1); cartChanged(); break;
      case 'remove': c.lines.splice(t.dataset.i, 1); cartChanged(); break;
      case 'clear': c.lines = []; c.orderDiscount = { type: 'none', value: '' }; c.customer = null; cartChanged(); break;
      case 'cart-open': state.mobileCart = true; renderCart(); break;
      case 'cart-close': state.mobileCart = false; renderCart(); break;
      case 'charge': openPayment(); break;
      case 'edit-line': lineEditor(Number(t.dataset.i)); break;
      case 'line-disc-type': $('#ld-type').value = t.dataset.v; document.querySelectorAll('[data-a="line-disc-type"]').forEach(function (b) { b.classList.toggle('active', b === t); }); $('#ld-val').disabled = t.dataset.v === 'none'; break;
      case 'line-save':
        var li = c.lines[t.dataset.i]; li.qty = Math.max(1, Math.round(Number($('#ld-qty').value) || 1)); li.discType = $('#ld-type').value; li.discValue = $('#ld-val').value; closeModal(); cartChanged(); break;
      case 'line-remove': c.lines.splice(t.dataset.i, 1); closeModal(); cartChanged(); break;
      case 'order-discount': orderDiscountModal(); break;
      case 'od-type': c.orderDiscount.type = t.dataset.v; document.querySelectorAll('[data-a="od-type"]').forEach(function (b) { b.classList.toggle('active', b === t); }); $('#od-val').classList.toggle('hidden', t.dataset.v === 'none'); break;
      case 'od-apply': c.orderDiscount.value = $('#od-val').value; closeModal(); cartChanged(); break;
      case 'hold': holdModal(); break;
      case 'hold-save':
        var q = quote();
        state.held.unshift({ id: Date.now(), label: ($('#hold-label').value || 'Cart ' + (state.held.length + 1)).slice(0, 60), cart: JSON.parse(JSON.stringify(c)), items: c.lines.length, total: q.total, at: new Date().toISOString(), by: state.user.name });
        state.cart = { lines: [], customer: null, orderDiscount: { type: 'none', value: '' }, notes: '' };
        closeModal(); persist(); render(); toast('Cart held. Resume it from “Held”.'); break;
      case 'held': heldModal(); break;
      case 'resume':
        var h = state.held.find(function (x) { return x.id === Number(t.dataset.id); });
        if (c.lines.length) { toast('Finish or hold the current sale first.', 'error'); break; }
        state.cart = h.cart; state.held = state.held.filter(function (x) { return x !== h; }); persist(); render(); toast('Resumed “' + h.label + '”'); break;
      case 'held-delete': state.held = state.held.filter(function (x) { return x.id !== Number(t.dataset.id); }); persist(); heldModal(); break;
      case 'customer': customerModal(true); break;
      case 'pick-customer': c.customer = t.dataset.id ? Number(t.dataset.id) : null; closeModal(); cartChanged(); break;
      case 'pay-method': state.pay.method = t.dataset.v; state.pay.amount = String(Math.max(0, state.pay.total - payPaid())); renderPayment(); break;
      case 'quick-cash': state.pay.amount = t.dataset.v; renderPayment(); break;
      case 'split':
        var amt = Math.round(Number(state.pay.amount) || 0);
        state.pay.payments.push({ method: state.pay.method, amount: amt, provider: state.pay.provider || null });
        state.pay.amount = String(state.pay.total - payPaid()); state.pay.provider = ''; state.pay.ref = ''; state.pay.method = state.pay.method === 'cash' ? 'mobile_payment' : 'cash'; renderPayment(); break;
      case 'pay-remove': state.pay.payments.splice(Number(t.dataset.i), 1); state.pay.amount = String(state.pay.total - payPaid()); renderPayment(); break;
      case 'complete': completeSale(); break;
      case 'receipt': showReceipt(t.dataset.no, t.dataset.size); break;

      // Other pages
      case 'sale': showSale(t.dataset.no); break;
      case 'refund':
        var s = state.extraSales.find(function (x) { return x.no === t.dataset.no; }) || baseSales.find(function (x) { return x.no === t.dataset.no; });
        s.status = 'refunded';
        if (s.demo) persist();
        closeModal(); render(); toast(s.no + ' refunded. Stock returned to shelf.'); break;
      case 'prod-cat': state.productFilter.cat = t.dataset.v; render(); break;
      case 'new-product': newProductModal(); break;
      case 'adjust': adjustModal(); break;
      case 'new-customer': customerModal(false); break;
    }
  });

  document.addEventListener('input', function (e) {
    var t = e.target, k = t.dataset && t.dataset.in; if (!k) return;
    if (t.id === 'pos-search') return;
    switch (k) {
      case 'qty': var n = Math.round(Number(t.value)); if (n > 0) { state.cart.lines[t.dataset.i].qty = n; persist(); clearTimeout(t._tm); t._tm = setTimeout(renderCart, 500); } break;
      case 'pay-amount': state.pay.amount = t.value.replace(/[^\d]/g, ''); renderPayment(); break;
      case 'pay-provider': state.pay.provider = t.value; break;
      case 'pay-ref': state.pay.ref = t.value; break;
      case 'sales-q': state.salesFilter.q = t.value; renderSalesTable(); break;
      case 'sales-status': state.salesFilter.status = t.value; renderSalesTable(); break;
      case 'sales-method': state.salesFilter.method = t.value; renderSalesTable(); break;
      case 'prod-q': state.productFilter.q = t.value; renderProductTable(); break;
      case 'cust-q': renderCustList(t.value); break;
    }
  });
  document.addEventListener('change', function (e) { var t = e.target; if (t.dataset && t.dataset.in === 'qty') renderCart(); });

  // POS search: live filter + Enter adds exact barcode/SKU match
  document.addEventListener('input', function (e) { if (e.target.id === 'pos-search') { state.posQuery = e.target.value; renderPosGrid(); } });
  document.addEventListener('keydown', function (e) {
    if (e.target.id === 'pos-search' && e.key === 'Enter') {
      e.preventDefault();
      var q = state.posQuery.trim().toLowerCase(); if (!q) return;
      var v = D.variants.find(function (x) { return x.barcode === q || x.sku.toLowerCase() === q; });
      if (v) { addVariant(v); state.posQuery = ''; e.target.value = ''; renderPosGrid(); return; }
      var list = filteredProducts();
      if (list.length === 1) { if (list[0].variants.length > 1) variantPicker(list[0]); else { addVariant(list[0].variants[0]); state.posQuery = ''; e.target.value = ''; renderPosGrid(); } }
      return;
    }
    if (e.key === 'Escape' && modalOpen()) { closeModal(); return; }
    if (route() !== 'pos' || !state.user) return;
    if (e.key === 'F2') { e.preventDefault(); var s = $('#pos-search'); if (s) { s.focus(); s.select(); } }
    if (e.key === 'F9') { e.preventDefault(); if (!modalOpen()) openPayment(); }
    if (e.key === 'Enter' && e.target.id === 'pay-amount') { e.preventDefault(); var b = $('[data-a="complete"]'); if (b && !b.disabled) completeSale(); }
  });

  document.addEventListener('submit', function (e) {
    var f = e.target, k = f.dataset.form; if (!k) return;
    e.preventDefault();
    if (k === 'login') {
      var role = f.role.value;
      state.user = { role: role, name: ROLES[role].name };
      persist();
      go(role === 'Cashier' ? 'pos' : 'dashboard');
      toast('Signed in as ' + state.user.name + ' (' + role + ')');
    }
    if (k === 'product') {
      var id = 900 + state.addedProducts.length + 1;
      var name = f.name.value.trim(), cost = Math.round(Number(f.cost.value)), price = Math.round(Number(f.price.value));
      var prefix = name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(function (w) { return w.slice(0, 3); }).join('').toUpperCase() || 'NEW';
      var p = { id: id, name: name, category: f.category.value, cost: cost, price: price, unit: 'pcs', taxable: f.category.value === 'mobile', low: 3, variants: [] };
      var v = { id: id * 10, productId: id, name: null, sku: prefix + '-' + id, barcode: '885' + String(id * 10).padStart(10, '0'), price: price, cost: cost, stock: Math.max(0, Math.round(Number(f.stock.value) || 0)) };
      p.variants.push(v);
      D.products.push(p); D.variants.push(v); state.addedProducts.push(p);
      persist(); closeModal(); render(); toast(name + ' added to the catalogue');
    }
    if (k === 'adjust') {
      var vid = Number(f.variant.value), qty = Math.round(Number(f.qty.value)) * Number(f.dir.value);
      state.stockDelta[vid] = (state.stockDelta[vid] || 0) + qty;
      persist(); closeModal(); render(); toast('Stock adjusted: ' + variantLabel(variantById(vid)) + ' ' + (qty > 0 ? '+' : '') + qty);
    }
    if (k === 'customer') {
      var cid = 100 + state.addedCustomers.length + 1;
      var cust = { id: cid, name: f.name.value.trim(), phone: f.phone.value.trim() || '—', points: 0 };
      state.addedCustomers.push(cust);
      if (f.pos) { state.cart.customer = cid; closeModal(); cartChanged(); }
      else { persist(); closeModal(); render(); }
      toast(cust.name + ' added');
    }
    if (k === 'settings') toast('Settings saved (demo only)');
  });

  /* ------------------------------------------------------------ POS modals */
  function lineEditor(i) {
    var l = state.cart.lines[i], v = variantById(l.variantId);
    openModal('<div class="modal sm"><div class="modal-head"><div><h3>' + esc(productOf(v).name) + '</h3><p class="sub">' + esc(v.sku) + (v.name ? ' · ' + esc(v.name) : '') + '</p></div><button class="btn btn-ghost" style="padding:8px" data-a="close">' + icon('x') + '</button></div>' +
      '<div class="modal-body"><div><label class="label">Quantity</label><input class="input" type="number" min="1" id="ld-qty" value="' + l.qty + '"></div>' +
      '<div><label class="label">Line discount</label><input type="hidden" id="ld-type" value="' + l.discType + '"><div class="grid3" style="margin-bottom:8px">' + [['none', 'None'], ['percent', '%'], ['amount', 'Fixed Ks']].map(function (o) { return '<button class="choice' + (l.discType === o[0] ? ' active' : '') + '" data-a="line-disc-type" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>' +
      '<input class="input" type="number" min="0" id="ld-val" value="' + esc(l.discValue) + '" placeholder="0"' + (l.discType === 'none' ? ' disabled' : '') + '><p class="help">Managers can set a maximum discount per role.</p></div></div>' +
      '<div class="modal-foot"><button class="btn btn-danger-outline" data-a="line-remove" data-i="' + i + '" style="margin-right:auto">Remove</button><button class="btn btn-primary" data-a="line-save" data-i="' + i + '">Done</button></div></div>');
  }
  function orderDiscountModal() {
    var od = state.cart.orderDiscount;
    openModal('<div class="modal sm"><div class="modal-head"><h3>Order discount</h3><button class="btn btn-ghost" style="padding:8px" data-a="close">' + icon('x') + '</button></div>' +
      '<div class="modal-body"><div class="grid3">' + [['none', 'None'], ['percent', '%'], ['amount', 'Fixed Ks']].map(function (o) { return '<button class="choice' + (od.type === o[0] ? ' active' : '') + '" data-a="od-type" data-v="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>' +
      '<input class="input' + (od.type === 'none' ? ' hidden' : '') + '" style="font-size:18px" type="number" min="0" id="od-val" value="' + esc(od.value) + '" placeholder="0"></div>' +
      '<div class="modal-foot"><button class="btn btn-primary" data-a="od-apply">Apply</button></div></div>');
  }
  function holdModal() {
    openModal('<div class="modal sm"><div class="modal-head"><div><h3>Hold cart</h3><p class="sub">Park this sale and serve the next customer.</p></div></div>' +
      '<div class="modal-body"><div><label class="label">Label</label><input class="input" id="hold-label" maxlength="60" placeholder="e.g. Lady in red, table 2"></div></div>' +
      '<div class="modal-foot"><button class="btn btn-secondary" data-a="close">Cancel</button><button class="btn btn-dark" data-a="hold-save">' + icon('pause', 'i-sm') + 'Hold</button></div></div>');
    $('#hold-label').focus();
  }
  function heldModal() {
    openModal('<div class="modal md"><div class="modal-head"><h3>Held carts</h3><button class="btn btn-ghost" style="padding:8px" data-a="close">' + icon('x') + '</button></div><ul style="overflow-y:auto">' +
      (state.held.length ? state.held.map(function (h) {
        return '<li class="list-row" style="padding:12px 24px"><div class="grow"><p class="truncate" style="font-weight:600">' + esc(h.label) + '</p><p class="sub">' + h.items + ' items · ' + money(h.total) + ' · ' + time12(new Date(h.at)) + '</p></div>' +
          '<button class="btn btn-ghost btn-sm" data-a="held-delete" data-id="' + h.id + '" aria-label="Delete">' + icon('trash', 'i-sm') + '</button><button class="btn btn-dark btn-sm" data-a="resume" data-id="' + h.id + '">' + icon('play', 'i-xs') + 'Resume</button></li>';
      }).join('') : '<li style="padding:40px 24px;text-align:center" class="muted">No held carts</li>') + '</ul></div>');
  }

  /* ------------------------------------------------------------------ boot */
  var _render = render;
  render = function () { _render(); var r = route(); if (r === 'sales') renderSalesTable(); if (r === 'products') renderProductTable(); };
  render();
})();
