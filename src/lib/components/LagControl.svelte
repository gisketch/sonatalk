<script lang="ts">
  import { presenter } from '../net/presenter.svelte'

  const STEP = 250
  const lagS = $derived((presenter.displayLagMs / 1000).toFixed(2).replace(/0$/, ''))
</script>

<!-- AirPlay compensation: step until the TV's countdown matches the phones. -->
<div class="lagctl">
  <span class="lbl">tv delay</span>
  <button
    class="btn ghost"
    onclick={() => presenter.setDisplayLag(presenter.displayLagMs - STEP)}
    disabled={presenter.displayLagMs <= 0}>−</button>
  <span class="val">{lagS}s</span>
  <button
    class="btn ghost"
    onclick={() => presenter.setDisplayLag(presenter.displayLagMs + STEP)}
    disabled={presenter.displayLagMs >= 5000}>+</button>
</div>

<style>
  .lagctl { display: flex; align-items: center; gap: 0.5rem; }
  .lbl, .val {
    font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.08em; color: var(--muted);
  }
  .val { color: var(--ink-soft); min-width: 2.8em; text-align: center; }
</style>
