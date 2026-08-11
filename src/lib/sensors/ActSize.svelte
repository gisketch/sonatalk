<script lang="ts">
  /** Act 1 — the 300-line gate. step: 0 grow · 1 fail · 2 split · 3 pass */
  let { step }: { step: number } = $props()

  const TARGET = 347
  let count = $state(0)
  $effect(() => {
    if (step !== 0) {
      count = TARGET
      return
    }
    count = 0
    const t = setInterval(() => {
      count = Math.min(TARGET, count + 9)
      if (count >= TARGET) clearInterval(t)
    }, 28)
    return () => clearInterval(t)
  })
  const over = $derived(count > 300)
</script>

{#if step < 2}
  <div class="filecard" class:fail={step === 1}>
    <span class="fname">Tools.svelte</span>
    <span class="count" class:hot={over}>{count}<i>lines</i></span>
    <span class="meter"><i style:width="{Math.min(100, (count / 400) * 100)}%" class:hot={over}></i><b style:left="75%"></b></span>
    <span class="limit">limit 300</span>
    {#if step === 1}<span class="stamp no">✗</span>{/if}
  </div>
{:else}
  <div class="splitrow">
    <div class="filecard small" class:pass={step === 3}>
      <span class="fname">Tools.svelte</span>
      <span class="count ok">198<i>lines</i></span>
      {#if step === 3}<span class="stamp yes">✓</span>{/if}
    </div>
    <div class="filecard small alt" class:pass={step === 3}>
      <span class="fname">ToolPresets.svelte</span>
      <span class="count ok">149<i>lines</i></span>
      {#if step === 3}<span class="stamp yes">✓</span>{/if}
    </div>
  </div>
{/if}

<style>
  .filecard {
    position: relative; display: flex; flex-direction: column; align-items: center;
    gap: 0.5rem; background: #fff; border: 1px solid var(--line); border-radius: 1rem;
    padding: 1.4rem 2.6rem 1.6rem; animation: cardIn 0.4s cubic-bezier(0.2, 1.4, 0.4, 1);
  }
  .filecard.fail { border-color: #C0392B; animation: shakeNo 0.4s ease; }
  .filecard.pass { border-color: #6b8f5e; }
  .fname { font-family: var(--mono); font-size: 0.85rem; color: var(--ink-soft); }
  .count { font-family: var(--serif); font-size: 3.2rem; line-height: 1; color: var(--ink); }
  .count i { font-family: var(--mono); font-style: normal; font-size: 0.7rem; color: var(--muted); margin-left: 0.4rem; }
  .count.hot { color: #C0392B; }
  .count.ok { color: #3d6b2f; font-size: 2.4rem; }
  .meter { position: relative; width: 13rem; height: 0.55rem; background: var(--ivory); border-radius: 999px; overflow: visible; }
  .meter i { display: block; height: 100%; border-radius: 999px; background: var(--clay); transition: width 0.05s linear; }
  .meter i.hot { background: #C0392B; }
  .meter b { position: absolute; top: -0.25rem; width: 2px; height: 1.05rem; background: var(--ink); opacity: 0.5; }
  .limit { font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.14em; color: var(--muted); }
  .splitrow { display: flex; gap: 1.4rem; }
  .splitrow .filecard:first-child { animation: splitL 0.5s cubic-bezier(0.2, 1.4, 0.4, 1); }
  .splitrow .filecard.alt { animation: splitR 0.5s cubic-bezier(0.2, 1.4, 0.4, 1); }
  .filecard.small { padding: 1.1rem 2rem 1.2rem; }
  .stamp {
    position: absolute; top: -0.8rem; right: -0.8rem; width: 2.2rem; height: 2.2rem;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; font-weight: 700; animation: stampIn 0.3s cubic-bezier(0.2, 1.6, 0.4, 1);
  }
  .stamp.no { background: #C0392B; color: #fff; }
  .stamp.yes { background: #6b8f5e; color: #fff; }
  @keyframes cardIn { from { transform: translateY(26px) scale(0.9); opacity: 0; } }
  @keyframes splitL { from { transform: translateX(6rem); opacity: 0.4; } }
  @keyframes splitR { from { transform: translateX(-6rem); opacity: 0.4; } }
  @keyframes stampIn { from { transform: scale(2.4) rotate(-14deg); opacity: 0; } }
  @keyframes shakeNo { 25% { transform: translateX(-6px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-3px); } }
</style>
