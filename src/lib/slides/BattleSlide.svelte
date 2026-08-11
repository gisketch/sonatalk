<script lang="ts">
  import { onDestroy } from 'svelte'
  import { fx } from '../fx'
  import { presenter } from '../net/presenter.svelte'
  import { renderBattle, entityAt } from '../battle/draw'
  import {
    ARENA_H, ARENA_W, createBattle, findWinner, step, type BattleState,
  } from '../battle/engine'
  import { TEAM_EMOJI, TEAMS, type Team } from '../battle/rps'

  const W = ARENA_W
  const H = ARENA_H
  const TICK_MS = 1000 / 30 // interval-driven, immune to rAF throttling
  const SPEEDS = Array.from({ length: 12 }, (_, i) => 0.25 * (i + 1)) // 0.25× … 3×
  const IDLE_ANIMS = ['bounce', 'spin', 'sway', 'hop']
  const CONFETTI = Array.from({ length: 44 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 2.4,
    duration: 2.6 + Math.random() * 2.2,
    color: ['#D97757', '#C4633F', '#4A7A8C', '#6B8F5E', '#C9A227', '#262624'][i % 6],
    tilt: Math.random() * 360,
  }))

  let canvasEl: HTMLCanvasElement | undefined = $state()
  let battle: BattleState | null = $state.raw(null)
  let running = $state(false)
  let winner = $state<Team | null>(null)
  let survivors = $state<Array<{ id: string; name: string }>>([])
  let timer: ReturnType<typeof setInterval> | undefined
  let lastTick = 0
  let speedIdx = $state(3) // 1×
  const images = new Map<string, HTMLImageElement>()

  const timeScale = $derived(SPEEDS[speedIdx])

  const live = $derived(presenter.live && !presenter.forceOffline)
  const canStart = $derived(
    live ? ['pick', 'battle'].includes(presenter.phase) && !running && !winner : !running,
  )

  // Session reset clears the arena too — even mid-forceOffline.
  $effect(() => {
    if (presenter.live && presenter.phase === 'lobby' && (battle || winner)) {
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
        .map((p) => ({
          id: p.id, name: p.name ?? 'anon', team: p.pick as Team, spawn: p.spawn,
        }))
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
    let elapsed = Math.min((nowT - lastTick) / 1000, 2) * timeScale
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
      <div class="confetti">
        {#each CONFETTI as c, i (i)}
          <span
            style:left="{c.left}%"
            style:background={c.color}
            style:animation-delay="{c.delay}s"
            style:animation-duration="{c.duration}s"
            style:transform="rotate({c.tilt}deg)"
          ></span>
        {/each}
      </div>
      <div class="winner-emoji">{TEAM_EMOJI[winner]}</div>
      <p class="winner-title">Team {winner} wins</p>
      <div class="winner-crew">
        {#each survivors as s, i (s.id)}
          <figure
            class="crew {IDLE_ANIMS[i % IDLE_ANIMS.length]}"
            style:animation-duration="{1.3 + (i % 5) * 0.25}s"
            style:animation-delay="{(i % 7) * 0.13}s"
          >
            {#if presenter.drawings[s.id] && presenter.drawings[s.id] !== 'pending'}
              <img src={presenter.drawings[s.id]} alt={s.name} />
            {:else}
              <span class="crew-fallback">{TEAM_EMOJI[winner]}</span>
            {/if}
            <figcaption>{s.name}</figcaption>
          </figure>
        {/each}
      </div>
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
  {#if running}
    <div class="speedctl">
      <button class="btn ghost" onclick={() => (speedIdx = Math.max(0, speedIdx - 1))} disabled={speedIdx === 0}>−</button>
      <span class="speed">{timeScale}×</span>
      <button class="btn ghost" onclick={() => (speedIdx = Math.min(SPEEDS.length - 1, speedIdx + 1))} disabled={speedIdx === SPEEDS.length - 1}>+</button>
    </div>
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

  .winner-crew {
    display: flex; flex-wrap: wrap; justify-content: center; gap: 1.2rem;
    margin-top: 0.8rem; max-width: 80%;
  }
  .crew { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
  .crew img, .crew-fallback {
    width: 4.6rem; height: 4.6rem; border-radius: 50%; border: 2px solid var(--ink);
    background: #fff; object-fit: cover; display: flex; align-items: center;
    justify-content: center; font-size: 2rem;
  }
  .crew figcaption { font-family: var(--mono); font-size: 0.66rem; color: var(--ink-soft); }
  .crew.bounce { animation: crewBounce infinite ease-in-out; }
  .crew.spin { animation: crewSpin infinite linear; }
  .crew.sway { animation: crewSway infinite ease-in-out; }
  .crew.hop { animation: crewHop infinite cubic-bezier(0.3, 1.4, 0.5, 1); }
  @keyframes crewBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
  @keyframes crewSpin { to { transform: rotate(360deg); } }
  @keyframes crewSway { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
  @keyframes crewHop { 0%, 100% { transform: translateY(0) scale(1); } 40% { transform: translateY(-10px) scale(1.08); } 60% { transform: translateY(-4px) scale(0.98); } }

  .confetti { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .confetti span {
    position: absolute; top: -4%; width: 0.55rem; height: 0.9rem; border-radius: 0.15rem;
    opacity: 0.9; animation-name: confettiFall; animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  @keyframes confettiFall {
    to { top: 104%; transform: rotate(720deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .crew, .confetti span { animation: none !important; }
  }
  .arena-ctl { display: flex; justify-content: center; align-items: center; gap: 1rem; padding-top: 0.8rem; }
  .speedctl { display: flex; align-items: center; gap: 0.55rem; }
  .speed {
    font-family: var(--mono); font-size: 0.8rem; color: var(--ink-soft);
    min-width: 2.6em; text-align: center;
  }
</style>
