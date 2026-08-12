import type { Component } from 'svelte'
import TitleSlide from './slides/TitleSlide.svelte'
import ProblemSlide from './slides/ProblemSlide.svelte'
import FlowSlide from './slides/FlowSlide.svelte'
import SonataSlide from './slides/SonataSlide.svelte'
import SensorsSlide from './slides/SensorsSlide.svelte'
import DocsSlide from './slides/DocsSlide.svelte'
import AnatomySlide from './slides/AnatomySlide.svelte'
import BattleSlide from './slides/BattleSlide.svelte'
import QRSlide from './slides/QRSlide.svelte'
import RevealSlide from './slides/RevealSlide.svelte'
import SimulatorSlide from './slides/SimulatorSlide.svelte'
import SkillsSlide from './slides/SkillsSlide.svelte'
import HumansSlide from './slides/HumansSlide.svelte'
import StartTinySlide from './slides/StartTinySlide.svelte'
import ClosingSlide from './slides/ClosingSlide.svelte'
import GameSlide from './slides/GameSlide.svelte'
import RaceSlide from './slides/RaceSlide.svelte'
import GauntletSlide from './slides/GauntletSlide.svelte'
import ChampionsSlide from './slides/ChampionsSlide.svelte'

export interface SlideDef {
  component: Component
  dark?: boolean
  notes: string
}

