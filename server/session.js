import { randomUUID } from 'node:crypto'

/** Phase order is the talk's arc; server only validates known phases, order is presenter-driven. */
export const PHASES = [
  'lobby', 'names', 'canvas', 'tools', 'drawing', 'pick', 'battle', 'winners', 'reveal',
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
  }
}

export function addPlayer(session) {
  const player = {
    id: randomUUID(), name: null, pick: null, alive: true, hasDrawing: false,
    ready: false, spawn: null,
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
  if (session.phase !== 'pick') return false
  player.pick = pick
  return true
}

/** Ready = pick locked + spawn chosen (normalized 0..1 coords). Pick phase only. */
export function setReady(session, id, spawn) {
  const player = session.players.get(id)
  if (!player || session.phase !== 'pick' || !player.pick) return false
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
    players: [...session.players.values()].map((p) => ({
      id: p.id, name: p.name, pick: p.pick, alive: p.alive, hasDrawing: p.hasDrawing,
      ready: p.ready, spawn: p.spawn,
    })),
  }
}
