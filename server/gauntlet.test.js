import { describe, expect, it } from 'vitest'
import {
  ROUND_CAP, WINDOW_FLOOR_MS, WINDOW_START_MS, beginRound, generateRound, recordTap,
  resolveRound, startGauntlet, windowFor,
} from './gauntlet.js'
import { addPlayer, createSession, setName } from './session.js'

function arena(names) {
  const s = createSession()
  const players = names.map((n) => {
    const p = addPlayer(s)
    setName(s, p.id, n)
    return p
  })
  startGauntlet(s)
  return { s, players }
}

const tapAt = (s) => Number(s.payload.showAt) + 10
const force = (s, expected) => {
  beginRound(s, 0)
  s.gauntletExpected = expected
}

describe('gauntlet engine (score attack)', () => {
  it('window ramps down to the floor', () => {
    expect(windowFor(1)).toBe(WINDOW_START_MS)
    expect(windowFor(999)).toBe(WINDOW_FLOOR_MS)
  })

  it('prompts are valid; yes/no rounds carry yesno mode with YES = right', () => {
    for (let round = 1; round <= 40; round++) {
      const spec = generateRound(round)
      expect(['left', 'right', 'double', 'none']).toContain(spec.expected)
      expect(['arrows', 'yesno']).toContain(spec.mode)
      if (spec.expected === 'double' || spec.expected === 'none') {
        expect(spec.mode).toBe('arrows')
      }
    }
  })

  it('display lag shifts the window; expected never leaks into the payload', () => {
    const { s } = arena(['A', 'B'])
    beginRound(s, 10_000, 1_500)
    expect(s.payload.showAt).toBe(11_500)
    expect(JSON.stringify(s.payload)).not.toContain('expected')
    expect(recordTap(s, [...s.players.keys()][0], 'left', 500)).toBe(false) // pre-TV
  })

  it('correct answers score a point; wrong/slow just score nothing — nobody is eliminated', () => {
    const { s, players } = arena(['A', 'B', 'C'])
    force(s, 'left')
    recordTap(s, players[0].id, 'left', tapAt(s))
    recordTap(s, players[1].id, 'right', tapAt(s))
    const { winner } = resolveRound(s)
    expect(winner).toBe(null)
    expect(players.map((p) => p.score)).toEqual([1, 0, 0])
    expect(players.every((p) => p.alive)).toBe(true)
    expect(s.payload.correctCount).toBe(1)
  })

  it('a zero-correct round ends the game; sole top score wins', () => {
    const { s, players } = arena(['A', 'B'])
    force(s, 'left')
    recordTap(s, players[0].id, 'left', tapAt(s))
    resolveRound(s)
    force(s, 'left') // round 2: silence from everyone
    const { winner } = resolveRound(s)
    expect(winner).toEqual({ id: players[0].id, name: 'A' })
    expect(s.payload.winner).toEqual(winner)
  })

  it('a tied top score triggers sudden death among the leaders only', () => {
    const { s, players } = arena(['A', 'B', 'C'])
    force(s, 'left')
    recordTap(s, players[0].id, 'left', tapAt(s))
    recordTap(s, players[1].id, 'left', tapAt(s))
    resolveRound(s)
    force(s, 'left') // all silent → game over, A and B tied on 1
    let r = resolveRound(s)
    expect(r.winner).toBe(null)
    expect(r.leaders.map((l) => l.name).sort()).toEqual(['A', 'B'])

    // tiebreak round: C's taps no longer count
    force(s, 'right')
    expect(recordTap(s, players[2].id, 'right', tapAt(s))).toBe(false)
    recordTap(s, players[0].id, 'right', tapAt(s))
    recordTap(s, players[1].id, 'left', tapAt(s))
    r = resolveRound(s)
    expect(r.winner).toEqual({ id: players[0].id, name: 'A' })
  })

  it('a tiebreak round that does not split the leaders repeats', () => {
    const { s, players } = arena(['A', 'B'])
    force(s, 'left')
    resolveRound(s) // round 1: nobody scores (no end before round 2)
    force(s, 'left')
    let r = resolveRound(s) // round 2: zero-correct → tie at 0 → both lead
    expect(r.leaders?.length).toBe(2)
    force(s, 'left') // both wrong again → still tied
    recordTap(s, players[0].id, 'right', tapAt(s))
    recordTap(s, players[1].id, 'right', tapAt(s))
    r = resolveRound(s)
    expect(r.winner).toBe(null)
    expect(s.gauntletLeaders.length).toBe(2)
  })

  it('the round cap force-ends a sharp crowd', () => {
    const { s, players } = arena(['A', 'B'])
    for (let i = 0; i < ROUND_CAP; i++) {
      force(s, 'left')
      recordTap(s, players[0].id, 'left', tapAt(s))
      if (i < ROUND_CAP - 1) resolveRound(s)
    }
    const { winner } = resolveRound(s)
    expect(winner).toEqual({ id: players[0].id, name: 'A' })
  })

  it('startGauntlet zeroes scores and clears leaders', () => {
    const { s, players } = arena(['A'])
    players[0].score = 7
    s.gauntletLeaders = [players[0].id]
    startGauntlet(s)
    expect(players[0].score).toBe(0)
    expect(s.gauntletLeaders).toBe(null)
    expect(s.payload).toEqual({ state: 'idle' })
  })
})
