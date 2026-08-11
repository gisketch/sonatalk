<script lang="ts">
  import type { Team } from './rps'

  const KILL_LINES: Record<Team, string[]> = {
    rock: [
      '🪨 {k} flattens {v}', '🪨 {k} demolishes {v}', '🪨 {v} got bonked by {k}',
      '🪨 {k} rocks {v} to sleep', '🪨 {v} is now a pancake, courtesy of {k}',
    ],
    scissors: [
      '✂️ {k} cuts {v} to ribbons', '✂️ {k} snips {v} in passing', '✂️ {v} got a haircut from {k}',
      '✂️ {k} runs with scissors, {v} pays', '✂️ {k} shreds {v} like old receipts',
    ],
    paper: [
      '📄 {k} gift-wraps {v}', '📄 {v} buried under {k}’s paperwork', '📄 {k} files {v} away forever',
      '📄 {k} folds {v} into origami', '📄 {v} got a papercut from {k}. fatal.',
    ],
  }
  const MOD_LINES = ['💨 {v} vanished mysteriously', '🕳️ {v} fell in a hole', '⚡ {v} was struck by lightning']

  let feed = $state<Array<{ n: number; text: string }>>([])
  let feedN = 0

  /** Called by the arena per elimination; killer null = presenter kill-switch. */
  export function announce(
    victim: { name: string },
    killer: { name: string; team: Team } | null,
  ) {
    const line = killer
      ? KILL_LINES[killer.team][Math.floor(Math.random() * KILL_LINES[killer.team].length)]
      : MOD_LINES[Math.floor(Math.random() * MOD_LINES.length)]
    const n = ++feedN
    feed = [...feed, { n, text: line.replace('{k}', killer?.name ?? '?').replace('{v}', victim.name) }].slice(-5)
    setTimeout(() => (feed = feed.filter((f) => f.n !== n)), 4_500)
  }
</script>

{#if feed.length}
  <div class="killfeed">
    {#each feed as f (f.n)}
      <div class="kill">{f.text}</div>
    {/each}
  </div>
{/if}

<style>
  .killfeed {
    position: absolute; top: 0.9rem; right: 0.9rem; display: flex; flex-direction: column;
    align-items: flex-end; gap: 0.35rem; pointer-events: none; max-width: 46%;
  }
  .kill {
    font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.03em; color: var(--ink-soft);
    background: rgba(250, 249, 245, 0.94); border: 1px solid var(--line); border-radius: 999px;
    padding: 0.32rem 0.75rem; box-shadow: 0 3px 12px rgba(38, 38, 36, 0.1);
    animation: killIn 0.38s cubic-bezier(0.2, 1.6, 0.4, 1);
  }
  @keyframes killIn {
    0% { transform: translateX(24px) scale(0.6); opacity: 0; }
    60% { transform: translateX(-4px) scale(1.06); opacity: 1; }
    100% { transform: translateX(0) scale(1); }
  }
</style>
