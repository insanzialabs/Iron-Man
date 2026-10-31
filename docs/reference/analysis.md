# Recording and public source analysis

Reference: https://landonorris.com/ — recording supplied as `LandoNorris Demo.mp4` (1920×1080, 50fps, 38.7s).

| Recording | Observed behavior | Adaptation |
| --- | --- | --- |
| 0–2s | Lime loader, small centered monogram, cream full-screen portrait | Lime curtain, typographic TS, supplied Tony portrait |
| 4–8s, 36–38s | Cursor reveals areas of a moving 3D helmet over the head | Dissolving flow-mask reveal of supplied armor image; explicit identity selection adds Doom |
| 10s | Portrait shrinks at center; huge moving type behind; signature in front | Same stacking and sticky scroll choreography; Stark wordmark replaces signature |
| 12s | Centered uppercase manifesto, mixed sans/serif, lime wipes | Rewritten Stark manifesto with matching font family pairing and scroll wipes |
| 15s | Scattered images with different sizes and heights on muted ground | Horizontal pinned archive with film stills, armor and character imagery |
| 18s | Outer portraits frame central on/off-track typography; image rises over it | Man/machine typography with outer portraits and full-screen Hall of Armor image |
| 21–24s | Moving staggered archive on black, thin notched frames, lime interaction | Armor archive with source-derived frame path and working modal files |
| 27s | Oversized collaborations heading, brand marquee | Fictional in-universe affiliations in matching text treatments |
| 30–33s | Curved fan of photos; dark notched footer with lime atmosphere | Archive fan, official character links, dark notched Stark footer |

The downloaded runtime bundles GSAP, Three.js, Lenis, Rive and navigation code. It references actual helmet GLB geometry, depth/head textures, HDR lighting and proprietary Rive files. These cannot become Stark geometry by swapping full-portrait JPEGs. A separate small renderer preserves the supplied art and keeps the implementation controlled and maintainable.

Responsive layouts were implemented from the supplied desktop evidence and source breakpoints. No mobile reference recording was supplied; mobile behavior is an adaptation, not an observed replica.
