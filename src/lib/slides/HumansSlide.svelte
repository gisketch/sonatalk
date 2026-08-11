<script lang="ts">
  import { fx } from '../fx'
  import { popKill } from '../sfx'

  // One click proves the point: the machine's speed never changes — only the
  // number of lines a human actually understood does.
  let off = $state(false)
  let shipped = $state(14)
  let understood = $state(14)

  $effect(() => {
    // `off` is only read inside the callback, never at effect top level, so the
    // effect never re-runs and the cadence survives every toggle — and that
    // unbroken cadence is the whole argument the slide is making.
    const id = setInterval(() => {
      shipped++
      if (!off) understood++
    }, 620)
    return () => clearInterval(id)
  })

  const HANDS = [
    {
      when: 'before', title: 'Design',
      line: 'The architecture, the boundaries, the call on what we are even building.',
      good: 'you drew the box it works inside', bad: 'who designed this?',
    },
    {
      when: 'during', title: 'Decide',
      line: 'Every fork gets grilled back to you — one real question at a time.',
      good: 'you picked this path', bad: 'a pattern nobody chose',
    },
    {
      when: 'after', title: 'Review',
      line: 'Nothing merges unread. The sensors go first so your eyes can go deep.',
      good: 'you read every line', bad: 'merged, unread',
    },
  ]

  function toggle() {
    off = !off
    popKill()
  }
</script>

<div class="eyebrow" use:fx>The Rider</div>
<h2 use:fx={{ d: 0.1 }}>The machine runs the loop. <em>Humans steer.</em></h2>

