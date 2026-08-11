/**
 * Deck-only sound effects, synthesized with WebAudio — no asset files, no licenses,
 * works offline. First user gesture unlocks the context (browser autoplay policy).
 * `M` on the deck toggles mute.
 */

let ctx: AudioContext | null = null
let unlocked = false
export const sfxState = { muted: false }

function ac(): AudioContext | null {
  if (typeof AudioContext === 'undefined') return null
  ctx ??= new AudioContext()
  return ctx
}

/** Call from any user gesture (deck clicks) — resumes a suspended context. */
export function unlockAudio() {
  const a = ac()
  if (!a) return
  if (a.state === 'suspended') void a.resume()
  unlocked = true
}

export function toggleMute(): boolean {
  sfxState.muted = !sfxState.muted
  return sfxState.muted
}

type ToneSpec = {
  freq: number
  endFreq?: number
  type?: OscillatorType
  dur: number
  gain?: number
  delay?: number
}

function tone({ freq, endFreq, type = 'sine', dur, gain = 0.12, delay = 0 }: ToneSpec) {
  const a = ac()
  if (!a || sfxState.muted || !unlocked) return
  const t0 = a.currentTime + delay
  const osc = a.createOscillator()
  const g = a.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, t0 + dur)
  g.gain.setValueAtTime(gain, t0)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  osc.connect(g).connect(a.destination)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

/** kill pop — short downward blip */
export function popKill() {
  tone({ freq: 660, endFreq: 220, type: 'square', dur: 0.09, gain: 0.07 })
}

/** gauntlet timer tick — urgent variant pitches up */
export function tick(urgent = false) {
  tone({ freq: urgent ? 1500 : 1000, type: 'square', dur: 0.03, gain: urgent ? 0.06 : 0.035 })
}

/** race countdown beep; GO is the high long one */
export function beep(go = false) {
  tone({ freq: go ? 880 : 440, type: 'triangle', dur: go ? 0.5 : 0.14, gain: 0.12 })
}

/** crown airhorn — three rising sawtooth blasts */
export function airhorn() {
  tone({ freq: 233, endFreq: 466, type: 'sawtooth', dur: 0.28, gain: 0.1 })
  tone({ freq: 233, endFreq: 466, type: 'sawtooth', dur: 0.28, gain: 0.1, delay: 0.3 })
  tone({ freq: 233, endFreq: 699, type: 'sawtooth', dur: 0.55, gain: 0.12, delay: 0.6 })
}

/** wrong-answer womp for the roast beat */
export function womp() {
  tone({ freq: 220, endFreq: 110, type: 'sawtooth', dur: 0.35, gain: 0.06 })
}

// any first gesture on the page unlocks audio — covers deck and test pages alike
if (typeof window !== 'undefined') {
  window.addEventListener('pointerdown', unlockAudio)
  window.addEventListener('keydown', unlockAudio)
}
