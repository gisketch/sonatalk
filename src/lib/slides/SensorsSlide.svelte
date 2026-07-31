<script lang="ts">
  import { fx } from '../fx'
</script>

<div class="eyebrow" use:fx>Sonata · The Feedback Half</div>
<h2 use:fx={{ d: 0.1 }}>Sensors that agents actually listen to</h2>
<div class="card-row three">
  <div class="qcard" use:fx={{ d: 0.3 }}>
    <span class="badge"><svg class="icon"><use href="#i-ruler" /></svg></span>
    <span class="mistake">Agents write god-files</span>
    <h3>300-line limit</h3>
    <p>
      My own script, <b>run by the agent itself</b>. Big files degrade both agent context and human
      review — so they simply aren't allowed to exist.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.55 }}>
    <span class="badge"><svg class="icon"><use href="#i-gauge" /></svg></span>
    <span class="mistake">Agents over-engineer</span>
    <h3><code>scc</code> — complexity</h3>
    <p>
      Counts lines and complexity across the codebase. When a "small feature" balloons,
      <b>the numbers say so before I do</b>.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.8 }}>
    <span class="badge"><svg class="icon"><use href="#i-ghost" /></svg></span>
    <span class="mistake">Agents leave orphans</span>
    <h3><code>skylos</code> — dead code</h3>
    <p>
      Agents love leaving unused functions and imports behind after refactors.
      <b>Dead code detection hunts the ghosts.</b>
    </p>
  </div>
</div>
<p class="footline" use:fx={{ d: 1.1 }}>
  These are <b>examples, not a prescription</b> — the pattern is: every check speaks in errors the
  agent can act on.
</p>
