/* SalesFlow demo — data layer.
   Replaces the original Google Sheets + serverless API with an in-browser store.
   Sample orders are generated deterministically relative to today, then kept in
   localStorage so visitors can add, edit and delete without touching a server. */
(function () {
  'use strict';

  var STORAGE_KEY = 'salesflow-demo:v1';
  var SESSION_KEY = 'salesflow-demo:session';
  var STATUSES = ['Pending', 'Delivered', 'Returned'];

  var DEFAULT_SETTINGS = {
    businessName: 'SalesFlow Demo Store',
    currency: 'Ks',
    timezone: 'Asia/Yangon',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    colors: ['Black', 'White', 'Sand', 'Olive', 'Navy', 'Grey', 'Natural', 'Maroon'],
  };

  var PRODUCTS = [
    { item: 'Linen Shirt', price: 32000, sizes: ['S', 'M', 'L', 'XL'], colors: ['Sand', 'White', 'Olive', 'Black'], w: 10 },
    { item: 'Oversized Tee', price: 18000, sizes: ['Free Size', 'M', 'L'], colors: ['Black', 'White', 'Grey'], w: 12 },
    { item: 'Cargo Pants', price: 42000, sizes: ['S', 'M', 'L', 'XL'], colors: ['Olive', 'Black', 'Sand'], w: 6 },
    { item: 'Knit Polo', price: 39000, sizes: ['M', 'L', 'XL', 'XXL'], colors: ['Navy', 'Maroon', 'Black'], w: 5 },
    { item: 'Canvas Tote', price: 15000, sizes: ['Free Size'], colors: ['Natural', 'Black'], w: 5 },
    { item: 'Pleated Skirt', price: 36000, sizes: ['XS', 'S', 'M'], colors: ['Black', 'Navy', 'Sand'], w: 4 },
    { item: 'Bucket Hat', price: 12000, sizes: ['Free Size'], colors: ['Black', 'Olive', 'Natural'], w: 4 },
  ];

  var FIRST = ['Aye Chan', 'Min Thant', 'Hnin Wai', 'Zaw Lin', 'Thiri', 'Kaung Myat', 'Su Myat', 'Phyo Wai', 'May Thu', 'Htet Aung', 'Ei Mon', 'Nay Lin', 'Khin Zar', 'Ye Yint', 'Wai Yan', 'Shwe Sin', 'Pyae Sone', 'Nandar', 'Thura', 'Yoon'];
  var LAST = ['Moe', 'Kyaw', 'Phyo', 'Htet', 'Khin', 'Thu', 'Noe', 'Aung', 'Oo', 'Win', 'Lwin', 'Naing', 'Zaw', 'Myint', 'Hlaing'];
  var STREETS = ['Bogyoke Aung San Rd, Pabedan', 'Pyay Rd, Kamayut', 'Inya Rd, Bahan', 'Kabar Aye Pagoda Rd, Mayangone', 'Anawrahta Rd, Lanmadaw', 'Shwe Gon Daing Rd, Bahan', 'Baho Rd, Sanchaung', 'Thamain Bayan Rd, Tamwe', 'University Ave, Bahan', 'Mahabandoola Rd, Kyauktada'];

  // ---- date helpers (local calendar dates as YYYY-MM-DD) ----
  function pad(n) { return String(n).padStart(2, '0'); }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function todayIso() { return iso(new Date()); }
  function parseIso(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(s, n) { var d = parseIso(s); d.setDate(d.getDate() + n); return iso(d); }
  function daysBetween(a, b) { return Math.round((parseIso(b) - parseIso(a)) / 86400000); }

  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function uid() {
    return 'S' + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 1296).toString(36).toUpperCase().padStart(2, '0');
  }

  function generateSeed() {
    var r = rng(20261104);
    var pick = function (arr) { return arr[Math.floor(r() * arr.length)]; };
    var totalW = PRODUCTS.reduce(function (s, p) { return s + p.w; }, 0);
    var pickProduct = function () {
      var x = r() * totalW;
      for (var i = 0; i < PRODUCTS.length; i++) { x -= PRODUCTS[i].w; if (x <= 0) return PRODUCTS[i]; }
      return PRODUCTS[0];
    };
    var today = todayIso();
    var orders = [];
    var n = 0;
    for (var back = 119; back >= 0; back--) {
      var date = addDays(today, -back);
      var dow = parseIso(date).getDay();
      var base = 3 + (119 - back) / 45 + (dow === 0 || dow === 6 ? 2 : 0);
      var count = Math.max(1, Math.round(base + (r() - 0.5) * 4));
      if (back === 0) count = Math.min(count, 5);
      for (var k = 0; k < count; k++) {
        var lines = [];
        var nLines = r() < 0.72 ? 1 : r() < 0.8 ? 2 : 3;
        for (var j = 0; j < nLines; j++) {
          var p = pickProduct();
          var qty = r() < 0.7 ? 1 : r() < 0.75 ? 2 : 3;
          var discount = r() < 0.15 ? 0.9 : 1;
          lines.push({ item: p.item, size: pick(p.sizes), color: pick(p.colors), qty: qty, amount: Math.round((p.price * qty * discount) / 500) * 500 });
        }
        var status;
        var x = r();
        if (back > 6) status = x < 0.95 ? 'Delivered' : 'Returned';
        else if (back > 2) status = x < 0.55 ? 'Delivered' : x < 0.97 ? 'Pending' : 'Returned';
        else status = x < 0.15 ? 'Delivered' : 'Pending';
        var hour = 9 + Math.floor(r() * 12);
        var minute = Math.floor(r() * 60);
        n++;
        orders.push({
          id: 'S' + String(10000 + n),
          date: date,
          time: pad(hour) + ':' + pad(minute),
          name: pick(FIRST) + ' ' + pick(LAST),
          phone: '09 ' + (4 + Math.floor(r() * 6)) + String(Math.floor(r() * 1000)).padStart(3, '0') + ' ' + String(Math.floor(r() * 10000)).padStart(4, '0'),
          address: 'No. ' + (1 + Math.floor(r() * 180)) + ', ' + pick(STREETS) + ' Tsp, Yangon',
          status: status,
          items: lines,
          updatedAt: Date.now(),
        });
      }
    }
    return orders;
  }

  // ---- persistence (every access guarded: storage can be blocked) ----
  var memory = null;
  function read() {
    if (memory) return memory;
    var data = null;
    try { data = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { data = null; }
    if (!data || !Array.isArray(data.orders)) data = { orders: generateSeed(), settings: clone(DEFAULT_SETTINGS) };
    data.settings = Object.assign(clone(DEFAULT_SETTINGS), data.settings || {});
    memory = data;
    return memory;
  }
  function write() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(memory)); } catch (e) { /* demo still works in memory */ } }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function orderTotal(o) { return o.items.reduce(function (s, l) { return s + l.amount; }, 0); }
  function orderQty(o) { return o.items.reduce(function (s, l) { return s + l.qty; }, 0); }

  var Store = {
    STATUSES: STATUSES,
    iso: iso, todayIso: todayIso, parseIso: parseIso, addDays: addDays, daysBetween: daysBetween,
    orderTotal: orderTotal, orderQty: orderQty,

    orders: function () { return read().orders; },
    get: function (id) { return read().orders.find(function (o) { return o.id === id; }) || null; },
    add: function (o) {
      var now = new Date();
      var rec = Object.assign({}, o, { id: uid(), time: pad(now.getHours()) + ':' + pad(now.getMinutes()), updatedAt: Date.now() });
      read().orders.push(rec); write(); return rec;
    },
    update: function (id, patch, expectedUpdatedAt) {
      var o = Store.get(id);
      if (!o) throw new Error('This sale no longer exists.');
      if (expectedUpdatedAt && o.updatedAt !== expectedUpdatedAt) throw new Error('This sale was changed somewhere else. Reload it and try again.');
      Object.assign(o, patch, { updatedAt: Date.now() }); write(); return o;
    },
    remove: function (id) {
      var d = read(); var i = d.orders.findIndex(function (o) { return o.id === id; });
      if (i >= 0) { d.orders.splice(i, 1); write(); }
    },
    settings: function () { return read().settings; },
    saveSettings: function (patch) { Object.assign(read().settings, patch); write(); return read().settings; },
    reset: function () { memory = { orders: generateSeed(), settings: clone(DEFAULT_SETTINGS) }; write(); },
    knownItems: function () {
      var set = {}; PRODUCTS.forEach(function (p) { set[p.item] = 1; });
      read().orders.forEach(function (o) { o.items.forEach(function (l) { set[l.item] = 1; }); });
      return Object.keys(set).sort();
    },

    session: function () { try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { return Store._session || null; } },
    signIn: function (username) {
      var s = { username: username, since: Date.now() }; Store._session = s;
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch (e) { /* memory only */ }
      return s;
    },
    signOut: function () { Store._session = null; try { sessionStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ } },
  };

  window.SFStore = Store;
})();
