<script lang="ts">
  import { onDestroy } from 'svelte'
  import Defs from '../lib/components/Defs.svelte'
  import { connect, type Snapshot } from '../lib/net/socket'
  import DrawBoard from './DrawBoard.svelte'
  import NameGate from './NameGate.svelte'
  import PickRPS from './PickRPS.svelte'
  import Race from './Race.svelte'
  import Gauntlet from './Gauntlet.svelte'

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
      // Full session reset: reload rejoins this phone as a brand-new player.
      if (msg.type === 'kicked') location.reload()
      if (msg.type === 'snapshot') {
        phase = msg.phase
        payload = msg.payload
        players = msg.players
        // Server truth wins: a rematch revives this phone even if it died last game.
        const self = msg.players.find((p) => p.id === myId)
        if (self) dead = !self.alive
        // new game — the old crown comes off
        if (['pick', 'race', 'gauntlet'].includes(msg.phase)) champion = false
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
  {:else if ['names', 'canvas', 'tools', 'drawing', 'pick', 'race', 'gauntlet'].includes(phase) && !named}
    <!-- The name gate can't be skipped: it stays until submitted, whatever has shipped since. -->
    <NameGate onsubmit={(name) => link.send({ type: 'setName', name })} />
  {:else if ['pick', 'race', 'gauntlet'].includes(phase) && me && !me.hasDrawing}
    <!-- late joiner: untimed character draw before entering the game -->
    <DrawBoard phase="onboard" {myId} name={me?.name ?? null} />
  {:else if phase === 'gauntlet'}
    <Gauntlet
      {payload}
      {myId}
      score={me?.score ?? 0}
      winnerName={(payload.winner as { id: string; name: string } | undefined)?.name ?? null}
      isWinner={(payload.winner as { id: string } | undefined)?.id === myId}
      ontap={(side) => link.send({ type: 'gauntletTap', side })}
    />
  {:else if phase === 'race'}
    <Race
      {payload}
      {myId}
      steps={me?.steps ?? 0}
      hasDrawing={me?.hasDrawing ?? false}
      winnerName={(payload.winner as { id: string; name: string } | undefined)?.name ?? null}
      winnerAvatar={(() => {
        const w = payload.winner as { id: string } | undefined
        return w && players.find((p) => p.id === w.id)?.hasDrawing ? `/api/drawing/${w.id}` : null
      })()}
      isWinner={(payload.winner as { id: string } | undefined)?.id === myId}
      ontap={(side) => link.send({ type: 'raceTap', side })}
    />
  {:else if phase === 'canvas' || phase === 'tools' || phase === 'drawing'}
    <DrawBoard
      {phase}
      {payload}
      {myId}
      name={me?.name ?? null}
      ready={me?.ready ?? false}
      onready={(ready) => link.send({ type: 'drawReady', ready })}
    />
  {:else if phase === 'pick' && (dead || me?.alive === false)}
    <div class="bigmoji">💀</div>
    <p class="phone-title">Eliminated!</p>
    <p class="phone-note">The survivors are re-picking for the next round. Watch the big screen.</p>
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
