<script lang="ts">
  import { fx } from '../../lib/fx'
</script>

<div class="eyebrow" use:fx>The Sensors</div>
<h2 use:fx={{ d: 0.1 }}>Quality gates — opt-in, pinned, agent-readable.</h2>
<div class="card-row three">
  <div class="qcard" use:fx={{ d: 0.3 }}>
    <span class="badge"><svg class="icon"><use href="#i-check" /></svg></span>
    <h3><code>check-sonata.sh</code></h3>
    <p>
      Structure, skills, manifest readiness, and the <b>300-line size gate</b>.
      Seconds to run — and agents run it on themselves.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.55 }}>
    <span class="badge"><svg class="icon"><use href="#i-gauge" /></svg></span>
    <h3>SCC — complexity</h3>
    <p>
      Per-language ceilings recommended from <b>your own code's 75th percentile</b>.
      Flags the file before it becomes the haunted house nobody enters.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.8 }}>
    <span class="badge"><svg class="icon"><use href="#i-shield" /></svg></span>
    <h3>Skylos — security</h3>
    <p>
      Security, secrets, and quality scans on <b>changed code only</b> —
      the diff pays the toll, not the whole repo.
    </p>
  </div>
</div>
<p class="footline" use:fx={{ d: 1.1 }}>
  Nothing installs without confirmation; a disabled gate never runs. Enabled gates are
  <b>pinned to exact versions</b> — same verdict on every machine, and in CI.
</p>
