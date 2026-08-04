<script lang="ts">
  import { fx } from '../../lib/fx'
</script>

<div class="eyebrow" use:fx>Getting Started</div>
<h2 use:fx={{ d: 0.1 }}>Two doors in: new project, existing project.</h2>
<div class="card-row two">
  <div class="qcard" use:fx={{ d: 0.3 }}>
    <span class="badge"><svg class="icon"><use href="#i-pen" /></svg></span>
    <h3>Greenfield → <code>$sonata-setup</code></h3>
    <div class="term start-term">
      <div class="cmd">npx github:gisketch/sonata init my-app</div>
      <div class="cmd">/sonata-setup</div>
    </div>
    <p>
      An interview, <b>one question per turn</b>: vision, current milestone, non-goals,
      commands, optional quality gates. It never asks what the repo already answers.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.55 }}>
    <span class="badge"><svg class="icon"><use href="#i-layers" /></svg></span>
    <h3>Existing codebase → <code>$sonata-retrofit</code></h3>
    <div class="term start-term">
      <div class="cmd">npx github:gisketch/sonata init .</div>
      <div class="cmd">/sonata-retrofit</div>
    </div>
    <p>
      Reads the whole repo deeply <b>before</b> interviewing — real architecture, real commands,
      real domain. <b>Never overwrites docs you already have.</b>
    </p>
  </div>
</div>
<p class="footline" use:fx={{ d: 0.9 }}>
  Readiness is a gate: spec, tickets, and implement check <b>.sonata/manifest.json</b> and stop
  until setup finishes — so nobody builds on a half-configured harness.
</p>

<style>
  .start-term { margin: 0.7em 0 0.9em; max-width: none; }
</style>
