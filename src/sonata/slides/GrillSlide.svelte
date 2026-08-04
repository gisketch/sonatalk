<script lang="ts">
  import { fx } from '../../lib/fx'
</script>

<div class="eyebrow" use:fx>Stage 1 · <span style="text-transform:none">$sonata-grill</span></div>
<h2 use:fx={{ d: 0.1 }}>Grill — one question at a time, before any code.</h2>
<div class="grill-row">
  <div class="qcard" use:fx={{ d: 0.3 }}>
    <span class="badge"><svg class="icon"><use href="#i-grill" /></svg></span>
    <h3>What it is</h3>
    <p>
      An interview that stress-tests the plan <b>while it's still cheap to change</b>.
      No walls of questions, no code written.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.5 }}>
    <span class="badge"><svg class="icon"><use href="#i-eye" /></svg></span>
    <h3>How it behaves</h3>
    <p>
      Looks up facts in the repo itself — asks only real <b>decisions</b>. Every question ships with a
      recommendation and its tradeoff.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.7 }}>
    <span class="badge"><svg class="icon"><use href="#i-check" /></svg></span>
    <h3>When it stops</h3>
    <p>
      When scope, acceptance behavior, and risks are explicit. Settled decisions land in
      <b><code style="font-family:var(--mono);font-size:0.9em">docs/specs/</code></b> as they happen.
    </p>
  </div>
  <div class="doc" use:fx={{ d: 0.9 }}>
    <div class="doc-name">
      <svg class="icon"><use href="#i-grill" /></svg>sonata-grill · one turn
    </div>
    <div class="doc-body">
      <h5>question 3 of ~7</h5>
      <ul><li>Should an eliminated player be able to rejoin the round?</li></ul>
      <h5>recommendation</h5>
      <ul><li>No — permanent elimination. Simpler state, clearer stakes.</li></ul>
      <h5>tradeoff</h5>
      <ul><li>Rejoining is friendlier, but doubles the reconnect logic.</li></ul>
    </div>
  </div>
</div>
<p class="footline" use:fx={{ d: 1.15 }}>
  Like a good architect: they don't hand you a blank page — <b>one sharp question at a time, always with an opinion.</b>
</p>

<style>
  .grill-row {
    flex: 1; display: grid; grid-template-columns: 1fr 1fr 1fr 1.3fr;
    gap: clamp(1rem, 2vw, 1.6rem); align-content: center; align-items: stretch; min-height: 0;
  }
  .grill-row .qcard { padding: clamp(1rem, 2.4vh, 1.6rem) clamp(1rem, 1.8vw, 1.4rem); }
  .grill-row .doc { margin-top: 0; max-width: none; align-self: center; }
</style>
