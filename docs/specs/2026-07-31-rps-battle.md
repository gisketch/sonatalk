# RPS Battle & Reveal — Pick, Sim, Winners, Receipts

> Derived from [interactive-audience-system.md](interactive-audience-system.md). Depends on
> [ws-core](2026-07-31-ws-core.md) and [drawing-tier-drops](2026-07-31-drawing-tier-drops.md).
> Chronologically third; closes the arc.

## Problem / Outcome

The drawings need a payoff and the talk needs its reveal. Outcome: every player's drawn
character battles DVD-logo-style on the main slide under RPS rules until one team stands, then
the reveal shows all drawings behind the Sonata receipts — landing the thesis that the whole
experience was one harness-built application.

## In Scope

- `pick` phase: phones show Rock / Paper / Scissors buttons; one pick per player, changeable
  until battle start; deck shows live per-team counts. Players with no uploaded drawing can
  still pick (they battle as a named placeholder chip) — nobody who joined is excluded.
- `battle` phase (presenter click):
  - Sim runs on the deck client only; server relays only start signal and eliminations.
  - Entities: each drawing as a sprite with name label + team badge, DVD-logo bouncing on a
    dedicated battle slide (arena uses deck design language: paper arena, ink walls).
  - Collision rule: RPS loser is eliminated (poof on deck, 💀 event to that phone); same-team
    and tie collisions bounce off.
  - Forced ending: after ~45s the arena shrinks and/or speed ramps; battle must resolve ≤90s.
    End condition: all remaining entities share one team.
  - Presenter kill-switch: clicking a sprite removes it (rude-content insurance), styled as an
    elimination, not an error.
- `winners` phase: team banner + surviving drawings enlarged with names; survivors' phones get
  a 🏆 state, everyone else sees the winning team.
- `reveal` phase: all drawings (eliminated included) form a gallery grid behind the receipts —
  grill transcript excerpt, spec/ticket screenshots, real sensor self-fix moments (two already
  logged from the deck rebuild). Closing beat before the existing "Start tiny" slide.
- Deck-mirror rule extends: picks mirrored on deck; battle runs entirely from mirrored state,
  so it works even if the server dies after picks arrive.

## Out of Scope

- Server-authoritative battle physics, tick sync, or phone-side battle rendering — phones only
  receive elimination/winner events.
- Kill counts, MVP stats, podium, replays, leaderboards.
- Bots / canned doodles for low-join sessions (bail to fake simulator covers that).
- Sound effects (stretch only if everything ships early; deck stays silent by default).

## Acceptance Criteria

1. `pick` advance → all phones show R/P/S within ~1s; deck team counters update live as picks
   change; a pick change before battle start moves the counter.
2. Battle start → every uploaded drawing appears bouncing with name + badge; entities without
   drawings appear as placeholder chips with names.
3. Collisions eliminate correctly per RPS (rock kills scissors, scissors kills paper, paper
   kills rock); eliminated phone shows 💀 within ~1s; same-team collisions never eliminate.
4. Battle visibly accelerates/shrinks after ~45s and always ends within 90s with one team
   remaining — including lopsided cases (e.g. 20 rocks, 2 papers) and the everyone-picked-rock
   case (instant win splash, no battle needed).
5. Presenter click on a sprite eliminates it indistinguishably from a normal elimination.
6. Winners phase shows the surviving team's drawings + names; reveal phase shows the full
   gallery + receipts; both driven by the presenter's next click.
7. Server killed after picks received → battle, winners, and reveal still run fully from the
   deck mirror (phones just stop receiving 💀/🏆 events).

## Constraints & Settled Decisions

- Deck is the single renderer and authority for battle outcomes; this is a deliberate,
  documented exception to "server owns truth," justified because phones cannot affect the
  battle once it starts (broadcast, not shared state).
- Elimination not conversion; free pick, lopsided teams accepted as comedy.
- v2 (post-playtest): movement is chase-based, not DVD-bounce — each entity hunts its nearest
  prey (rock→scissors→paper→rock) with per-player randomized speed; readiness is a gate:
  pick + phone-chosen spawn position (mini arena map, normalized coords) + READY button.
  Deck shows "N ready / M connected" plus who's not ready (bottom-left, never over CTAs);
  battle slide has a playback speed control (0.5×–3×) with visible multiplier.
- Sim determinism is not required (no replay); but the RPS resolution function must be pure and
  unit-tested — it is the one piece of game logic with a wrong answer.
- Battle slide slots between the simulator slide and "Start tiny"; reveal replaces/extends the
  planned reveal slide. Deck shell navigation (keys/clicks) keeps working throughout.
- 300-line gate: sim loop, entity rendering, and phase UI are separate modules.

## Validation Evidence

- Unit tests: RPS resolution (all 9 pairings + same-team), end-condition detection, forced-end
  ramp trigger.
- Multi-tab harness: 10+ players through pick → battle → winners → reveal, including a
  mid-battle server kill.
- A recorded full-arc dry run on real hardware (projector or large display + own phone) —
  doubles as the talk rehearsal artifact.

## Risks / Open Questions

- Physics feel (speed, sprite size, collision radius vs 30 entities on a projector) needs
  hand-tuning; timebox it — hard-cap juice passes at 30 min per the working agreement.
- 💀/🏆 event delivery depends on connectivity at battle time; phones degrade to spectating the
  projector, which is acceptable.
- Exact receipts layout for the reveal (screenshots vs live artifacts) — decide when assembling
  the reveal content; not a build blocker.
