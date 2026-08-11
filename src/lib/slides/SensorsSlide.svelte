<script lang="ts">
  import { fx } from '../fx'
  import { popKill } from '../sfx'
  import ActSize from '../sensors/ActSize.svelte'
  import ActComplexity from '../sensors/ActComplexity.svelte'
  import ActGhost from '../sensors/ActGhost.svelte'

  const ACTS = [
    {
      icon: '#i-ruler', tab: '300-line limit', mistake: 'god-files',
      cmd: '$ ./scripts/check-size.sh',
      err: '✗ source file exceeds 300 lines: Tools.svelte (347)',
      okMsg: '✓ 2 files, both under 300 — agent split it itself',
    },
    {
      icon: '#i-gauge', tab: 'scc · complexity', mistake: 'over-engineering',
      cmd: '$ scc --by-file src/',
      err: '✗ complexity 24 (limit 15): applyRules()',
      okMsg: '✓ complexity 9 — flattened with early returns',
    },
    {
      icon: '#i-ghost', tab: 'skylos · dead code', mistake: 'orphaned code',
      cmd: '$ skylos src/',
      err: '✗ unused function: applyDiscount() — 0 callers',
      okMsg: '✓ no dead code — the ghost is gone',
    },
  ]

  let act = $state(0)
  let step = $state(0) // 0 attempt · 1 error · 2 self-correct · 3 pass
  const finished = $derived(act >= ACTS.length)
  const current = $derived(ACTS[Math.min(act, ACTS.length - 1)])

  function advance() {
    if (finished) return
    if (step < 3) {
      step++
      if (step === 1) popKill()
    } else if (act < ACTS.length - 1) {
      act++
      step = 0
    } else {
      act++ // all three done
    }
  }
</script>

<div class="eyebrow" use:fx>Sonata · The Feedback Half</div>
<h2 use:fx={{ d: 0.1 }}>Sensors that agents actually listen to</h2>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="sensor-wrap" use:fx={{ d: 0.3 }} onclick={advance}>
  <div class="tabs">
    {#each ACTS as a, i (a.tab)}
      <span class="tab" class:on={i === act} class:done={i < act}>
        {#if i < act}<b>✓</b>{:else}<svg class="icon"><use href={a.icon} /></svg>{/if}
        {a.tab}
        <i>{a.mistake}</i>
      </span>
    {/each}
  </div>

  <div class="stage">
    {#if finished}
      <p class="alldone" >every check speaks in <b>errors the agent can act on</b> — and it acts.</p>
    {:else}
      {#key act}
        {#if act === 0}<ActSize {step} />{:else if act === 1}<ActComplexity {step} />{:else}<ActGhost {step} />{/if}
      {/key}
    {/if}
  </div>

  <div class="termline">
    {#if !finished}
      <span class="cmd">{current.cmd}</span>
      {#key `${act}:${step}`}
        {#if step === 1 || step === 2}
          <span class="err">{current.err}</span>
        {:else if step === 3}
          <span class="ok">{current.okMsg}</span>
        {:else}
          <span class="idle">…watching every change</span>
        {/if}
      {/key}
    {:else}
      <span class="ok">✓ ✓ ✓ — three mistakes an agent actually makes, three sensors that catch them</span>
    {/if}
  </div>
</div>

<p class="footline" use:fx={{ d: 0.6 }}>
  Examples, not a prescription — the pattern: <b>attempt → error → self-correct → pass.</b>
  <span class="hint">(click to run the sensors)</span>
</p>

<style>
  .sensor-wrap {
    flex: 1; min-height: 0; display: flex; flex-direction: column; cursor: pointer;
    background: var(--paper); border: 1px solid var(--line); border-radius: 1.2rem;
    overflow: hidden;
  }
  .tabs { display: flex; border-bottom: 1px solid var(--line); }
  .tab {
    flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    padding: 0.7rem 0.5rem; font-family: var(--mono); font-size: clamp(0.62rem, 1.2vw, 0.8rem);
    letter-spacing: 0.05em; color: var(--muted); border-right: 1px solid var(--line);
    transition: background 0.25s, color 0.25s;
  }
  .tab:last-child { border-right: 0; }
  .tab.on { background: #fff; color: var(--clay-deep); }
  .tab.done { color: #3d6b2f; }
  .tab b { font-weight: 700; }
  .tab i { font-style: normal; font-size: 0.85em; color: var(--line); }
  .tab.on i { color: var(--muted); }
  .tab :global(.icon) { width: 1em; height: 1em; stroke: currentColor; fill: none; stroke-width: 2; }

  .stage {
    flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center;
    padding: 1rem;
  }
  .alldone {
    font-family: var(--serif); font-size: clamp(1.3rem, 3vw, 2rem); color: var(--ink);
    text-align: center; animation: allIn 0.5s cubic-bezier(0.2, 1.4, 0.4, 1);
  }
  @keyframes allIn { from { transform: scale(0.85); opacity: 0; } }

  .termline {
    display: flex; gap: 1.2rem; align-items: center; padding: 0.75rem 1.2rem;
    background: #262624; font-family: var(--mono);
    font-size: clamp(0.72rem, 1.4vw, 0.95rem); /* floor keeps it readable from the back */
  }
  .cmd { color: #a8a49a; }
  .err { color: #e07b6a; animation: termIn 0.25s ease-out; }
  .ok { color: #9dc08b; animation: termIn 0.25s ease-out; }
  .idle { color: #6d6960; }
  @keyframes termIn { from { transform: translateY(6px); opacity: 0; } }

  .hint { font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.1em; color: var(--line); margin-left: 0.8rem; }
</style>
