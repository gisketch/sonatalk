import express from 'express'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { attachDrawings } from './drawings.js'
import { addPlayer, createSession, setPhase } from './session.js'

let server, session, base

beforeEach(async () => {
  session = createSession()
  const app = express()
  attachDrawings(app, session, () => {})
  await new Promise((r) => {
    server = app.listen(0, r)
  })
  base = `http://127.0.0.1:${server.address().port}`
})

afterEach(() => new Promise((r) => server.close(r)))

const upload = (id) =>
  fetch(`${base}/api/drawing?player=${id}`, {
    method: 'POST',
    headers: { 'Content-Type': 'image/png' },
    body: Buffer.from([1, 2, 3]),
  })

describe('drawing uploads', () => {
  it('accepts a first upload outside the drawing window (late joiner)', async () => {
    const p = addPlayer(session)
    setPhase(session, 'pick')
    const res = await upload(p.id)
    expect(res.status).toBe(200)
    expect(p.hasDrawing).toBe(true)
  })

  it('rejects replacement uploads outside the window, allows them inside', async () => {
    const p = addPlayer(session)
    p.hasDrawing = true
    session.drawings.set(p.id, Buffer.from([9]))
    setPhase(session, 'pick')
    expect((await upload(p.id)).status).toBe(409)
    setPhase(session, 'drawing', { endsAt: Date.now() + 60_000 })
    expect((await upload(p.id)).status).toBe(200)
  })
})
