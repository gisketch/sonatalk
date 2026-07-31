<script lang="ts">
  import { fx } from '../fx'
</script>

<div class="eyebrow" use:fx>My Harness</div>
<h2 use:fx={{ d: 0.1 }}>Sonata — the same two ideas, made concrete</h2>
<div class="card-row two">
  <div class="qcard" use:fx={{ d: 0.35 }}>
    <span class="badge"><svg class="icon"><use href="#i-book" /></svg></span>
    <span class="mistake">Feedforward</span>
    <h3>Skills that build</h3>
    <p>
      A set of skills the agent runs to take a feature from idea to code — grilling, speccing,
      ticketing, implementing. <b>The agent can't skip steps.</b>
    </p>
  </div>
  <div class="qcard dark-card" use:fx={{ d: 0.6 }}>
    <span class="badge"><svg class="icon"><use href="#i-shield" /></svg></span>
    <span class="mistake">Feedback</span>
    <h3>Checks that validate</h3>
    <p>
      Quality sensors that fire on every change and feed errors straight back.
      <b>The agent self-corrects before I read anything.</b>
    </p>
  </div>
</div>
<p class="footline" use:fx={{ d: 0.9 }}>
  <svg class="icon" style="color:var(--clay-deep)"><use href="#i-gh" /></svg>&ensp;github.com/gisketch/sonata
  — grown feature by feature on real work, not designed in a vacuum.
</p>
