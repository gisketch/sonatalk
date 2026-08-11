<script lang="ts">
  /** Act 3 — skylos dead code. step: 0 chips · 1 ghost flagged · 2 dissolve · 3 pass */
  let { step }: { step: number } = $props()

  const FNS = ['createOrder()', 'applyDiscount()', 'shipOrder()']
</script>

<div class="ghostcard" class:fail={step === 1} class:pass={step === 3}>
  <span class="fname">orders.ts</span>
  <div class="chips">
    {#each FNS as fn, i (fn)}
      {#if fn !== 'applyDiscount()' || step < 2}
        <span
          class="chip"
          class:ghost={fn === 'applyDiscount()' && step >= 1}
          class:dissolving={fn === 'applyDiscount()' && step === 2}
          class:ok={step === 3}
          style:animation-delay="{i * 0.1}s"
        >
          {#if fn === 'applyDiscount()' && step >= 1}👻{/if}
          {fn}
          {#if fn !== 'applyDiscount()' && step >= 1}<i class="used">called ✓</i>{/if}
          {#if fn === 'applyDiscount()' && step >= 1}<i class="unused">0 callers</i>{/if}
        </span>
      {/if}
    {/each}
  </div>
  {#if step === 1}<span class="stamp no">✗</span>{/if}
  {#if step === 3}<span class="stamp yes">✓</span>{/if}
</div>

<style>
  .ghostcard {
    position: relative; display: flex; flex-direction: column; align-items: center; gap: 0.8rem;
    background: #fff; border: 1px solid var(--line); border-radius: 1rem;
    padding: 1.6rem 2.2rem; animation: cardIn 0.4s cubic-bezier(0.2, 1.4, 0.4, 1);
  }
  .ghostcard.fail { border-color: #C0392B; animation: shakeNo 0.4s ease; }
  .ghostcard.pass { border-color: #6b8f5e; }
  .fname {
    position: absolute; top: -0.7rem; left: 1rem; font-family: var(--mono);
    font-size: 0.66rem; color: var(--muted); background: var(--paper);
    padding: 0.1rem 0.5rem; border-radius: 999px; border: 1px solid var(--line);
  }
  .chips { display: flex; gap: 0.9rem; align-items: center; }
  .chip {
    display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
    font-family: var(--mono); font-size: clamp(0.72rem, 1.4vw, 0.95rem); color: var(--ink-soft);
    border: 1px solid var(--line); border-radius: 0.8rem; padding: 0.9rem 1.2rem;
    animation: lnIn 0.35s both ease-out; background: var(--paper);
  }
  .chip.ok { border-color: #6b8f5e; }
  .chip.ghost { border-style: dashed; border-color: #C0392B; color: #a03325; opacity: 0.85; }
  .chip.dissolving { animation: dissolve 0.9s ease forwards; }
  .used { font-style: normal; font-size: 0.58rem; color: #3d6b2f; letter-spacing: 0.1em; }
  .unused { font-style: normal; font-size: 0.58rem; color: #a03325; letter-spacing: 0.1em; }
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
  @keyframes dissolve {
    to { transform: translateY(-26px) rotate(9deg) scale(0.7); opacity: 0; filter: blur(3px); }
  }
</style>
