import { WebSocketServer } from 'ws'
import {
  DRAW_SECONDS, addPlayer, removePlayer, resetSession, setPhase, setName, setPick, snapshot,
} from './session.js'

const HEARTBEAT_MS = 30_000 // keeps idle sockets alive through nginx proxy timeouts

export function attachWs(httpServer, session, presenterToken) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' })

  const broadcast = () => {
    const msg = JSON.stringify(snapshot(session))
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN && client.role) client.send(msg)
    }
  }

  const sendTo = (playerId, obj) => {
    for (const client of wss.clients) {
      if (client.playerId === playerId && client.readyState === client.OPEN) {
        client.send(JSON.stringify(obj))
      }
    }
  }

  wss.on('connection', (socket) => {
    socket.isAlive = true
    socket.on('pong', () => (socket.isAlive = true))

    socket.on('message', (raw) => {
      let msg
      try { msg = JSON.parse(raw) } catch { return }

      if (msg.type === 'hello') {
        if (msg.role === 'presenter' && msg.token === presenterToken) {
          socket.role = 'presenter'
        } else {
          socket.role = 'phone'
          const player = addPlayer(session)
          socket.playerId = player.id
          socket.send(JSON.stringify({ type: 'you', id: player.id }))
        }
        socket.send(JSON.stringify(snapshot(session)))
        broadcast()
        return
      }

      if (socket.role === 'phone') {
        if (msg.type === 'setName' && setName(session, socket.playerId, msg.name)) broadcast()
        if (msg.type === 'pick' && setPick(session, socket.playerId, msg.pick)) broadcast()
        return
      }

      if (socket.role === 'presenter') {
        if (msg.type === 'advance') {
          // Server owns the clock: the drawing deadline is stamped here, not by the deck.
          const payload =
            msg.phase === 'drawing'
              ? { ...msg.payload, endsAt: Date.now() + DRAW_SECONDS * 1000 }
              : (msg.payload ?? {})
          if (setPhase(session, msg.phase, payload)) broadcast()
        }
        if (msg.type === 'eliminate') {
          const player = session.players.get(msg.playerId)
          if (player) {
            player.alive = false
            sendTo(msg.playerId, { type: 'eliminated' })
            broadcast()
          }
        }
        if (msg.type === 'crown' && Array.isArray(msg.survivors)) {
          for (const id of msg.survivors) sendTo(id, { type: 'winner' })
        }
        if (msg.type === 'reset') {
          resetSession(session)
          for (const client of wss.clients) {
            if (client.readyState === client.OPEN && client.role) {
              client.send(JSON.stringify({ type: 'reset' }))
            }
          }
          broadcast()
        }
      }
    })

    socket.on('close', () => {
      if (socket.playerId) {
        removePlayer(session, socket.playerId)
        broadcast()
      }
    })
  })

  const heartbeat = setInterval(() => {
    for (const client of wss.clients) {
      if (!client.isAlive) { client.terminate(); continue }
      client.isAlive = false
      client.ping()
    }
  }, HEARTBEAT_MS)
  wss.on('close', () => clearInterval(heartbeat))

  return { wss, broadcast }
}
