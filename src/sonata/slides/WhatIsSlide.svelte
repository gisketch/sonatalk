<script lang="ts">
  import { fx } from '../../lib/fx'
</script>

<div class="eyebrow" use:fx>What It Is</div>
<h2 use:fx={{ d: 0.1 }}>Just files in your repo. No app, no service.</h2>
<div class="what-grid">
  <div use:fx={{ d: 0.3 }}>
    <div class="term big-term">
      <div class="cmd">npx github:gisketch/sonata init .</div>
      <div class="add">+ AGENTS.md</div>
      <div class="add">+ docs/ (brief · architecture · quality · specs · plans)</div>
      <div class="add">+ .agents/skills/ (11 workflows)</div>
      <div class="add">+ scripts/check-sonata.sh</div>
      <div class="add">+ .sonata/ (manifest · quality gates)</div>
      <div class="ok">✓ harness installed — repository unchanged otherwise</div>
    </div>
  </div>
  <div class="what-cards">
    <div class="qcard" use:fx={{ d: 0.5 }}>
      <h3><code>AGENTS.md</code> — the map</h3>
      <p>First thing every agent reads. Short, links to everything durable. <b>The front page of the house manual.</b></p>
    </div>
    <div class="qcard" use:fx={{ d: 0.65 }}>
      <h3><code>docs/</code> — the memory</h3>
      <p>Intent, architecture, quality menu, specs, plans. <b>What survives when the session ends.</b></p>
    </div>
    <div class="qcard" use:fx={{ d: 0.8 }}>
      <h3><code>skills/</code> — the workflows</h3>
      <p>Grill, spec, tickets, implement, fix, review… <b>each one a markdown checklist the agent follows.</b></p>
    </div>
  </div>
</div>
<p class="footline" use:fx={{ d: 1.05 }}>
  Why "Sonata"? The musicians change — Claude, Codex, Copilot — but <b>they all play from the same sheet music.</b>
</p>

<style>
  .what-grid {
    flex: 1; display: grid; grid-template-columns: 1.1fr 1fr;
    gap: clamp(1.2rem, 2.5vw, 2rem); align-items: center; min-height: 0;
  }
  .big-term { max-width: none; font-size: clamp(0.72rem, 1.2vw, 0.95rem); padding: 1em 1.2em; }
  .what-cards { display: flex; flex-direction: column; gap: clamp(0.7rem, 1.6vh, 1.1rem); }
  .what-cards .qcard { padding: clamp(0.8rem, 1.8vh, 1.2rem) clamp(1rem, 1.8vw, 1.4rem); }
</style>
