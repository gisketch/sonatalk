# Drawing & Tier Drops — Phone Client Evolution

> Derived from [interactive-audience-system.md](interactive-audience-system.md). Depends on
> [ws-core](2026-07-31-ws-core.md) phases. Chronologically second.

## Problem / Outcome

Slide 7's workflow demo must visibly ship real features to the audience mid-talk: each tier's
"done" click makes new UI materialize on every phone. Outcome: the phone client grows from a
bare lobby into a drawing app in three presenter-controlled steps, then captures one drawing
per player for the battle.

## In Scope

- Tier drops as phase payloads (phases from ws-core):
  - `names` (trivial): name input appears. Submitted name locks in (no rename).
  - `canvas` (normal): drawing canvas appears with the instruction "draw your character" and a
    single black brush. Canvas has a fixed paper background — any future theming affects chrome
    only, never the paper.
  - `tools` (complex): tool panel materializes — 5-color palette, fill tool, brush sizes.
- Each drop lands with a small entrance animation (Motion, consistent with deck motion language)
  so the "it just shipped" moment reads from a phone held in a hand.
- 60s drawing challenge: presenter click starts it; countdown visible on deck and phones;
  drawing locks at zero; canvas exports PNG and uploads (HTTP POST, not WS) with player id.
- Deck gallery beat: thumbnails pop onto the deck as uploads land (join-counter energy).
- Local-only drawing: strokes never leave the phone before the final PNG. Undo (single-level)
  and clear are allowed if cheap; nothing else.
- Deck mirror extends to drawings: received PNGs are held by the deck for the battle regardless
  of later connectivity.

## Out of Scope

- Stroke streaming / live spectating of drawing in progress.
- Eraser-as-tool beyond undo/clear, layers, zoom, stickers — the toy stays a toy.
- Persistence of drawings beyond process memory (they die with the session).
- RPS pick UI (next spec) even though it follows immediately.

## Acceptance Criteria

1. Phones in `lobby` show no controls. `names` advance → name input within ~1s on all phones.
2. `canvas` advance → canvas + "draw your character" + black brush appear; drawing works with
   touch on iOS Safari and Android Chrome; palm-scroll does not scroll/zoom the page mid-stroke.
3. `tools` advance → palette (5 colors), fill, and brush sizes appear without wiping the
   in-progress drawing.
4. Timer start → deck and phones count down together (±1s drift acceptable); at zero the canvas
   locks, uploads, and the deck shows that player's thumbnail within ~2s on venue-grade internet.
5. A phone that joined late (e.g. during `tools`) gets the full current toolset immediately and
   can still submit within the remaining time.
6. A phone that dies mid-drawing simply never uploads; the arc continues without it.
7. Upload payloads stay small (target ≤200KB/PNG; downscale canvas export if needed) — 30
   uploads land within ~5s of timer end in the multi-tab harness.

## Constraints & Settled Decisions

- Phone client is part of the same Svelte project; 300-line gate applies — canvas, tools, and
  phase shell are separate components by design pressure, not choice.
- Tier drops are feature flags flipped by phase payloads — the features are prebuilt and gated,
  which the reveal discloses honestly via Sonata receipts.
- Drawing tools use the talk's design tokens (clay/ivory/ink palette for UI chrome; the 5 brush
  colors themselves should read well on the fixed paper background — pick during implement).
- No text tool on canvas (free-drawn text is possible; accepted risk, kill-switch covers it).

## Validation Evidence

- Multi-tab harness run: full names→canvas→tools→drawing walk with 10+ tabs, all thumbnails
  landing on the deck.
- Real-device pass on own phone(s): touch drawing feel, no scroll bleed, upload over mobile data.
- Timer-lock evidence: drawing at zero is rejected/ignored server-side, not just hidden client-side.

## Risks / Open Questions

- iOS Safari canvas/touch quirks (double-tap zoom, rubber-banding): budget real-device time early.
- Fill tool on a small canvas can wipe someone's work (fill = flood on tap) — single-level undo
  is the mitigation; confirm it's enough during implement.
- Brush colors vs paper background contrast — decide the 5 colors when the canvas exists.
