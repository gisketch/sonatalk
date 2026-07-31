<script lang="ts">
  import { presenter } from '../net/presenter.svelte'

  const PHASES = ['names', 'canvas', 'tools', 'drawing', 'pick']

  const visible = $derived(presenter.live && PHASES.includes(presenter.phase))
  const roster = $derived(
    presenter.players.filter(
      (p) => (p as (typeof presenter.players)[0] & { connected?: boolean }).connected,
    ),
  )

  /** ✓ when the player finished what the current phase asks of them. */
  const doneFor = (p: (typeof roster)[0]) => {
    if (presenter.phase === 'names') return !!p.name
    if (presenter.phase === 'drawing') return p.hasDrawing
    if (presenter.phase === 'pick') return p.ready
    return null // canvas/tools: nothing to complete, presence only
  }

  const doneCount = $derived(roster.filter((p) => doneFor(p) === true).length)
  const hasStatus = $derived(!['canvas', 'tools'].includes(presenter.phase))
  const thumb = (id: string) => {
    const url = presenter.drawings[id]
    return url && url !== 'pending' ? url : null
  }
</script>

{#if visible && roster.length}
  <aside class="player-rail">
    {#if hasStatus}
      <div class="rail-head"><b>{doneCount}</b> / {roster.length} ready</div>
    {:else}
      <div class="rail-head">{roster.length} drawing</div>
    {/if}
    <div class="rail-list">
      {#each roster as p (p.id)}
        <div class="prow" class:done={doneFor(p) === true}>
          {#if thumb(p.id)}
            <img src={thumb(p.id)} alt={p.name ?? 'player'} />
          {:else}
            <span class="pinit">{(p.name ?? '?').slice(0, 1).toUpperCase()}</span>
          {/if}
          <span class="pname">{p.name ?? 'anon'}</span>
          {#if doneFor(p) !== null}
            <span class="pstat">{doneFor(p) ? '✓' : '…'}</span>
          {/if}
        </div>
      {/each}
    </div>
  </aside>
{/if}

<style>
  .player-rail {
    position: fixed; left: 1.1rem; top: 50%; transform: translateY(-50%); z-index: 10;
    width: 11rem; max-height: 72vh; display: flex; flex-direction: column;
    background: var(--paper); border: 1px solid var(--line); border-radius: 1rem;
    box-shadow: 0 6px 24px rgba(38, 38, 36, 0.1); overflow: hidden;
  }
  .rail-head {
    font-family: var(--mono); font-size: 0.64rem; letter-spacing: 0.1em; color: var(--muted);
    padding: 0.55rem 0.8rem; border-bottom: 1px solid var(--line); flex: 0 0 auto;
  }
  .rail-head b { color: var(--clay-deep); font-weight: 500; }
  .rail-list { overflow-y: auto; padding: 0.4rem; display: flex; flex-direction: column; gap: 0.2rem; }
  .rail-list::-webkit-scrollbar { width: 4px; }
  .rail-list::-webkit-scrollbar-thumb { background: var(--line); border-radius: 2px; }
  .prow {
    display: flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0.4rem;
    border-radius: 0.6rem; opacity: 0.55;
  }
  .prow.done { opacity: 1; background: rgba(217, 119, 87, 0.07); }
  .prow img, .pinit {
    width: 1.7rem; height: 1.7rem; border-radius: 50%; border: 1px solid var(--line);
    background: #fff; object-fit: cover; flex: 0 0 auto;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: 0.7rem; color: var(--muted);
  }
  .pname {
    font-family: var(--mono); font-size: 0.66rem; color: var(--ink-soft);
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;
  }
  .pstat { font-size: 0.7rem; color: var(--clay-deep); flex: 0 0 auto; }
</style>