<div class="steer-wrap" use:fx={{ d: 0.3 }}>
  <div class="hands" class:off>
    {#each HANDS as h, i (h.title)}
      <div class="hand" style:--i={i}>
        <span class="palm">✋</span>
        <span class="when">{h.when}</span>
        <h3>{h.title}</h3>
        <p>{h.line}</p>
        <div class="art">
          {#if i === 0}
            <!-- the architecture: boxes you placed on purpose -->
            <svg viewBox="0 0 160 56">
              <line class="spine" x1="28" y1="28" x2="132" y2="28" />
              <rect class="bx" x="6" y="14" width="44" height="28" rx="7" />
              <rect class="bx" x="58" y="14" width="44" height="28" rx="7" />
              <rect class="bx" x="110" y="14" width="44" height="28" rx="7" />
            </svg>
          {:else if i === 1}
            <!-- the fork: one branch taken, on purpose -->
            <svg viewBox="0 0 160 56">
              <path class="stem" d="M8 28 H58" />
              <path class="alt" d="M58 28 Q86 28 90 12 H150" />
              <path class="pick" d="M58 28 Q86 28 90 44 H150" />
              <circle class="pin" cx="150" cy="44" r="5" />
            </svg>
          {:else}
            <!-- the diff: read, then merged -->
            <svg viewBox="0 0 160 56">
              <rect class="frame" x="6" y="8" width="148" height="40" rx="8" />
              <line class="ln" x1="18" y1="20" x2="104" y2="20" />
              <line class="ln" x1="18" y1="30" x2="126" y2="30" />
              <line class="ln" x1="18" y1="40" x2="88" y2="40" />
              <path class="tick" d="M124 37 l6 6 l11 -14" />
            </svg>
          {/if}
        </div>
        <span class="stat">{off ? h.bad : h.good}</span>
      </div>
    {/each}
  </div>

  <div class="belt">
    <div class="rail">
      <span class="dot"></span><span class="dot d2"></span><span class="dot d3"></span>
      <span class="railtag">the agent, running at exactly the same speed</span>
    </div>
    <div class="meters">
      <div class="meter"><b>{shipped}</b><span>diffs shipped</span></div>
      <div class="meter" class:cold={off}><b>{understood}</b><span>you understood</span></div>
      <div class="meter bad" class:show={shipped > understood}>
        <b>{shipped - understood}</b><span>nobody understands</span>
      </div>
    </div>
    <button class="btn steerbtn" class:back={off} onclick={toggle}>
      {off ? 'put your hands back →' : 'take your hands off →'}
    </button>
  </div>
</div>

<p class="footline" use:fx={{ d: 0.6 }}>
  The agent types. <b>You design, you decide, you review.</b> A harness doesn't remove the
  human — it moves the human to the three places that actually need one.
</p>

<style>
  .steer-wrap {
    flex: 1; min-height: 0; display: flex; flex-direction: column; gap: clamp(0.8rem, 2vh, 1.4rem);
  }
  .hands { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: clamp(1rem, 2vw, 1.6rem); flex: 1; min-height: 0; }
  .hand {
    position: relative; display: flex; flex-direction: column; align-items: flex-start;
    background: var(--paper); border: 1px solid var(--line); border-radius: 1.2rem;
    padding: clamp(0.9rem, 2.2vh, 1.5rem) clamp(1rem, 1.9vw, 1.6rem);
    transition: opacity 0.5s, filter 0.5s, transform 0.5s cubic-bezier(0.3, 1.2, 0.5, 1), border-color 0.5s;
  }
  .palm {
    font-size: clamp(1.6rem, 3.4vw, 2.4rem); line-height: 1; margin-bottom: 0.3rem;
    animation: press 2.6s ease-in-out infinite; animation-delay: calc(var(--i) * 0.5s);
    transform-origin: 50% 100%;
  }
  @keyframes press { 0%, 72%, 100% { transform: translateY(0) rotate(0deg); } 82% { transform: translateY(7px) rotate(-4deg); } }
  .when {
    font-family: var(--mono); font-size: clamp(0.58rem, 1vw, 0.7rem); letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--clay-deep); margin-bottom: 0.35rem;
  }
  .hand h3 { font-family: var(--serif); font-weight: 600; font-size: clamp(1.15rem, 2.2vw, 1.6rem); margin-bottom: 0.3em; }
  .hand p { font-size: clamp(0.78rem, 1.25vw, 0.95rem); color: var(--muted); line-height: 1.5; flex: 0 0 auto; }
  .stat {
    margin-top: 0.7rem; font-family: var(--mono); font-size: clamp(0.58rem, 1.05vw, 0.74rem);
    color: #3d6b2f; border: 1px solid rgba(107, 143, 94, 0.45); border-radius: 999px;
    padding: 0.25rem 0.7rem; transition: color 0.4s, border-color 0.4s;
  }

  /* the artifact each hand actually touches */
  /* the artifact centres itself in whatever room the copy leaves behind */
  .art { width: 100%; flex: 1; min-height: 0; display: flex; align-items: center; margin: 0.4rem 0; }
  .art svg {
    width: 100%; max-height: min(100%, clamp(3rem, 12vh, 5.6rem)); display: block;
    fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round;
  }
  .spine, .stem, .ln { stroke: var(--line); }
  .bx, .frame { stroke: var(--clay); fill: rgba(217, 119, 87, 0.08); transition: all 0.5s; }
  .bx { transform-box: fill-box; transform-origin: center; transition: transform 0.5s cubic-bezier(0.3, 1.2, 0.5, 1); }
  .alt { stroke: var(--line); stroke-dasharray: 5 5; }
  .pick { stroke: var(--clay); transition: stroke 0.5s; }
  .pin { fill: var(--clay); stroke: none; transition: opacity 0.4s; }
  .tick { stroke: #6b8f5e; stroke-width: 3; transition: opacity 0.4s; }

  /* hands off — the checkpoints lift away, the machine below does not care */
  .hands.off .hand { opacity: 0.62; transform: translateY(-12px); border-style: dashed; }
  .hands.off .hand h3, .hands.off .hand p, .hands.off .when { opacity: 0.45; }
  .hands.off .palm { animation: none; opacity: 0.45; filter: grayscale(1); }
  .hands.off .stat { color: #a03325; border-color: rgba(192, 57, 43, 0.5); }
  .hands.off .bx, .hands.off .frame { stroke: #c0392b; fill: rgba(192, 57, 43, 0.06); }
  .hands.off .bx:nth-of-type(2) { transform: rotate(-9deg) translateY(5px); }
  .hands.off .bx:nth-of-type(3) { transform: rotate(7deg) translate(4px, -4px); }
  .hands.off .pick { stroke: var(--line); stroke-dasharray: 5 5; }
  .hands.off .pin, .hands.off .tick { opacity: 0; }

  .belt { display: flex; align-items: center; gap: clamp(1rem, 2.4vw, 2rem); }
  .rail {
    position: relative; flex: 1; height: 4px; border-radius: 2px; background: var(--line);
  }
  .dot {
    position: absolute; top: -4px; width: 12px; height: 12px; border-radius: 50%;
    background: var(--clay); animation: run 2.4s linear infinite;
  }
  .d2 { animation-delay: 0.8s; }
  .d3 { animation-delay: 1.6s; }
  @keyframes run { from { left: -12px; } to { left: 100%; } }
  .railtag {
    position: absolute; top: 12px; left: 0; font-family: var(--mono);
    font-size: clamp(0.56rem, 0.95vw, 0.7rem); color: var(--muted); letter-spacing: 0.06em;
  }

  .meters { display: flex; gap: clamp(0.8rem, 1.8vw, 1.6rem); }
  .meter { display: flex; flex-direction: column; align-items: center; min-width: 5.2rem; }
  .meter b {
    font-family: var(--mono); font-size: clamp(1.2rem, 2.6vw, 1.9rem); font-weight: 500;
    color: var(--ink); line-height: 1;
  }
  .meter span {
    font-family: var(--mono); font-size: clamp(0.52rem, 0.9vw, 0.66rem); letter-spacing: 0.08em;
    color: var(--muted); margin-top: 0.25rem; white-space: nowrap;
  }
  .meter.cold b { color: #7a776e; }
  .meter.bad { opacity: 0; transition: opacity 0.4s; }
  .meter.bad.show { opacity: 1; }
  .meter.bad b, .meter.bad span { color: #a03325; }

  .steerbtn { white-space: nowrap; animation: nudge 2s ease-in-out infinite; }
  .steerbtn.back { animation: none; }
  @keyframes nudge { 50% { transform: translateY(-3px); } }

  @media (prefers-reduced-motion: reduce) {
    .palm, .dot, .steerbtn { animation: none !important; }
  }
</style>
