<script lang="ts">
  import { presenter } from '../net/presenter.svelte'

  const avatar = (id: string) => {
    const url = presenter.drawings[id]
    return url && url !== 'pending' ? url : null
  }
</script>

{#if presenter.champions.length}
  <aside class="champs">
    {#each presenter.champions as c, i (i)}
      <div class="champ">
        {#if avatar(c.id)}
          <img src={avatar(c.id)} alt={c.name} />
        {/if}
        <span>👑 G{i + 1} · <b>{c.name}</b></span>
      </div>
    {/each}
  </aside>
{/if}

<style>
  .champs {
    position: fixed; top: 1.1rem; right: 1.1rem; z-index: 10;
    display: flex; flex-direction: column; gap: 0.4rem;
    background: var(--paper); border: 1px solid var(--line); border-radius: 0.9rem;
    padding: 0.55rem 0.8rem; box-shadow: 0 6px 24px rgba(38, 38, 36, 0.1);
  }
  .champ {
    display: flex; align-items: center; gap: 0.5rem;
    font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.06em; color: var(--muted);
  }
  .champ b { color: var(--clay-deep); font-weight: 500; }
  .champ img { width: 1.6rem; height: 1.6rem; object-fit: contain; }
</style>
