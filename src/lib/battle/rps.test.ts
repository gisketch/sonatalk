import { describe, expect, it } from 'vitest'
import { createBattle, findWinner, step, ARENA_H, ARENA_W, RAMP_AT } from './engine'
import { beats, preyOf, resolve, soleTeam, type Team } from './rps'

describe('rps resolution', () => {
  const cases: Array<[Team, Team, Team | null]> = [
    ['rock', 'rock', null],
    ['rock', 'paper', 'paper'],
    ['rock', 'scissors', 'rock'],
    ['paper', 'rock', 'paper'],
    ['paper', 'paper', null],
    ['paper', 'scissors', 'scissors'],
    ['scissors', 'rock', 'rock'],
    ['scissors', 'paper', 'scissors'],
    ['scissors', 'scissors', null],
  ]
  it.each(cases)('%s vs %s → %s', (a, b, expected) => {
    expect(resolve(a, b)).toBe(expected)
  })

  it('beats is antisymmetric', () => {
    const teams: Team[] = ['rock', 'paper', 'scissors']
    for (const a of teams) for (const b of teams) {
      if (a !== b) expect(beats(a, b)).toBe(!beats(b, a))
    }
  })

  it('prey chain forms the full cycle', () => {
    expect(preyOf('rock')).toBe('scissors')
    expect(preyOf('scissors')).toBe('paper')
    expect(preyOf('paper')).toBe('rock')
  })
})

describe('battle end conditions', () => {
  it('declares a winner when one team remains, including instant wins', () => {
    expect(soleTeam(['rock', 'rock', 'rock'])).toBe('rock')
    expect(soleTeam(['rock', 'paper'])).toBe(null)
    expect(soleTeam([])).toBe(null)
  })

  it('collision eliminates the loser and never same-team entities', () => {
    const state = createBattle(
      [
        { id: 'a', name: 'A', team: 'rock' },
        { id: 'b', name: 'B', team: 'scissors' },
      ],
      400,
      400,
    )
    // force overlap
    state.entities[0].x = state.entities[1].x = 200
    state.entities[0].y = state.entities[1].y = 200
    const events = step(state, 0.016)
    expect(events).toEqual([{ id: 'b', by: 'a' }])
    expect(findWinner(state)).toBe('rock')
  })

  it('same-team collisions bounce without deaths', () => {
    const state = createBattle(
      [
        { id: 'a', name: 'A', team: 'paper' },
        { id: 'b', name: 'B', team: 'paper' },
      ],
      400,
      400,
    )
    state.entities[0].x = state.entities[1].x = 200
    state.entities[0].y = state.entities[1].y = 200
    const events = step(state, 0.016)
    expect(events).toEqual([])
    expect(state.entities.every((e) => e.alive)).toBe(true)
  })

  it('chosen spawns place entities at normalized positions; chasers close in', () => {
    const state = createBattle(
      [
        { id: 'hunter', name: 'H', team: 'rock', spawn: { x: 0, y: 0.5 } },
        { id: 'prey', name: 'P', team: 'scissors', spawn: { x: 1, y: 0.5 } },
      ],
      ARENA_W,
      ARENA_H,
    )
    const [hunter, prey] = state.entities
    expect(hunter.x).toBeLessThan(prey.x) // spawned left vs right
    const gap0 = Math.hypot(prey.x - hunter.x, prey.y - hunter.y)
    for (let i = 0; i < 90; i++) step(state, 1 / 30) // 3s of chasing
    const alive = state.entities.filter((e) => e.alive)
    const gap1 = alive.length === 2
      ? Math.hypot(alive[1].x - alive[0].x, alive[1].y - alive[0].y)
      : 0
    expect(gap1).toBeLessThan(gap0) // chase closes the gap (or already ate them)
  })

  it('forced-end ramp shrinks the arena and battles resolve under 90s', () => {
    const state = createBattle(
      Array.from({ length: 20 }, (_, i) => ({
        id: String(i),
        name: `P${i}`,
        team: (['rock', 'paper', 'scissors'] as Team[])[i % 3],
      })),
      1000,
      600,
    )
    let winner = null
    let t = 0
    const dt = 1 / 30
    while (winner === null && t < 90) {
      step(state, dt)
      winner = findWinner(state)
      t += dt
    }
    if (t > RAMP_AT) expect(state.inset).toBeGreaterThan(0) // ramp engaged when it ran long
    expect(winner).not.toBe(null)
    expect(t).toBeLessThan(90)
  })
})
