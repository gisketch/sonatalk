<script lang="ts">
  import { fx } from '../fx'
</script>

<div class="eyebrow" use:fx>Your Turn</div>
<h2 use:fx={{ d: 0.1 }}>Build your own. Start tiny.</h2>
<div class="card-row three">
  <div class="qcard" use:fx={{ d: 0.3 }}>
    <span class="badge"><svg class="icon"><use href="#i-pen" /></svg></span>
    <h3>1 · Write one rule down</h3>
    <p>
      Put a single convention in <b>AGENTS.md</b> — the thing you keep correcting. Ten minutes,
      today.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.55 }}>
    <span class="badge"><svg class="icon"><use href="#i-gauge" /></svg></span>
    <h3>2 · Wire one sensor</h3>
    <p>A linter, a test, a check — with error messages <b>the agent can read and act on</b>.</p>
  </div>
  <div class="qcard" use:fx={{ d: 0.8 }}>
    <span class="badge"><svg class="icon"><use href="#i-repeat" /></svg></span>
    <h3>3 · Repeat forever</h3>
    <p>
      Every mistake that happens twice becomes a new guide or sensor.
      <b>That's the whole practice.</b>
    </p>
  </div>
</div>
