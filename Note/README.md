# Miichika Gallery redesign

Drop-in static redesign for `miichika.github.io`.

Palette: `#EEE6FF`, `#C4B0FF`, `#8D6BFF`, `#2C2347`, `#FFFAFF`.

Main changes:
- Responsive layout for desktop/tablet/mobile.
- Smaller proportional hero.
- Clear Original → Redraw/Fan Art → Selected Works → About flow.
- Search and category filters.
- Accessible artwork modal with keyboard navigation and thumbnails.
- Gallery records loaded from `assets/data/gallery.json`.
- SEO metadata, canonical URL, Open Graph/Twitter metadata, semantic headings and Person JSON-LD.
- Existing footer concept retained and resized/aligned to the main content.
- `prefers-reduced-motion` and skip navigation support.

Strict JSON does not allow `// comments` or trailing commas. Your original schema is supported; `category`, `alt`, and `tags` are optional additions.

Keep your existing `assets/img` folder. Replace/add the files in this package.
GitHub Pages must serve the page over HTTP/HTTPS because the JavaScript loads the JSON with `fetch()`.
