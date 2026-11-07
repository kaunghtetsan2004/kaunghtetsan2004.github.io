# TeamFlow — Portfolio Case Study

A self-contained project showcase page for **kaunghtetsan.online**.
No CDN links, no web fonts, no frameworks — just HTML, CSS and plain JavaScript.

```
teamflow/
├── index.html            the case-study page
├── css/showcase.css      all styles (light + dark theme, responsive)
├── js/showcase.js        interactions (theme, screen tabs, phone carousel, lightbox)
└── assets/
    ├── favicon.svg  logo-white.svg  logo-black.svg
    └── screens/          real app screenshots (WebP)
```

## Add it to your portfolio
1. Copy the whole `teamflow/` folder into your site, e.g. `kaunghtetsan.online/projects/teamflow/`.
2. On your projects section, link a card to `/projects/teamflow/`.
   For the card thumbnail you can reuse `assets/screens/d-dashboard-light.webp`.
3. Back links point to `https://kaunghtetsan.online/#projects` and `#contact` —
   change them in `index.html` if your section ids differ.

## Preview locally
Open `index.html` directly, or run a tiny server from inside the folder:
```bash
python3 -m http.server 8080   # then visit http://localhost:8080
```

## Features of the page
- Laptop + phone hero mockup (pure CSS device frames)
- Admin screen viewer: 6 tabs × light/dark toggle in a browser frame
- Swipeable/draggable phone carousel of 8 member screens
- Click any screen to open it full-size (Esc to close)
- Design-system section: copy-to-clipboard colour swatches, type scale, live task component
- User-flow steps and an architecture diagram in plain HTML/CSS
- Page-wide dark mode (remembers choice, follows system by default)
- Scroll-reveal animations, respects "reduce motion"; keyboard accessible
