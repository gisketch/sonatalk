# Post-Talk Games — rematch mode with persistent characters

Date: 2026-08-11 · Status: approved for game 1; games 2–3 pending format decisions

## Problem & Desired Outcome

The in-talk RPS demo is a trial round. After the closing slide the session continues into
up to three audience games. Characters (names + drawings) must survive the whole evening —
players should never redraw unless they joined late. Game 1 is an RPS rematch: everyone
alive again, same avatars, players only re-choose weapon + spawn. Late arrivals can still
scan the QR, name themselves, and draw untimed, then join the same game.

## In Scope

- **Character persistence**: names, drawings, and the deck mirror survive from the talk demo
  through all games. Only `Shift+R` (full reset) wipes them — it must not be needed between
  talk and games.
- **Rematch action**: a presenter-triggered transition that revives every player
  (`alive = true`), clears pick/spawn/ready, and enters the `pick` phase. Distinct from the
  sudden-death re-round (which must keep eliminated players dead).
- **Game 1 deck slide(s)**: appended after Closing. Reuses the existing arena module
  (ready gate → show players → start → sudden death → sole champion) plus a compact join QR
  and the ready roster. Only the current slide mounts, so reusing the arena component is safe.
- **Late-joiner onboarding during `pick`**: phone-side routing becomes per-player, not
  phase-global — missing name → name gate (already true); missing drawing → untimed draw
  board with an explicit submit button; then the pick screen.
- **Upload window change**: the drawing endpoint accepts a first upload from any player who
  has no drawing yet, in any joinable phase. Replacements stay restricted to the timed
  drawing window.
- Games 2–3: reserved deck-slide slots and the persistence guarantees they rely on — nothing
  else until formats are decided.

## Out of Scope

- Game 2 and game 3 mechanics (TBD).
- Score/leaderboard across games.
- Persistence across server restarts (session stays in-memory; a restart before the games
  still loses everything — accepted, same as the talk).

## Acceptance Criteria

1. Talk demo ends (winners/reveal); presenter advances through Closing; on the Game 1 slide
   a "rematch" control revives all players: every connected phone (including those
   eliminated in the demo) sees the pick screen; names and drawings are unchanged.
2. A brand-new phone scanning the QR during game-1 pick gets: name gate → untimed draw board
   with submit → pick screen. Their character then appears in the arena with everyone else.
3. The ready gate counts all living connected players, including mid-onboarding late
   joiners — the game cannot start while someone is still naming or drawing.
4. Game 1 plays by v3 arena rules end-to-end: show players (weapons hidden) → start →
   sudden death re-rounds → exactly one crowned champion.
5. After game 1 ends, a second rematch control can start the next game the same way
   (revive-all + fresh picks) — the loop is repeatable, not single-shot.
6. Deck refresh or WS drop during games recovers exactly as during the talk (mirror keeps
   players + drawings).

## Constraints & Settled Decisions

- Reuse the existing phase machine (`pick → battle → winners`); no new phases. "Games mode"
  is a deck-side framing, not a server concept. The rematch is a presenter message
  (revive-all + pick advance), not a new state.
- The sudden-death pick-advance and the rematch pick-advance are distinct server paths:
  re-round preserves `alive`, rematch resets it.
- Phone routing rule (supersedes phase-only routing): within `pick`, screens resolve in
  order name → drawing → pick, per player. The talk's timed drawing phase is unchanged.
- The untimed draw board reuses the existing canvas + tools; the only differences are no
  countdown and a manual submit.
- QR on the game slide is compact (corner), not the full-slide join moment.
- 300-line gate applies: the game slide composes existing modules (arena, QR, roster)
  rather than growing BattleSlide.

## Validation Evidence

- Server unit tests: rematch revives eliminated players and clears picks; first-upload
  acceptance outside the drawing window; replacement uploads still rejected outside it.
- Multi-phone harness: demo arc → rematch → late joiner (name + draw + pick) → game 1
  champion → second rematch.
- Manual dry run on localhost with ≥5 tabs including one late joiner.

## Risks / Open Questions

- Games 2 and 3 formats are TBD — the only commitment is that avatars persist and slide
  slots exist. Decide formats before building anything beyond game 1.
- Late joiners drawing with no time pressure may stall the ready gate; presenter can watch
  the roster and nudge verbally. If it drags, a possible v2 is a presenter "close joins"
  toggle — not built now.
- Audience fatigue: three RPS-style games back-to-back may need variety; that is a content
  decision, not an engineering one.
