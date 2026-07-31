<script lang="ts">
  import { onDestroy } from 'svelte'
  import Defs from '../lib/components/Defs.svelte'
  import { connect, type Snapshot } from '../lib/net/socket'
  import DrawBoard from './DrawBoard.svelte'
  import NameGate from './NameGate.svelte'
  import PickRPS from './PickRPS.svelte'

  let phase = $state('lobby')
  let payload = $state<Record<string, unknown>>({})
  let myId = $state<string | null>(null)
  let open = $state(false)
  let players = $state<Snapshot['players']>([])
  let dead = $state(false)
  let champion = $state(false)

  const link = connect(
    { role: 'phone' },
    (msg) => {
      if (msg.type === 'you') myId = msg.id
      if (msg.type === 'eliminated') dead = true
      if (msg.type === 'winner') champion = true
      if (msg.type === 'reset') {
        dead = false
        champion = false
      }
      if (msg.type === 'snapshot') {
        phase = msg.phase
        payload = msg.payload
        players = msg.players
      }
    },
    (o) => (open = o),
  )

  onDestroy(() => link.close())

  const me = $derived(players.find((p) => p.id === myId))
  const named = $derived(!!me?.name)
</script>

<Defs />

<main class="phone">
  {#if !open}
    <div class="phone-note">connecting…</div>
  {:else if phase === 'lobby'}
    <svg class="spark pulse" width="44" height="44" viewBox="0 0 100 100"><use href="#sparkShape" /></svg>
    <div class="eyebrow">live</div>
    <p class="phone-title">You're in.</p>
    <p class="phone-note">Keep this open — things will start appearing here during the talk.</p>
  {:else if phase === 'names' && !named}
    <NameGate onsubmit={(name) => link.send({ type: 'setName', name })} />
  {:else if phase === 'canvas' || phase === 'tools' || phase === 'drawing'}
    <DrawBoard {phase} {payload} {myId} name={me?.name ?? null} />
  {:else if phase === 'pick' && me?.ready}
    <div class="bigmoji">{me.pick === 'rock' ? '🪨' : me.pick === 'paper' ? '📄' : '✂️'}</div>
    <p class="phone-title">Ready.</p>
    <p class="phone-note">Spawn locked. Watch the big screen — battle starts soon.</p>
  {:else if phase === 'pick'}
    <PickRPS
      pick={me?.pick ?? null}
      onpick={(pick) => link.send({ type: 'pick', pick })}
      onready={(spawn) => link.send({ type: 'ready', spawn })}
    />
  {:else if phase === 'battle' && dead}
    <div class="bigmoji">💀</div>
    <p class="phone-title">Eliminated!</p>
    <p class="phone-note">Your character fought bravely. Watch the big screen.</p>
  {:else if phase === 'battle'}
    <div class="bigmoji">⚔️</div>
    <p class="phone-title">Your character is in the arena.</p>
    <p class="phone-note">Eyes on the big screen — collisions settle everything.</p>
  {:else if phase === 'winners' || phase === 'reveal'}
    <div class="bigmoji">{champion ? '🏆' : '👏'}</div>
    <p class="phone-title">{champion ? 'Champion!' : 'Good game.'}</p>
    <p class="phone-note">
      {champion ? 'Your character survived the arena.' : 'Every drawing returns for the finale.'}
    </p>
  {:else}
    <svg class="spark pulse" width="44" height="44" viewBox="0 0 100 100"><use href="#sparkShape" /></svg>
    <div class="eyebrow">live</div>
    <p class="phone-title">{me?.name ?? 'You'}</p>
    <p class="phone-note">Locked in. Watch the big screen.</p>
  {/if}
</main>
