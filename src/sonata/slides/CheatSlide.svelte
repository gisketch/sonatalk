<script lang="ts">
  import { fx } from '../../lib/fx'

  const rows = [
    { cmd: '/sonata-work', when: 'anything at all — when unsure, this. It routes.' },
    { cmd: '/sonata-fix', when: "something's broken — evidence before edits" },
    { cmd: '/sonata-grill', when: 'big fuzzy idea, decisions still unsettled' },
    { cmd: '/sonata-review', when: 'confidence check on a branch, PR, or working tree' },
    { cmd: '/sonata-audit', when: 'repo health day — security + complexity plan' },
    { cmd: 'init + setup / retrofit', when: 'bringing Sonata to a new or existing project' },
  ]
</script>

<div class="eyebrow" use:fx>Day To Day</div>
<h2 use:fx={{ d: 0.1 }}>The cheat sheet.</h2>
<div class="cheat">
  {#each rows as row, i (row.cmd)}
    <div class="cheat-row" use:fx={{ d: 0.3 + i * 0.12 }}>
      <span class="cheat-cmd">{row.cmd}</span>
      <span class="cheat-when">{row.when}</span>
    </div>
  {/each}
</div>
<p class="footline" use:fx={{ d: 1.15 }}>
  One habit covers 90% of it: <b>describe the outcome, type <code
    style="font-family:var(--mono);font-size:0.9em;color:var(--clay-deep)">/sonata-work</code>, answer one
  question at a time.</b>
</p>

<style>
  .cheat {
    flex: 1; display: flex; flex-direction: column; justify-content: center;
    gap: clamp(0.55rem, 1.4vh, 0.9rem); min-height: 0; max-width: 62rem;
  }
  .cheat-row {
    display: grid; grid-template-columns: 17rem 1fr; align-items: baseline;
    gap: clamp(1rem, 2.5vw, 2rem); background: var(--paper); border: 1px solid var(--line);
    border-radius: 0.9rem; padding: clamp(0.6rem, 1.5vh, 0.95rem) clamp(1rem, 2vw, 1.5rem);
  }
  .cheat-cmd {
    font-family: var(--mono); font-size: clamp(0.78rem, 1.3vw, 1rem); color: var(--clay-deep);
  }
  .cheat-when { font-size: clamp(0.85rem, 1.4vw, 1.05rem); color: var(--ink-soft); }
</style>
