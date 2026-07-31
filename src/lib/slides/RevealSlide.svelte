<script lang="ts">
  import { onMount } from 'svelte'
  import { fx } from '../fx'
  import { presenter } from '../net/presenter.svelte'

  // Entering the reveal completes the arc for the phones too.
  onMount(() => {
    if (presenter.live && presenter.phase === 'winners') presenter.advance('reveal')
  })

  const gallery = $derived(
    presenter.players
      .filter((p) => presenter.drawings[p.id] && presenter.drawings[p.id] !== 'pending')
      .map((p) => ({ id: p.id, name: p.name ?? 'anon', url: presenter.drawings[p.id] })),
  )

  const receipts = [
    { label: 'grilled', text: 'one design interview — every tool you used tonight came out of it' },
    { label: 'specced', text: '3 specs · 12 tickets · every drop you saw was a ticket' },
    { label: 'sensored', text: '300-line gate fired twice mid-build; the agent split the files itself' },
    { label: 'validated', text: 'unit tests on the RPS rules · e2e on the arc you just played' },
  ]
</script>

<div class="eyebrow" use:fx>The Reveal</div>
<h2 use:fx={{ d: 0.1 }}>This deck, your phone, that battle — one app. Built through Sonata.</h2>
<div class="reveal-wrap">
  <div class="receipts" use:fx={{ d: 0.3 }}>
    {#each receipts as r, i (r.label)}
      <div class="receipt" use:fx={{ d: 0.4 + i * 0.15 }}>
        <span class="rlabel">{r.label}</span>
        <span class="rtext">{r.text}</span>
      </div>
    {/each}
  </div>
  <div class="gallery" use:fx={{ d: 0.5 }}>
    {#if gallery.length}
      {#each gallery as g (g.id)}
        <figure>
          <img src={g.url} alt={g.name} />
          <figcaption>{g.name}</figcaption>
        </figure>
      {/each}
    {:else}
      <p class="sub">Every audience drawing lands here on talk day.</p>
    {/if}
  </div>
</div>
{#if presenter.live}
  <div class="reveal-ctl">
    <button class="btn ghost" onclick={() => presenter.reset()}>↺ restart session</button>
  </div>
{/if}

<style>
  .reveal-wrap {
    flex: 1; display: grid; grid-template-columns: 5fr 7fr;
    gap: clamp(1.5rem, 3.5vw, 3rem); align-items: center; min-height: 0;
  }
  .receipts { display: flex; flex-direction: column; gap: 0.9rem; }
  .receipt {
    display: flex; flex-direction: column; gap: 0.2rem; background: var(--paper);
    border: 1px solid var(--line); border-radius: 1rem;
    padding: 0.9rem 1.1rem;
  }
  .rlabel {
    font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--clay-deep);
  }
  .rtext { font-size: clamp(0.85rem, 1.3vw, 1rem); color: var(--ink-soft); }
  .gallery {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
    gap: 0.8rem; max-height: 100%; overflow-y: auto;
  }
  figure { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
  img {
    width: 100%; aspect-ratio: 1; border-radius: 0.8rem; border: 1px solid var(--line);
    background: var(--paper);
  }
  figcaption { font-family: var(--mono); font-size: 0.6rem; color: var(--muted); }
  .reveal-ctl { display: flex; justify-content: flex-end; padding-top: 0.6rem; }
</style>
