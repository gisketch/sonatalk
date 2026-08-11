# Interactive concept slides — sensors as live simulations

Date: 2026-08-11 · Status: proposed (awaiting go)

## Problem & Desired Outcome

Slides 5 (Sensors) and 6 (Documentation) are static cards — the talk's core concepts get
the least engaging treatment while the games get all the motion. Each sensor should be
*shown doing its job*, not described: a file arrives, the sensor judges it, the agent
reads the error and fixes itself. Presenter-paced, fun, and instantly understandable
from the back of the room.

## Design (recommended)

**One shared metaphor: the sensor gate.** Every sensor act is the same three-beat loop
the whole talk teaches — attempt → error the agent can read → self-correct → pass.
The deck plays it as a mini-simulation; the error is shown as a REAL terminal line
(reuse the simulator's `.term` styling — visual continuity with slide 9).

### Slide 5 · Sensors — three acts, presenter-clicked

A single stage area + the three sensor cards as tabs. Clicking advances steps
(same guarded-click pattern as the sim). Each act ≈ 4 clicks:

1. **300-line gate**
   - file card `Tools.svelte` slides in, line-counter ticks up… blows past 300 → 347
   - gate stamps ✗ · terminal: `✗ source file exceeds 300 lines: Tools.svelte (347)`
   - card SPLITS into `Tools.svelte (198)` + `ToolPresets.svelte (149)` (the agent read
     the error — this literally happened building tonight's app)
   - re-scan → ✓ green stamp
2. **scc complexity**
   - card shows a nesting pyramid (`if { for { if { … }`), complexity meter climbs
   - ✗ `complexity 24 > 15: applyRules()` → pyramid flattens (early returns) → ✓
3. **skylos dead code**
   - card with three function chips; one fades to a 👻 ghost
   - ✗ `unused function: applyDiscount()` → ghost dissolves → ✓

Footline stays: "every check speaks in errors the agent can act on" — now demonstrated
three times instead of asserted.

### Slide 6 · Documentation — the before/after toggle

Split stage, same prompt on both sides ("add refunds to payments"):
- **without docs**: agent invents `RefundManager2.ts` in the wrong folder, new parallel
  pattern (red-tinted, wrong)
- presenter clicks **"load the docs"** → `architecture.md` `conventions.md` chips fly
  into the agent's context window
- **with docs**: same prompt now lands in `payments/refunds.ts`, follows the house
  pattern (green-tinted)

One click, one punchline: docs are executable context — the diff changes because the
context changed.

### Slide 4 · Sonata "My Harness" — the two-lane machine (approved, build next)

For the visual learners: the two cards become one continuously-running assembly line —
no clicks, it just breathes while the presenter talks (45s beat).

- **Top lane — SKILLS THAT BUILD (feedforward, clay):** an idea chip travels through
  four stamped stations — `grill → spec → tickets → implement` — each station lights and
  stamps it as it passes; out the end drops a `code` box. Loops.
- **Bottom lane — CHECKS THAT VALIDATE (feedback, ink):** the code box rides through
  three scanner arches — `lint · tests · 300-gate` — each arch sweeps a scan beam and
  pops a ✓; out the end: a **trusted diff** card with a small crown-of-checks.
- The two lanes connect: build lane output feeds the check lane input — one machine,
  two halves, matching slide 3's vocabulary (clay = feedforward, ink = feedback).
- Implementation: SMIL/CSS loop like FlowSlide's traveling pulses (rAF-proof); one new
  component; existing card copy moves into two compact lane labels + footline.

## In Scope

- Rebuild `SensorsSlide` as the 3-act gate simulation (new components under
  `src/lib/sensors/`, shared `SensorGate` stage; 300-line gate applies to us too).
- Rebuild `DocsSlide` with the before/after toggle.
- Click-guard classes so stepping never navigates the deck; `N`-notes updated;
  phone-script sections 5 & 6 rewritten to the new beats.
- Pure deck-side; no server or phone changes. `fx` entrances; SFX optional
  (gate stamp = existing pop sound).

## Out of Scope

- Other slides (Sonata slide 4 mini-flow, Skills slide) — park until these two land.
- Real scc/skylos output parsing — the acts are scripted vignettes of real behavior.

## Acceptance Criteria

1. Sensors slide: presenter clicks through all three acts; each shows attempt →
   terminal error → self-correction → pass; deck navigation still works outside the
   stage; total ≤ ~12 clicks.
2. Docs slide: one toggle flips the split view; both states readable at 1280×720.
3. No overflow at 16:9; `svelte-check` clean; size gate green.
4. Phone script sections 5–6 match the new click choreography.

## Risks / Open Questions

- Click-count budget: 12 clicks of choreography can stall a nervous presenter — every
  act must also allow "click fast, animations catch up".
- Terminal text must be readable from the back → min font-size floor, not clamp-only.
