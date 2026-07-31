<script lang="ts">
  import Defs from './lib/components/Defs.svelte'
  import LiveBar from './lib/components/LiveBar.svelte'
  import PlayerSidebar from './lib/components/PlayerSidebar.svelte'
  import { deck } from './lib/deck.svelte'
  import { presenter } from './lib/net/presenter.svelte'
  import { slides } from './lib/slides'

  deck.count = slides.length
  presenter.start()
  const notes = $derived(slides[deck.current].notes)
</script>

<svelte:window onkeydown={(e) => deck.handleKey(e)} />

<Defs />

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<main class="deck-root" onclick={(e) => deck.handleClick(e)}>
  {#each slides as s, idx (idx)}
    {#if idx === deck.current || idx === deck.leaving}
      <section
        class="slide"
        class:dark={s.dark}
        class:active={idx === deck.current}
        class:leaving={idx === deck.leaving}
      >
        <s.component />
      </section>
    {/if}
  {/each}
</main>

<LiveBar />
<PlayerSidebar />
<div class="progress" style:width="{((deck.current + 1) / slides.length) * 100}%"></div>
<div class="hud">
  <span class="keys">←/→ nav · N notes · F fullscreen</span>
  <span>{deck.current + 1} / {slides.length}</span>
</div>
<div class="notes" class:show={deck.showNotes}>
  <div class="nt">Speaker notes</div>
  <div>{notes}</div>
</div>
