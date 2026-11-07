document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Read more / less ---------- */
    var aboutText = document.getElementById('aboutText');
    var aboutFade = document.getElementById('aboutFade');
    var toggleBtn = document.getElementById('aboutToggleBtn');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            var isOpen = aboutText.classList.toggle('expanded');
            aboutFade.classList.toggle('hidden', isOpen);
            toggleBtn.classList.toggle('open', isOpen);
            toggleBtn.innerHTML = isOpen
                ? 'Read less <i class="fa-solid fa-chevron-down ms-1"></i>'
                : 'Read more <i class="fa-solid fa-chevron-down ms-1"></i>';
        });
    }

    /* ---------- Scroll reveal ---------- */
    var revealEls = document.querySelectorAll('.reveal');

    revealEls.forEach(function (el, index) {
        el.style.transitionDelay = (index % 6) * 60 + 'ms';
    });

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(function (el) {
        observer.observe(el);
    });

});