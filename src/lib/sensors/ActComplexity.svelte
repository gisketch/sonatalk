<script lang="ts">
  /** Act 2 — scc complexity. step: 0 nest · 1 fail · 2 flatten · 3 pass */
  let { step }: { step: number } = $props()

  // nesting pyramid: each row is one level deeper
  const NESTED = [
    'function applyRules(order) {',
    '  if (order.valid) {',
    '    for (const item of items) {',
    '      if (item.discount) {',
    '        if (item.stacked) {',
    '          while (retries--) {',
  ]
  const FLAT = [
    'function applyRules(order) {',
    '  if (!order.valid) return',
    '  const eligible = items.filter(canDiscount)',
    '  return eligible.map(applyOnce)',
  ]
  const rows = $derived(step < 2 ? NESTED : FLAT)
  const score = $derived(step < 2 ? 24 : 9)
</script>

<div class="codecard" class:fail={step === 1} class:pass={step === 3}>
  <span class="fname">rules.ts</span>
  <div class="code">
    {#each rows as line, i (step < 2 ? 'n' + i : 'f' + i)}
      <span class="ln" style:animation-delay="{i * 0.07}s" class:deep={step < 2 && i > 2}>{line}</span>
    {/each}
  </div>
  <div class="scorebox">
    <span class="lbl">complexity</span>
    <span class="score" class:hot={score > 15} class:ok={score <= 15}>{score}</span>
    <span class="lbl">limit 15</span>
  </div>
  {#if step === 1}<span class="stamp no">✗</span>{/if}
  {#if step === 3}<span class="stamp yes">✓</span>{/if}
</div>

<style>
  .codecard {
    position: relative; display: flex; gap: 2rem; align-items: center;
    background: #fff; border: 1px solid var(--line); border-radius: 1rem;
    padding: 1.2rem 1.8rem; animation: cardIn 0.4s cubic-bezier(0.2, 1.4, 0.4, 1);
  }
  .codecard.fail { border-color: #C0392B; animation: shakeNo 0.4s ease; }
  .codecard.pass { border-color: #6b8f5e; }
  .fname {
    position: absolute; top: -0.7rem; left: 1rem; font-family: var(--mono);
    font-size: 0.66rem; color: var(--muted); background: var(--paper);
    padding: 0.1rem 0.5rem; border-radius: 999px; border: 1px solid var(--line);
  }
  .code { display: flex; flex-direction: column; gap: 0.18rem; }
  .ln {
    font-family: var(--mono); font-size: clamp(0.66rem, 1.3vw, 0.85rem); color: var(--ink-soft);
    white-space: pre; animation: lnIn 0.3s both ease-out;
  }
  .ln.deep { color: #C0392B; }
  .scorebox { display: flex; flex-direction: column; align-items: center; gap: 0.2rem; }
  .lbl { font-family: var(--mono); font-size: 0.58rem; letter-spacing: 0.14em; color: var(--muted); }
  .score { font-family: var(--serif); font-size: 3rem; line-height: 1; }
  .score.hot { color: #C0392B; }
  .score.ok { color: #3d6b2f; }
  .stamp {
    position: absolute; top: -0.8rem; right: -0.8rem; width: 2.2rem; height: 2.2rem;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem; font-weight: 700; animation: stampIn 0.3s cubic-bezier(0.2, 1.6, 0.4, 1);
  }
  .stamp.no { background: #C0392B; color: #fff; }
  .stamp.yes { background: #6b8f5e; color: #fff; }
  @keyframes cardIn { from { transform: translateY(26px) scale(0.9); opacity: 0; } }
  @keyframes lnIn { from { transform: translateX(-10px); opacity: 0; } }
  @keyframes stampIn { from { transform: scale(2.4) rotate(-14deg); opacity: 0; } }
  @keyframes shakeNo { 25% { transform: translateX(-6px); } 50% { transform: translateX(5px); } 75% { transform: translateX(-3px); } }
</style>
