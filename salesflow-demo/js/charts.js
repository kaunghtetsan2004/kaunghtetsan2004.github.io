/* SalesFlow demo — analytics and hand-written SVG charts (no chart library). */
(function () {
  'use strict';
  var S = window.SFStore;

  /** Aggregate orders between from..to (inclusive). Returned orders are excluded from money totals. */
  function summarize(orders, from, to) {
    var inRange = orders.filter(function (o) { return o.date >= from && o.date <= to; });
    var counted = inRange.filter(function (o) { return o.status !== 'Returned'; });
    var byStatus = {};
    S.STATUSES.forEach(function (st) { byStatus[st] = { orders: 0, amount: 0 }; });
    inRange.forEach(function (o) { var b = byStatus[o.status]; b.orders++; b.amount += S.orderTotal(o); });
    var byItem = {};
    counted.forEach(function (o) {
      o.items.forEach(function (l) {
        var b = byItem[l.item] || (byItem[l.item] = { item: l.item, qty: 0, amount: 0, orders: 0 });
        b.qty += l.qty; b.amount += l.amount; b.orders++;
      });
    });
    var total = counted.reduce(function (s, o) { return s + S.orderTotal(o); }, 0);
    var qty = counted.reduce(function (s, o) { return s + S.orderQty(o); }, 0);
    return {
      from: from, to: to, inRange: inRange, counted: counted,
      total: total, orders: counted.length, qty: qty,
      avg: counted.length ? total / counted.length : 0,
      byStatus: byStatus,
      items: Object.keys(byItem).map(function (k) { return byItem[k]; }).sort(function (a, b) { return b.amount - a.amount; }),
    };
  }

  function weekStart(isoDate) { var d = S.parseIso(isoDate); var dow = (d.getDay() + 6) % 7; d.setDate(d.getDate() - dow); return S.iso(d); }

  /** Bucket counted orders by day / week (Mon) / month, filling empty buckets with zero. */
  function buckets(counted, from, to, period) {
    var keyOf = period === 'monthly' ? function (d) { return d.slice(0, 7); } : period === 'weekly' ? weekStart : function (d) { return d; };
    var map = {};
    counted.forEach(function (o) {
      var k = keyOf(o.date); var b = map[k] || (map[k] = { amount: 0, orders: 0, qty: 0 });
      b.amount += S.orderTotal(o); b.orders++; b.qty += S.orderQty(o);
    });
    var out = []; var seen = {};
    for (var d = from; d <= to; d = S.addDays(d, 1)) {
      var k = keyOf(d);
      if (seen[k]) continue; seen[k] = 1;
      out.push(Object.assign({ key: k }, map[k] || { amount: 0, orders: 0, qty: 0 }));
    }
    return out;
  }

  function niceMax(v) {
    if (v <= 0) return 1;
    var p = Math.pow(10, Math.floor(Math.log10(v)));
    var steps = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
    for (var i = 0; i < steps.length; i++) if (steps[i] * p >= v) return steps[i] * p;
    return 10 * p;
  }

  function compact(n) {
    if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M';
    if (n >= 1e3) return Math.round(n / 1e3) + 'k';
    return String(Math.round(n));
  }

  var NS = 'http://www.w3.org/2000/svg';
  function el(name, attrs, parent) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  /**
   * Responsive line/area chart. points: [{label, tip, value}].
   * Hover / touch shows a tooltip; the whole chart has an aria-label summary.
   */
  function lineChart(container, points, opts) {
    opts = opts || {};
    container.innerHTML = '';
    container.classList.add('chart');
    // Draw in real pixels (viewBox = rendered width) so text never stretches; redraw on resize.
    if (!container._sfObserver && window.ResizeObserver) {
      var lastW = container.clientWidth;
      container._sfObserver = new ResizeObserver(function () {
        if (Math.abs(container.clientWidth - lastW) < 8) return;
        lastW = container.clientWidth;
        lineChart(container, container._sfPoints, container._sfOpts);
      });
      container._sfObserver.observe(container);
    }
    container._sfPoints = points; container._sfOpts = opts;
    var W = Math.max(260, container.clientWidth || 640), H = 260, L = 46, R = 12, T = 14, B = 30;
    var max = niceMax(Math.max.apply(null, points.map(function (p) { return p.value; }).concat([0])));
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': opts.label || 'Sales trend chart' }, container);
    var x = function (i) { return points.length < 2 ? L + (W - L - R) / 2 : L + (i * (W - L - R)) / (points.length - 1); };
    var y = function (v) { return T + (H - T - B) * (1 - v / max); };

    var grid = el('g', { class: 'grid' }, svg);
    var axis = el('g', { class: 'axis' }, svg);
    for (var t = 0; t <= 4; t++) {
      var v = (max * t) / 4; var yy = y(v);
      el('line', { x1: L, x2: W - R, y1: yy, y2: yy }, grid);
      var tx = el('text', { x: L - 8, y: yy + 4, 'text-anchor': 'end' }, axis); tx.textContent = compact(v);
    }
    var labelEvery = Math.max(1, Math.ceil(points.length / Math.max(2, Math.floor((W - L) / 90))));
    points.forEach(function (p, i) {
      if (i % labelEvery !== 0 && i !== points.length - 1) return;
      if (i !== points.length - 1 && points.length - 1 - i < labelEvery * 0.6) return;
      var anchor = i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle';
      var tl = el('text', { x: x(i), y: H - 8, 'text-anchor': anchor }, axis); tl.textContent = p.label;
    });

    if (points.length) {
      var d = points.map(function (p, i) { return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(p.value).toFixed(1); }).join(' ');
      el('path', { class: 'area', d: d + ' L' + x(points.length - 1).toFixed(1) + ' ' + y(0) + ' L' + x(0).toFixed(1) + ' ' + y(0) + ' Z' }, svg);
      el('path', { class: 'line', d: d, 'vector-effect': 'non-scaling-stroke' }, svg);
      var last = points.length - 1;
      var guide = el('line', { class: 'guide', y1: T, y2: H - B, x1: 0, x2: 0, visibility: 'hidden', 'vector-effect': 'non-scaling-stroke' }, svg);
      var endDot = el('ellipse', { class: 'end', cx: x(last), cy: y(points[last].value), rx: 5, ry: 5, 'vector-effect': 'non-scaling-stroke' }, svg);
      var tip = document.createElement('div'); tip.className = 'chart-tip'; tip.hidden = true; container.appendChild(tip);

      var show = function (clientX) {
        var box = svg.getBoundingClientRect();
        var px = ((clientX - box.left) / box.width) * W;
        var i = Math.round(((px - L) / (W - L - R)) * (points.length - 1));
        i = Math.max(0, Math.min(points.length - 1, points.length < 2 ? 0 : i));
        var p = points[i];
        guide.setAttribute('x1', x(i)); guide.setAttribute('x2', x(i)); guide.setAttribute('visibility', 'visible');
        endDot.setAttribute('cx', x(i)); endDot.setAttribute('cy', y(p.value));
        tip.hidden = false;
        tip.innerHTML = '';
        var b = document.createElement('b'); b.textContent = opts.format ? opts.format(p.value) : p.value;
        tip.appendChild(b); tip.appendChild(document.createTextNode(p.tip || p.label));
        var leftPct = (x(i) / W) * 100;
        tip.style.left = Math.min(88, Math.max(12, leftPct)) + '%';
        tip.style.top = (y(p.value) / H) * box.height + 'px';
      };
      var hide = function () {
        guide.setAttribute('visibility', 'hidden'); tip.hidden = true;
        endDot.setAttribute('cx', x(last)); endDot.setAttribute('cy', y(points[last].value));
      };
      svg.addEventListener('pointermove', function (e) { show(e.clientX); });
      svg.addEventListener('pointerdown', function (e) { show(e.clientX); });
      svg.addEventListener('pointerleave', hide);
    }
  }

  /** Horizontal bar list, values relative to the largest. rows: [{label, value, display}] */
  function barList(rows) {
    var max = Math.max.apply(null, rows.map(function (r) { return r.value; }).concat([1]));
    var wrap = document.createElement('div'); wrap.className = 'bars';
    rows.forEach(function (r) {
      var row = document.createElement('div'); row.className = 'bar-row';
      var top = document.createElement('div'); top.className = 'top';
      var a = document.createElement('span'); a.textContent = r.label;
      var b = document.createElement('span'); b.textContent = r.display;
      top.appendChild(a); top.appendChild(b);
      var track = document.createElement('div'); track.className = 'bar-track';
      var fill = document.createElement('div'); fill.className = 'bar-fill'; fill.style.width = Math.max(2, (r.value / max) * 100) + '%';
      track.appendChild(fill); row.appendChild(top); row.appendChild(track); wrap.appendChild(row);
    });
    return wrap;
  }

  window.SFCharts = { summarize: summarize, buckets: buckets, lineChart: lineChart, barList: barList, compact: compact, weekStart: weekStart };
})();
