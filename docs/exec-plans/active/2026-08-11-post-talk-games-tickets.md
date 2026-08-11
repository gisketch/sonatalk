# Post-Talk Games — tickets

Spec: [2026-08-11-post-talk-games.md](../../specs/2026-08-11-post-talk-games.md)

Invariant for EVERY game, current and future: **a game ends with exactly one winner.**
The sudden-death loop (stand-off → re-pick → repeat) is the mechanism; a "game" may span
many battle rounds and that is expected, not a bug. No game-end path may crown >1 player.

## G1 · Rematch server action

**Delivered behavior:** presenter can start a fresh game: every player revives with their
existing name + drawing and lands on the pick screen.

- New presenter WS message `rematch`: sets `alive = true` for all players, clears
  pick/spawn/ready, enters `pick`. Names, drawings, connections untouched.
- Deliberately distinct from `advance('pick')` (sudden-death re-round), which must keep
  eliminated players dead. Both paths covered by unit tests side by side.
- Acceptance: after the demo crowns a champion, `rematch` → every connected phone
  (including demo casualties) shows the pick screen; `/api/state` shows all alive,
  no picks, drawings intact.
- Validation: vitest on session + ws layers (revive vs re-round contrast test).
- Blocked by: —

## G2 · Late-joiner onboarding

**Delivered behavior:** a phone that scans the QR mid-game onboards itself: name → untimed
draw → pick, without affecting anyone else.

- Server: `POST /api/drawing` accepts a **first** upload from a player with no drawing in
  any phase; replacement uploads remain valid only inside the timed drawing window.
- Phone routing in `pick`: no name → name gate (exists) → no drawing → untimed draw board
  (existing canvas + tools, no countdown, explicit "submit character" button) → pick screen.
- Ready gate already counts them (alive + connected, not ready while onboarding) — assert
  it in validation, don't rebuild it.
- Acceptance: fresh tab during game-1 pick completes name → draw → submit → pick; deck
  roster shows them; "show players" stays locked until they're ready; their character
  fights in the arena.
- Validation: vitest for the upload-window rule; manual tab walk-through.
- Blocked by: —

## G3 · Game 1 deck slide

**Delivered behavior:** after Closing, a game slide runs the full rematch loop end to end —
repeatably, one champion per game.

- New slide after Closing composing existing modules (arena, roster, QR): compact corner QR
  for late joiners, ready roster, and the arena's v3 flow (ready gate → show players →
  start → sudden death → sole champion).
- "Rematch" control on the slide fires G1's message; usable again after each game ends —
  this same loop is how games 2–3 will launch.
- 300-line gate: compose, don't grow BattleSlide.
- Acceptance: demo arc → Closing → game slide → rematch revives all → (late joiner via G2)
  → battle → stand-offs re-pick as needed → **exactly one** champion crowned → rematch
  works again. Deck refresh mid-game recovers from the mirror.
- Validation: multi-phone harness run of the full loop (extend `scripts/rehearse.mjs` with
  a late joiner + rematch re-arm); manual localhost dry run with ≥5 tabs.
- Blocked by: G1, G2

## Status

- [x] G1 rematch server action — `rematch` WS msg + `rematchSession`; contrast-tested vs re-round
- [x] G2 late-joiner onboarding — first-upload-any-phase rule (HTTP-tested); phone routes
      name → untimed draw ("onboard" board) → pick
- [x] G3 game 1 deck slide — slide 15 composes Arena (extracted from BattleSlide, 238 lines)
      + corner QR + rematch loop; validated live: reveal → rematch → late joiner onboarded
      mid-pick → gate waited (3/4) → battle → sole champion ("Late wins!") → crown →
      second rematch revived all with drawings intact

Sensor catch during build: phones kept local dead/champion flags across rematches — a
revived player would have stayed on the Eliminated screen. Fixed by syncing to snapshot
truth (alive) and clearing the crown when a new pick round opens.

Games 2–3: no tickets until formats are decided (spec's open question). They inherit G1's
rematch loop and the one-winner invariant as-is.
