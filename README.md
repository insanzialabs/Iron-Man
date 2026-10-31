# STARK — an Insanzia Labs experiment

A local, frontend-only reinterpretation of [landonorris.com](https://landonorris.com/), themed around Tony Stark, Iron Man and Doctor Doom. Built with Vite, GSAP/ScrollTrigger, Lenis and a small native WebGL portrait renderer. No framework, remote media requests, analytics or backend is required at runtime.

## Run

```sh
npm install
npm run dev
```

Preview: **http://127.0.0.1:4174**. Production: `npm run build`; check asset integrity after building with `npm run check`. Run `npm test` for the idle motion timing/path checks. Vercel uses the included configuration and serves `dist`.

## Experience

- Full-screen acid-lime loading transition, with the original reference's Brier and Mona Sans typography.
- Move over the hero to create a crisp liquid lens with merging droplets, inertia, trailing motion and subtle edge refraction. The reveal cycles Tony → Iron Man → Doom → Tony. Press to expand the temporary lens; release lets it recede. Only the three identity buttons change the selected character. Escape closes navigation/dialogs without changing identity. Touch and keyboard users have explicit selection controls.
- The portrait shrinks into a moving typographic composition, followed by the highlighted manifesto and a horizontally travelling photo collage.
- Portraits frame the central man/machine typography; a full-bleed workshop image passes over the sticky composition.
- The selected character drives the complete experience: palette, wordmark, manifesto, imagery, captions, chapter links, affiliations and footer. Tony opens workshop dossiers, Iron Man opens the armor archive, and Doom opens Latverian dossiers. Files support keyboard arrows, native modal focus handling and backdrop/Escape dismissal. Rapid selections cancel stale content transitions.
- Doom chapter, moving affiliations, an opening fan of archive images and a notched footer complete the page.
- The hero begins after 650 ms of inactivity. Four continuous diagonal crossings descend from forehead to torso over 2.5 seconds, briefly clear, then retrace upward. A float-texture velocity/pressure simulation carries the liquid wake at a 60 Hz render target, with an antialiased boundary and a portable droplet fallback. Pale animated simplex contours sit behind edge-matted portraits. Pointer input takes priority, identity changes restart the interval, and menus, dialogs, scrolling and hidden tabs suspend autonomous motion. The Auto motion control pauses/resumes it; reduced-motion preferences disable it.
- Fourteen researched assets expand the Iron Man and Doom experiences, including two additional suits. Every character collage uses seven unique images and every photo fan uses five. Sources and credits: `docs/expanded-asset-sources.json`. Assets are served locally as WebP.
- Small-screen layouts, reduced-motion alternatives, image fallback for unavailable WebGL, hidden-tab/offscreen rendering suspension and rendering that settles when the pointer stops.

## Reference study and differences

The supplied recording was sampled at 17 timestamps across its 38.7 seconds, with closer inspection of the hero reveal, shrinking portrait, manifesto, collage, portrait framing, archive and footer. Public HTML, CSS and the frontend animation bundle were downloaded into `docs/reference/` for analysis. The downloaded bundles are **not executed by this app or shipped in the production build**. The small standard GLSL simplex helper retained in `src/simplex.js` is attributed to the reference; the local renderer uses it for the contour background.

The reference's hero uses a depth-textured head and a genuine 3D racing helmet. The supplied Stark, Iron Man and Doom assets are flat portraits. This implementation recreates the reveal with a WebGL flow-mask shader, subtle displacement and smooth identity blending; it does not claim to reproduce the reference's 3D geometry or its proprietary Rive animations. The original site's ecommerce, driver statistics and external content pages are replaced by coherent local character/archive sections.

Design and interaction reference: **OFF+BRAND / Lando Norris**. Character and film imagery: **Marvel and respective rights holders**. Hero portraits were supplied in this project. Additional source URLs are recorded in `docs/asset-sources.json`. Publicly accessible files are not evidence of a redistribution license. This is an unofficial fan experiment, not an official Marvel, Lando Norris or OFF+BRAND website.

The three original hero files remain untouched in the project root. Optimized runtime images live in `public/images`. Optional Python scripts document asset retrieval and WebP conversion; Python/Pillow are not required to run or build the website.
