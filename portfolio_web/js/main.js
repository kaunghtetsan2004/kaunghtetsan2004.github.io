// Footer year
document.querySelectorAll('#year').forEach(function (el) {
    el.innerHTML = new Date().getFullYear();
});

// Active nav link based on current page
(function setActiveNav() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav_hover a').forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === path || (path === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
})();

// Custom toggler animation (bars <-> X), synced with Bootstrap collapse events
(function customTogglerAnim() {
    var toggler = document.querySelector('.custom-toggler');
    var collapseEl = document.querySelector('#navbarNav');
    if (!toggler || !collapseEl) return;

    collapseEl.addEventListener('show.bs.collapse', function () {
        toggler.classList.add('is-open');
    });
    collapseEl.addEventListener('hide.bs.collapse', function () {
        toggler.classList.remove('is-open');
    });
})();

// Auto-close the mobile menu after tapping a link
(function closeMobileNavOnTap() {
    var collapseEl = document.querySelector('#navbarNav');
    if (!collapseEl || typeof bootstrap === 'undefined') return;

    var bsCollapse = new bootstrap.Collapse(collapseEl, { toggle: false });

    collapseEl.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            if (collapseEl.classList.contains('show')) {
                bsCollapse.hide();
            }
        });
    });
})();

// Sticky navbar shadow on scroll
(function navScrollState() {
    var nav = document.querySelector('.nav_b');
    if (!nav) return;
    var onScroll = function () {
        if (window.scrollY > 12) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

// Scroll reveal via IntersectionObserver
(function scrollReveal() {
    var targets = document.querySelectorAll('[data-reveal], [data-reveal-stagger], .line');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
        targets.forEach(function (t) { t.classList.add('in-view'); });
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');

                // fill skill bars once revealed
                entry.target.querySelectorAll('.skill-bar').forEach(function (bar) {
                    bar.classList.add('filled');
                });

                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    targets.forEach(function (t) { observer.observe(t); });
})();

// Back to top button
(function backToTop() {
    var btn = document.querySelector('.back-to-top');
    if (!btn) return;

    var toggle = function () {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    };
    document.addEventListener('scroll', toggle, { passive: true });
    toggle();

    btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// Contact form (front-end only demo — wire up to a backend or a service like Formspree/EmailJS to actually send)
(function contactForm() {
    var form = document.querySelector('#contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var status = document.querySelector('#formStatus');
        if (status) {
            status.textContent = 'Thanks! Your message has been noted — connect a form service (e.g. Formspree or EmailJS) to deliver it to your inbox.';
            status.classList.add('show');
        }
        form.reset();
    });
})();