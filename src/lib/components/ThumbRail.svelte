<script lang="ts">
  import { presenter } from '../net/presenter.svelte'

  const visible = $derived(presenter.live && presenter.phase === 'drawing')
  const entries = $derived(
    presenter.players
      .filter((p) => presenter.drawings[p.id] && presenter.drawings[p.id] !== 'pending')
      .map((p) => ({ id: p.id, name: p.name ?? '?', url: presenter.drawings[p.id] })),
  )
</script>

{#if visible && entries.length}
  <div class="rail">
    {#each entries as e (e.id)}
      <figure>
        <img src={e.url} alt={e.name} />
        <figcaption>{e.name}</figcaption>
      </figure>
    {/each}
  </div>
{/if}

<style>
  .rail {
    /* bottom-left, away from centered CTAs */
    position: fixed; bottom: 1.1rem; left: 1.4rem; z-index: 9;
    display: flex; gap: 0.6rem; padding: 0.5rem 0.8rem; background: var(--paper);
    border: 1px solid var(--line); border-radius: 1rem; max-width: 42vw; overflow-x: auto;
    box-shadow: 0 6px 24px rgba(38, 38, 36, 0.1);
  }
  figure { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; }
  img {
    width: 3rem; height: 3rem; border-radius: 0.6rem; border: 1px solid var(--line);
    animation: popIn 0.4s cubic-bezier(0.3, 1.4, 0.5, 1) both;
  }
  @keyframes popIn { from { opacity: 0; transform: scale(0.6); } }
  figcaption {
    font-family: var(--mono); font-size: 0.55rem; color: var(--muted); max-width: 3.4rem;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
</style>
