<script lang="ts">
  import { fx } from '../../lib/fx'
</script>

<div class="eyebrow" use:fx>Confidence · <span style="text-transform:none">$sonata-review</span></div>
<h2 use:fx={{ d: 0.1 }}>Review — three separate lenses, never blended.</h2>
<div class="card-row three">
  <div class="qcard" use:fx={{ d: 0.3 }}>
    <span class="badge"><svg class="icon"><use href="#i-ruler" /></svg></span>
    <h3>Standards</h3>
    <p>
      Documented boundaries, duplication, file-size pressure, security,
      <b>scope discipline</b> — did the diff stay in its lane?
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.55 }}>
    <span class="badge"><svg class="icon"><use href="#i-spec" /></svg></span>
    <h3>Spec</h3>
    <p>
      Does the change do <b>what the contract says</b>? Missing, partial, or unrequested
      behavior — with the requirement quoted.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.8 }}>
    <span class="badge"><svg class="icon"><use href="#i-shield" /></svg></span>
    <h3>Behavior</h3>
    <p>
      Is there <b>evidence it actually works</b>? Regressions, wrong public behavior,
      risky seams left untested.
    </p>
  </div>
</div>
<p class="footline" use:fx={{ d: 1.1 }}>
  Findings ranked <b>P0</b> (data/security loss) → <b>P3</b> (cleanup), each with exact file:line and the
  smallest credible fix. <b>Review reports — it never edits.</b>
</p>