export const slides: SlideDef[] = [
  {
    component: TitleSlide,
    dark: true,
    notes:
      "30s. Hi — quick one. Agents write code fast now. This talk is about the part nobody demos: trusting what they write.",
  },
  {
    component: ProblemSlide,
    notes:
      "45s. Land the pain. Everyone's felt this — agent produces a 40-file diff, and now YOU are the bottleneck. Pause after the bold line.",
  },
  {
    component: FlowSlide,
    notes:
      '2 min. THE concept. Feedforward = guides, steer BEFORE it acts. Feedback = sensors, catch AFTER — and errors loop straight back so the agent self-corrects before a human ever looks. Watch the dots: work flows right, feedback flows back. Punchline: only-sensors = repeats mistakes forever; only-guides = you never learn if the rules worked.',
  },
  {
    component: SonataSlide,
    notes:
      "45s. One machine, running by itself — trace it with your hand. TOP lane (clay, feedforward): an idea gets stamped through grill → spec → tickets → implement, and comes out the far end as CODE. It turns the corner and rides the BOTTOM lane (feedback) back through lint → tests → the 300-line gate, and what drops out is a TRUSTED diff. Two halves, one loop. Grown on real work: every repeated mistake became a station or an arch.",
  },
  {
    component: SensorsSlide,
    notes:
      "1.5-2 min INTERACTIVE. Click the stage to run each sensor: attempt → terminal error → self-correct → pass (4 clicks per act, 3 acts). 300-line: file blows past the limit, agent SPLITS it (say: this literally happened building tonight's app). scc: nesting flattens. skylos: the ghost dissolves. Fast-clicking is safe. Land the pattern line at the end.",
  },
  {
    component: DocsSlide,
    notes:
      "1 min INTERACTIVE. Left pane: agent alone invents RefundManager2 in the wrong folder. ONE click ('load the docs') — chips fly into context, right pane lands in payments/ following the house pattern. Punchline: same model, same prompt, the DIFF changed because the CONTEXT changed.",
  },
  {
    component: SkillsSlide,
    notes:
      "1 min. Land skills for the devs in the room: it's a markdown file the agent loads on demand — what (a checklist it follows), how (slash command or auto-trigger via description), when (anything you explain twice). Point at the example: 20 lines, whole team gets your best workflow. Every Sonata step tonight is literally a skill. Segue: enough theory — phones out.",
  },
  {
    component: HumansSlide,
    notes:
      "1 min INTERACTIVE. The counterweight — everything so far runs without me, so am I still an engineer? Three places a human still touches the work: DESIGN before, DECIDE during, REVIEW after. ONE click ('take your hands off'): hands lift, the belt keeps the exact same speed, but 'you understood' freezes while 'diffs shipped' keeps climbing — the red gap is code nobody understands. Punchline: speed was never the problem, direction was. Click back before moving on.",
  },
  {
    component: QRSlide,
    notes:
      '1 min. The turn: phones out, scan, wait for the counter to climb. No instructions beyond the QR — the app is deliberately empty right now. When the number settles, move on. Hotkey O bails the next slide to the offline simulator if the room is empty.',
  },
  {
    component: SimulatorSlide,
    notes:
      "2.5 min LIVE. Chronological: trivial ships the name input (tell them to check their phones), normal ships the canvas, complex ships the full toolkit. Let each drop land before advancing. If anything smells wrong: press O, it becomes the offline demo. [Swap complex grill placeholder with the real grill transcript.]",
  },
  {
    component: BattleSlide,
    notes:
      "2 min. Button unlocks when everyone picked + placed. 'Show players' freezes them at their spawns — weapons secret. 'Start' reveals teams and they move. Clicking a sprite eliminates it — moderation kill-switch, use casually. Self-accelerates after 45s, ends by ~90s. Multiple survivors = stand-off → next round, survivors re-pick, until ONE champion. Then crown.",
  },
  {
    component: RevealSlide,
    notes:
      "1 min. THE reveal. Every drawing comes back. Point at the receipts: grill → specs → tickets → sensors firing mid-build. 'The app you just used was built the way this talk says to build.' Then Start Tiny.",
  },
  {
    component: AnatomySlide,
    notes:
      "1 min. Bring it down to earth: the harness is just files in the repo. Click AGENTS.md — the map. Click quality.md — the sensors. Click the grill record — tonight's app came from this. Dimmed entries exist too; these are the load-bearing ones. Segue: you can start with ONE of these files.",
  },
  {
    component: StartTinySlide,
    notes:
      "45s. The takeaway — everyone can start TODAY with step 1. Ten minutes. The whole practice: every repeated mistake becomes a guide or a sensor.",
  },
  {
    component: ClosingSlide,
    dark: true,
    notes:
      "30s. Close on the thesis line, drop the links, invite questions. If someone bites on 'company-wide' — great, seed planted.",
  },
  {
    component: GameSlide,
    notes:
      "POST-TALK GAME 1. Characters persist from the demo. 'Rematch — new game' revives everyone (incl. demo casualties); they re-pick weapon + spawn. Corner QR stays open: late joiners name + draw untimed, and the ready gate waits for them. Same arena rules: show players → start → sudden death → ONE champion. Crown = game-1 champion recorded (👑 strip). Then arrow to the race.",
  },
  {
    component: RaceSlide,
    notes:
      "POST-TALK GAME 2. The sprint: everyone lines up at the bottom, first to 150 alternating steps wins. 'Start the race' = synced 3-2-1 on all phones, then GO. Same-foot taps stumble (locked pads + shake). First to the line freezes the race → crown = game-2 champion recorded. Set TV DELAY once so the countdown matches the AirPlayed screen.",
  },
  {
    component: GauntletSlide,
    notes:
      "POST-TALK GAME 3 — the finale, best prize. One click starts it; rounds auto-run and accelerate. The command shows on BOTH the deck and every phone (revealed together on the server clock, TV delay included) — say 'play off your phone, watch the wall for carnage'. Phones: giant TAP pad for count commands, YES/NO for questions. Every correct answer scores; the round NOBODY gets ends it — top score wins, ties go to sudden death. Roasts + 🔥 streaks on the results beats. Crown → 'the podium'.",
  },
  {
    component: ChampionsSlide,
    notes:
      "THE PODIUM — final image of the night. All three champions dancing on the blocks (gauntlet champ center on the tall one), everyone else dancing below as the crowd, unlimited confetti. Hand out the prizes, take the group photo. M mutes sounds if needed.",
  },
]
