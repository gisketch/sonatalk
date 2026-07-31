<script lang="ts">
  import { fx } from '../fx'
  import Simulator from '../sim/Simulator.svelte'
</script>

<div class="eyebrow" use:fx>Sonata · The Feature Workflow</div>
<h2 use:fx={{ d: 0.1 }}>Pick a task. Watch the flow.</h2>
<Simulator />
