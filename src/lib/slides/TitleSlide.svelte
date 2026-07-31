<script lang="ts">
  import { fx } from '../fx'
</script>

<div class="title-wrap">
  <div use:fx={{ d: 0.1 }}>
    <svg class="spark spin" width="52" height="52" viewBox="0 0 100 100"><use href="#sparkShape" /></svg>
  </div>
  <div class="eyebrow" use:fx={{ d: 0.25 }}>Weekly Tech Talk · AI Session</div>
  <h1 use:fx={{ d: 0.4 }}>Harness<br />Engineering</h1>
  <p class="sub" style="margin-top:1.2rem" use:fx={{ d: 0.6 }}>
    Building trust in coding agents — and the one I built for myself.
  </p>
  <div class="byline" use:fx={{ d: 0.8 }}>
    <b>Ghe Jimenez</b><span>gisketch</span><span>·</span><span>8 minutes</span>
  </div>
</div>
