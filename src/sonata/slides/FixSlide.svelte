<script lang="ts">
  import { fx } from '../../lib/fx'
</script>

<div class="eyebrow" use:fx>Broken Things · <span style="text-transform:none">$sonata-fix</span></div>
<h2 use:fx={{ d: 0.1 }}>Fix — detective first, mechanic second.</h2>
<div class="card-row three">
  <div class="qcard" use:fx={{ d: 0.3 }}>
    <span class="badge"><svg class="icon"><use href="#i-eye" /></svg></span>
    <h3>Evidence before edits</h3>
    <p>
      Read the whole error. Reproduce at the narrowest seam. Inspect recent diffs and
      <b>trace bad data backward to its source</b>.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.55 }}>
    <span class="badge"><svg class="icon"><use href="#i-zap" /></svg></span>
    <h3>One falsifiable hypothesis</h3>
    <p>
      <b>"X is the root cause because Y."</b> Test with the smallest probe, one variable at a
      time. Disproved? Remove the probe, form a new one.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.8 }}>
    <span class="badge"><svg class="icon"><use href="#i-x" /></svg></span>
    <h3>Know when to stop</h3>
    <p>
      Three failed hypotheses → stop and <b>grill the architecture with a human</b>.
      Never duct tape on a symptom.
    </p>
  </div>
</div>
<p class="footline" use:fx={{ d: 1.1 }}>
  Once confirmed: one focused regression test at the public seam, re-run the reproduction,
  and <b>check a sibling path it could have broken</b>.
</p>
