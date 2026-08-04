<script lang="ts">
  import { fx } from '../../lib/fx'
</script>

<div class="eyebrow" use:fx>Keeping It Healthy</div>
<h2 use:fx={{ d: 0.1 }}>Audit and upgrade — service days for the repo.</h2>
<div class="card-row two">
  <div class="qcard" use:fx={{ d: 0.3 }}>
    <span class="badge"><svg class="icon"><use href="#i-eye" /></svg></span>
    <h3><code>$sonata-audit</code> — the full inspection</h3>
    <p>
      Whole-repo scan: exploitable security, exposed secrets, complexity hotspots.
      Scanner output is <b>evidence, not truth</b> — findings get read before they're believed.
      Ends in a prioritized remediation plan and <b>changes zero code</b>.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.55 }}>
    <span class="badge"><svg class="icon"><use href="#i-repeat" /></svg></span>
    <h3><code>$sonata-upgrade</code> — the safe recall</h3>
    <p>
      Updates harness files via <b>checksums and a dry-run</b>. Files you've modified become
      conflicts to resolve deliberately — never casualties. Like a manufacturer recall that
      <b>won't repaint your custom paint job</b>.
    </p>
  </div>
</div>
<p class="footline" use:fx={{ d: 0.9 }}>
  Both stay advisory until you approve. <b>Sonata never force-overwrites and never commits on its own.</b>
</p>
