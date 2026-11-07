document.addEventListener('DOMContentLoaded', function () {

    var filterBtns = document.querySelectorAll('.gallery_filter_btn');
    var galleryCols = document.querySelectorAll('.gallery_col');

    /* ---------- Scroll-reveal (staggered fade-up) ---------- */
    galleryCols.forEach(function (col, index) {
        col.classList.add('reveal');
        col.style.transitionDelay = (index % 4) * 70 + 'ms';
    });

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    galleryCols.forEach(function (col) {
        revealObserver.observe(col);
    });

    /* ---------- Filtering ---------- */
    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            btn.classList.add('active');

            var filter = btn.getAttribute('data-filter');

            galleryCols.forEach(function (col) {
                var match = filter === 'all' || col.getAttribute('data-category') === filter;
                if (match) {
                    col.style.display = '';
                    // restart reveal animation for a smooth reappear
                    col.classList.remove('in-view');
                    requestAnimationFrame(function () {
                        col.classList.remove('filtered_out');
                        requestAnimationFrame(function () {
                            col.classList.add('in-view');
                        });
                    });
                } else {
                    col.classList.add('filtered_out');
                    col.classList.remove('in-view');
                    setTimeout(function () {
                        if (col.classList.contains('filtered_out')) {
                            col.style.display = 'none';
                        }
                    }, 350);
                }
            });
        });
    });

    /* ---------- Lightbox ---------- */
    var lightbox = document.getElementById('galleryLightbox');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxClose = document.getElementById('lightboxClose');
    var lightboxPrev = document.getElementById('lightboxPrev');
    var lightboxNext = document.getElementById('lightboxNext');

    var visibleItems = [];
    var currentIndex = 0;

    function getVisibleItems() {
        return Array.prototype.slice.call(document.querySelectorAll('.gallery_col'))
            .filter(function (col) { return col.style.display !== 'none'; })
            .map(function (col) { return col.querySelector('.gallery_item'); });
    }

    function openLightbox(item) {
        visibleItems = getVisibleItems();
        currentIndex = visibleItems.indexOf(item);
        updateLightboxImage();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function updateLightboxImage() {
        var img = visibleItems[currentIndex].querySelector('img');
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % visibleItems.length;
        updateLightboxImage();
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
        updateLightboxImage();
    }

    document.querySelectorAll('.gallery_item').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            openLightbox(item);
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNext);
    lightboxPrev.addEventListener('click', showPrev);

    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });

});