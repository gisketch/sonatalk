# Project Brief

## Product Vision

An 8–10 minute talk on harness engineering for Netzon's weekly tech talk, delivered through a
self-contained HTML slide deck — potentially paired with an interactive audience app whose reveal
is the talk's proof: the deck and the app are one application, built through Sonata itself.

Thesis line: "The model isn't the moat. The harness is."

Full context transfer from the originating chat: [Talk handoff](talk-handoff.md).

## Users

- Primary user: Ghe (gisketch) — presenter, owner of the Sonata harness (`github.com/gisketch/sonata`).
- Secondary users: ~30 Netzon coworkers in the audience, possibly joining on phones over mobile data.
- Operating environment: projector (deck) + audience phones; office wifi is unreliable, so any live
  app is hosted on VPS "bedrock" at talk.gisketch.com (Nginx Proxy Manager) and the deck must degrade to offline fakes.

## Current Milestone

- Outcome: rebuild the slide deck from scratch in Svelte + Motion, reaching parity with the
  reference HTML deck. Talk is next week. The interactive-app concept (plaza / polls / none)
  stays deferred and gates all audience-app work — not the deck rebuild.
- Acceptance behavior: the Svelte deck renders all 9 slides with parity to the reference
  (`reference/harness-talk.html`) — nav, notes, simulator, design system — via `npm run dev`.

## Problem

The deck alone makes the talk a lecture; the reveal ("you've been using a Sonata-built app the
whole time") is what makes the thesis land. But the app format is undecided, and building the
wrong scope for a 10-minute talk wastes the week before it.

## Non-Goals

- No collision, chat, free-text input, names/accounts, reconnection logic, or persistence in any app variant.
- No heavy infra: one Node process, in-memory state only, no DB. The app lives for ~10 minutes.
- No multiplayer game/leaderboard (stretch only if everything ships early).

## Later / Not Now

- App concept selection (teleport plaza / joystick plaza / simple polls / none) — deferred by Ghe.
- Real `$sonata-grill` transcript to replace slide 7 placeholders (needed regardless of app decision).
- Reveal slide with receipts (grill/spec/ticket/sensor screenshots) — only if an app exists to reveal.
- Confirm "8 minutes" vs "10 minutes" on the title byline.

## Constraints

- Stack: Svelte 5 + Vite + TypeScript, `motion` (motion.dev) for animation. The deck is rebuilt
  from scratch in Svelte; `reference/harness-talk.html` is design/copy reference only, not shipped.
  If an audience app is chosen: one Node server (Express + `ws`), deck at `/`, phone client at `/join`.
- Package manager: npm.
- Runtime: Node on VPS "bedrock" (Ubuntu 24.04, Singapore), exposed as talk.gisketch.com via
  Nginx Proxy Manager (TLS + WebSocket proxying); no tunnels. Verify VPS state before relying on it.
- Data: in-memory only; server owns truth (positions, votes, timers) — "server owns truth, LLM owns flavor" is quoted in the talk, honor it.
- Security: no free-text input from the audience; anonymous sessions only.
- Performance: ~30 concurrent users; if joystick mode is ever chosen, ~10–15 tick/s server-authoritative movement.
- Design: keep the Claude/Anthropic aesthetic of the deck (ivory/clay palette, Source Serif 4 / Inter /
  JetBrains Mono, spark motif, paper grain). No accent bars; whitespace does the work.
- Working style: cut scope, don't extend hours; hard-cap polish passes at 30 min; whatever gets built
  MUST go through the Sonata workflow because the artifacts are slide content.

## Open Questions

- Which interactive format, if any? (plaza / polls / none — Ghe decides)
- Which reveal moments matter most if an app happens?
- If plaza: teleport vs joystick · dedicated slide moments vs corner widget · zone-walk vs slider
  for the trust meter · sprite art source (own with 30-min cap, or free pack).
