<script lang="ts">
  import { fx } from '../fx'
</script>

<div class="eyebrow" use:fx>The Problem</div>
<div class="quote-wrap">
  <p class="bigquote" use:fx={{ d: 0.2 }}>The agent writes the feature in minutes.</p>
  <p class="bigquote" use:fx={{ d: 0.7 }}>
    Then I spend the rest of the day <span class="accent">reviewing everything it wrote.</span>
  </p>
  <p class="quote-kicker" use:fx={{ d: 1.4 }}>
    Speed stopped being the bottleneck. <b>Trust is the bottleneck.</b>
  </p>
</div>
