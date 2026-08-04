<script lang="ts">
  import { fx } from '../../lib/fx'
</script>

<div class="title-wrap">
  <div use:fx={{ d: 0.1 }}>
    <svg class="spark spin" width="52" height="52" viewBox="0 0 100 100"><use href="#sparkShape" /></svg>
  </div>
  <div class="eyebrow" use:fx={{ d: 0.25 }}>Team KT · Working with Coding Agents</div>
  <h1 use:fx={{ d: 0.4 }}>Sonata</h1>
  <p class="sub" style="margin-top:1.2rem" use:fx={{ d: 0.6 }}>
    A harness for coding agents — what it is, why it works, and how to actually use it.
  </p>
  <div class="byline" use:fx={{ d: 0.8 }}>
    <b>github.com/gisketch/sonata</b><span>·</span><span>knowledge transfer</span>
  </div>
</div>
