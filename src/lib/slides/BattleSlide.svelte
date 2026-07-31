<script lang="ts">
  import { onDestroy } from 'svelte'
  import { fx } from '../fx'
  import { presenter } from '../net/presenter.svelte'
  import { renderBattle, entityAt } from '../battle/draw'
  import { createBattle, findWinner, step, type BattleState } from '../battle/engine'
  import { TEAM_EMOJI, TEAMS, type Team } from '../battle/rps'

  const W = 1280
  const H = 620
  const TICK_MS = 1000 / 30 // interval-driven, immune to rAF throttling

  let canvasEl: HTMLCanvasElement | undefined = $state()
  let battle: BattleState | null = $state.raw(null)
  let running = $state(false)
  let winner = $state<Team | null>(null)
  let survivors = $state<Array<{ id: string; name: string }>>([])
  let timer: ReturnType<typeof setInterval> | undefined
  let lastTick = 0
  const images = new Map<string, HTMLImageElement>()

  const live = $derived(presenter.live && !presenter.forceOffline)
  const canStart = $derived(
    live ? ['pick', 'battle'].includes(presenter.phase) && !running && !winner : !running,
  )

  // Session reset clears the arena too.
  $effect(() => {
    if (live && presenter.phase === 'lobby' && (battle || winner)) {
      clearInterval(timer)
      running = false
      battle = null
      winner = null
      survivors = []
    }
  })

  function contestants() {
    if (live) {
      return presenter.players
        .filter((p) => p.pick)
        .map((p) => ({ id: p.id, name: p.name ?? 'anon', team: p.pick as Team }))
    }
    return Array.from({ length: 12 }, (_, i) => ({
      id: `mock-${i}`,
      name: ['Ash', 'Bo', 'Cy', 'Dot', 'Eel', 'Fig', 'Gus', 'Hex', 'Ivy', 'Jax', 'Kit', 'Lux'][i],
      team: TEAMS[i % 3],
    }))
  }

  function loadImages() {
    images.clear()
    for (const [id, url] of Object.entries(presenter.drawings)) {
      if (url === 'pending') continue
      const img = new Image()
      img.src = url
      images.set(id, img)
    }
  }

  function start() {
    const players = contestants()
    if (players.length === 0) return
    if (live && presenter.phase === 'pick') presenter.advance('battle')
    loadImages()
    winner = null
    survivors = []
    battle = createBattle(players, W, H)
    running = true
    lastTick = performance.now()
    timer = setInterval(tick, TICK_MS)
  }

  function tick() {
    if (!battle || !canvasEl) return
    // Real-elapsed sub-stepping: the sim advances in wall-clock time even when the
    // browser throttles timers (hidden tab, busy main thread), without tunneling.
    const nowT = performance.now()
    let elapsed = Math.min((nowT - lastTick) / 1000, 2)
    lastTick = nowT
    while (elapsed > 0) {
      const dt = Math.min(1 / 30, elapsed)
      const events = step(battle, dt)
      for (const ev of events) {
        if (live) presenter.eliminate(ev.id) // 💀 to that phone
      }
      elapsed -= dt
    }
    renderBattle(canvasEl.getContext('2d')!, battle, images)
    const w = findWinner(battle)
    if (w) finish(w)
  }

  function finish(team: Team) {
    running = false
    clearInterval(timer)
    winner = team
    survivors = battle!.entities.filter((e) => e.alive).map((e) => ({ id: e.id, name: e.name }))
    if (live) presenter.crown(survivors.map((s) => s.id))
  }

  /** Kill-switch: presenter click removes a sprite, styled as a normal elimination. */
  function arenaClick(e: MouseEvent) {
    if (!battle || !running || !canvasEl) return
    const rect = canvasEl.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W
    const y = ((e.clientY - rect.top) / rect.height) * H
    const id = entityAt(battle, x, y)
    if (!id) return
    const entity = battle.entities.find(atE => atE.id === id)!
    entity.alive = false
    if (live) presenter.eliminate(id)
  }

  function toWinners() {
    if (live) presenter.advance('winners', { team: winner, survivors: survivors.map((s) => s.id) })
  }

  onDestroy(() => clearInterval(timer))
</script>

<div class="eyebrow" use:fx>The Arena</div>
<h2 use:fx={{ d: 0.1 }}>Last team standing.</h2>
<div class="arena-wrap" use:fx={{ d: 0.25 }}>
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
  <canvas bind:this={canvasEl} width={W} height={H} onclick={arenaClick}></canvas>
  {#if winner}
    <div class="winner-overlay" use:fx={{ pop: true }}>
      <div class="winner-emoji">{TEAM_EMOJI[winner]}</div>
      <p class="winner-title">Team {winner} wins</p>
      <p class="winner-names">{survivors.map((s) => s.name).join(' · ')}</p>
    </div>
  {/if}
</div>
<div class="arena-ctl">
  {#if canStart}
    <button class="btn" onclick={start}>{live ? 'start the battle →' : 'run mock battle →'}</button>
  {:else if winner}
    <button class="btn" onclick={live ? toWinners : start}>
      {live ? 'crown the winners →' : '↺ run again'}
    </button>
  {/if}
</div>

<style>
  .arena-wrap { position: relative; flex: 1; min-height: 0; display: flex; }
  canvas {
    width: 100%; height: 100%; object-fit: contain;
    background: var(--paper); border: 1px solid var(--line); border-radius: 1.2rem;
  }
  .winner-overlay {
    position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 0.6rem; background: rgba(250, 249, 245, 0.88);
    border-radius: 1.2rem;
  }
  .winner-emoji { font-size: 3.4rem; }
  .winner-title { font-family: var(--serif); font-size: clamp(1.8rem, 4vw, 2.8rem); }
  .winner-names { font-family: var(--mono); font-size: 0.9rem; color: var(--muted); }
  .arena-ctl { display: flex; justify-content: center; padding-top: 0.8rem; }
</style>
