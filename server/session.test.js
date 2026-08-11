import { describe, expect, it } from 'vitest'
import {
  RACE_STEPS, addPlayer, createSession, drawingOpen, raceTap, rematchSession, resetSession,
  setDrawReady, setName, setPhase, setPick, setReady, startRace,
} from './session.js'

describe('session', () => {
  it('validates phases on advance', () => {
    const s = createSession()
    expect(setPhase(s, 'names')).toBe(true)
    expect(setPhase(s, 'nonsense')).toBe(false)
    expect(s.phase).toBe('names')
  })

  it('trims and caps names, rejects empty', () => {
    const s = createSession()
    const p = addPlayer(s)
    expect(setName(s, p.id, '  Ghe  ')).toBe(true)
    expect(p.name).toBe('Ghe')
    expect(setName(s, p.id, '   ')).toBe(false)
    expect(setName(s, p.id, 'x'.repeat(50))).toBe(true)
    expect(p.name.length).toBe(24)
  })

  it('accepts duplicate names verbatim', () => {
    const s = createSession()
    const a = addPlayer(s)
    const b = addPlayer(s)
    setName(s, a.id, 'Sam')
    setName(s, b.id, 'Sam')
    expect(a.name).toBe('Sam')
    expect(b.name).toBe('Sam')
  })

  it('accepts uploads only while the drawing window is open', () => {
    const s = createSession()
    expect(drawingOpen(s, Date.now())).toBe(false) // not in drawing phase
    const endsAt = 1_000_000
    setPhase(s, 'drawing', { endsAt })
    expect(drawingOpen(s, endsAt - 5_000)).toBe(true)
    expect(drawingOpen(s, endsAt + 1_500)).toBe(true) // grace window
    expect(drawingOpen(s, endsAt + 5_000)).toBe(false) // late upload rejected
  })

  it('ready requires pick phase, a pick, and finite coords; clamps spawn', () => {
    const s = createSession()
    const p = addPlayer(s)
    expect(setReady(s, p.id, { x: 0.5, y: 0.5 })).toBe(false) // wrong phase
    setPhase(s, 'pick')
    expect(setReady(s, p.id, { x: 0.5, y: 0.5 })).toBe(false) // no pick yet
    setPick(s, p.id, 'rock')
    expect(setReady(s, p.id, { x: 'nope', y: 0.5 })).toBe(false)
    expect(setReady(s, p.id, { x: 1.7, y: -0.2 })).toBe(true)
    expect(p.ready).toBe(true)
    expect(p.spawn).toEqual({ x: 1, y: 0 }) // clamped
  })

  it('reset is a full wipe: lobby, no players, no drawings', () => {
    const s = createSession()
    const p = addPlayer(s)
    setName(s, p.id, 'Ghe')
    setPhase(s, 'pick')
    setPick(s, p.id, 'rock')
    setReady(s, p.id, { x: 0.3, y: 0.7 })
    p.hasDrawing = true
    s.drawings.set(p.id, Buffer.from('png'))
    resetSession(s)
    expect(s.phase).toBe('lobby')
    expect(s.players.size).toBe(0)
    expect(s.drawings.size).toBe(0)
    expect(s.payload).toEqual({})
  })

  it('drawReady toggles only during the drawing phase', () => {
    const s = createSession()
    const p = addPlayer(s)
    expect(setDrawReady(s, p.id, true)).toBe(false) // wrong phase
    setPhase(s, 'drawing', { endsAt: 1 })
    expect(setDrawReady(s, p.id, true)).toBe(true)
    expect(p.ready).toBe(true)
    expect(setDrawReady(s, p.id, false)).toBe(true)
    expect(p.ready).toBe(false)
    expect(setDrawReady(s, p.id, 'yes')).toBe(true) // non-boolean coerces to false
    expect(p.ready).toBe(false)
  })

  it('only accepts picks during the pick phase', () => {
    const s = createSession()
    const p = addPlayer(s)
    expect(setPick(s, p.id, 'rock')).toBe(false)
    setPhase(s, 'pick')
    expect(setPick(s, p.id, 'rock')).toBe(true)
    expect(setPick(s, p.id, 'lizard')).toBe(false)
  })

  it('rematch revives everyone with names + drawings intact; re-round advance does not', () => {
    const s = createSession()
    const winner = addPlayer(s)
    const casualty = addPlayer(s)
    setName(s, winner.id, 'Cy')
    setName(s, casualty.id, 'Bo')
    winner.hasDrawing = true
    casualty.hasDrawing = true
    casualty.alive = false
    setPhase(s, 'pick')
    setPick(s, winner.id, 'rock')
    setReady(s, winner.id, { x: 0.5, y: 0.5 })

    // sudden-death re-round: casualty stays dead
    setPhase(s, 'pick')
    expect(casualty.alive).toBe(false)

    // rematch: everyone back in, characters kept, picks fresh
    rematchSession(s)
    expect(s.phase).toBe('pick')
    expect(casualty.alive).toBe(true)
    expect(winner.alive).toBe(true)
    for (const p of [winner, casualty]) {
      expect(p.pick).toBe(null)
      expect(p.spawn).toBe(null)
      expect(p.ready).toBe(false)
      expect(p.hasDrawing).toBe(true)
      expect(p.name).not.toBe(null)
    }
  })

  it('race: entry revives + zeroes, taps must alternate and are GO-gated', () => {
    const s = createSession()
    const p = addPlayer(s)
    const q = addPlayer(s)
    p.alive = false
    p.steps = 12
    startRace(s, 1_000_000)
    expect(s.phase).toBe('race')
    expect(p.alive).toBe(true)
    expect(p.steps).toBe(0)

    const go = Number(s.payload.startsAt)
    expect(raceTap(s, p.id, 'left', go - 10)).toBe(false) // jumped the gun
    expect(raceTap(s, p.id, 'left', go)).toBe(true)
    expect(raceTap(s, p.id, 'left', go)).toBe(false) // same foot — stumble
    expect(raceTap(s, p.id, 'right', go)).toBe(true)
    expect(p.steps).toBe(1) // two alternating taps = one step
    expect(raceTap(s, p.id, 'middle', go)).toBe(false)
    void q
  })

  it('race: first to the line freezes the race as sole winner', () => {
    const s = createSession()
    const p = addPlayer(s)
    const q = addPlayer(s)
    setName(s, p.id, 'Flash')
    startRace(s, 0)
    const go = Number(s.payload.startsAt)
    let side = 'left'
    let result
    for (let i = 0; i < RACE_STEPS * 2; i++) {
      result = raceTap(s, p.id, side, go)
      side = side === 'left' ? 'right' : 'left'
    }
    expect(result).toBe('win')
    expect(s.payload.winner).toEqual({ id: p.id, name: 'Flash' })
    expect(raceTap(s, q.id, 'left', go)).toBe(false) // race is over
    expect(raceTap(s, p.id, side, go)).toBe(false)
  })

  it('eliminated players cannot pick or ready in later rounds', () => {
    const s = createSession()
    const p = addPlayer(s)
    setPhase(s, 'pick')
    p.alive = false
    expect(setPick(s, p.id, 'rock')).toBe(false)
    p.pick = 'rock' // even with a stale pick, ready is refused
    expect(setReady(s, p.id, { x: 0.5, y: 0.5 })).toBe(false)
  })
})
