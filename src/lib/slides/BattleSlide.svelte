<script lang="ts">
  import { fx } from '../fx'
  import Arena from '../battle/Arena.svelte'
</script>

<div class="eyebrow" use:fx>The Arena</div>
<h2 use:fx={{ d: 0.1 }}>Last team standing.</h2>
<Arena />
