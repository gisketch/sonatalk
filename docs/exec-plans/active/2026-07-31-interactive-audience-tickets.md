# Interactive Audience System — Ticket Breakdown

> **Status 2026-07-31:** T1–T3, T5–T11 implemented and validated (multi-tab e2e + 10-phone
> harness via `node scripts/rehearse.mjs`). T4: Docker image builds and serves; VPS/NPM/DNS
> steps remain with Ghe (checklist in `docs/deploy.md`). T12: automated arc validated twice
> (single-phone browser e2e + 10-phone harness incl. battle-with-server-gone); real-device
> pass over talk.gisketch.com and the recorded projector run remain with Ghe.
>
> Sensor catches worth keeping for the reveal slide: (1) Motion's rAF driver froze in a
> throttled pane → switched entrances to the WAAPI engine; (2) `svelte:body` click handler
> never fired → moved nav onto an in-app wrapper; (3) battle-slide clicks triggered deck
> navigation → click-guard list; (4) fixed-dt sim crawled under timer throttling → real-elapsed
> sub-stepping; (5) backend restarts crashed the Vite dev server → proxy error handlers;
> (6) HMR leaked phone sockets → WS lifecycle tied to component destroy.

> Specs: [ws-core](../../specs/2026-07-31-ws-core.md) ·
> [drawing-tier-drops](../../specs/2026-07-31-drawing-tier-drops.md) ·
> [rps-battle](../../specs/2026-07-31-rps-battle.md)
> Tracker: local (this file is canonical). Work only tickets whose blockers are complete.
> Every ticket is a vertical slice: demoable on its own, sized for one fresh agent context.

## Dependency Graph

```
T1 ──> T2 ──> T3 ──────────> T7 ──> T10 ──> T11 ──> T12
 │      ├───> T5 ──> T6 ──┘         ^        ^       ^
 │      └───> T8 ──────────────────┘        │       │
 ├────> T4 ─────────────────────────────────┼───────┘
 T9 (mock-driven, parallel any time) ───────┘
```

---

## T1 · Server skeleton + join counter

- **Delivered behavior:** One Node process (Express + `ws`) serves the built deck at `/` and a
  phone shell at `/join`. Opening `/join` connects a WS; the deck's bottom edge shows a live
  "N connected" counter ticking up/down.
- **Acceptance:** 10 browser tabs on `/join` → counter reads 10 within ~1s each; closing tabs
  decrements; deck and phone pages both come from the same Vite project build.
- **Validation:** multi-tab smoke run; `npm run check` + build green; counter behavior on deck.
- **Blocked by:** —

## T2 · Phase machine + presenter auth + name phase

- **Delivered behavior:** Server-owned phase state machine (`lobby → names → … → reveal`) with
  snapshot-on-change broadcast and snapshot-on-connect. Deck holds a presenter token; only it
  advances phases. Advancing to `names` makes a name input appear on every phone (the trivial
  drop, minimal styling); submitted names appear on the deck roster.
- **Acceptance:** ws-core AC 2, 3, 5 — drop lands ≤1s; late joiner lands in current phase;
  phones cannot advance phases; duplicate names accepted.
- **Validation:** multi-tab walk of lobby→names incl. one late join; unit test on the phase
  transition guard (presenter-only).
- **Blocked by:** T1

## T3 · Slide-7 live mode: deck wiring, mirror, bail hotkey

- **Delivered behavior:** Slide 7 gains a live mode — the chat playback's "done" clicks send
  real phase advances; a QR join beat precedes it (stable URL asset). Deck mirrors all received
  state (players, names) so a WS drop loses nothing. One hotkey swaps slide 7 to the existing
  fake simulator with no visible error.
- **Acceptance:** ws-core AC 1, 4 — QR beat + counter; kill server mid-`names` → roster
  persists on deck, bail lands cleanly on fake sim; restart yields fresh session.
- **Validation:** scripted kill-server drill; visual pass of QR beat and both slide-7 modes.
- **Blocked by:** T2

## T4 · VPS deploy: talk.gisketch.com via NPM + real-device pass (run early)

- **Delivered behavior:** Verified VPS "bedrock" runs the server; Nginx Proxy Manager proxy
  host for talk.gisketch.com with TLS + WebSocket support enabled — no tunnels. Server WS
  heartbeat (~30s pings) in place. A real phone on mobile data scans the QR and joins.
- **Acceptance:** own phone joins via QR at https://talk.gisketch.com over mobile data (WSS
  upgrade succeeds through NPM); a phone left idle 10+ min stays connected thanks to the
  heartbeat — if drops persist, the finding + chosen mitigation go into the ws-core spec.
- **Validation:** deploy notes + idle-longevity evidence appended to the spec.
- **Blocked by:** T1 (deliberately early — de-risks every later live moment)

