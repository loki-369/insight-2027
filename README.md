# INSIGHT 5.0 (27–29 Jan 2027) – MES Keveeyam College

Plain HTML + CSS + JavaScript. No build step, no framework, no Wix scripts.

```
index.html          the page (generated layout, 1:1 with the Wix desktop design)
css/style.css       hand-written styles (fonts, buttons, hover states, header, sliders)
css/generated.css   positions / sizes / text styles for every element
js/main.js          header fade on scroll, speaker + gallery arrows, small-screen scaling
assets/people/      portraits cropped from the official INSIGHT 5.0 poster
assets/logos/       official KSHEC, MES and INSIGHT 5.0 logos
coordinators.html   the "Coordinators" block (same HTML as the original Wix embed, shown in an iframe)
map.html            the Contact map (see "Map" below)
assets/waves/*.svg  the wavy section dividers
tools/download_images.py   copies every image from Wix to your own folder (see step 1)
```

## 1. Download the images BEFORE you delete the Wix site

The photos and logos are still loaded from Wix's image servers (`static.wixstatic.com`).
They will break if the Wix site is deleted, so run this once on a computer with internet:

    python3 tools/download_images.py

It saves everything to `assets/img/` and rewrites `index.html` to use the local files.
(Only the social-share preview image in the `<head>` stays as a link; point it at your own
domain once the site is live.)

## 2. Preview locally

    python3 -m http.server 8000      # then open http://localhost:8000

Opening `index.html` by double-click also works, except the embedded blocks (coordinators / map)
which browsers prefer to load over http.

## 3. Publish

Upload the whole folder to any static host (Netlify, Cloudflare Pages, GitHub Pages, cPanel, S3 …).
`index.html` is the entry point.

## Things you should know

* **Map** – the original used Wix's built-in Google Map (grey style, pin, "Directions" bubble).
  Wix's key only works on Wix domains. `map.html` therefore shows a normal Google embed at the same
  location (10.8785987, 76.0772057, zoom 14) until you add your own free Google Maps JavaScript API
  key: open `map.html`, put it in `var API_KEY = '';`, and the exact grey-styled map with pin and
  "Directions" bubble appears.
* **Fonts** – Wix's licensed fonts (Lulo Clean, Avenir, Nimbus Sans Condensed) can't be copied.
  Closest free Google Fonts are used instead (Krona One, Nunito Sans, Archivo Narrow), so
  headings/body text look very close but not letter-for-letter identical. Poppins, Prompt and Anton
  are the real fonts. If you own licences, drop the font files in and change the three
  `--font-*` variables at the top of `css/style.css`.
* **Mobile** – phones (< 768 px wide) get a dedicated layout rebuilt from the original's Wix
  mobile layout (320 px design width, scaled to the screen by `js/main.js`; markup in `#m` in
  `index.html`, styles in `css/mobile.css`). Speakers and gallery are swipeable with arrows, the
  header hides on scroll-down and returns on scroll-up, and a back-to-top button appears.
  768-979 px screens use the desktop layout scaled down to fit.
* The "This website was built on Wix" banner is not included.
* Section buttons / menu pills scroll to the matching section of the page.


Content source: the official INSIGHT 5.0 poster PDF; registration links were decoded from its QR codes.
