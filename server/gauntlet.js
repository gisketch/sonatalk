/**
 * Game 3 — The Gauntlet. Round lifecycle: windows, taps, scoring, tiebreaks.
 * Prompt generation lives in prompts.js.
 * Score attack: nobody is eliminated — every correct answer scores a point, rounds
 * auto-run faster and faster, and the first round EVERYBODY fails ends the game.
 * Most correct wins; ties go to sudden-death tiebreak rounds among the leaders.
 */

export const WINDOW_START_MS = 2_500
export const WINDOW_STEP_MS = 150
export const WINDOW_FLOOR_MS = 650
export const RESULTS_GRACE_MS = 250 // in-flight taps at window close still count
export const ROUND_CAP = 30 // backstop: sharp crowds can't run forever

import { generateRound } from './prompts.js'
export { generateRound }

export function windowFor(round) {
  return Math.max(WINDOW_FLOOR_MS, WINDOW_START_MS - (round - 1) * WINDOW_STEP_MS)
}

/** The between-round breather shrinks too — the whole game accelerates. */
export function beatFor(round) {
  return Math.max(1_100, 2_600 - round * 120)
}

/**
 * Begin a round: stamp the window, clear tap logs. Payload hides `expected` from clients.
 * displayLagMs shifts the window to when the AirPlayed TV actually SHOWS the prompt —
 * the window opens on the TV's clock, not the server's broadcast.
 */
export function beginRound(session, now, displayLagMs = 0) {
  const lag = Math.min(5_000, Math.max(0, Number(displayLagMs) || 0))
  const round = (session.gauntletRound ?? 0) + 1
  const spec = generateRound(round)
  session.gauntletRound = round
  session.gauntletExpected = spec.expected
  session.gauntletTaps = new Map()
  session.payload = {
    state: 'prompt',
    round,
    prompt: { text: spec.text, sub: spec.sub, ink: spec.ink ?? null },
    mode: spec.mode,
    tiebreak: (session.gauntletLeaders?.length ?? 0) > 0,
    // announced publicly at the tie anyway; phones use it to bench non-leaders
    ...(session.gauntletLeaders?.length ? { leaderIds: session.gauntletLeaders } : {}),
    showAt: now + lag,
    closesAt: now + lag + spec.windowMs,
  }
  return spec
}

export function recordTap(session, id, side, now) {
  if (session.phase !== 'gauntlet' || session.payload.state !== 'prompt') return false
  if (!['left', 'right'].includes(side)) return false
  const player = session.players.get(id)
  if (!player) return false
  // during a tiebreak only the tied leaders' answers count
  if (session.gauntletLeaders?.length && !session.gauntletLeaders.includes(id)) return false
  if (now < session.payload.showAt || now > session.payload.closesAt + RESULTS_GRACE_MS) return false
  const taps = session.gauntletTaps.get(id) ?? []
  taps.push(side)
  session.gauntletTaps.set(id, taps)
  return true
}

function isCorrect(expected, taps) {
  if (expected === 'none') return taps.length === 0
  if (expected === 'once') return taps.length === 1
  if (expected === 'double') return taps.length === 2
  return taps.length > 0 && taps[0] === expected // yes/no: first answer counts
}

const asName = (p) => ({ id: p.id, name: p.name ?? 'anon' })

/**
 * Close the round. Main phase: correct answers score a point; the game ends when
 * EVERYBODY misses (or at the round cap) — sole top score wins, ties go to tiebreak.
 * Tiebreak: a round that splits the leaders narrows them; down to one → winner.
 */
export function resolveRound(session, connectedIds) {
  const expected = session.gauntletExpected
  const inTiebreak = (session.gauntletLeaders?.length ?? 0) > 0
  const everyone = [...session.players.values()].filter(
    (p) => !connectedIds || connectedIds.has(p.id),
  )
  const field = inTiebreak
    ? everyone.filter((p) => session.gauntletLeaders.includes(p.id))
    : everyone
  const correct = field.filter((p) => isCorrect(expected, session.gauntletTaps.get(p.id) ?? []))
  for (const p of correct) p.score += 1

  let winner = null
  let leaders = null
  if (inTiebreak) {
    const next = correct.length > 0 && correct.length < field.length ? correct : field
    session.gauntletLeaders = next.map((p) => p.id)
    if (next.length === 1) winner = asName(next[0])
    else leaders = next.map(asName)
  } else {
    const over =
      (correct.length === 0 && session.gauntletRound > 1) || session.gauntletRound >= ROUND_CAP
    if (over) {
      const top = Math.max(...everyone.map((p) => p.score), 0)
      const best = everyone.filter((p) => p.score === top)
      if (best.length === 1 && top > 0) winner = asName(best[0])
      else {
        session.gauntletLeaders = best.map((p) => p.id)
        leaders = best.map(asName)
      }
    }
  }

  session.payload = {
    state: 'results',
    round: session.gauntletRound,
    prompt: session.payload.prompt,
    mode: session.payload.mode,
    correct: expected,
    correctIds: correct.map((p) => p.id),
    correctCount: correct.length,
    fieldCount: field.length,
    tiebreak: (session.gauntletLeaders?.length ?? 0) > 0 || inTiebreak,
    ...(leaders ? { leaders } : {}),
    ...(winner ? { winner } : {}),
  }
  return { correct, winner, leaders }
}

/** Enter the gauntlet: scores zeroed, everyone plays, round counter resets. */
export function startGauntlet(session) {
  for (const player of session.players.values()) {
    player.alive = true
    player.pick = null
    player.spawn = null
    player.ready = false
    player.steps = 0
    player.foot = null
    player.score = 0
  }
  session.phase = 'gauntlet'
  session.gauntletRound = 0
  session.gauntletTaps = new Map()
  session.gauntletLeaders = null
  session.payload = { state: 'idle' }
}
