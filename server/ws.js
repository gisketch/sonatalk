import { WebSocketServer } from 'ws'
import {
  DRAW_SECONDS, addPlayer, raceTap, rematchSession, removePlayer, resetSession,
  setDrawReady, setPhase, setName, setPick, setReady, snapshot, startRace,
} from './session.js'
import {
  RESULTS_GRACE_MS, beatFor, beginRound, recordTap, resolveRound, startGauntlet,
} from './gauntlet.js'

const HEARTBEAT_MS = 30_000 // keeps idle sockets alive through nginx proxy timeouts
const RACE_BROADCAST_MS = 120 // tap storm control: ~8 snapshots/s instead of per-tap

export function attachWs(httpServer, session, presenterToken) {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' })

  const broadcast = () => {
    const msg = JSON.stringify(snapshot(session))
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN && client.role) client.send(msg)
    }
  }

  let gauntletTimer = null

  // Race taps mark dirty; a slow timer flushes, so 18 fast tappers can't storm the wire.
  let raceDirty = false
  const raceFlush = setInterval(() => {
    if (raceDirty) {
      raceDirty = false
      broadcast()
    }
  }, RACE_BROADCAST_MS)

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
        if (msg.type === 'drawReady' && setDrawReady(session, socket.playerId, msg.ready)) broadcast()
        if (msg.type === 'pick' && setPick(session, socket.playerId, msg.pick)) broadcast()
        if (msg.type === 'ready' && setReady(session, socket.playerId, msg.spawn)) broadcast()
        if (msg.type === 'raceTap') {
          const result = raceTap(session, socket.playerId, msg.side, Date.now())
          if (result === 'win') broadcast() // the finish is never throttled
          else if (result) raceDirty = true
        }
        // gauntlet taps are logged silently; the round's resolution broadcast reveals all
        if (msg.type === 'gauntletTap') recordTap(session, socket.playerId, msg.side, Date.now())
        return
      }

      if (socket.role === 'presenter') {
        if (msg.type === 'advance') {
          // Server owns the clock: the drawing deadline is stamped here, not by the deck.
          const payload =
            msg.phase === 'drawing'
              ? { ...msg.payload, endsAt: Date.now() + DRAW_SECONDS * 1000 }
              : (msg.payload ?? {})
          // Every pick round starts clean: no leaked draw-ready flags, and sudden-death
          // re-rounds force survivors to choose weapon + spawn again.
          if (msg.phase === 'pick') {
            for (const player of session.players.values()) {
              player.ready = false
              player.pick = null
              player.spawn = null
            }
          }
          // Crowning a sole survivor is THE one place a game champion is recorded —
          // RPS and the race both funnel through it, so one-winner stays structural.
          if (msg.phase === 'winners' && session.phase !== 'winners') {
            const ids = Array.isArray(payload.survivors) ? payload.survivors : []
            if (ids.length === 1) {
              // The race payload froze the winner's name — it survives a disconnect.
              const frozen = session.payload.winner
              const name =
                session.players.get(ids[0])?.name ??
                (frozen?.id === ids[0] ? frozen.name : null) ??
                'anon'
              session.champions.push({ id: ids[0], name })
            }
          }
          clearTimeout(gauntletTimer) // any phase move stops a running gauntlet loop
          if (msg.phase === 'race') {
            startRace(session, Date.now(), msg.payload?.displayLagMs)
            broadcast()
          } else if (msg.phase === 'gauntlet') {
            startGauntlet(session)
            broadcast()
          } else if (setPhase(session, msg.phase, payload)) broadcast()
        }
        // One click starts the whole game: rounds auto-run (prompt → resolve → beat → next)
        // until a winner exists. Score attack — nobody is eliminated mid-game.
        if (msg.type === 'gauntletStart' && session.phase === 'gauntlet' && !session.payload.winner) {
          const lag = msg.displayLagMs
          const runRound = () => {
            if (session.phase !== 'gauntlet' || session.payload.winner) return
            beginRound(session, Date.now(), lag)
            broadcast()
            const wait = session.payload.closesAt - Date.now() + RESULTS_GRACE_MS + 50
            gauntletTimer = setTimeout(() => {
              if (session.phase !== 'gauntlet') return
              const connectedIds = new Set(
                [...wss.clients].filter((c) => c.playerId && c.readyState === c.OPEN).map((c) => c.playerId),
              )
              const { winner } = resolveRound(session, connectedIds)
              broadcast()
              // breather shrinks as rounds climb — the whole game accelerates
              if (!winner) gauntletTimer = setTimeout(runRound, beatFor(session.gauntletRound))
            }, wait)
          }
          clearTimeout(gauntletTimer)
          runRound()
        }
        if (msg.type === 'rematch') {
          rematchSession(session)
          broadcast()
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
          clearTimeout(gauntletTimer)
          resetSession(session)
          for (const client of wss.clients) {
            if (client.readyState !== client.OPEN || !client.role) continue
            if (client.role === 'phone') {
              // Kicked phones reload and rejoin as fresh players; stale tabs die here too.
              client.playerId = undefined
              client.send(JSON.stringify({ type: 'kicked' }))
            } else {
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
  wss.on('close', () => {
    clearInterval(heartbeat)
    clearInterval(raceFlush)
    clearTimeout(gauntletTimer)
  })

  return { wss, broadcast }
}
