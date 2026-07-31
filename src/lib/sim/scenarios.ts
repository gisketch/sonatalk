/** Workflow simulator scripts — ported verbatim from the reference deck. */
const CHECK = '<svg class="icon"><use href="#i-check"/></svg>'
const XI = '<svg class="icon"><use href="#i-x"/></svg>'
const EYE = '<svg class="icon"><use href="#i-eye"/></svg>'

export type ScenarioKey = 'trivial' | 'normal' | 'complex'

export interface Step {
  who: 'user' | 'ai' | 'sys'
  stage: number
  html: string
}

export interface Scenario {
  title: string
  pipe: string[]
  steps: Step[]
}

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  complex: {
    title: 'sonata · complex feature',
    pipe: ['grill', 'spec', 'ticket', 'implement', 'validate', 'review'],
    steps: [
      { who: 'user', stage: -1, html: '<span class="cmd">/sonata-grill</span> — add a daily quest system to the Minecraft battle pass' },
      { who: 'ai', stage: 0, html: 'Complex tier detected. Before I touch code, I need answers — <b>15 questions</b>. A taste:<ul><li>Quests reset per-player, or server-wide at midnight?</li><li>Rewards: battle-pass XP, items, or both?</li><li>Do dailies stack with weekly quests?</li><li>Offline all day — does yesterday backfill?</li></ul><span class="more">…11 more questions [placeholder — swap in real grill]</span>' },
      { who: 'user', stage: 0, html: 'Per-player reset · XP only · stacks with weeklies · no backfill' },
      { who: 'ai', stage: 1, html: '<div class="status"><div>' + CHECK + '<b>SPEC.md</b> drafted from your answers</div><div>' + CHECK + 'scope · edge cases · non-goals · acceptance criteria</div></div><span class="review-chip">' + EYE + 'human review — approve the spec</span>' },
      { who: 'ai', stage: 2, html: '<div class="status"><div>' + CHECK + '<b>ticket</b> created, scoped to the spec</div><div>' + CHECK + 'no scope drift — the ticket <b>is</b> the contract</div></div><span class="review-chip">' + EYE + 'human review — approve the ticket</span>' },
      { who: 'ai', stage: 3, html: 'Implementing…<div class="status"><div>' + CHECK + 'quest scheduler + reset logic</div><div>' + CHECK + 'XP grants wired to server state</div><div>' + CHECK + 'tests written</div></div><span class="more">server owns truth — the LLM never holds game state</span>' },
      { who: 'ai', stage: 4, html: 'Sensors fired:<div class="status"><div class="bad">' + XI + 'quest_manager.ts → 340 lines</div><div>' + CHECK + 'split into 3 modules</div><div class="bad">' + XI + 'skylos → dead handler left behind</div><div>' + CHECK + 'removed</div><div>' + CHECK + '<b>all green</b> — 2 self-fixes, zero of my time</div></div>' },
      { who: 'ai', stage: 5, html: 'Ready. <em>One focused pass on a diff that already survived the gauntlet.</em><span class="review-chip">' + EYE + 'human review — the diff</span>' },
      { who: 'sys', stage: 5, html: 'Full gauntlet: grill → spec → ticket → implement → validate → review&ensp;↺&ensp;pick another task' },
    ],
  },
  normal: {
    title: 'sonata · normal feature',
    pipe: ['spec', 'implement', 'validate', 'review'],
    steps: [
      { who: 'user', stage: -1, html: 'add a <span class="cmd">/quests</span> command that lists a player’s active quests' },
      { who: 'ai', stage: 0, html: 'Normal tier — no grilling needed. Light spec:<div class="status"><div>' + CHECK + 'chat command, paginated list</div><div>' + CHECK + 'shows progress per quest</div><div>' + CHECK + 'reuses existing quest store</div></div><span class="review-chip">' + EYE + 'quick nod from you</span>' },
      { who: 'user', stage: 0, html: 'lgtm, go' },
      { who: 'ai', stage: 2, html: '<div class="status"><div>' + CHECK + 'implemented + tests</div><div class="bad">' + XI + 'sensor: unused import</div><div>' + CHECK + 'fixed — all green, 1 self-fix</div></div>' },
      { who: 'ai', stage: 3, html: 'Done — small diff, easy review.<span class="review-chip">' + EYE + 'human review — the diff</span>' },
      { who: 'sys', stage: 3, html: 'Right-sized ceremony. Not everything needs a spec doc.&ensp;↺' },
    ],
  },
  trivial: {
    title: 'sonata · trivial change',
    pipe: ['implement', 'validate'],
    steps: [
      { who: 'user', stage: -1, html: 'change the XP bar color to gold' },
      { who: 'ai', stage: 1, html: 'Trivial — just doing it.<div class="status"><div>' + CHECK + 'one-line change</div><div>' + CHECK + 'sensors green on first pass</div></div>' },
      { who: 'sys', stage: 1, html: 'No ceremony for small things. <em>Speed where it’s safe, rigor where it’s not.</em>&ensp;↺' },
    ],
  },
}

