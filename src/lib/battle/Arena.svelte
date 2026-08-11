<script lang="ts">
  import { onDestroy } from 'svelte'
  import { fx } from '../fx'
  import { presenter } from '../net/presenter.svelte'
  import { renderBattle, entityAt } from './draw'
  import {
    ARENA_H, ARENA_W, createBattle, findWinner, step, type BattleState,
  } from './engine'
  import { TEAMS, type Team } from './rps'
  import WinnerOverlay from './WinnerOverlay.svelte'

  /** rematchable: game mode — offers "rematch" (revive-all) after a champion is crowned. */
  let { rematchable = false }: { rematchable?: boolean } = $props()

  const W = ARENA_W
  const H = ARENA_H
  const TICK_MS = 1000 / 30 // interval-driven, immune to rAF throttling
  const SPEEDS = Array.from({ length: 12 }, (_, i) => 0.25 * (i + 1)) // 0.25× … 3×

  let canvasEl: HTMLCanvasElement | undefined = $state()
  let battle: BattleState | null = $state.raw(null)
  let preview = $state(false)
  let running = $state(false)
  let winner = $state<Team | null>(null)
  let survivors = $state<Array<{ id: string; name: string }>>([])
  let timer: ReturnType<typeof setInterval> | undefined
  let lastTick = 0
  let speedIdx = $state(3) // 1×
  const images = new Map<string, HTMLImageElement>()

  const timeScale = $derived(SPEEDS[speedIdx])

  const live = $derived(presenter.live && !presenter.forceOffline)

  // Sudden-death gate: only living, connected players pick each round.
  const alivePickers = $derived(
    presenter.players.filter(
      (p) => (p as (typeof presenter.players)[0] & { connected?: boolean }).connected && p.alive,
    ),
  )
  const readyCount = $derived(alivePickers.filter((p) => p.ready).length)
  const allReady = $derived(alivePickers.length > 0 && alivePickers.every((p) => p.ready))

  // Session reset clears the arena too — even mid-forceOffline.
  $effect(() => {
    if (presenter.live && presenter.phase === 'lobby' && (battle || winner || preview)) {
      clearLocal()
    }
  })

  function clearLocal() {
    clearInterval(timer)
    running = false
    preview = false
    battle = null
    winner = null
    survivors = []
  }

  function contestants() {
    if (live) {
      return presenter.players
        .filter((p) => p.pick && p.alive)
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

  /** Step 1: freeze everyone at their chosen spawn — weapons stay secret. */
  function showPlayers() {
    const players = contestants()
    if (players.length === 0) return
    loadImages()
    winner = null
    survivors = []
    battle = createBattle(players, W, H)
    preview = true
    clearInterval(timer)
    // re-render as drawings finish loading; nothing moves until start()
    timer = setInterval(() => {
      if (canvasEl && battle) renderBattle(canvasEl.getContext('2d')!, battle, images, { hideTeams: true })
    }, 350)
  }

  /** Step 2: reveal the teams and let them loose. */
  function start() {
    if (!battle || winner) {
      // offline mock (incl. run-again), or deck-refresh recovery mid-battle-phase
      const players = contestants()
      if (players.length === 0) return
      loadImages()
      winner = null
      survivors = []
      battle = createBattle(players, W, H)
    }
    if (live && presenter.phase === 'pick') presenter.advance('battle')
    preview = false
    running = true
    clearInterval(timer)
    lastTick = performance.now()
    timer = setInterval(tick, TICK_MS)
  }

  /** More than one survivor: everyone standing re-picks weapon + spawn. */
  function nextRound() {
    clearLocal()
    if (live) presenter.advance('pick')
  }

  /** New game: everyone revives (server-side), same characters, fresh picks. */
  function rematch() {
    clearLocal()
    if (live) presenter.rematch()
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
    // No crowning yet — with >1 survivor the round repeats until a sole champion.
    if (live && survivors.length === 1) presenter.crown(survivors.map((s) => s.id))
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

  const isChampion = $derived(!!winner && survivors.length === 1)
  const crowned = $derived(isChampion && presenter.phase === 'winners')

  onDestroy(() => clearInterval(timer))
</script>

<div class="arena-wrap" use:fx={{ d: 0.25 }}>
  <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
  <canvas bind:this={canvasEl} width={W} height={H} onclick={arenaClick}></canvas>
  {#if winner}
    <WinnerOverlay {winner} {survivors} {isChampion} />
  {/if}
</div>
<div class="arena-ctl">
  {#if live}
    {#if winner}
      {#if isChampion && rematchable && crowned}
        <button class="btn" onclick={rematch}>rematch — next game →</button>
      {:else if isChampion}
        <button class="btn" onclick={toWinners} disabled={crowned}>crown the winner →</button>
      {:else}
        <button class="btn" onclick={nextRound}>next round — re-pick →</button>
      {/if}
    {:else if running}
      <!-- speed control only -->
    {:else if preview || presenter.phase === 'battle'}
      <button class="btn" onclick={start}>start the battle →</button>
    {:else if presenter.phase === 'pick'}
      <button class="btn" disabled={!allReady} onclick={showPlayers}>
        {allReady ? 'show players →' : `waiting… ${readyCount} / ${alivePickers.length} ready`}
      </button>
    {:else if rematchable && ['winners', 'reveal'].includes(presenter.phase)}
      <button class="btn" onclick={rematch}>rematch — new game →</button>
    {/if}
  {:else if winner}
    <button class="btn" onclick={start}>↺ run again</button>
  {:else if !running}
    <button class="btn" onclick={start}>run mock battle →</button>
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
  .arena-ctl { display: flex; justify-content: center; align-items: center; gap: 1rem; padding-top: 0.8rem; }
  .speedctl { display: flex; align-items: center; gap: 0.55rem; }
  .speed {
    font-family: var(--mono); font-size: 0.8rem; color: var(--ink-soft);
    min-width: 2.6em; text-align: center;
  }
</style>
