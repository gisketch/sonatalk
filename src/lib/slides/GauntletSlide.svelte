<script lang="ts">
  import { fx } from '../fx'
  import { deck } from '../deck.svelte'
  import ChampionsStrip from '../components/ChampionsStrip.svelte'
  import GauntletStage from '../gauntlet/GauntletStage.svelte'
</script>

<div class="eyebrow" use:fx>Game 3 · The Final</div>
<h2 use:fx={{ d: 0.1 }}>The Gauntlet. Obey the screen or fall.</h2>
<GauntletStage finale onnext={() => deck.next()} />
<ChampionsStrip />
