<script module lang="ts">
  /** 5 brush colors chosen to read on the fixed paper background. */
  export const COLORS = ['#262624', '#D97757', '#4A7A8C', '#6B8F5E', '#C9A227']
  const SIZES = [4, 8, 16]
</script>

<script lang="ts">
  let {
    color = $bindable(),
    brush = $bindable(),
    mode = $bindable(),
    onundo,
    onclear,
  }: {
    color: string
    brush: number
    mode: 'draw' | 'fill'
    onundo: () => void
    onclear: () => void
  } = $props()
</script>

<div class="tools">
  <div class="row">
    {#each COLORS as c (c)}
      <button
        class="swatch"
        class:on={color === c}
        style:background={c}
        aria-label="color {c}"
        onclick={() => (color = c)}
      ></button>
    {/each}
  </div>
  <div class="row">
    {#each SIZES as s (s)}
      <button class="sizebtn" class:on={brush === s && mode === 'draw'} aria-label="brush {s}" onclick={() => { brush = s; mode = 'draw' }}>
        <span style:width="{s + 4}px" style:height="{s + 4}px" style:background={color}></span>
      </button>
    {/each}
    <button class="toolbtn" class:on={mode === 'fill'} onclick={() => (mode = mode === 'fill' ? 'draw' : 'fill')}>fill</button>
    <button class="toolbtn" onclick={onundo}>undo</button>
    <button class="toolbtn" onclick={onclear}>clear</button>
  </div>
</div>

<style>
  .tools { display: flex; flex-direction: column; gap: 0.6rem; align-items: center; }
  .row { display: flex; gap: 0.55rem; align-items: center; }
  .swatch {
    width: 2.1rem; height: 2.1rem; border-radius: 50%; cursor: pointer;
    border: 2px solid transparent; transition: transform 0.15s ease;
  }
  .swatch.on { border-color: var(--ink); transform: scale(1.12); }
  .sizebtn {
    width: 2.4rem; height: 2.4rem; border-radius: 50%; background: var(--paper);
    border: 1px solid var(--line); display: flex; align-items: center; justify-content: center;
    cursor: pointer;
  }
  .sizebtn.on { border-color: var(--clay); }
  .sizebtn span { display: block; border-radius: 50%; }
  .toolbtn {
    font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase;
    border: 1px solid var(--line); border-radius: 2rem; padding: 0.5em 1em; cursor: pointer;
    background: var(--paper); color: var(--ink-soft);
  }
  .toolbtn.on { background: var(--ink); color: var(--clay); border-color: var(--ink); }
</style>
