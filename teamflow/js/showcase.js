// TeamFlow case study — interactions. Plain JS, no dependencies.
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  /* ---------- Theme ---------- */
  var KEY = 'tf-case-theme';
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  if (!root.dataset.theme) {
    root.dataset.theme = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function syncThemedImages() {
    var t = root.dataset.theme;
    $$('img.themed').forEach(function (img) { img.src = img.dataset[t] || img.src; });
  }
  syncThemedImages();
  $('#themeBtn').addEventListener('click', function () {
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    store(next);
    syncThemedImages();
    setMode(next); // keep the screen viewer in step with the page
  });

  /* ---------- Sticky header + active section ---------- */
  var bar = $('.topbar');
  function onScroll() { bar.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    var links = $$('.toc a');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) spy.observe(s); });

    /* Reveal on scroll */
    var rev = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el) { rev.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Desktop screen viewer ---------- */
  var SCREENS = {
    dashboard: { path: '/admin', cap: 'Team dashboard — eight live stat cards, the overdue queue and per-member progress at a glance.' },
    today: { path: '/admin#today', cap: "Today's tasks — overdue work across the team first, then everything scheduled for today, filterable by person." },
    members: { path: '/admin#members', cap: 'Team members — profiles, job roles and access level, with activate / deactivate controls.' },
    approvals: { path: '/admin#approvals', cap: 'Pending approvals — new registrations wait here until an admin grants access.' },
    activity: { path: '/admin#activity', cap: 'Activity logs — a full audit trail of task and team changes.' },
    login: { path: '/login', cap: 'Sign in — the brand panel sets the tone: "Every task. Every day. On time."', lightOnly: true }
  };
  var current = 'dashboard';
  var mode = root.dataset.theme === 'dark' ? 'dark' : 'light';
  var deskImg = $('#deskImg');
  var deskCap = $('#deskCap');
  var url = $('.browser .url');
  var urlIcon = url.querySelector('svg').outerHTML;

  // Preload so switching feels instant
  Object.keys(SCREENS).forEach(function (k) {
    ['light', 'dark'].forEach(function (m) {
      if (SCREENS[k].lightOnly && m === 'dark') return;
      var i = new Image(); i.src = srcFor(k, m);
    });
  });

  function srcFor(k, m) {
    if (SCREENS[k].lightOnly) m = 'light';
    return 'assets/screens/d-' + k + '-' + m + '.webp';
  }
  function render() {
    var s = SCREENS[current];
    var next = srcFor(current, mode);
    deskCap.textContent = s.cap;
    deskImg.alt = 'TeamFlow ' + current + ' screen (' + mode + ' theme)';
    url.innerHTML = urlIcon + 'teamflow.app' + s.path;
    $$('#deskMode button').forEach(function (b) { b.disabled = !!s.lightOnly && b.dataset.mode === 'dark'; });
    if (deskImg.getAttribute('src') === next) return;
    deskImg.classList.add('fading');
    setTimeout(function () {
      deskImg.src = next;
      deskImg.onload = function () { deskImg.classList.remove('fading'); };
    }, 160);
  }
  function setMode(m) {
    mode = m;
    $$('#deskMode button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === m)); });
    render();
  }
  var tabs = $$('#deskTabs [role=tab]');
  tabs.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      current = btn.dataset.screen;
      tabs.forEach(function (b) { b.setAttribute('aria-selected', String(b === btn)); b.tabIndex = b === btn ? 0 : -1; });
      render();
    });
    btn.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var n = tabs[(i + d + tabs.length) % tabs.length];
      n.focus(); n.click();
    });
    btn.tabIndex = i === 0 ? 0 : -1;
  });
  $$('#deskMode button').forEach(function (b) {
    b.addEventListener('click', function () { setMode(b.dataset.mode); });
  });
  setMode(mode);

  /* ---------- Phone carousel ---------- */
  var track = $('#phoneTrack');
  var prev = $('.nav-arrow.prev');
  var next = $('.nav-arrow.next');
  function step() { var c = track.querySelector('.phone-card'); return c ? c.getBoundingClientRect().width + 28 : 280; }
  function arrows() {
    prev.disabled = track.scrollLeft < 8;
    next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
  }
  [prev, next].forEach(function (b) {
    b.addEventListener('click', function () {
      track.scrollBy({ left: step() * Number(b.dataset.dir) * 2, behavior: 'smooth' });
    });
  });
  track.addEventListener('scroll', arrows, { passive: true });
  track.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') track.scrollBy({ left: step(), behavior: 'smooth' });
    if (e.key === 'ArrowLeft') track.scrollBy({ left: -step(), behavior: 'smooth' });
  });
  window.addEventListener('resize', arrows);
  arrows();

  // Drag-to-scroll with the mouse on desktop
  var dragging = false, startX = 0, startLeft = 0, moved = false;
  track.addEventListener('mousedown', function (e) {
    dragging = true; moved = false; startX = e.pageX; startLeft = track.scrollLeft;
    track.style.scrollSnapType = 'none'; e.preventDefault();
  });
  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    var dx = e.pageX - startX;
    if (Math.abs(dx) > 4) moved = true;
    track.scrollLeft = startLeft - dx;
  });
  window.addEventListener('mouseup', function () {
    if (!dragging) return;
    dragging = false; track.style.scrollSnapType = '';
  });

  /* ---------- Lightbox ---------- */
  var lb = $('#lightbox');
  var lbImg = lb.querySelector('img');
  var lastFocus = null;
  function openLb(src, alt) {
    lastFocus = document.activeElement;
    lbImg.src = src; lbImg.alt = alt || '';
    lb.hidden = false; document.body.style.overflow = 'hidden';
    lb.querySelector('.lb-close').focus();
  }
  function closeLb() {
    lb.hidden = true; document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  $('.browser-view').addEventListener('click', function () { openLb(deskImg.src, deskImg.alt); });
  track.addEventListener('click', function (e) {
    if (moved) return; // ignore click at the end of a drag
    var img = e.target.closest('.phone') && e.target.closest('.phone').querySelector('img');
    if (img) openLb(img.src, img.alt);
  });
  lb.addEventListener('click', function (e) { if (e.target !== lbImg) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  /* ---------- Design system bits ---------- */
  var hint = $('#copyHint');
  $$('.sw').forEach(function (sw) {
    sw.addEventListener('click', function () {
      var hex = sw.dataset.copy;
      var done = function () { hint.textContent = 'Copied ' + hex + ' to clipboard.'; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(hex).then(done, function () { hint.textContent = hex; });
      } else { hint.textContent = hex; }
    });
  });
  var check = $('#demoCheck');
  check.setAttribute('role', 'checkbox');
  check.setAttribute('aria-checked', 'false');
  check.addEventListener('click', function () {
    var card = check.closest('.demo-task');
    var on = card.classList.toggle('done');
    check.setAttribute('aria-checked', String(on));
  });

  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();
})();
