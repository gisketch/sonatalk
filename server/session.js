import { randomUUID } from 'node:crypto'

/** Phase order is the talk's arc; server only validates known phases, order is presenter-driven. */
export const PHASES = [
  'lobby', 'names', 'canvas', 'tools', 'drawing', 'pick', 'battle', 'winners', 'reveal',
  'race', 'gauntlet',
]

/** In-memory session — the app lives for one talk; restart = fresh session. */
export function createSession() {
  return {
    phase: 'lobby',
    /** phase-specific payload, e.g. { endsAt } for drawing, { team, survivors } for winners */
    payload: {},
    /** id -> { id, name, pick, alive, hasDrawing } */
    players: new Map(),
    /** id -> Buffer (PNG) — uploaded drawings, T7 */
    drawings: new Map(),
    /** ordered game winners [{ id, name }] — the rewards record; only Shift+R clears it */
    champions: [],
  }
}

export function addPlayer(session) {
  const player = {
    id: randomUUID(), name: null, pick: null, alive: true, hasDrawing: false,
    ready: false, spawn: null, steps: 0, foot: null, score: 0, streak: 0,
  }
  session.players.set(player.id, player)
  return player
}

export function removePlayer(session, id) {
  session.players.delete(id)
  session.drawings.delete(id)
}

/** Full wipe: empty lobby, no players. Phones are told to reload and rejoin fresh. */
export function resetSession(session) {
  session.phase = 'lobby'
  session.payload = {}
  session.players.clear()
  session.drawings.clear()
  session.champions = []
}

export function setPhase(session, phase, payload = {}) {
  if (!PHASES.includes(phase)) return false
  session.phase = phase
  session.payload = payload
  return true
}

export function setName(session, id, name) {
  const player = session.players.get(id)
  if (!player || typeof name !== 'string') return false
  const trimmed = name.trim().slice(0, 24)
  if (!trimmed) return false
  player.name = trimmed
  return true
}

export function setPick(session, id, pick) {
  const player = session.players.get(id)
  if (!player || !['rock', 'paper', 'scissors'].includes(pick)) return false
  if (session.phase !== 'pick' || !player.alive) return false // eliminated players spectate
  player.pick = pick
  return true
}

/**
 * New game, same characters: everyone revives and re-picks. Names and drawings are kept.
 * Contrast with the sudden-death pick advance, which must keep eliminated players dead.
 */
export function rematchSession(session) {
  session.payload = {}
  for (const player of session.players.values()) {
    player.alive = true
    player.pick = null
    player.spawn = null
    player.ready = false
    player.steps = 0
    player.foot = null
  }
  session.phase = 'pick'
}

/** Game 2 — the sprint. Steps to the finish line; each valid alternating tap = half a step. */
export const RACE_STEPS = 150
export const RACE_COUNTDOWN_MS = 3_500

/**
 * Everyone races: revive all, zero progress, stamp the synchronized GO time.
 * displayLagMs delays GO so the AirPlayed TV's countdown and the phones' agree.
 */
export function startRace(session, now, displayLagMs = 0) {
  const lag = Math.min(5_000, Math.max(0, Number(displayLagMs) || 0))
  for (const player of session.players.values()) {
    player.alive = true
    player.pick = null
    player.spawn = null
    player.ready = false
    player.steps = 0
    player.foot = null
  }
  session.phase = 'race'
  // target travels in the payload so clients never hardcode the step count
  session.payload = { startsAt: now + RACE_COUNTDOWN_MS + lag, target: RACE_STEPS }
}

/**
 * One tap. Server is the authority: GO-gated, dead players and finished races excluded,
 * and sides must alternate (first tap may be either). Returns 'win' | true | false.
 */
export function raceTap(session, id, side, now) {
  const player = session.players.get(id)
  if (!player || session.phase !== 'race' || !player.alive) return false
  if (!['left', 'right'].includes(side)) return false
  if (session.payload.winner) return false
  if (now < Number(session.payload.startsAt ?? Infinity)) return false
  if (player.foot === side) return false // same foot twice — no step
  player.foot = side
  player.steps += 0.5
  if (player.steps >= RACE_STEPS) {
    session.payload = { ...session.payload, winner: { id: player.id, name: player.name ?? 'anon' } }
    return 'win'
  }
  return true
}

/** "I'm done" toggle during the 60s draw. Cleared when picks open (pick re-readies). */
export function setDrawReady(session, id, ready) {
  const player = session.players.get(id)
  if (!player || session.phase !== 'drawing') return false
  player.ready = ready === true
  return true
}

/** Ready = pick locked + spawn chosen (normalized 0..1 coords). Pick phase only. */
export function setReady(session, id, spawn) {
  const player = session.players.get(id)
  if (!player || session.phase !== 'pick' || !player.pick || !player.alive) return false
  const x = Number(spawn?.x)
  const y = Number(spawn?.y)
  if (!Number.isFinite(x) || !Number.isFinite(y)) return false
  player.spawn = { x: Math.min(1, Math.max(0, x)), y: Math.min(1, Math.max(0, y)) }
  player.ready = true
  return true
}

/** 60s for the talk; overridable for rehearsal runs. Clients read the deadline from payload. */
export const DRAW_SECONDS = Number(process.env.DRAW_SECONDS ?? 60)
const UPLOAD_GRACE_MS = 2_000

/** Uploads are valid during the drawing phase until endsAt + a small grace window. */
export function drawingOpen(session, now) {
  if (session.phase !== 'drawing') return false
  const endsAt = Number(session.payload.endsAt ?? 0)
  return now <= endsAt + UPLOAD_GRACE_MS
}

export function snapshot(session) {
  return {
    type: 'snapshot',
    phase: session.phase,
    payload: session.payload,
    champions: session.champions,
    players: [...session.players.values()].map((p) => ({
      id: p.id, name: p.name, pick: p.pick, alive: p.alive, hasDrawing: p.hasDrawing,
      ready: p.ready, spawn: p.spawn, steps: p.steps, score: p.score, streak: p.streak,
    })),
  }
}
