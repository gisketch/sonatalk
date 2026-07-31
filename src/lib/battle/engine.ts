import { resolve, soleTeam, type Team } from './rps'

export interface Entity {
  id: string
  name: string
  team: Team
  x: number
  y: number
  vx: number
  vy: number
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

const BASE_SPEED = 90 // px/s
export const RAMP_AT = 45 // s — arena shrinks + speeds up after this
const RAMP_SPEED_PER_S = 0.035 // +3.5% speed per second past the ramp
const RAMP_INSET_PER_S = 6 // px of wall per second past the ramp
const MAX_INSET_FRACTION = 0.36

export function createBattle(
  players: Array<{ id: string; name: string; team: Team }>,
  w: number,
  h: number,
  radius = 34,
): BattleState {
  const entities = players.map((p, i) => {
    const angle = (i / Math.max(1, players.length)) * Math.PI * 2
    const dir = Math.random() * Math.PI * 2
    return {
      id: p.id,
      name: p.name,
      team: p.team,
      x: w / 2 + Math.cos(angle) * (w / 3.2),
      y: h / 2 + Math.sin(angle) * (h / 3.2),
      vx: Math.cos(dir) * BASE_SPEED,
      vy: Math.sin(dir) * BASE_SPEED,
      r: radius,
      alive: true,
    }
  })
  return { entities, w, h, elapsed: 0, inset: 0 }
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
    e.x += e.vx * speedMul * dt
    e.y += e.vy * speedMul * dt
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
        bounce(a, b, dx, dy, dist)
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

function bounce(a: Entity, b: Entity, dx: number, dy: number, dist: number) {
  // swap velocity components along the collision normal; separate overlap
  const nx = dx / dist
  const ny = dy / dist
  const overlap = a.r + b.r - dist
  a.x -= (nx * overlap) / 2
  a.y -= (ny * overlap) / 2
  b.x += (nx * overlap) / 2
  b.y += (ny * overlap) / 2
  const va = a.vx * nx + a.vy * ny
  const vb = b.vx * nx + b.vy * ny
  const dv = va - vb
  a.vx -= dv * nx
  a.vy -= dv * ny
  b.vx += dv * nx
  b.vy += dv * ny
}

/** Winning team once one team remains among the living; null while contested. */
export function findWinner(state: BattleState): Team | null {
  return soleTeam(state.entities.filter((e) => e.alive).map((e) => e.team))
}
