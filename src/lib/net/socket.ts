/** Minimal WS client shared by the phone app and the deck's presenter client. */

import { noteSample } from './clock'

export interface PlayerInfo {
  id: string
  name: string | null
  pick: 'rock' | 'paper' | 'scissors' | null
  alive: boolean
  hasDrawing: boolean
  ready: boolean
  /** normalized 0..1 arena coordinates chosen on the phone */
  spawn: { x: number; y: number } | null
  /** race progress — each valid alternating tap adds 0.5 */
  steps: number
  /** gauntlet score — correct answers this game */
  score: number
  /** gauntlet: consecutive correct answers */
  streak: number
}

export interface Champion {
  id: string
  name: string
}

export interface Snapshot {
  type: 'snapshot'
  phase: string
  payload: Record<string, unknown>
  players: PlayerInfo[]
  /** ordered per-game winners — the rewards record */
  champions: Champion[]
}

export type ServerMessage =
  | Snapshot
  | { type: 'pong'; t0: number; now: number }
  | { type: 'you'; id: string }
  | { type: 'eliminated'; by?: { id: string; name: string } }
  | { type: 'winner' }
  | { type: 'reset' }
  | { type: 'kicked' }

export function wsUrl(): string {
  const proto = location.protocol === 'https:' ? 'wss' : 'ws'
  return `${proto}://${location.host}/ws`
}

export function connect(
  hello: Record<string, unknown>,
  onMessage: (msg: ServerMessage) => void,
  onOpenChange?: (open: boolean) => void,
): { send: (obj: Record<string, unknown>) => void; close: () => void } {
  const socket = new WebSocket(wsUrl())
  const send = (obj: Record<string, unknown>) => {
    if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(obj))
  }

  // Clock sync: a burst right after connect converges fast, then a slow trickle keeps
  // the estimate honest across the night. Timers are cleared with the socket.
  const timers: ReturnType<typeof setTimeout>[] = []
  const ping = () => send({ type: 'ping', t0: Date.now() })
  const startSync = () => {
    for (const delay of [0, 250, 700, 1_500, 3_000]) timers.push(setTimeout(ping, delay))
    timers.push(setInterval(ping, 20_000) as unknown as ReturnType<typeof setTimeout>)
  }
  const stopSync = () => {
    for (const t of timers) {
      clearTimeout(t)
      clearInterval(t as unknown as ReturnType<typeof setInterval>)
    }
    timers.length = 0
  }

  socket.addEventListener('open', () => {
    send({ type: 'hello', ...hello })
    startSync()
    onOpenChange?.(true)
  })
  socket.addEventListener('close', () => {
    stopSync()
    onOpenChange?.(false)
  })
  socket.addEventListener('message', (e) => {
    let msg: ServerMessage
    try {
      msg = JSON.parse(e.data)
    } catch {
      return /* malformed frame — ignore */
    }
    if (msg.type === 'pong') {
      noteSample(msg.t0, msg.now, Date.now())
      return
    }
    onMessage(msg)
  })
  return {
    send,
    close: () => {
      stopSync()
      socket.close()
    },
  }
}
