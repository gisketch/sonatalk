# Deck Rebuild — Svelte + Motion

Goal: parity with `reference/harness-talk.html` (9 slides, nav, notes, simulator, design system),
rebuilt as Svelte 5 + Vite + TS components with `motion` driving entrance animation.

## Slices

1. [x] Scaffold: Vite + Svelte 5 + TS + motion; fonts; global styles ported from reference.
2. [x] Deck shell: slide switching (keys, click thirds), crossfade, progress bar, HUD, speaker notes.
3. [x] Static slides 1, 2, 4, 5, 6, 8, 9 (title, problem, sonata, sensors, docs, start-tiny, closing).
4. [x] Slide 3 flow diagram (SVG, traveling pulses).
5. [x] Slide 7 workflow simulator (tabs, pipeline chips, chat playback, typing indicator).
6. [x] Validation: `npm run build`, `./scripts/check-sonata.sh`, visual pass in browser.

## Constraints

- Every `.svelte`/`.ts` file stays under the 300-line gate — split at component boundaries.
- Keep the reference design system exactly: tokens, fonts, grain, spark, no accent bars.
- `prefers-reduced-motion` respected; print styles preserved.
