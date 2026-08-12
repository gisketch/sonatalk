import http from 'node:http'
import { WebSocket } from 'ws'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createSession } from './session.js'
import { attachWs } from './ws.js'

const TOKEN = 'test-token'
let server, session, port

function client(hello) {
  return new Promise((resolve) => {
    const socket = new WebSocket(`ws://127.0.0.1:${port}/ws`)
    const messages = []
    socket.on('open', () => socket.send(JSON.stringify({ type: 'hello', ...hello })))
    socket.on('message', (raw) => {
      messages.push(JSON.parse(raw))
      if (messages.length === 1 || messages.find((m) => m.type === 'snapshot')) {
        resolve({ socket, messages })
      }
    })
  })
}

const send = (socket, obj) => socket.send(JSON.stringify(obj))
const wait = (ms = 120) => new Promise((r) => setTimeout(r, ms))

beforeEach(async () => {
  session = createSession()
  server = http.createServer()
  attachWs(server, session, TOKEN)
  await new Promise((r) => server.listen(0, r))
  port = server.address().port
})

afterEach(() => new Promise((r) => server.close(r)))

describe('ws roles', () => {
  it('phones join the roster; closing removes them', async () => {
    const a = await client({ role: 'phone' })
    const b = await client({ role: 'phone' })
    await wait()
    expect(session.players.size).toBe(2)
    b.socket.close()
    await wait()
    expect(session.players.size).toBe(1)
    a.socket.close()
  })

  it('answers ping with the server clock so phones can measure their offset', async () => {
    const phone = await client({ role: 'phone' })
    const t0 = Date.now()
    send(phone.socket, { type: 'ping', t0 })
    await wait()
    const pong = phone.messages.find((m) => m.type === 'pong')
    expect(pong.t0).toBe(t0)
    expect(Math.abs(pong.now - Date.now())).toBeLessThan(2_000)
    phone.socket.close()
  })

  it('rejects phase advances from phones and wrong tokens', async () => {
    const phone = await client({ role: 'phone' })
    send(phone.socket, { type: 'advance', phase: 'names' })
    const fake = await client({ role: 'presenter', token: 'wrong' })
    send(fake.socket, { type: 'advance', phase: 'names' })
    await wait()
    expect(session.phase).toBe('lobby')
    phone.socket.close()
    fake.socket.close()
  })

  it('advancing to pick clears draw-phase ready flags', async () => {
    const presenter = await client({ role: 'presenter', token: TOKEN })
    const phone = await client({ role: 'phone' })
    send(presenter.socket, { type: 'advance', phase: 'drawing' })
    await wait()
    send(phone.socket, { type: 'drawReady', ready: true })
    await wait()
    expect([...session.players.values()][0].ready).toBe(true)
    send(presenter.socket, { type: 'advance', phase: 'pick' })
    await wait()
    const player = [...session.players.values()][0]
    expect(player.ready).toBe(false)
    expect(player.pick).toBe(null) // re-rounds force a fresh weapon + spawn choice
    expect(player.spawn).toBe(null)
    presenter.socket.close()
    phone.socket.close()
  })

  it('crowning a sole survivor records the game champion exactly once', async () => {
    const presenter = await client({ role: 'presenter', token: TOKEN })
    const phone = await client({ role: 'phone' })
    await wait()
    const id = [...session.players.keys()][0]
    session.players.get(id).name = 'Champ'
    send(presenter.socket, { type: 'advance', phase: 'winners', payload: { survivors: [id] } })
    await wait()
    // double advance to winners must not double-record
    send(presenter.socket, { type: 'advance', phase: 'winners', payload: { survivors: [id] } })
    await wait()
    expect(session.champions).toEqual([{ id, name: 'Champ' }])
    // multi-survivor crowning never records (one-winner invariant)
    send(presenter.socket, { type: 'advance', phase: 'pick' })
    await wait()
    send(presenter.socket, { type: 'advance', phase: 'winners', payload: { survivors: [id, 'x'] } })
    await wait()
    expect(session.champions.length).toBe(1)
    presenter.socket.close()
    phone.socket.close()
  })

  it('eliminate carries the killer for the death-cam', async () => {
    const presenter = await client({ role: 'presenter', token: TOKEN })
    const victim = await client({ role: 'phone' })
    const hunter = await client({ role: 'phone' })
    await wait()
    const [victimId, hunterId] = [...session.players.keys()]
    session.players.get(hunterId).name = 'Bo'
    send(presenter.socket, { type: 'eliminate', playerId: victimId, by: hunterId })
    await wait()
    const death = victim.messages.find((m) => m.type === 'eliminated')
    expect(death.by).toEqual({ id: hunterId, name: 'Bo' })
    // kill-switch has no killer
    send(presenter.socket, { type: 'eliminate', playerId: hunterId })
    await wait()
    const modDeath = hunter.messages.find((m) => m.type === 'eliminated')
    expect(modDeath.by).toBeUndefined()
    presenter.socket.close()
    victim.socket.close()
    hunter.socket.close()
  })

  it('presenter reset wipes the roster and kicks every phone', async () => {
    const presenter = await client({ role: 'presenter', token: TOKEN })
    const phone = await client({ role: 'phone' })
    await wait()
    expect(session.players.size).toBe(1)
    send(presenter.socket, { type: 'reset' })
    await wait()
    expect(session.players.size).toBe(0)
    expect(session.phase).toBe('lobby')
    expect(phone.messages.some((m) => m.type === 'kicked')).toBe(true)
    expect(presenter.messages.some((m) => m.type === 'reset')).toBe(true)
    presenter.socket.close()
    phone.socket.close()
  })

  it('presenter advances phases; late joiner receives current phase', async () => {
    const presenter = await client({ role: 'presenter', token: TOKEN })
    send(presenter.socket, { type: 'advance', phase: 'names' })
    await wait()
    const late = await client({ role: 'phone' })
    await wait()
    const snap = late.messages.find((m) => m.type === 'snapshot')
    expect(snap.phase).toBe('names')
    presenter.socket.close()
    late.socket.close()
  })
})
