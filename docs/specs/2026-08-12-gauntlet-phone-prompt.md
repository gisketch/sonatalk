# 2026-08-12 — Gauntlet prompt on the phone

## Problem

During the gauntlet the command lives only on the deck (AirPlayed to a TV) while the
answer pads live on the phone. Players ping-pong between two surfaces under a
sub-second window: read the TV, look down, find the pad, tap. It is disorienting, and
the head-snap costs more time than the challenge itself.

Desired outcome: a player can play the whole gauntlet **without looking up**. The
command and its timer render on the top half of their phone; the pads stay on the
bottom half. The deck keeps showing everything for the room (spectacle, roasts, wall),
but it is no longer required reading.

## In scope

- Phone renders the live command text, sub-line, and stroop ink colour.
- Phone renders its own draining timer bar for the same window the deck shows.
- Phone reveals the command at the same wall-clock instant the TV does, on every phone.
- A clock-sync handshake so "the same instant" survives phone clock skew.
- Deck display is unchanged apart from anything needed to keep the two in step.

## Out of scope

- Changing prompt content, difficulty curve, scoring, tiebreaks, or windows.
- Making the deck optional for the *presenter* (the deck still drives the game).
- Prompt rendering on any other phone screen (battle, race).

## Acceptance criteria

1. While a round is live, the phone shows the command text and sub-line in the top
   region and the pads in the bottom region, both reachable without scrolling on a
   small phone (≥ 360×640 CSS px).
2. Stroop rounds render the ink colour on the phone exactly as the deck does, and the
   phone's timer is never coloured by, or drawn behind, the command text.
3. A phone never reveals the command before the TV shows it. Reveal happens at the
   round's `showAt` instant expressed in that phone's local clock.
4. Every phone's visible countdown reaches empty within ±150 ms of every other phone's,
   and within ±150 ms of the window the server actually accepts taps for.
5. A phone whose system clock is wrong by minutes still satisfies (3) and (4).
6. Taps continue to be accepted only inside the server window; a phone cannot widen its
   own window by rendering early or by lying about its clock.
7. Between rounds the phone shows the result verdict as it does today; the command area
   clears rather than leaving a stale command visible.
8. With no clock-sync data yet (first round after joining), the phone degrades to
   revealing on broadcast receipt — never earlier than receipt, never blocked forever.

## Implementation constraints and settled decisions

- **The TV is the timebase.** The server already stamps `showAt = broadcast +
  displayLagMs` and `closesAt = showAt + windowMs` on the round payload, and gates taps
  to that range. The phone adopts the same two numbers; nothing new is invented, so
  phone, TV, and tap-gate cannot drift apart by construction.
- **Clock skew is measured, not assumed.** Add a `ping`/`pong` round trip on the
  socket. The client estimates `offset = serverTime − localMidpoint` and keeps the
  sample from the lowest observed round trip; `serverNow() = Date.now() + offset`.
  Sampling repeats a few times shortly after connect and periodically thereafter so a
  phone that joins mid-game converges quickly.
- **Reveal is gated, taps are not re-gated.** The phone hides the command until
  `serverNow() ≥ showAt`; pad enablement stays driven by broadcast state exactly as
  today, and the server remains the only authority on what counts.
- **No new payload fields.** The command is already broadcast to phones; it was simply
  not rendered.
- Layout: command block on top, verdict/score in the middle, pads pinned to the bottom.
  The pads must not move between rounds — a shifting hit target under a 650 ms window
  is a fairness bug.

## Validation evidence expected

- Server tests: `ping` answers with the server timestamp and echoes the client stamp;
  tap gating still rejects pre-`showAt` and post-grace taps (existing tests stay green).
- Client: `svelte-check` clean, build clean.
- Manual/browser: two phone clients side by side reveal the command together; one with
  a deliberately skewed clock (offset injected) still reveals with the others.
- Live: a full gauntlet run over the deployed instance with the TV-delay stepper set,
  confirming phone command and TV command appear together.

## Risks and open questions

- One-way network asymmetry can bias the offset estimate by a few tens of ms. Accepted:
  the resulting error is well under the ±150 ms budget and identical in kind to the
  race countdown, which already ships.
- A phone that reveals *late* (bad sample, GC pause) loses window. Mitigated by capping
  the reveal wait: if the estimated `showAt` is more than one window away, reveal on
  receipt instead of trusting the estimate.
- Players may now stare only at their phone and miss the roasts. Acceptable — the deck
  is spectacle for the room, and the results beat is long enough to look up.
