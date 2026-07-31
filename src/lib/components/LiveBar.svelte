<script lang="ts">
  import { presenter } from '../net/presenter.svelte'

  const counts = $derived(
    ['rock', 'paper', 'scissors'].map((t) => ({
      team: t,
      n: presenter.players.filter((p) => p.pick === t).length,
    })),
  )
</script>

{#if presenter.live}
  <div class="livebar" class:offline={!presenter.connected}>
    <span class="dot"></span>
    <span>{presenter.liveCount} connected</span>
    {#if presenter.phase === 'pick'}
      {#each counts as c (c.team)}
        <span class="team">{c.team === 'rock' ? '🪨' : c.team === 'paper' ? '📄' : '✂️'} {c.n}</span>
      {/each}
    {/if}
  </div>
{/if}

<style>
  .livebar {
    position: fixed; bottom: 1.1rem; left: 50%; transform: translateX(-50%); z-index: 10;
    display: flex; align-items: center; gap: 0.5em; font-family: var(--mono);
    font-size: 0.72rem; color: var(--muted); user-select: none; letter-spacing: 0.08em;
  }
  .dot { width: 0.55rem; height: 0.55rem; border-radius: 50%; background: var(--clay); }
  .offline .dot { background: var(--line); }
  .team { color: var(--ink-soft); }
</style>
