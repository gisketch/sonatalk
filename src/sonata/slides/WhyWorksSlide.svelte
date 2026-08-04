<script lang="ts">
  import { fx } from '../../lib/fx'
</script>

<div class="eyebrow" use:fx>Why It Works</div>
<h2 use:fx={{ d: 0.1 }}>The compound interest of written-down context.</h2>
<div class="card-row three">
  <div class="qcard" use:fx={{ d: 0.3 }}>
    <span class="badge"><svg class="icon"><use href="#i-book" /></svg></span>
    <h3>Memory compounds</h3>
    <p>
      Every settled decision, spec, and rule outlives its session. The day-100 agent is smarter
      than the day-1 agent — <b>same model, richer repo</b>.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.55 }}>
    <span class="badge"><svg class="icon"><use href="#i-repeat" /></svg></span>
    <h3>Mistakes become infrastructure</h3>
    <p>
      A failure that happens twice becomes a doc, a check, a fixture, or a boundary.
      <b>The error rate falls structurally</b>, not by luck.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.8 }}>
    <span class="badge"><svg class="icon"><use href="#i-sliders" /></svg></span>
    <h3>Process stays right-sized</h3>
    <p>
      The router skips every stage that adds no confidence, so it <b>never feels like
      bureaucracy</b> — which is why people actually keep using it.
    </p>
  </div>
</div>
<p class="footline" use:fx={{ d: 1.1 }}>
  Models get swapped every few months. <b>The harness compounds. That's the bet.</b>
</p>
