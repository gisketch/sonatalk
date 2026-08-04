import type { Component } from 'svelte'
import TitleSlide from './slides/TitleSlide.svelte'
import AmnesiaSlide from './slides/AmnesiaSlide.svelte'
import WhatIsSlide from './slides/WhatIsSlide.svelte'
import BeliefsSlide from './slides/BeliefsSlide.svelte'
import RouterSlide from './slides/RouterSlide.svelte'
import GrillSlide from './slides/GrillSlide.svelte'
import SpecSlide from './slides/SpecSlide.svelte'
import TicketsSlide from './slides/TicketsSlide.svelte'
import ImplementSlide from './slides/ImplementSlide.svelte'
import FixSlide from './slides/FixSlide.svelte'
import ReviewSlide from './slides/ReviewSlide.svelte'
import StartSlide from './slides/StartSlide.svelte'
import GatesSlide from './slides/GatesSlide.svelte'
import MaintainSlide from './slides/MaintainSlide.svelte'
import WhyWorksSlide from './slides/WhyWorksSlide.svelte'
import CheatSlide from './slides/CheatSlide.svelte'
import ClosingSlide from './slides/ClosingSlide.svelte'

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
      "30s. This is the KT for Sonata itself — not the theory talk. By the end everyone should know how to work in a Sonata repo and how to start one.",
  },
  {
    component: AmnesiaSlide,
    notes:
      '1 min. The framing analogy — contractor with amnesia. Every agent session forgets everything. The only cure is knowledge that lives in the repo. Sonata = the house manual.',
  },
  {
    component: WhatIsSlide,
    notes:
      "1.5 min. Demystify: it's ONE npx command and a handful of files. No SaaS, no lock-in — delete the files and it's gone. Land the name: musicians change (Claude, Codex, Copilot), sheet music stays.",
  },
  {
    component: BeliefsSlide,
    notes:
      '1.5 min. The three beliefs everything else derives from. Repo = truth (chat and trackers are not memory). Guides + checks (feedforward/feedback, from the first talk). Ceremony scales with risk — typo vs payment flow. Mention the 300-line gate.',
  },
  {
    component: RouterSlide,
    notes:
      "2 min. THE usage slide. You never memorize workflows — describe the outcome in plain language and /sonata-work routes: trivial → just do it; broken → fix; clear → implement; fuzzy → the full grill→spec→tickets→implement→review chain. Emphasize: it SKIPS stages that add no confidence.",
  },
  {
    component: GrillSlide,
    notes:
      '2 min. Grill = the architect interview. One question per turn, ALWAYS with a recommendation + tradeoff — so answering is easy. It looks up facts itself; it only asks decisions. Point at the sample turn. No code gets written during a grill.',
  },
  {
    component: SpecSlide,
    notes:
      "1.5 min. Spec = the contract. Point at the sample: acceptance criteria are OBSERVABLE — 'reappears within 2s', not 'refactor the store'. Length follows risk; a tiny change gets a tiny spec. It survives sessions — that's the point.",
  },
  {
    component: TicketsSlide,
    notes:
      '1.5 min. The cake analogy. Layer-by-layer = nothing to taste until the end. Vertical slice = every layer of ONE behavior, demoable on its own. Blocked-by edges give the order. Each ticket sized for one fresh agent context.',
  },
  {
    component: ImplementSlide,
    notes:
      '1.5 min. Implementation is deliberately boring: read spec + quality.md, pick the risk lane, reuse before inventing, check while working. Terminal shows the agent running its own gate. Punchline: same failure twice → harness gains a rule.',
  },
  {
    component: FixSlide,
    notes:
      "1.5 min. Fix = detective before mechanic. Evidence first, one falsifiable hypothesis at a time, and a stop-rule: three failed hypotheses means grill the architecture with a human. This is the anti-'just try another patch' loop.",
  },
  {
    component: ReviewSlide,
    notes:
      '1.5 min. Three lenses kept separate so findings stay honest: standards, spec compliance (requirement quoted), behavior evidence. P0–P3 ranking with file:line and smallest credible fix. Review never edits.',
  },
  {
    component: StartSlide,
    notes:
      '1.5 min. How to bring it home: greenfield = init + setup interview; existing repo = init + retrofit, which READS deeply before asking and never clobbers existing docs. Readiness gate blocks building on a half-configured harness.',
  },
  {
    component: GatesSlide,
    notes:
      '1.5 min. The sensors: check-sonata.sh (structure + 300-line gate), SCC (complexity ceilings from your own 75th percentile), Skylos (security/secrets on changed code only). All opt-in, all version-pinned.',
  },
  {
    component: MaintainSlide,
    notes:
      '1 min. Service days: audit = full inspection that ends in a plan, changes nothing. Upgrade = checksummed recall that treats your modified files as conflicts, never casualties. Neither acts without approval.',
  },
  {
    component: WhyWorksSlide,
    notes:
      '1.5 min. The why: memory compounds, mistakes become infrastructure, process stays right-sized so people actually use it. Close the loop: models get swapped, the harness compounds.',
  },
  {
    component: CheatSlide,
    notes:
      "1 min. The take-home. If they remember one line: describe the outcome, type /sonata-work, answer one question at a time. Everything else on this slide is for the 10% of days that aren't that.",
  },
  {
    component: ClosingSlide,
    dark: true,
    notes: '30s. Thesis line, repo link, the one-liner to try it tonight. Questions.',
  },
]
