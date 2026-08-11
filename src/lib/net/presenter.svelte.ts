import { connect, type Champion, type PlayerInfo, type Snapshot } from './socket'

/**
 * Deck-side presenter client with the state mirror: everything received is retained
 * locally (players survive a WS drop) so later phases can run offline.
 */
class Presenter {
  live = $state(false)
  connected = $state(false)
  /** Bail switch: presses slide 7 back into the fake simulator without touching the network. */
  forceOffline = $state(false)
  phase = $state('lobby')
  payload = $state<Record<string, unknown>>({})
  /** mirror: last-known players, kept across disconnects */
  players = $state<PlayerInfo[]>([])
  /** mirror: playerId → object URL of their uploaded PNG; survives server death */
  drawings = $state<Record<string, string>>({})
  /** mirror: per-game winners — the rewards record */
  champions = $state<Champion[]>([])
  /**
   * AirPlay compensation: how far the TV lags the server, presenter-calibrated.
   * Timing games shift their windows by this so the TV's clock is the fair one.
   */
  displayLagMs = $state(Number(localStorage.getItem('displayLagMs') ?? 1000))

  #send: ((obj: Record<string, unknown>) => void) | null = null

  /** Presenter mode activates only with ?key=<token> in the deck URL. */
  start() {
    const token = new URLSearchParams(location.search).get('key')
    if (!token || this.live) return
    this.live = true
    this.#send = connect(
      { role: 'presenter', token },
      (msg) => {
        if (msg.type === 'reset') this.#clearMirror()
        if (msg.type === 'snapshot') this.#absorb(msg)
      },
      (open) => (this.connected = open),
    ).send
  }

  /** A session reset is the one event allowed to wipe the mirror. */
  #clearMirror() {
    this.phase = 'lobby'
    this.payload = {}
    this.players = []
    this.champions = []
    for (const url of Object.values(this.drawings)) {
      if (url !== 'pending') URL.revokeObjectURL(url)
    }
    this.drawings = {}
  }

  #absorb(snap: Snapshot) {
    this.phase = snap.phase
    this.payload = snap.payload
    if (snap.champions) this.champions = snap.champions
    // Mirror rule: players only ever merge in; a dropped server never erases them here.
    const known = new Map(this.players.map((p) => [p.id, p]))
    for (const p of snap.players) known.set(p.id, p)
    const liveIds = new Set(snap.players.map((p) => p.id))
    this.players = [...known.values()].map((p) => ({ ...p, connected: liveIds.has(p.id) }) as PlayerInfo)
    for (const p of snap.players) {
      if (p.hasDrawing && !this.drawings[p.id]) void this.#mirrorDrawing(p.id)
    }
  }

  async #mirrorDrawing(id: string) {
    this.drawings[id] = 'pending'
    try {
      const res = await fetch(`/api/drawing/${id}`)
      if (!res.ok) throw new Error()
      this.drawings[id] = URL.createObjectURL(await res.blob())
    } catch {
      delete this.drawings[id] // retry on the next snapshot
    }
  }

  get liveCount() {
    return this.players.filter((p) => (p as PlayerInfo & { connected?: boolean }).connected).length
  }

  setDisplayLag(ms: number) {
    this.displayLagMs = Math.min(5_000, Math.max(0, ms))
    localStorage.setItem('displayLagMs', String(this.displayLagMs))
  }

  advance(phase: string, payload: Record<string, unknown> = {}) {
    if (phase === 'race') payload = { ...payload, displayLagMs: this.displayLagMs }
    this.#send?.({ type: 'advance', phase, payload })
  }

  /** One click runs the whole gauntlet: server auto-loops rounds until a winner. */
  gauntletStart() {
    this.#send?.({ type: 'gauntletStart', displayLagMs: this.displayLagMs })
  }

  eliminate(playerId: string, by?: string) {
    this.#send?.({ type: 'eliminate', playerId, ...(by ? { by } : {}) })
  }

  crown(survivors: string[]) {
    this.#send?.({ type: 'crown', survivors })
  }

  /** New game, same characters: server revives everyone and reopens picks. */
  rematch() {
    this.#send?.({ type: 'rematch' })
  }

  /** Full reset (Shift+R on the deck): server wipes everyone; phones reload and rejoin fresh. */
  reset() {
    this.#send?.({ type: 'reset' })
  }
}

export const presenter = new Presenter()
