/* Counter POS demo data — mirrors the app's DemoSeeder. All in-browser, no server. */
(function (global) {
  'use strict';

  // Deterministic RNG so every visitor sees the same history.
  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var business = {
    name: 'Shwe Mandalay Fashion & Mart',
    address: '78th Street, Mandalay',
    phone: '09 2000 3000',
    currency: 'Ks',
    taxName: 'Commercial Tax 5%'
  };

  var locations = [
    { id: 'MDY', name: 'Mandalay Main Store' },
    { id: 'YGN', name: 'Yangon Branch' }
  ];

  var staff = [
    { id: 1, name: 'Daw Khin Myat', role: 'Owner', email: 'owner@demo.test', status: 'Active', last: 'Today, 9:02 AM' },
    { id: 2, name: 'U Aung Ko', role: 'Manager', email: 'manager@demo.test', status: 'Active', last: 'Today, 8:40 AM' },
    { id: 3, name: 'Ma Thida', role: 'Cashier', email: 'cashier@demo.test', status: 'Active', last: 'Today, 8:55 AM' },
    { id: 4, name: 'Ko Htet Aung', role: 'Cashier', email: 'htet@demo.test', status: 'Invited', last: '—' }
  ];

  var categories = [
    { id: 'clothing', name: 'Clothing', color: '#ea5959', icon: 'shirt' },
    { id: 'shoes', name: 'Shoes', color: '#303030', icon: 'shoe' },
    { id: 'cosmetics', name: 'Cosmetics', color: '#d946ef', icon: 'sparkles' },
    { id: 'grocery', name: 'Grocery', color: '#16a34a', icon: 'bag' },
    { id: 'mobile', name: 'Mobile Accessories', color: '#0ea5e9', icon: 'phone' }
  ];

  // [name, category, cost, price, variants?]
  var raw = [
    ['Cotton T-Shirt', 'clothing', 6000, 12000, ['M / Black', 'L / Black', 'M / White', 'L / White']],
    ['Slim Fit Jeans', 'clothing', 18000, 32000, ['30 / Blue', '32 / Blue', '34 / Blue']],
    ['Longyi (Men)', 'clothing', 9000, 16500, ['Green Check', 'Maroon']],
    ['Htamein (Women)', 'clothing', 11000, 19500, ['Gold', 'Navy']],
    ['Canvas Sneakers', 'shoes', 14000, 26000, ['40 / White', '41 / White', '42 / Black']],
    ['Velvet Slippers', 'shoes', 7000, 13500, ['8 / Black', '9 / Black']],
    ['Thanakha Cream 50g', 'cosmetics', 1500, 3000],
    ['Lip Tint Rose', 'cosmetics', 4500, 8500],
    ['Sunscreen SPF50', 'cosmetics', 7000, 12900],
    ['Jasmine Rice 5kg', 'grocery', 14500, 17800],
    ['Laphet Thoke Pack', 'grocery', 2200, 3500],
    ['Instant Coffee 3in1 (30)', 'grocery', 5200, 6900],
    ['Palm Sugar 500g', 'grocery', 1800, 2600],
    ['Drinking Water 1L', 'grocery', 250, 500],
    ['USB-C Charger 20W', 'mobile', 9000, 15000],
    ['Lightning Cable 1m', 'mobile', 2500, 5500],
    ['Power Bank 10000mAh', 'mobile', 21000, 34500],
    ['Tempered Glass Screen', 'mobile', 1200, 3500],
    ['Bluetooth Earbuds', 'mobile', 16000, 28500]
  ];

  var r = rng(2026);
  var products = [];
  var variants = []; // sellable units
  raw.forEach(function (row, idx) {
    var name = row[0], cat = row[1];
    var prefix = name.replace(/[^A-Za-z ]/g, '').split(' ').filter(Boolean).slice(0, 2).map(function (w) { return w.slice(0, 3); }).join('').toUpperCase();
    var p = {
      id: idx + 1, name: name, category: cat, cost: row[2], price: row[3],
      unit: name.indexOf('Rice') > -1 ? 'bag' : 'pcs',
      taxable: cat === 'mobile',
      low: cat === 'grocery' ? 10 : 3,
      variants: []
    };
    (row[4] || [null]).forEach(function (vn, k) {
      var stock = cat === 'grocery' ? 20 + Math.floor(r() * 140) : Math.floor(r() * 40);
      if (idx === 7 || (idx === 1 && k === 2) || (idx === 16)) stock = 2; // a few low-stock items
      if (idx === 5 && k === 1) stock = 0;
      var v = {
        id: p.id * 10 + k, productId: p.id, name: vn,
        sku: prefix + (vn ? '-' + vn.replace(/[^A-Za-z0-9]+/g, '-').toUpperCase() : '-' + String(p.id).padStart(3, '0')),
        barcode: '885' + String(p.id * 10 + k).padStart(10, '0'),
        price: p.price, cost: p.cost, stock: stock
      };
      p.variants.push(v); variants.push(v);
    });
    products.push(p);
  });

  var customers = [
    { id: 1, name: 'Ko Zaw Min', phone: '09 420 111 222', points: 340 },
    { id: 2, name: 'Ma Ei Phyu', phone: '09 777 888 999', points: 1210 },
    { id: 3, name: 'U Hla Maung', phone: '09 250 333 444', points: 95 },
    { id: 4, name: 'Daw Nwe Nwe', phone: '09 455 666 777', points: 560 },
    { id: 5, name: 'Ko Min Thu', phone: '09 789 123 456', points: 40 },
    { id: 6, name: 'Ma Su Myat', phone: '09 260 777 111', points: 720 }
  ];

  var suppliers = [
    { name: 'Golden Land Trading Co.', contact: 'U Myo Win', phone: '09 400 500 600' }
  ];

  var methods = ['cash', 'mobile_payment', 'card', 'bank_transfer'];
  var methodLabels = { cash: 'Cash', mobile_payment: 'Mobile pay', card: 'Card', bank_transfer: 'Bank transfer' };
  var providers = ['KBZPay', 'WavePay', 'AYA Pay', 'CB Pay'];

  // ---- 30 days of sales ----
  function generateSales() {
    var rr = rng(77);
    var sales = [];
    var now = new Date();
    var no = 1000;
    for (var d = 29; d >= 0; d--) {
      var day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - d);
      var dow = day.getDay();
      var count = 9 + Math.floor(rr() * 8) + (dow === 0 || dow === 6 ? 6 : 0);
      if (d === 0) count = Math.max(5, Math.round(count * Math.min(1, (now.getHours() - 8) / 12)));
      for (var s = 0; s < count; s++) {
        var t = new Date(day.getTime());
        t.setHours(9 + Math.floor(rr() * 11), Math.floor(rr() * 60));
        if (d === 0 && t > now) t = new Date(now.getTime() - (count - s) * 7 * 60000);
        var nLines = 1 + Math.floor(rr() * 3);
        var lines = [];
        for (var l = 0; l < nLines; l++) {
          var v = variants[Math.floor(rr() * variants.length)];
          var p = products[v.productId - 1];
          var qty = p.category === 'grocery' ? 1 + Math.floor(rr() * 3) : 1;
          lines.push({ variantId: v.id, name: p.name + (v.name ? ' — ' + v.name : ''), qty: qty, price: v.price, cost: v.cost, taxable: p.taxable, category: p.category, discount: 0 });
        }
        var subtotal = lines.reduce(function (a, x) { return a + x.qty * x.price; }, 0);
        var discount = rr() < 0.12 ? Math.round(subtotal * 0.05 / 100) * 100 : 0;
        var tax = Math.round(lines.reduce(function (a, x) { return a + (x.taxable ? x.qty * x.price * 0.05 : 0); }, 0));
        var total = subtotal - discount + tax;
        var m = rr();
        var method = m < 0.52 ? 'cash' : m < 0.85 ? 'mobile_payment' : m < 0.95 ? 'card' : 'bank_transfer';
        var status = rr() < 0.025 ? 'refunded' : rr() < 0.015 ? 'voided' : 'completed';
        var cashier = rr() < 0.6 ? 'Ma Thida' : rr() < 0.7 ? 'U Aung Ko' : 'Daw Khin Myat';
        var cust = rr() < 0.35 ? customers[Math.floor(rr() * customers.length)].name : null;
        sales.push({
          no: 'MDY-' + String(++no).padStart(6, '0'), at: t.toISOString(), cashier: cashier, customer: cust,
          lines: lines, subtotal: subtotal, discount: discount, tax: tax, total: total,
          payments: [{ method: method, amount: total, provider: method === 'mobile_payment' ? providers[Math.floor(rr() * 3)] : null }],
          change: 0, status: status
        });
      }
    }
    return sales;
  }

  var expenses = [
    { date: -2, category: 'Utilities', note: 'Electricity — October', amount: 185000 },
    { date: -5, category: 'Transport', note: 'Delivery from Golden Land', amount: 42000 },
    { date: -9, category: 'Supplies', note: 'Shopping bags & receipt paper', amount: 38500 },
    { date: -14, category: 'Salaries', note: 'Staff salaries (half month)', amount: 900000 },
    { date: -20, category: 'Marketing', note: 'Facebook boosted post', amount: 60000 },
    { date: -28, category: 'Rent', note: 'Shop rent — 78th Street', amount: 1200000 }
  ];

  var purchases = [
    { no: 'PO-000014', date: -1, supplier: 'Golden Land Trading Co.', items: 6, total: 1284000, status: 'Received' },
    { no: 'PO-000013', date: -6, supplier: 'Golden Land Trading Co.', items: 4, total: 642000, status: 'Received' },
    { no: 'PO-000012', date: -13, supplier: 'Golden Land Trading Co.', items: 9, total: 2156000, status: 'Partially received' },
    { no: 'PO-000011', date: -21, supplier: 'Golden Land Trading Co.', items: 3, total: 418500, status: 'Received' }
  ];

  global.DemoData = {
    business: business, locations: locations, staff: staff, categories: categories,
    products: products, variants: variants, customers: customers, suppliers: suppliers,
    methods: methods, methodLabels: methodLabels, providers: providers,
    generateSales: generateSales, expenses: expenses, purchases: purchases
  };
})(window);
