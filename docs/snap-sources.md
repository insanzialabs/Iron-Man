# Snap feature sources and implementation

- Endgame artwork: supplied by the user at `public/snap.png` (2048 × 1078); optimized as `public/images/endgame-snap.webp`.
- Soundtrack: supplied by the user as `MF Doom All Caps.mp3` (129.78 seconds); identical runtime copy `public/audio/all-caps.mp3`. No external music is requested at runtime.
- Gauntlet: original articulated SVG illustration in `src/gauntlet.js`. Segmented finger/thumb groups animate the snap. No downloaded gauntlet artwork is shipped.
- Asset research: [Wikimedia gauntlet category](https://commons.wikimedia.org/wiki/Category:Infinity_Gauntlet), [PNGkey illustration](https://www.pngkey.com/detail/u2q8q8i1r5q8o0q8_infinity-gauntlet-the-infinity-gauntlet/). The raster candidates were rejected because their poses could not articulate the requested gesture. A researched Endgame fallback was replaced by the user’s exact image once its local path was provided; the fallback is not shipped.
- Timing approach: [MDN currentTime](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/currentTime), [W3C Media Timed Events](https://www.w3.org/TR/media-timed-events/). The renderer samples media time on animation frames rather than advancing a separate wall-clock timeline. Visual completion is targeted at media time 4.00 s, subject to browser render cadence/output latency, not a sample-accurate hardware guarantee.

No remote runtime dependencies were added. All media assets are local. Existing Marvel and reference credits continue to apply.
