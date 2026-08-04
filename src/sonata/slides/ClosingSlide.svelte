<script lang="ts">
  import { fx } from '../../lib/fx'
</script>

<div class="quote-wrap">
  <div use:fx={{ d: 0.1 }}>
    <svg class="spark spin" width="44" height="44" viewBox="0 0 100 100"><use href="#sparkShape" /></svg>
  </div>
  <p class="bigquote" style="color:var(--cream-on-dark)" use:fx={{ d: 0.3 }}>
    The repository is the source of truth.<br />
    <span class="accent">Everything else just coordinates.</span>
  </p>
  <div class="links">
    <span use:fx={{ d: 0.8 }}>
      <svg class="icon"><use href="#i-gh" /></svg>the harness → <b>github.com/gisketch/sonata</b>
    </span>
    <span use:fx={{ d: 0.95 }}>
      <svg class="icon"><use href="#i-zap" /></svg>try it → <b>npx github:gisketch/sonata init . && /sonata-work</b>
    </span>
  </div>
  <p class="salamat" use:fx={{ d: 1.4 }}>Salamat! — questions?</p>
</div>
