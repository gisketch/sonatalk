import { describe, expect, it } from 'vitest'
import {
  addPlayer, createSession, drawingOpen, resetSession, setName, setPhase, setPick,
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

  it('reset returns to lobby, keeps players, wipes their progress', () => {
    const s = createSession()
    const p = addPlayer(s)
    setName(s, p.id, 'Ghe')
    setPhase(s, 'pick')
    setPick(s, p.id, 'rock')
    p.hasDrawing = true
    p.alive = false
    s.drawings.set(p.id, Buffer.from('png'))
    resetSession(s)
    expect(s.phase).toBe('lobby')
    expect(s.players.size).toBe(1)
    expect(p.name).toBe(null)
    expect(p.pick).toBe(null)
    expect(p.alive).toBe(true)
    expect(p.hasDrawing).toBe(false)
    expect(s.drawings.size).toBe(0)
  })

  it('only accepts picks during the pick phase', () => {
    const s = createSession()
    const p = addPlayer(s)
    expect(setPick(s, p.id, 'rock')).toBe(false)
    setPhase(s, 'pick')
    expect(setPick(s, p.id, 'rock')).toBe(true)
    expect(setPick(s, p.id, 'lizard')).toBe(false)
  })
})
