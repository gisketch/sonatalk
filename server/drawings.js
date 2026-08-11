import express from 'express'
import { drawingOpen, snapshot } from './session.js'

const MAX_PNG_BYTES = 512 * 1024

/** PNG upload + serving. Uploads are only accepted while the drawing window is open. */
export function attachDrawings(app, session, broadcast) {
  app.post(
    '/api/drawing',
    express.raw({ type: 'image/png', limit: MAX_PNG_BYTES }),
    (req, res) => {
      const playerId = String(req.query.player ?? '')
      const player = session.players.get(playerId)
      if (!player) return res.status(404).json({ error: 'unknown player' })
      // Late joiners get one untimed first upload; replacements stay window-locked.
      if (player.hasDrawing && !drawingOpen(session, Date.now())) {
        return res.status(409).json({ error: 'drawing window closed' })
      }
      if (!Buffer.isBuffer(req.body) || req.body.length === 0) {
        return res.status(400).json({ error: 'empty body' })
      }
      session.drawings.set(playerId, req.body)
      player.hasDrawing = true
      broadcast()
      res.json({ ok: true })
    },
  )

  app.get('/api/drawing/:id', (req, res) => {
    const png = session.drawings.get(req.params.id)
    if (!png) return res.status(404).end()
    res.type('image/png').send(png)
  })

  app.get('/api/state', (_req, res) => res.json(snapshot(session)))
}