export const TABS: Array<{ key: ScenarioKey; icon: string; label: string; blurb: string }> = [
  { key: 'trivial', icon: 'i-zap', label: 'Trivial', blurb: 'change a color, rename a thing — just do it' },
  { key: 'normal', icon: 'i-sliders', label: 'Normal', blurb: 'small feature — light spec, then build' },
  { key: 'complex', icon: 'i-grill', label: 'Complex', blurb: 'real feature — full gauntlet, grilling first' },
]

/**
 * Live mode: chronological trivial → normal → complex. Each scenario's completion
 * ships a real feature to the audience's phones (the phase to advance to).
 */
export const LIVE_ORDER: ScenarioKey[] = ['trivial', 'normal', 'complex']

export const LIVE_SHIPS: Record<ScenarioKey, string> = {
  trivial: 'names',
  normal: 'canvas',
  complex: 'tools',
}

export const LIVE_SCENARIOS: Record<ScenarioKey, Scenario> = {
  trivial: {
    title: 'sonata · trivial change',
    pipe: ['implement', 'validate'],
    steps: [
      { who: 'user', stage: -1, html: 'add a name input so the audience can join in' },
      { who: 'ai', stage: 0, html: 'Trivial — just doing it.<div class="status"><div>' + '<svg class="icon"><use href="#i-check"/></svg>' + 'one input, one message type</div><div>' + '<svg class="icon"><use href="#i-check"/></svg>' + 'sensors green on first pass</div></div>' },
      { who: 'sys', stage: 1, html: 'Shipping to your phones… <em>check your screens.</em>' },
    ],
  },
  normal: {
    title: 'sonata · normal feature',
    pipe: ['spec', 'implement', 'validate', 'review'],
    steps: [
      { who: 'user', stage: -1, html: 'give everyone a canvas — <span class="cmd">draw your character</span>' },
      { who: 'ai', stage: 0, html: 'Normal tier — light spec:<div class="status"><div>' + '<svg class="icon"><use href="#i-check"/></svg>' + 'touch canvas, one black brush</div><div>' + '<svg class="icon"><use href="#i-check"/></svg>' + 'fixed paper background</div><div>' + '<svg class="icon"><use href="#i-check"/></svg>' + 'PNG export for later</div></div><span class="review-chip">' + '<svg class="icon"><use href="#i-eye"/></svg>' + 'quick nod from you</span>' },
      { who: 'user', stage: 0, html: 'lgtm, go' },
      { who: 'ai', stage: 2, html: '<div class="status"><div>' + '<svg class="icon"><use href="#i-check"/></svg>' + 'implemented + tests</div><div>' + '<svg class="icon"><use href="#i-check"/></svg>' + 'all green</div></div>' },
      { who: 'sys', stage: 3, html: 'Shipping to your phones… <em>start drawing.</em>' },
    ],
  },
  complex: {
    title: 'sonata · complex feature',
    pipe: ['grill', 'spec', 'ticket', 'implement', 'validate', 'review'],
    steps: [
      { who: 'user', stage: -1, html: '<span class="cmd">/sonata-grill</span> — real drawing tools: colors, fill, brush sizes' },
      { who: 'ai', stage: 0, html: 'Complex tier detected. Questions first:<ul><li>Fill = flood on tap — undo needed?</li><li>How many colors read well on paper?</li><li>Do tools drop mid-drawing without wiping it?</li></ul><span class="more">[placeholder — swap in real grill]</span>' },
      { who: 'user', stage: 0, html: 'single undo · 5 colors · never wipe the canvas' },
      { who: 'ai', stage: 1, html: '<div class="status"><div>' + '<svg class="icon"><use href="#i-check"/></svg>' + '<b>SPEC.md</b> drafted</div></div><span class="review-chip">' + '<svg class="icon"><use href="#i-eye"/></svg>' + 'human review — approve the spec</span>' },
      { who: 'ai', stage: 3, html: 'Implementing…<div class="status"><div>' + '<svg class="icon"><use href="#i-check"/></svg>' + 'palette · fill · brush sizes</div><div class="bad">' + '<svg class="icon"><use href="#i-x"/></svg>' + 'tools panel → 340 lines</div><div>' + '<svg class="icon"><use href="#i-check"/></svg>' + 'split into 3 modules</div></div>' },
      { who: 'ai', stage: 5, html: 'Ready. <em>Diff already survived the gauntlet.</em><span class="review-chip">' + '<svg class="icon"><use href="#i-eye"/></svg>' + 'human review — the diff</span>' },
      { who: 'sys', stage: 5, html: 'Shipping to your phones… <em>full toolkit unlocked.</em>' },
    ],
  },
}
