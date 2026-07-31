<script lang="ts">
  import { presenter } from '../net/presenter.svelte'

  interface Connected {
    connected?: boolean
  }

  const roster = $derived(
    presenter.players.filter((p) => (p as typeof p & Connected).connected),
  )
  const ready = $derived(roster.filter((p) => p.ready))
  const notReady = $derived(roster.filter((p) => !p.ready))
  const visible = $derived(presenter.live && presenter.phase === 'pick')
</script>

{#if visible}
  <div class="ready-panel">
    <div class="count">
      <b>{ready.length}</b> ready · {roster.length} connected
    </div>
    {#if notReady.length}
      <div class="waiting">
        <span class="wlabel">waiting for</span>
        {#each notReady as p (p.id)}
          <span class="wname">{p.name ?? 'anon'}</span>
        {/each}
      </div>
    {:else if roster.length}
      <div class="allin">everyone's in ✓</div>
    {/if}
  </div>
{/if}

<style>
  .ready-panel {
    position: fixed; bottom: 1.1rem; left: 1.4rem; z-index: 10; max-width: 20rem;
    background: var(--paper); border: 1px solid var(--line); border-radius: 1rem;
    padding: 0.7rem 0.95rem; box-shadow: 0 6px 24px rgba(38, 38, 36, 0.1);
    font-family: var(--mono); font-size: 0.7rem; color: var(--muted);
  }
  .count b { color: var(--clay-deep); font-weight: 500; }
  .waiting { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.45rem; }
  .wlabel { letter-spacing: 0.1em; text-transform: uppercase; font-size: 0.58rem; align-self: center; }
  .wname {
    background: rgba(217, 119, 87, 0.1); border: 1px solid rgba(217, 119, 87, 0.3);
    color: var(--clay-deep); border-radius: 2rem; padding: 0.15em 0.6em;
  }
  .allin { margin-top: 0.4rem; color: var(--clay-deep); }
</style>
