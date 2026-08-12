# Gauntlet prompt on the phone — tickets

Spec: [2026-08-12 Gauntlet prompt on the phone](../../specs/2026-08-12-gauntlet-phone-prompt.md)

Three slices. Each one is demoable on its own; the last two are what the players feel.

Status: T1, T2, T3 done (2026-08-12).

## T1 — Socket clock sync

**Delivers:** any client can ask "what time is it on the server?" and get an answer good
to a few tens of milliseconds, regardless of the device's own clock.

- `ping` message carries the client stamp; server replies `pong` with that stamp echoed
  plus its own `now`.
- Client keeps the offset from the lowest-round-trip sample, re-samples on connect (a
  short burst) and periodically after, and exposes `serverNow()`.
- Before any sample exists, `serverNow()` returns local time and reports itself unsynced.

**Acceptance:** a client with a clock deliberately offset by minutes reports a
`serverNow()` within a few tens of ms of the server's own clock.
**Validation:** server unit test for the `ping`/`pong` round trip; existing suite green.
**Blocked by:** —

## T2 — Command and timer on the phone

**Delivers:** the player reads the command on their phone. Top region = command text,
sub-line, stroop ink, draining timer bar. Bottom region = the same pads as today, in the
same place, never shifting between rounds.

- Reveal gated on `serverNow() ≥ showAt`; falls back to broadcast receipt when unsynced
  or when the estimate looks wrong (more than a window away).
- Timer bar drains `showAt → closesAt`, turning red near the end, matching the deck.
- Command area clears on the results beat; verdict and score behave as today.

**Acceptance:** spec criteria 1, 2, 3, 7, 8.
**Validation:** `svelte-check`, build, two phone clients revealing together in the
browser; small-viewport check at 360×640.
**Blocked by:** T1

## T3 — Fairness proof under skew and TV delay

**Delivers:** confidence that the mirrored prompt did not hand anyone an advantage.

- Confirm the server tap gate is unchanged and still rejects pre-`showAt` taps.
- Run a full gauntlet with the TV-delay stepper non-zero and a skewed-clock client in
  the field; both reveal with the TV and both score normally.
- Rehearsal bots keep passing (they already schedule taps relative to `showAt`).

**Acceptance:** spec criteria 4, 5, 6.
**Validation:** full sensor run (`vitest`, `svelte-check`, build, `check-sonata.sh`)
plus the live browser run described above.
**Blocked by:** T2
