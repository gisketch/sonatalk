import { preyOf, resolve, soleTeam, type Team } from './rps'

export interface Entity {
  id: string
  name: string
  team: Team
  x: number
  y: number
  vx: number
  vy: number
  /** per-player speed, randomized at spawn */
  speed: number
  r: number
  alive: boolean
}

export interface BattleState {
  entities: Entity[]
  w: number
  h: number
  /** seconds since battle start */
  elapsed: number
  /** wall inset grows during the forced-end ramp */
  inset: number
}

export interface Elimination {
  id: string
  by: string
}

export interface SpawnPlayer {
  id: string
  name: string
  team: Team
  /** normalized 0..1 arena position chosen on the phone; ring fallback when absent */
  spawn?: { x: number; y: number } | null
}

/** Canonical arena raster — deck renders it, phones mirror its aspect for spawn choice. */
export const ARENA_W = 1280
export const ARENA_H = 620

const BASE_SPEED = 95 // px/s
const SPEED_JITTER: [number, number] = [0.65, 1.45] // per-player random factor
const TURN_RATE = 3.2 // rad/s steering toward prey
export const RAMP_AT = 45 // s — speeds up + arena shrinks after this
const RAMP_SPEED_PER_S = 0.035
const RAMP_INSET_PER_S = 6
const MAX_INSET_FRACTION = 0.36

export function createBattle(players: SpawnPlayer[], w: number, h: number, radius = 34): BattleState {
  const entities = players.map((p, i) => {
    const ring = (i / Math.max(1, players.length)) * Math.PI * 2
    const x = p.spawn ? p.spawn.x * (w - radius * 2) + radius : w / 2 + Math.cos(ring) * (w / 3.2)
    const y = p.spawn ? p.spawn.y * (h - radius * 2) + radius : h / 2 + Math.sin(ring) * (h / 3.2)
    const dir = Math.random() * Math.PI * 2
    const speed =
      BASE_SPEED * (SPEED_JITTER[0] + Math.random() * (SPEED_JITTER[1] - SPEED_JITTER[0]))
    return {
      id: p.id, name: p.name, team: p.team,
      x, y,
      vx: Math.cos(dir) * speed, vy: Math.sin(dir) * speed,
      speed, r: radius, alive: true,
    }
  })
  return { entities, w, h, elapsed: 0, inset: 0 }
}

function nearestPrey(e: Entity, alive: Entity[]): Entity | null {
  const prey = preyOf(e.team)
  let best: Entity | null = null
  let bestDist = Infinity
  for (const other of alive) {
    if (other.team !== prey || !other.alive) continue
    const d = Math.hypot(other.x - e.x, other.y - e.y)
    if (d < bestDist) {
      bestDist = d
      best = other
    }
  }
  return best
}

/** Advance the sim by dt seconds. Mutates state; returns eliminations this step. */
export function step(state: BattleState, dt: number): Elimination[] {
  state.elapsed += dt
  const past = Math.max(0, state.elapsed - RAMP_AT)
  const speedMul = 1 + past * RAMP_SPEED_PER_S
  state.inset = Math.min(
    Math.min(state.w, state.h) * MAX_INSET_FRACTION,
    past * RAMP_INSET_PER_S,
  )

  const alive = state.entities.filter((e) => e.alive)
  for (const e of alive) {
    // steer toward nearest prey; without prey, keep current heading
    const target = nearestPrey(e, alive)
    const heading = Math.atan2(e.vy, e.vx)
    let newHeading = heading
    if (target) {
      const want = Math.atan2(target.y - e.y, target.x - e.x)
      let diff = want - heading
      while (diff > Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      const turn = Math.max(-TURN_RATE * dt, Math.min(TURN_RATE * dt, diff))
      newHeading = heading + turn
    }
    const v = e.speed * speedMul
    e.vx = Math.cos(newHeading) * v
    e.vy = Math.sin(newHeading) * v
    e.x += e.vx * dt
    e.y += e.vy * dt

    const minX = state.inset + e.r
    const maxX = state.w - state.inset - e.r
    const minY = state.inset + e.r
    const maxY = state.h - state.inset - e.r
    if (e.x < minX) { e.x = minX; e.vx = Math.abs(e.vx) }
    if (e.x > maxX) { e.x = maxX; e.vx = -Math.abs(e.vx) }
    if (e.y < minY) { e.y = minY; e.vy = Math.abs(e.vy) }
    if (e.y > maxY) { e.y = maxY; e.vy = -Math.abs(e.vy) }
  }

  const events: Elimination[] = []
  for (let i = 0; i < alive.length; i++) {
    for (let j = i + 1; j < alive.length; j++) {
      const a = alive[i]
      const b = alive[j]
      if (!a.alive || !b.alive) continue
      const dx = b.x - a.x
      const dy = b.y - a.y
      const dist = Math.hypot(dx, dy)
      if (dist === 0 || dist > a.r + b.r) continue
      const winnerTeam = resolve(a.team, b.team)
      if (winnerTeam === null) {
        separate(a, b, dx, dy, dist)
      } else {
        const loser = winnerTeam === a.team ? b : a
        const winner = winnerTeam === a.team ? a : b
        loser.alive = false
        events.push({ id: loser.id, by: winner.id })
      }
    }
  }
  return events
}

/** Same-team overlap: push apart, no deaths. */
function separate(a: Entity, b: Entity, dx: number, dy: number, dist: number) {
  const nx = dx / dist
  const ny = dy / dist
  const overlap = a.r + b.r - dist
  a.x -= (nx * overlap) / 2
  a.y -= (ny * overlap) / 2
  b.x += (nx * overlap) / 2
  b.y += (ny * overlap) / 2
}

/** Winning team once one team remains among the living; null while contested. */
export function findWinner(state: BattleState): Team | null {
  return soleTeam(state.entities.filter((e) => e.alive).map((e) => e.team))
}
