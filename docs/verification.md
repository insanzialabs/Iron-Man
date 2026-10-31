# Verification record

## Completed

- Production compilation with Vite (`npm run build`).
- JavaScript syntax checks for both application modules; Python syntax checks for the optional asset scripts.
- `npm run check`: section anchors, unique IDs, local font/image references, valid WebP containers, reduced-motion stylesheet and built production entrypoints.
- Production HTTP preview on localhost:4175: all 18 built files returned HTTP 200, with correct HTML, CSS, JavaScript, SVG, font and WebP MIME types.
- Native Chrome preview on localhost:4174: inspected Tony's initial composition and active cursor reveal, selected Doctor Doom and observed the completed full-portrait transition, and opened the navigation with its underlying page correctly removed from the accessibility tree.
- Compared those observed hero states with the supplied recording and inspected source; refined the portrait's top spacing, wordmark visibility, control contrast, the portrait-framed typography sequence and source-derived archive frame geometry.

## Limits

The isolated browser host reported `The browser access host is unavailable`. Native Chrome initially worked, then produced an Apple ScreenCaptureKit capture failure and blank gray captures with no web content accessibility tree. A Safari fallback also timed out. This prevented reliable final full-scroll, mobile, modal, rapid-input and pixel-overlay verification. Those paths have been implemented and source-reviewed, but should not be described as browser-tested.

The source evidence is a desktop recording. Responsive compositions are deliberate adaptations. The hero uses supplied flat portraits and a flow-mask shader, rather than claiming the original reference's actual 3D model animation. No production deployment or custom-domain change was performed.

## Three-character liquid reveal revision — 31 October 2026

Implemented a thresholded, advected droplet field with a narrow solid boundary, merging trails and edge refraction. Replaced the old click-to-toggle behavior with a temporary press-to-expand lens. Base and preview image weights now support Tony → Iron Man → Doom → Tony for all three selections. Explicit buttons choose the persistent identity; Escape and portrait presses do not reset it. Hidden/offscreen resumes clear expired trails.

Character profiles now supply page-wide palette, copy, images, archive files, chapter destinations, affiliations, wordmarks and footer. Tony's workshop, Iron Man's armor archive and Doom's Latverian dossiers share the established layout and animation system. Images decode before swapping; revision tokens and canceled timelines prevent stale content updates. Wipe nodes remain mounted across updates.

Native Chrome verification completed during this revision:

- Observed the Tony-to-Iron liquid boundary in the rendered hero.
- Selected Iron Man; observed the gold/burgundy palette and matching wordmark, manifesto and archive content, with an active Doom reveal.
- Selected Doom; observed the green identity, rewritten copy and Latverian dossier controls.
- Pressed Doom's portrait for 900 ms; the screenshot showed the temporary Tony reveal while Doom's pressed selection remained true.
- Opened Iron Man's Mark I file and Doom's The Mind dossier; checked the correct image, copy and identity-specific archive label.
- Reloaded the refined source and confirmed the Tony workshop navigation and revised accessible section labels.

Build and expanded asset/profile integrity checks pass. The isolated browser host remains unavailable. Native browser focus was intermittently changed, so rapid-input stress tests and mobile/reduced-motion rendering were not conclusively verified in-browser. No claim of exact 3D geometry or pixel-perfect reference motion is made; the hero uses the supplied flat portraits.

## Expanded imagery and autonomous hero — 31 October 2026

Analyzed the new 10.985-second, 4096×2328 recording at one-second intervals. The observed idle reference alternates clear portraits with passing helmet slices across the eyes, jaw and forehead; faint background wakes accompany those slices. The implementation uses a 6.2-second cycle with a 2.1-second sweep, three alternating facial lanes, a quiet interval after input, slight portrait drift and a restrained wake on pale background pixels. It preserves the chosen identity and reuses the same liquid field as manual input.

Downloaded and visually reviewed 14 additional assets (seven Doom artworks/promotional images and seven Iron Man stills/renders), optimized them to local WebP, recorded source URLs/credits in `expanded-asset-sources.json`, and integrated them into the character profiles. Every profile has seven unique collage images and five unique fan images. Iron Man now has six suit files; Doom has six dossier files. Lazy gallery images remain deferred; only immediately relevant character images are decoded before switching.

Verified in native Chrome: an untouched Tony portrait first appeared clear, then showed an automatic Iron Man reveal without a pointer action; Doom selected the new images and dossier files; Auto motion changed from ON to OFF through the pause button; the Doom archive rendered its distinct new artworks. Inspected every downloaded image via a contact sheet and verified image decoding. Production build, asset/profile diversity checks, syntax checks, and two deterministic idle timing/continuity tests pass.

The isolated browser host remains unavailable. Desktop behavior was inspected through native Chrome; full mobile rendering, reduced-motion browser emulation and device performance profiling were not completed. Automatic motion is disabled for reduced motion and unavailable WebGL, suspended for hidden/offscreen/scroll/overlay states, and can be paused explicitly. The existing flat-image/3D geometry distinction still applies. Source credits do not assert a redistribution license.


## Four-pass choreography and fluid background — 31 October 2026

