<script lang="ts">
  import { fx } from '../fx'
  import { popKill } from '../sfx'

  // one click, one punchline: same agent, same prompt — only the context changes
  let loaded = $state(false)
  const CHIPS = ['architecture.md', 'conventions.md', 'quality.md']
  function load() {
    if (loaded) return
    loaded = true
    popKill()
  }
</script>

<div class="eyebrow" use:fx>Sonata · The Feedforward Half</div>
<h2 use:fx={{ d: 0.1 }}>Documentation the agent actually reads</h2>

<div class="docs-wrap" use:fx={{ d: 0.3 }}>
  <div class="promptbar">
    <span class="plabel">same prompt, twice</span>
    <span class="ptext">"add refunds to the payments flow"</span>
  </div>

  <div class="split">
    <div class="pane bad">
      <span class="pane-tag">agent alone</span>
      <div class="diffcard wrong">
        <span class="path">✗ src/utils/RefundManager2.ts</span>
        <span class="line">class RefundManager2 {'{'}</span>
        <span class="line">  // brand-new parallel pattern…</span>
        <span class="line">  handleRefundV2(data: any) …</span>
      </div>
      <div class="verdicts">
        <span>invented a new pattern</span><span>wrong folder</span><span>any-typed</span>
      </div>
    </div>

    <div class="pane good" class:on={loaded}>
      <span class="pane-tag">{loaded ? 'agent + your docs' : 'the same agent…'}</span>
      {#if loaded}
        <div class="diffcard right">
          <span class="path ok">✓ src/payments/refunds.ts</span>
          <span class="line">export function refundPayment(order: Order) {'{'}</span>
          <span class="line">  // follows the payments/ house pattern</span>
          <span class="line">  return ledger.reverse(order.txn)</span>
        </div>
        <div class="verdicts ok">
          <span>extends YOUR design</span><span>right folder</span><span>typed</span>
        </div>
      {:else}
        <button class="btn loadbtn" onclick={load}>load the docs →</button>
      {/if}
    </div>

    {#if loaded}
      <div class="flychips">
        {#each CHIPS as c, i (c)}
          <span class="chip" style:animation-delay="{i * 0.12}s">{c}</span>
        {/each}
      </div>
    {/if}
  </div>
</div>

<p class="footline" use:fx={{ d: 0.6 }}>
  Same model. Same prompt. <b>The diff changed because the context changed</b> — docs are
  executable context now, kept alive by the flow itself.
</p>

<style>
  .docs-wrap {
    flex: 1; min-height: 0; display: flex; flex-direction: column; gap: 0.9rem;
  }
  .promptbar {
    display: flex; align-items: baseline; gap: 1rem; justify-content: center;
    font-family: var(--mono);
  }
  .plabel { font-size: 0.62rem; letter-spacing: 0.14em; color: var(--muted); text-transform: uppercase; }
  .ptext { font-size: clamp(0.85rem, 1.8vw, 1.1rem); color: var(--ink); }

  .split { position: relative; flex: 1; min-height: 0; display: flex; gap: 1.2rem; }
  .pane {
    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 0.9rem;
    border: 1px solid var(--line); border-radius: 1.2rem; padding: 1.2rem;
    justify-content: center; background: var(--paper); transition: border-color 0.3s;
  }
  .pane.bad { border-color: rgba(192, 57, 43, 0.45); }
  .pane.good.on { border-color: rgba(107, 143, 94, 0.6); }
  .pane-tag {
    font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.14em;
    color: var(--muted); text-transform: uppercase;
  }
  .diffcard {
    display: flex; flex-direction: column; gap: 0.3rem; background: #fff;
    border: 1px solid var(--line); border-radius: 0.9rem; padding: 1rem 1.3rem;
    animation: dIn 0.4s cubic-bezier(0.2, 1.4, 0.4, 1); max-width: 100%;
  }
  .diffcard.wrong { border-color: rgba(192, 57, 43, 0.4); background: rgba(192, 57, 43, 0.04); }
  .diffcard.right { border-color: rgba(107, 143, 94, 0.5); background: rgba(107, 143, 94, 0.05); }
  .path { font-family: var(--mono); font-size: clamp(0.7rem, 1.4vw, 0.9rem); color: #a03325; }
  .path.ok { color: #3d6b2f; }
  .line {
    font-family: var(--mono); font-size: clamp(0.62rem, 1.2vw, 0.8rem); color: var(--ink-soft);
    white-space: pre; overflow: hidden; text-overflow: ellipsis;
  }
  .verdicts { display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: center; }
  .verdicts span {
    font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.08em; color: #a03325;
    border: 1px solid rgba(192, 57, 43, 0.35); border-radius: 999px; padding: 0.22rem 0.6rem;
  }
  .verdicts.ok span { color: #3d6b2f; border-color: rgba(107, 143, 94, 0.45); }

  .loadbtn { animation: pulseBtn 1.6s infinite ease-in-out; }
  @keyframes pulseBtn { 50% { transform: scale(1.05); } }

  .flychips {
    position: absolute; left: 50%; top: 38%; transform: translateX(-50%);
    display: flex; flex-direction: column; gap: 0.4rem; pointer-events: none;
  }
  .chip {
    font-family: var(--mono); font-size: 0.68rem; color: var(--clay-deep);
    background: var(--paper); border: 1px solid var(--clay); border-radius: 999px;
    padding: 0.3rem 0.8rem; animation: fly 1.1s both cubic-bezier(0.3, 0.9, 0.4, 1);
  }
  @keyframes fly {
    0% { transform: translate(-9rem, 2rem) scale(0.8); opacity: 0; }
    25% { opacity: 1; }
    100% { transform: translate(9rem, -1rem) scale(0.9); opacity: 0; }
  }
  @keyframes dIn { from { transform: translateY(18px) scale(0.94); opacity: 0; } }
</style>
