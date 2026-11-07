const photos = [
    { src: "images/Bird.jpeg", title: "Bird", category: "Nature" },
    { src: "images/DragonHill.jpeg", title: "Dragon Hill", category: "Travel" },
    { src: "images/HleYin.jpeg", title: "Hle Yin", category: "Travel" },
    { src: "images/Sunset.jpeg", title: "Sunset", category: "Nature" },
];
// ======= get element ==========

const gallery = document.getElementById("gallery");
const filters = document.getElementById("filters");
const searchInput = document.getElementById("search");
const emptyText = document.getElementById("empty");

const lightbox = document.getElementById("lightbox");
const lbImage = document.getElementById("lbImage");
const lbCaption = document.getElementById("lbCaption");
const lbClose = document.getElementById("lbClose");   // FIX: was missing
const lbPrev = document.getElementById("lbPrev");
const lbNext = document.getElementById("lbNext");

let currentCategory = "All";
let shownPhotos = [];
let currentIndex = 0;

//========= Category button ========
function createFilters() {
    const categories = ["All", ...new Set(photos.map((p) => p.category))];

    categories.forEach((category) => {
        const button = document.createElement("button");
        button.className = "filter-btn";
        button.textContent = category;
        if (category === currentCategory) button.classList.add("active");

        button.addEventListener("click", () => {
            currentCategory = category;
            document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active")); // FIX: querySelectorAll
            button.classList.add("active");   // FIX: highlight the clicked button
            showPhotos();                     // FIX: new function name
        });

        filters.appendChild(button);
    });
}

//======= show photos ======
function showPhotos() {   // FIX: renamed (was the same name as the variable)
    const searchText = searchInput.value.toLowerCase().trim();

    shownPhotos = photos.filter((photo) => {
        const matchCategory = currentCategory === "All" || photo.category === currentCategory;
        const matchSearch = photo.title.toLowerCase().includes(searchText);
        return matchCategory && matchSearch;
    });

    gallery.innerHTML = "";
    shownPhotos.forEach((photo, index) => {
        const item = document.createElement("button");
        item.className = "photo";
        item.setAttribute("aria-label", "Open " + photo.title);   // FIX: added space

        const img = document.createElement("img");
        img.src = photo.src;
        img.alt = photo.title;
        img.loading = "lazy";

        const title = document.createElement("span");
        title.className = "photo-title";
        title.textContent = photo.title;

        item.appendChild(img);
        item.appendChild(title);
        item.addEventListener("click", () => openLightbox(index));

        gallery.appendChild(item);
    });

    emptyText.hidden = shownPhotos.length > 0;
}

//========= Lightbox ========
function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
}

function updateLightbox() {
    const photo = shownPhotos[currentIndex];
    lbImage.src = photo.src;
    lbImage.alt = photo.title;   // FIX: alt instead of title
    lbCaption.textContent = `${photo.title} · ${currentIndex + 1} / ${shownPhotos.length}`;   // FIX: length
}

function nextPhoto() {   // FIX: this function was missing
    currentIndex = (currentIndex + 1) % shownPhotos.length;
    updateLightbox();
}

function prevPhoto() {
    currentIndex = (currentIndex - 1 + shownPhotos.length) % shownPhotos.length;
    updateLightbox();
}

lbClose.addEventListener("click", closeLightbox);
lbNext.addEventListener("click", nextPhoto);
lbPrev.addEventListener("click", prevPhoto);

// Click on the dark background to close
lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();   // FIX: spelling
});

// Keyboard: ← → move, Esc close
document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "ArrowRight") nextPhoto();
    if (event.key === "ArrowLeft") prevPhoto();
    if (event.key === "Escape") closeLightbox();
});

// Swipe left / right on phones
let touchStartX = 0;
lightbox.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
});
lightbox.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (distance > 50) prevPhoto();
    if (distance < -50) nextPhoto();
});

// ======= start =======
searchInput.addEventListener("input", showPhotos);   // FIX: new function name
createFilters();
showPhotos();                                        // FIX: new function name