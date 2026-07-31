<script lang="ts">
  import { fx } from '../fx'
</script>

<div class="quote-wrap">
  <div use:fx={{ d: 0.1 }}>
    <svg class="spark spin" width="44" height="44" viewBox="0 0 100 100"><use href="#sparkShape" /></svg>
  </div>
  <p class="bigquote" style="color:var(--cream-on-dark)" use:fx={{ d: 0.3 }}>
    The model isn&rsquo;t the moat.<br /><span class="accent">The harness is.</span>
  </p>
  <div class="links">
    <span use:fx={{ d: 0.8 }}>
      <svg class="icon"><use href="#i-link" /></svg>read → <b>openai.com/index/harness-engineering</b>
    </span>
    <span use:fx={{ d: 0.95 }}>
      <svg class="icon"><use href="#i-link" /></svg>read → <b>martinfowler.com/articles/harness-engineering.html</b>
    </span>
    <span use:fx={{ d: 1.1 }}>
      <svg class="icon"><use href="#i-gh" /></svg>mine → <b>github.com/gisketch/sonata</b>
    </span>
  </div>
  <p class="salamat" use:fx={{ d: 1.5 }}>Salamat! — questions?</p>
</div>
