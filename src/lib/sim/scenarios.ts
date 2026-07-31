/**
 * Workflow demo scripts — chronological trivial → normal → complex.
 * One set for both modes: live mode ships each tier to the phones on completion,
 * offline (bail) mode plays the identical theater with no network.
 */
const CHECK = '<svg class="icon"><use href="#i-check"/></svg>'
const EYE = '<svg class="icon"><use href="#i-eye"/></svg>'

export type ScenarioKey = 'trivial' | 'normal' | 'complex'

export interface Step {
  who: 'user' | 'ai' | 'sys'
  stage: number
  html: string
}

export interface Scenario {
  title: string
  label: string
  pipe: string[]
  steps: Step[]
}

export const ORDER: ScenarioKey[] = ['trivial', 'normal', 'complex']

/** Phase each tier ships to the phones when its script completes (live mode). */
export const SHIPS: Record<ScenarioKey, string> = {
  trivial: 'names',
  normal: 'canvas',
  complex: 'tools',
}

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  trivial: {
    title: 'sonata · trivial change',
    label: 'Trivial',
    pipe: ['implement', 'validate'],
    steps: [
      { who: 'user', stage: -1, html: 'add a name input so the audience can join in with their name' },
      { who: 'ai', stage: 0, html: 'Trivial tier — one input, one message type, no state worth speccing. Doing it directly.<div class="status"><div>' + CHECK + '<b>NameGate.svelte</b> — input + submit, 24-char cap</div><div>' + CHECK + '<b>server</b> — <code>setName</code> guard: trim, reject empty, allow duplicates</div><div>' + CHECK + 'deck roster updates from the same snapshot</div></div>' },
      { who: 'ai', stage: 1, html: 'Sensors:<div class="status"><div>' + CHECK + 'svelte-check — 0 errors</div><div>' + CHECK + '300-line gate — biggest file 41 lines</div><div>' + CHECK + 'vitest — name rules covered (trim / cap / dupes)</div></div>No review needed at this size. <em>Speed where it’s safe.</em>' },
      { who: 'sys', stage: 1, html: 'Shipping to your phones… <em>check your screens.</em>' },
    ],
  },
  normal: {
    title: 'sonata · normal feature',
    label: 'Normal',
    pipe: ['spec', 'implement', 'validate', 'review'],
    steps: [
      { who: 'user', stage: -1, html: 'give everyone a drawing canvas — <span class="cmd">draw your character</span>' },
      { who: 'ai', stage: 0, html: 'Normal tier — worth a light spec before code:<ul><li>touch canvas, fixed paper background, one black brush</li><li>pointer events with capture — no scroll/zoom bleed mid-stroke</li><li>512px raster so the PNG export stays small later</li><li>non-goals: colors, fill, undo — that’s a bigger feature</li></ul><span class="review-chip">' + EYE + 'quick nod from you</span>' },
      { who: 'user', stage: 0, html: 'lgtm, go' },
      { who: 'ai', stage: 1, html: 'Implementing…<div class="term"><div class="add">+ create src/join/Canvas.svelte — pointer draw loop, 512×512 raster</div><div class="mut">~ wire DrawBoard to the phase change — mounts once, never remounts</div><div class="mut">~ touch-action: none — stroke can’t scroll the page</div></div>' },
      { who: 'ai', stage: 2, html: '<div class="term"><div class="cmd">npm run check</div><div class="ok">✓ 0 errors</div><div class="cmd">npx skylos</div><div class="err">✗ unused export: clearAll</div><div class="mut">~ removed</div><div class="ok">✓ all green — 1 self-fix, zero of my time</div></div>' },
      { who: 'ai', stage: 3, html: 'Small diff, one focused pass.<span class="review-chip">' + EYE + 'human review — the diff</span>' },
      { who: 'sys', stage: 3, html: 'Shipping to your phones… <em>start drawing.</em>' },
    ],
  },
  complex: {
    title: 'sonata · complex feature',
    label: 'Complex',
    pipe: ['grill', 'spec', 'ticket', 'implement', 'validate', 'review'],
    steps: [
      { who: 'user', stage: -1, html: '<span class="cmd">/sonata-grill</span> — real drawing tools: colors, fill tool, brush sizes' },
      { who: 'ai', stage: 0, html: 'Complex tier detected. Before I touch code, decisions.<br><b>Q1</b> — fill is flood-fill on tap. One stray thumb and someone’s whole character is orange. Undo: none, single-level, or full history?' },
      { who: 'user', stage: 0, html: 'single-level. keep it light, this runs on phones' },
      { who: 'ai', stage: 0, html: '<b>Q2</b> — how many colors? More looks generous but this is a 60-second timer; choice costs seconds. And whatever we pick has to read against the paper background.' },
      { who: 'user', stage: 0, html: '5 max. you pick the palette, contrast first' },
      { who: 'ai', stage: 0, html: '<b>Q3</b> — the drop lands mid-drawing. Replace the canvas component and their work is gone. Extend in place, or snapshot-and-restore?' },
      { who: 'user', stage: 0, html: 'NEVER wipe the canvas. extend in place' },
      { who: 'ai', stage: 1, html: 'Decisions locked. Here’s the spec — read before I write a line:<div class="doc"><div class="doc-name"><svg class="icon"><use href="#i-spec"/></svg>docs/specs/drawing-tools.md</div><div class="doc-body"><h5>Scope</h5><ul><li>5-color palette, contrast-checked against the paper background</li><li>flood fill on tap</li><li>3 brush sizes</li><li>single-level undo (covers a stray fill)</li></ul><h5>Acceptance</h5><ul><li>tools materialize mid-drawing — canvas pixels untouched</li><li>undo restores the exact pre-fill state</li><li>everything reachable with a thumb, one hand</li></ul><h5>Non-goals</h5><ul><li>eraser · layers · zoom — the toy stays a toy</li></ul></div></div><span class="review-chip">' + EYE + 'your call</span>' },
      { who: 'user', stage: 1, html: 'LG. tickets?' },
      { who: 'ai', stage: 2, html: '<div class="doc"><div class="doc-name"><svg class="icon"><use href="#i-spec"/></svg>docs/exec-plans/drawing-tools-tickets.md</div><div class="doc-body"><h5>T1 · tool panel UI</h5><ul><li>blocked by: none</li></ul><h5>T2 · flood fill + single undo</h5><ul><li>blocked by: T1</li></ul><h5>T3 · mid-drawing drop choreography</h5><ul><li>blocked by: T2 — the never-wipe acceptance lives here</li></ul></div></div><span class="review-chip">' + EYE + 'your call</span>' },
      { who: 'user', stage: 2, html: 'approved — build it' },
      { who: 'ai', stage: 3, html: 'Working…<div class="term"><div class="add">+ create src/join/Tools.svelte</div><div class="add">+ create src/join/Swatches.svelte</div><div class="mut">~ extend src/join/Canvas.svelte — fillAt(), undo snapshot</div><div class="cmd">npm run check</div><div class="ok">✓ 0 errors, 0 warnings</div><div class="cmd">./scripts/check-file-size.sh</div><div class="err">✗ source file exceeds 300 lines: Tools.svelte (340)</div></div>' },
      { who: 'ai', stage: 4, html: 'Sensor refused the file. Splitting — not arguing:<div class="term"><div class="mut">~ split → Tools.svelte · Swatches.svelte · SizeDock.svelte</div><div class="cmd">./scripts/check-file-size.sh</div><div class="ok">✓ file size ok</div><div class="cmd">npm test</div><div class="err">✗ undo loses pre-fill snapshot on rapid taps</div><div class="mut">~ snapshot before fill, not after — test added</div><div class="cmd">npm test</div><div class="ok">✓ 14/14 passed</div></div><span class="more">2 sensor catches, both fixed before any human looked</span>' },
      { who: 'ai', stage: 5, html: 'All green. <em>One focused pass on a diff that already survived the gauntlet.</em><span class="review-chip">' + EYE + 'review the diff</span>' },
      { who: 'sys', stage: 5, html: 'Shipping to your phones… <em>full toolkit unlocked.</em>' },
    ],
  },
}
