/** Minimal WS client shared by the phone app and the deck's presenter client. */

export interface PlayerInfo {
  id: string
  name: string | null
  pick: 'rock' | 'paper' | 'scissors' | null
  alive: boolean
  hasDrawing: boolean
}

export interface Snapshot {
  type: 'snapshot'
  phase: string
  payload: Record<string, unknown>
  players: PlayerInfo[]
}

export type ServerMessage =
  | Snapshot
  | { type: 'you'; id: string }
  | { type: 'eliminated' }
  | { type: 'winner' }
  | { type: 'reset' }

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
  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({ type: 'hello', ...hello }))
    onOpenChange?.(true)
  })
  socket.addEventListener('close', () => onOpenChange?.(false))
  socket.addEventListener('message', (e) => {
    try {
      onMessage(JSON.parse(e.data))
    } catch {
      /* malformed frame — ignore */
    }
  })
  return {
    send: (obj) => {
      if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(obj))
    },
    close: () => socket.close(),
  }
}