Analyzed the supplied 8.072-second, 120 fps recording with a 4 fps contact sheet, then inspected the already downloaded reference runtime. Its idle cursor uses a cosine with four horizontal crossings and continuous vertical travel, with a 2.5-second downward pass and a reversed upward pass. Replaced the previous independent horizontal lanes with this continuous choreography, shortened inactivity to 650 ms, and reduced clear intervals between bursts. The application now targets 60 Hz for automatic motion rather than the previous 30 Hz cap; this is a scheduling target, not a measured device performance guarantee.

Added native WebGL float-texture velocity advection, external force, divergence, four pressure iterations and projection. Unsupported float framebuffers retain the portable droplet renderer at a higher field resolution. The portrait boundary uses screen-space derivative antialiasing. Edge-connected pale studio ground is removed in runtime textures, leaving original source images untouched and preserving isolated white armor highlights. This exposes the near-white simplex contour background and the gray fluid wake behind the subject.

Native Chrome desktop inspection: observed the automatic Iron Man slice across Tony's eyes and the new contour/wake background; selected Iron Man and Doom and captured their rendered portraits; observed the temporary Tony slice on Doom while Doom remained selected; toggled Auto motion OFF and ON and confirmed the respective accessible states. Build, asset/profile integrity checks, and three deterministic tests cover four crossings, path continuity, reverse timing, clear intervals, and preservation of isolated highlights during runtime matting.

No mobile GPU benchmark, measured frame-rate guarantee, or pixel-perfect equivalence is claimed. The source reference animates a genuine 3D head/helmet; this version continues to use the supplied flat character portraits. Earlier verification entries describe their respective historical implementations; this revision supersedes the earlier idle timings and horizontal-lane path.


## Visible contour ground and wider reveal — 31 October 2026

Adjusted the contour shader after the supplied still clarified the desired background contrast. Lines now differentiate the continuous noise field before wrapping into bands, eliminating derivative spikes at wrap seams, and use a DPR-aware stroke width. Increased their contrast over a lighter neutral ground so they remain visible at ordinary desktop viewing size. Increased the automatic fluid input radius from .105 to .19 of hero height (about 81%), manual radius from .115 to .21, and held radius from .21 to .34. Increased portable fallback brush sizes too; four-pass choreography and character identity behavior are retained.

Verified the refreshed local page in native Chrome after an initial stale/blank capture: the Doom hero showed distinct curved contour lines on both sides, evolving between captures, and a broad Tony reveal spanning eyes through nose while Doom remained selected. Build, three existing motion/matting tests, and asset integrity checks pass. Mobile and device GPU profiling were not performed for this adjustment.


## Infinity Gauntlet / four-second soundtrack cinematic — 31 October 2026

Implemented a native modal hero takeover with an original articulated SVG gauntlet. The local MP3 starts from a trusted user click, and a paused GSAP timeline samples the media playback clock on animation frames. Tony blends into Iron Man, a diagonal reveal introduces the user-supplied Endgame image, and Doom’s final reveal runs from 3.25 to 4.00 seconds of soundtrack time. A short 0.4-second settlement returns to the interactive Doom hero. Doom identity/theme and related landing images are prepared under the last reveal. Replay reuses one audio element from zero; pause holds both sound and visuals; Escape restores the prior identity; skip seeks to the Doom cue. Hidden tabs pause and expose resume. Post-film controls support play/pause, mute and stop. Reduced motion removes the finger flick, zooms, letterboxing motion and diagonal wipes while retaining the sequence and timing.

Prepared a 174 KB WebP from the supplied `public/snap.png` and copied the supplied MP3 to its local runtime URL. Original files remain untouched. Runtime media HTTP checks returned 200 with image/webp and audio/mpeg MIME types. No researched third-party gauntlet raster or fallback Endgame still is shipped; source/research notes are in `snap-sources.md`.

Native Chrome checks completed on localhost:4175: gauntlet trigger visible next to the portrait; trusted click opened the film at 00.28 with Chrome reporting Audio playing; repeat runs completed on the selected Doom identity with matching page content; pause changed to RESUME and held the clock at 00.53; successive captures showed the supplied Endgame artwork, cinematic crop and caption at 1.65–1.96 seconds; Escape dismissed the sequence back to the hero; mute changed to Unmute soundtrack with its pressed state true. Source tests verify cue ordering, the 4.00-second progress target, completion timing, clock stalling/resumption and invalid clock inputs. Build, five tests, syntax and expanded local asset checks pass.

Limits: Chrome focus changed repeatedly and some native screen captures were stale/blank or timed out. Frame-perfect four-second speaker-output alignment, stop/pause-after-film controls, hidden-tab/mobile/reduced-motion behavior and device performance were not conclusively verified through the UI; their handlers were implemented and source-reviewed. Actual audio playback was confirmed by Chrome’s playing indicator and advancing media-linked clock, not by a listening or audio-loopback test. Render cadence and audio device latency still apply. No deployment, commit or domain change was made for this feature.


## Background soundtrack playback correction — 31 October 2026

Removed the visibility-change handler that automatically paused the soundtrack when the document became hidden. User-started music now continues across tab/window switches; manual pause, stop and cancellation remain available. On return, an active cinematic cancels its pending animation frame and immediately resamples the media clock, including completing the Doom landing if the four-second cue has passed. Build and five tests pass. Window-switch playback was not reverified in a browser for this correction. This supersedes the earlier hidden-tab audio policy.
