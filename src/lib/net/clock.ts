/**
 * Server-clock estimate for the phones.
 *
 * The gauntlet reveals a command at a server-stamped instant (`showAt`, already shifted
 * to TV time). A phone with a wrong system clock would reveal early or late, so we
 * measure the offset instead of trusting the device: ping/pong round trips, keep the
 * sample from the fastest trip (least one-way asymmetry), and read the clock through
 * `serverNow()`.
 */

let offset = 0
let bestRtt = Number.POSITIVE_INFINITY
let samples = 0

/** true once at least one round trip has landed */
export function clockSynced(): boolean {
  return samples > 0
}

export function serverNow(): number {
  return Date.now() + offset
}

/**
 * @param t0 local time the ping left
 * @param serverT server time stamped on the pong
 * @param t2 local time the pong landed
 */
export function noteSample(t0: number, serverT: number, t2: number): void {
  const rtt = t2 - t0
  if (!Number.isFinite(rtt) || rtt < 0 || !Number.isFinite(serverT)) return
  // Let the bar drift up slowly so one lucky early trip can't pin us to a stale offset.
  if (samples > 0) bestRtt *= 1.05
  if (rtt > bestRtt) return
  bestRtt = rtt
  offset = serverT - (t0 + rtt / 2)
  samples++
}

/** test seam */
export function resetClock(): void {
  offset = 0
  bestRtt = Number.POSITIVE_INFINITY
  samples = 0
}
