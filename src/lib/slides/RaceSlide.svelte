<script lang="ts">
  import { fx } from '../fx'
  import ChampionsStrip from '../components/ChampionsStrip.svelte'
  import RaceTrack from '../race/RaceTrack.svelte'
</script>

<div class="eyebrow" use:fx>Game 2 · The Sprint</div>
<h2 use:fx={{ d: 0.1 }}>Fastest feet win. Alternate or stumble.</h2>
<RaceTrack />
<ChampionsStrip />
