# Architecture

## Current Shape

- Kind: presentation project — a Svelte slide deck (rebuild in progress), with a possible companion audience app (undecided).
- Stack: Svelte 5 + Vite + TypeScript, `motion` for animation. App stack (if chosen): one Node server, Express + `ws`.

## System Map

- `reference/harness-talk.html` — the original single-file deck. Reference only for design tokens,
  copy, and behavior; never shipped or edited.
- `src/` — the Svelte deck. 9 slides as components, deck shell owns navigation (keys, click zones),
  progress bar, speaker notes, and crossfade transitions; slide 7 hosts the workflow simulator.
- If an audience app is approved, the sketch (not yet real): one Node process serving
  `/` (presenter deck) and `/join` (phone client), WebSocket fan-in of phone inputs,
  server aggregates and broadcasts. In-memory state only.
- `src/sonata/` + `sonata-talk.html` — a second, standalone deck (Sonata KT, 17 slides) served at
  `/sonata-talk`. Reuses the deck shell, styles, fx, and Defs from the main deck; no live/audience
  features. Dev: `localhost:5173/sonata-talk.html`; prod: `localhost:8787/sonata-talk`.

## Boundary Rule

For each load-bearing boundary, record what it owns, its public interface, allowed dependencies,
and the validation command.

- Deck shell vs slides: the shell owns which slide is active and all global chrome; slides own
  their content and entrance motion and never touch navigation state. Validation: `npm run build`.
- Offline resilience: the built deck must present fully with no network beyond first load
  (fonts aside) and keep working with faked data if connectivity dies mid-talk.
- Server owns truth (only applies if the app is built): authoritative state (positions, votes,
  timers) lives on the server; clients render and send inputs. This rule is quoted in the talk itself.
