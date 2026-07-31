# HANDOFF — Harness Engineering Talk + Interactive Plaza App

> Context transfer from Claude chat → Claude Code. Read fully before touching code.
> Owner: Ghe (gisketch). ADHD-friendly working style: cut scope aggressively, name the real constraint, one clear next action at a time. No guilt-framing, no artificial urgency.

---

## 1. WHAT THIS IS

Ghe is giving an **8–10 minute talk** at Netzon's weekly tech talk (AI session). Coworkers cover n8n and general AI stuff; Ghe's unique angle: **he built his own AI harness (Sonata)**.

The talk has a killer twist: the audience scans a QR at the start, joins an interactive "pixel plaza" on their phones, plays along during the talk — and at the end Ghe reveals that **the slide deck + the phone app they've been using is ONE application built through Sonata itself**. The app is the proof of the talk's thesis.

Repo for the harness: `github.com/gisketch/sonata` (Ghe owns it).

References the talk cites:
- https://openai.com/index/harness-engineering/
- https://martinfowler.com/articles/harness-engineering.html (Birgitta Böckeler, Apr 2026)

**Thesis line:** "The model isn't the moat. The harness is."

---

## 2. CORE CONCEPTS (talk content — don't distort these)

From the Fowler article, the ONE idea the talk teaches:

- **Guides (feedforward):** steer the agent BEFORE it acts — conventions, skills, docs, scripts.
- **Sensors (feedback):** catch AFTER it acts — linters, tests, checks, review agents — with errors written so the agent can act on them → self-correction loop before a human looks.
- Punchline: only-feedback = agent repeats mistakes forever; only-feedforward = you never learn if the rules worked.

**Sonata** = Ghe's harness, two halves:
- Feedforward: skills that build (grill → spec → ticket → implement), docs the agent reads (architecture notes, conventions/how-tos, kept alive by the flow — "executable context").
- Feedback: quality sensors. Real examples (keep vague/example-framed, "examples not prescription"):
  - **300-line file limit** — Ghe's own script, the agent runs it itself
  - **scc** — complexity/size accounting, catches over-engineering
  - **skylos** — dead code detection, catches orphaned code agents leave behind
- **Feature workflow tiers:** Trivial (just do it) / Normal (light spec) / Complex (full gauntlet: grill → spec → human review → ticket → human review → implement ↔ validate loop → human review).
- **Grilling** = the agent interrogates Ghe (~15 questions) before touching code on complex tasks.
- Ghe's architecture rule (appears in the demo copy): **"server owns truth, LLM owns flavor"** — an LLM never holds authoritative state.

---

## 3. CURRENT STATE OF THE DECK (harness-talk.html — file included in this handoff)

Single self-contained HTML file. 9 slides, keyboard-driven presentation.

