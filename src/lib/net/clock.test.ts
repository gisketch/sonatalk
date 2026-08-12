import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clockSynced, noteSample, resetClock, serverNow } from './clock'

/** device clock wrong by 7 minutes — the phone must still land on server time */
const SKEW = 7 * 60_000

describe('server clock estimate', () => {
  beforeEach(() => {
    resetClock()
    vi.useFakeTimers()
  })
  afterEach(() => vi.useRealTimers())

  it('is unsynced until a round trip lands', () => {
    expect(clockSynced()).toBe(false)
    expect(serverNow()).toBe(Date.now())
  })

  it('corrects a badly skewed device clock', () => {
    const local = Date.now()
    const trueServer = local - SKEW
    const rtt = 80
    // ping left at `local`, server stamped it mid-flight, pong landed rtt later
    noteSample(local, trueServer + rtt / 2, local + rtt)
    expect(clockSynced()).toBe(true)
    expect(Math.abs(serverNow() - (Date.now() - SKEW))).toBeLessThan(10)
  })

  it('keeps the fastest round trip and ignores slower, noisier ones', () => {
    const local = Date.now()
    const trueServer = local - SKEW
    noteSample(local, trueServer + 20, local + 40) // clean
    const clean = serverNow()
    noteSample(local, trueServer + 900, local + 1_000) // congested, asymmetric
    expect(serverNow()).toBe(clean)
  })
})