## T5 · Canvas drop (normal tier)

- **Delivered behavior:** Advancing to `canvas` makes a drawing surface materialize on phones —
  "draw your character", single black brush, fixed paper background, entrance animation in the
  deck's motion language.
- **Acceptance:** drawing-tier-drops AC 2 — touch drawing works on iOS Safari + Android Chrome;
  no scroll/zoom bleed mid-stroke; drop ≤1s on all connected phones.
- **Validation:** real-device stroke test; multi-tab drop timing.
- **Blocked by:** T2

## T6 · Tools drop (complex tier)

- **Delivered behavior:** Advancing to `tools` materializes the tool panel — 5 colors, fill,
  brush sizes, single-level undo + clear — without wiping the in-progress drawing.
- **Acceptance:** drawing-tier-drops AC 3, 5 — in-progress drawing survives the drop; late
  joiner gets the full toolset; fill + undo behave (undo restores pre-fill state).
- **Validation:** real-device pass incl. fill/undo; brush colors legible on paper background.
- **Blocked by:** T5

## T7 · 60s challenge: timer, lock, upload, deck thumbnails

- **Delivered behavior:** Presenter click starts a synchronized 60s countdown on deck + phones.
  At zero the canvas locks, exports PNG (≤200KB), uploads over HTTP; thumbnails pop onto the
  deck as they land and join the deck mirror.
- **Acceptance:** drawing-tier-drops AC 4, 6, 7 — ±1s drift; late upload rejected server-side;
  30 simulated uploads land ≤5s after zero; dead phone mid-draw just never appears.
- **Validation:** multi-tab upload storm; server-side lock unit test; thumbnail beat visual.
- **Blocked by:** T3, T6

## T8 · Pick phase: R/P/S + live team counters

- **Delivered behavior:** `pick` phase shows Rock/Paper/Scissors on phones (changeable until
  battle start); deck shows live per-team counts; players without drawings still pick and get
  a named placeholder chip.
- **Acceptance:** rps-battle AC 1, 2 (chip part) — pick change moves counters live ≤1s.
- **Validation:** multi-tab pick churn; counter consistency check.
- **Blocked by:** T2 (independent of T5–T7; can run parallel to drawing tickets)

## T9 · Battle sim engine (mock-driven, parallel any time)

- **Delivered behavior:** Dedicated battle slide: entities bounce DVD-style with name + team
  badge, RPS collisions eliminate losers, same-team/tie collisions bounce, arena
  shrinks/accelerates after ~45s, end detected when one team remains, winner splash renders.
  Runs entirely on the deck from mock entities — demoable with zero server.
- **Acceptance:** rps-battle AC 3 (rules), 4 (≤90s incl. lopsided + single-team cases), winner
  splash appears; pure RPS resolution function unit-tested (all 9 pairings + same-team).
- **Validation:** unit tests; three scripted mock runs (balanced / lopsided / instant-win);
  physics feel pass hard-capped at 30 min.
- **Blocked by:** — (uses deck shell only; can start immediately)

## T10 · Battle integration: real data, events, kill-switch

- **Delivered behavior:** Battle consumes mirrored drawings + picks; presenter click starts it;
  eliminated players' phones get 💀 ≤1s; presenter click on a sprite removes it styled as a
  normal elimination; battle + winners + reveal still run if the server dies after picks.
- **Acceptance:** rps-battle AC 2, 3 (💀 part), 5, 7.
- **Validation:** multi-tab arc through battle incl. mid-battle server kill; kill-switch visual
  indistinguishability check.
- **Blocked by:** T7, T8, T9

## T11 · Winners + reveal slide

- **Delivered behavior:** `winners` phase: team banner + surviving drawings enlarged with
  names; survivors' phones show 🏆. `reveal` phase: all drawings (eliminated included) as a
  gallery grid behind the Sonata receipts (grill excerpt, spec/ticket shots, sensor self-fix
  moments), slotted before "Start tiny".
- **Acceptance:** rps-battle AC 6 — both phases presenter-clicked; every submitted drawing
  appears in the gallery.
- **Validation:** visual pass on projector-ish display; receipts content checklist assembled.
- **Blocked by:** T10

## T12 · Full-arc rehearsal + failure drill

- **Delivered behavior:** The talk is rehearsable end-to-end: scripted multi-tab full arc
  (join → reveal), one kill-the-server drill practicing the bail hotkey, one recorded run on a
  large display with own phone via the real VPS QR. Findings feed fixes or spec updates.
- **Acceptance:** full arc completes twice without intervention beyond presenter clicks; bail
  drill lands on fake sim mid-arc without visible error; recording exists.
- **Validation:** the recording + a rehearsal-notes entry in this file.
- **Blocked by:** T4, T11
