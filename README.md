# STARK — an Insanzia Labs experiment

A local, frontend-only reinterpretation of [landonorris.com](https://landonorris.com/), themed around Tony Stark, Iron Man and Doctor Doom. Built with Vite, GSAP/ScrollTrigger, Lenis and a small native WebGL portrait renderer. No framework, remote media requests, analytics or backend is required at runtime.

## Run

```sh
npm install
npm run dev
```

Preview: **http://127.0.0.1:4174**. Production: `npm run build`; check asset integrity after building with `npm run check`. Vercel uses the included configuration and serves `dist`.

## Experience

- Full-screen acid-lime loading transition, with the original reference's Brier and Mona Sans typography.
- Move over the hero to paint a dissolving Iron Man reveal. Click to lock the armor; use the three identity buttons for Tony, Iron Man or Doom. Escape resets the identity. Touch and keyboard users have the same explicit controls.
- The portrait shrinks into a moving typographic composition, followed by the highlighted manifesto and a horizontally travelling photo collage.
- Portraits frame the central man/machine typography; a full-bleed workshop image passes over the sticky composition.
- A staggered armor wall opens navigable files for Mark I, V, VII and LXXXV, with keyboard arrows, native modal focus handling and backdrop/Escape dismissal.
- Doom chapter, moving affiliations, an opening fan of archive images and a notched footer complete the page.
- Small-screen layouts, reduced-motion alternatives, image fallback for unavailable WebGL, hidden-tab/offscreen rendering suspension and rendering that settles when the pointer stops.

## Reference study and differences

The supplied recording was sampled at 17 timestamps across its 38.7 seconds, with closer inspection of the hero reveal, shrinking portrait, manifesto, collage, portrait framing, archive and footer. Public HTML, CSS and the frontend animation bundle were downloaded into `docs/reference/` for analysis. They are **not executed by this app or shipped in the production build**.

The reference's hero uses a depth-textured head and a genuine 3D racing helmet. The supplied Stark, Iron Man and Doom assets are flat portraits. This implementation recreates the reveal with a WebGL flow-mask shader, subtle displacement and smooth identity blending; it does not claim to reproduce the reference's 3D geometry or its proprietary Rive animations. The original site's ecommerce, driver statistics and external content pages are replaced by coherent local character/archive sections.

Design and interaction reference: **OFF+BRAND / Lando Norris**. Character and film imagery: **Marvel and respective rights holders**. Hero portraits were supplied in this project. Additional source URLs are recorded in `docs/asset-sources.json`. Publicly accessible files are not evidence of a redistribution license. This is an unofficial fan experiment, not an official Marvel, Lando Norris or OFF+BRAND website.

The three original hero files remain untouched in the project root. Optimized runtime images live in `public/images`. Optional Python scripts document asset retrieval and WebP conversion; Python/Pillow are not required to run or build the website.
