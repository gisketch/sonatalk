<script lang="ts">
  import { fx } from '../../lib/fx'
</script>

<div class="eyebrow" use:fx>Stage 4 · <span style="text-transform:none">$sonata-implement</span></div>
<h2 use:fx={{ d: 0.1 }}>Implement — one slice, checked as it goes.</h2>
<div class="impl-row">
  <div class="qcard" use:fx={{ d: 0.3 }}>
    <span class="badge"><svg class="icon"><use href="#i-book" /></svg></span>
    <h3>Read before write</h3>
    <p>
      Loads the spec, architecture, and <b>docs/quality.md</b> first, then picks the smallest
      credible risk lane. No ceremony beyond it.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.5 }}>
    <span class="badge"><svg class="icon"><use href="#i-code" /></svg></span>
    <h3>Reuse before invent</h3>
    <p>
      Searches existing patterns and shared code before adding anything.
      <b>Smallest durable change wins.</b>
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.7 }}>
    <span class="badge"><svg class="icon"><use href="#i-gauge" /></svg></span>
    <h3>Check while working</h3>
    <p>
      One targeted check during, one final check for the lane. Docs update
      <b>in the same slice</b> when behavior changes.
    </p>
  </div>
  <div class="term impl-term" use:fx={{ d: 0.9 }}>
    <div class="cmd">./scripts/check-sonata.sh</div>
    <div class="ok">✓ structure · skills · manifest</div>
    <div class="mut">checking source sizes…</div>
    <div class="ok">✓ all files ≤ 300 lines</div>
    <div class="cmd">npm run check</div>
    <div class="ok">✓ 0 errors, 0 warnings</div>
  </div>
</div>
<p class="footline" use:fx={{ d: 1.15 }}>
  Same failure twice? The harness gains a doc, check, fixture, or boundary.
  <b>The system learns — not just the model.</b>
</p>

<style>
  .impl-row {
    flex: 1; display: grid; grid-template-columns: 1fr 1fr 1fr 1.15fr;
    gap: clamp(1rem, 2vw, 1.6rem); align-content: center; align-items: stretch; min-height: 0;
  }
  .impl-row .qcard { padding: clamp(1rem, 2.4vh, 1.6rem) clamp(1rem, 1.8vw, 1.4rem); }
  .impl-term { margin-top: 0; max-width: none; align-self: center; font-size: clamp(0.66rem, 1.05vw, 0.8rem); }
</style>