### Slide map
1. **Title** (dark) — spark logo, "Harness Engineering"
2. **The Problem** — two-beat quote: "writes in minutes" → "reviewing everything it wrote" → "Trust is the bottleneck"
3. **Feedforward/Feedback** — animated SVG diagram: GUIDES → AGENT → DIFF, SENSORS loop below, continuously traveling pulse dots (SMIL animateMotion)
4. **Sonata overview** — two cards: skills that build / checks that validate
5. **Quality checks** — 3 sensor cards (300-line / scc / skylos), each framed "agent mistake → sensor"
6. **Documentation** — 3 cards (architecture notes / conventions / kept alive by flow)
7. **Workflow simulator** — INTERACTIVE: Trivial/Normal/Complex tabs, chat playback with typing indicator, pipeline chips lighting per stage, next-step button. Complex scenario = "daily quest system for Minecraft battle pass" (Ghe's real mc-battlepass project)
8. **Start tiny** — 3-step CTA (one rule in AGENTS.md / one sensor / repeat)
9. **Closing** (dark) — thesis + links + "Salamat! — questions?"

### Design system (KEEP — Ghe loves this)
Claude/Anthropic aesthetic, explicitly requested:
- Colors: ivory `#F0EEE6`, paper `#FAF9F5`, ink `#262624`, clay/terracotta `#D97757`, clay-deep `#C4633F`, muted `#7A776E`, line `#DAD5C9`
- Fonts (Google): **Source Serif 4** (display, Tiempos-ish), **Inter** (body), **JetBrains Mono** (eyebrows/labels)
- Motif: Claude-style ✳ spark (custom SVG path, id `#sparkShape`), slow 80s rotation
- Paper grain: SVG feTurbulence noise overlay on every slide (`.slide::after`, opacity .05 light / .09 soft-light dark)
- Icons: inline Lucide-style SVG symbols (no deps)
- Eyebrow labels: mono, letter-spaced, uppercase, clay color
- NO accent bars/stripes/underlines. Whitespace does the work.

### Interaction/nav
- ←/→/space/PgUp/PgDn navigate; Home/End; **N** toggles speaker notes (in `data-notes` attrs, with per-slide timings); **F** fullscreen; click right/left thirds navigate
- **Crossfade transitions** (old slide stays as `.leaving` under incoming `.active`) — fixed an earlier bug where dark body bg flashed between light slides. Body bg = ivory. Don't regress this.
- Entrance animations (`.fx` fadeUp / `.pop`) with `--d` delay vars, restart on slide re-entry (display:none → flex). `prefers-reduced-motion` respected.
- Simulator clicks are `stopPropagation`-guarded from deck nav (`.sim-wrap` check in click handler).

### Known placeholders in the deck
- Slide 7 grilling questions marked `[placeholder — swap in real grill]` — Ghe will run a REAL /sonata-grill and the transcript replaces these.
- "8 minutes" byline on title — confirm.
- Speaker notes contain timing guidance; total budget 8–10 min.

---

## 4. IDEA IN EXPLORATION: PIXEL PLAZA (⚠️ NOT FINALIZED — do not build without Ghe's go)

**Status: brainstorm only.** Ghe likes the direction but has NOT committed. The reveal concept ("audience app + deck = one Sonata-built application") is the appealing core; the exact interactivity format is still open. Alternatives floated and not ruled out: simple trust poll + triage vote (no plaza), a 60-second arcade game + leaderboard, or something else entirely. Ghe may also decide the interactive app is out of scope for this talk.

**Claude Code: your first job is to help Ghe finalize the concept and scope — not to scaffold anything.** Everything below is the current best-sketch of the plaza idea, kept so context isn't lost.

Sketch: merge "walkable characters" with "voting" → **walking IS the voting.** Kahoot mechanics, Pokémon skin. Very gisketch-brand (pixel/CLI aesthetic, game dev background).

### Experience flow
1. **Join (slide 1/2):** QR on deck → phone opens join page → pick 1 of ~8 preset pixel sprites → character appears in a "plaza" rendered ON THE DECK (projector). Phone = controller.
2. **Ambient wander:** characters can move around the plaza while Ghe talks (cold-open energy, no instructions needed).
3. **Question moments:** plaza floor splits into labeled zones. Deck shows a question, e.g.:
   - **Trust Meter (early, slide 2):** "AI writes a 40-file diff — how much do you trust it without reading everything?" zones: low/mid/high (or 0–100 slider fallback)
   - **Triage Vote (slide 7):** "Add a daily quest system to the battle pass — Trivial / Normal / Complex?" → walk into a zone → countdown → zone counts glow → Ghe runs the simulator on the winning answer.
4. **The Reveal (before closing):** "The deck, the plaza, the little guy you walked around — one application, built through Sonata." Show receipts: grill transcript, spec/ticket screenshots, sensor failures + self-fixes.

### Architecture (boring on purpose — keep it this way)
- **One Node server** (Express + `ws`), single process:
  - `/` → presenter deck (the existing harness-talk.html, extended)
  - `/join` → phone client (sprite picker + joystick/D-pad + zone UI)
  - WS: presenter is source of truth for slide/question state; phones send inputs; server aggregates positions/votes and broadcasts
- **In-memory state only.** No DB. App lives for 10 minutes. Fragile is fine.
- **Server owns truth** (positions, votes, timers) — this rule is literally quoted in the talk, honor it.
- ~30 concurrent users max. Office wifi is risk #1 → deploy behind **Cloudflare Tunnel** on Ghe's VPS "bedrock" (Ubuntu 24.04, Singapore) so phones can use mobile data. (Verify current VPS state before relying on it.)
- **Offline fallback:** deck must work standalone with faked poll data if connectivity dies mid-talk.

### Scope tiers (pick based on talk date — ASK GHE THE DATE FIRST)
- **Teleport mode (talk is imminent, ~4–6h):** no joystick — phone shows zone buttons, character hops/teleports to zone with a little animation. 80% of charm, 40% of work.
- **Joystick mode (weekend available, ~8–12h):** virtual joystick/D-pad, ~10–15 tick/s server-authoritative movement, lerped rendering on deck.

### Proposed hard cuts (if the plaza happens)
- ❌ No collision, no chat, no free-text input (buttons/zones/slider only — no moderation risk)
- ❌ No names/accounts — sprite = identity, anonymous sessions
- ❌ No reconnection logic, no persistence
- ❌ No multiplayer game/leaderboard (stretch ONLY if everything ships early)
- ❌ One map, one screen. Sprites from a free pixel pack if drawing them exceeds 30 min.

### Build-through-Sonata requirement (IMPORTANT — applies to whatever app gets chosen, if any)
Whatever gets built MUST go through the Sonata workflow, because the artifacts ARE slide content:
1. Start with `/sonata-grill` on the plaza app (complex tier). Save the transcript → replaces slide 7 placeholder AND feeds the reveal.
2. Keep spec + ticket → screenshots for the reveal slide.
3. Log real sensor failures/self-fixes during implementation (300-line splits, skylos catches) → reveal receipts.

### Deck integration work needed
- New/updated slides: QR join slide (or QR embedded in slide 1–2), live Trust Meter visualization on slide 2, live triage vote wired into slide 7 tabs, a **Reveal slide** (receipts layout) before "Start tiny".
- Plaza canvas rendered on deck (probably a dedicated slide or a persistent corner widget — Ghe to decide; corner widget risks distraction, dedicated moments are safer).
- Keep all existing design tokens, motion language, grain, spark motif.

---

## 5. GHE CONTEXT CLAUDE CODE SHOULD KNOW

- Stack comfort: TypeScript/React/Vite/Svelte, Node/Express, WS; game dev background (Unity, AoTTG 2 lead web dev); pixel art is on-brand (portfolio = noir grayscale + green accents, pixel/CLI influence — but THIS deck is Claude-branded, keep it Claude-branded).
- Hardware/infra: M1 MacBook Pro (dev), VPS "bedrock" (HostHatch, Ubuntu 24.04), knows Cloudflare Tunnel, Docker/Compose.
- The Minecraft battle pass (`gisketch/mc-battlepass`) is a real project — the simulator's "daily quest system" example references it.
- Working style: give concrete verdicts, call out overengineering, never recommend heavy infra for a 10-minute app. One next action at a time. Challenge optimistic time estimates.
- Known bottleneck: too many projects + hyperfocus at expense of sleep. If scope creeps, cut features, don't extend hours. Hard-cap "juice/polish" passes at 30 min.

---

## 6. OPEN QUESTIONS (resolve with Ghe FIRST — these gate everything)

1. **Is there an interactive audience app at all?** Plaza / simple polls / arcade game / none — UNDECIDED. The plaza is just the current favorite idea.
2. **Talk date?** → determines how ambitious any concept can be.
3. If an app happens: which reveal moments matter most? (The reveal is the appealing core; the input format is negotiable.)
4. If plaza specifically: teleport vs joystick · dedicated slide moments vs corner widget · zone-walk vs slider for trust meter · sprite art source (own, 30-min cap, or free pack).
5. Real grill transcript — Ghe runs `/sonata-grill` and pastes results into slide 7 (needed regardless of the app decision).
6. Confirm "8 minutes" vs "10 minutes" on title byline.

---

## 7. FIRST ACTIONS FOR CLAUDE CODE (in order)

1. **Do NOT scaffold anything yet.** First: ask the talk date, then help Ghe finalize the concept — no app / simple polls / plaza / other. Give honest time costs (deck-only ≈ 0h · polls ≈ 4–6h · teleport plaza ≈ 4–6h + poll work · joystick plaza ≈ 8–12h) and challenge optimistic estimates.
2. Once decided: write a short scope-lock (features in / out) and get Ghe's yes.
3. Only then scaffold. If building, get the loop working end-to-end UGLY first (QR → join → one input round-trips to the deck). Polish nothing until that works.
4. Wire deck integrations with offline-fallback fakes.
5. Reveal slide last — and only if an app exists to reveal.
