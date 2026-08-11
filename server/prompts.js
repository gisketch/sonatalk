/**
 * Gauntlet prompt generation — every command and question the deck can fire.
 * All prompts resolve to yes/no pads or the single tap pad; difficulty scales by round.
 */

import { windowFor } from './gauntlet.js'

/** difficulty tier 0..3 — parameters get nastier every ~6 rounds */
const tierFor = (round) => Math.min(3, Math.floor(round / 6))

const rand = (n) => Math.floor(Math.random() * n)
const pickOne = (arr) => arr[rand(arr.length)]

/**
 * expected: 'left' | 'right' (yes/no) | 'once' | 'double' | 'none' (single tap pad)
 * mode: 'tap' (one big pad, count matters) | 'yesno' (NO left / YES right)
 */
function reflexPrompt() {
  return pickOne([
    { text: 'TAP ONCE', sub: 'exactly one tap', expected: 'once', mode: 'tap' },
    { text: 'TAP TWICE', sub: 'exactly two taps', expected: 'double', mode: 'tap' },
    { text: "DON'T TAP", sub: 'discipline.', expected: 'none', mode: 'tap' },
  ])
}

// yes/no rounds: phones show NO on the left (red) and YES on the right (green) —
// YES travels as 'right'.
const yesno = (text, truthy, sub = 'true? answer on your phone', extra = {}) => ({
  text,
  sub,
  expected: truthy ? 'right' : 'left',
  mode: 'yesno',
  ...extra,
})

function mathPrompt(round) {
  const tier = tierFor(round)
  const scale = 2 + tier * 2
  const a = 2 + rand(6 * scale)
  const b = 2 + rand(6 * scale)
  const op = pickOne(['×', '+', '−'])
  const real = op === '×' ? a * b : op === '+' ? a + b : a - b
  const truthy = Math.random() < 0.5
  // near-miss wrong answers look right under pressure — and get NEARER late-game
  const deltas = tier >= 2 ? [-2, -1, 1, 2] : [-3, -2, -1, 1, 2, 3]
  const shown = truthy ? real : real + pickOne(deltas)
  return yesno(`${a} ${op} ${b} = ${shown}`, truthy)
}

/** 23 − 7 > 15 — comparisons with tightening margins */
function comparePrompt(round) {
  const tier = tierFor(round)
  const a = 5 + rand(20 + tier * 15)
  const b = 2 + rand(10 + tier * 10)
  const op = Math.random() < 0.5 ? '+' : '−'
  const real = op === '+' ? a + b : a - b
  const margin = (tier >= 2 ? 1 + rand(2) : 1 + rand(4)) * (Math.random() < 0.5 ? 1 : -1)
  const gt = Math.random() < 0.5
  const rhs = real - margin
  const truthy = gt ? real > rhs : real < rhs
  return yesno(`${a} ${op} ${b} ${gt ? '>' : '<'} ${rhs}`, truthy)
}

/** subitizing breaks around 6 — count the row, no time to count late-game */
function countPrompt(round) {
  const tier = tierFor(round)
  const n = tier >= 1 ? 5 + rand(6) : 3 + rand(4)
  const emoji = pickOne(['🍕', '⭐', '🔥', '🐔', '🎈', '💎'])
  const truthy = Math.random() < 0.5
  const claim = truthy ? n : n + (Math.random() < 0.5 ? 1 : -1)
  return yesno(`${emoji.repeat(n)} = ${claim}`, truthy, 'count them. or don’t. answer!')
}

const WORDS = [
  ['MANGO', 5], ['ADOBO', 5], ['BANANA', 6], ['COFFEE', 6], ['GUITAR', 6], ['PYTHON', 6],
  ['JEEPNEY', 7], ['KARAOKE', 7], ['TYPHOON', 7], ['ELEPHANT', 8], ['SINIGANG', 8],
]
function letterCountPrompt() {
  const [word, len] = pickOne(WORDS)
  const truthy = Math.random() < 0.5
  const claim = truthy ? len : len + (Math.random() < 0.5 ? 1 : -1)
  return yesno(`${word} has ${claim} letters`, truthy)
}

/** 3 · 6 · 12 · next = 24 — arithmetic and doubling runs */
function sequencePrompt(round) {
  const tier = tierFor(round)
  const geometric = Math.random() < 0.45
  const start = 2 + rand(6)
  const k = 2 + rand(4 + tier * 2)
  const seq = geometric
    ? [start, start * 2, start * 4]
    : [start, start + k, start + 2 * k]
  const real = geometric ? start * 8 : start + 3 * k
  const truthy = Math.random() < 0.5
  const claim = truthy ? real : real + pickOne(tier >= 2 ? [-2, -1, 1, 2] : [-4, -2, 2, 4])
  return yesno(`${seq.join(' · ')} · next = ${claim}`, truthy)
}

const LOGIC_FACTS = [
  ['🪨 beats ✂️', true], ['✂️ beats 📄', true], ['📄 beats 🪨', true],
  ['✂️ beats 🪨', false], ['🪨 beats 📄', false], ['📄 beats ✂️', false],
]
function logicPrompt() {
  const kind = rand(3)
  if (kind === 0) {
    const [text, truth] = pickOne(LOGIC_FACTS)
    return { text, sub: 'true? answer on your phone', expected: truth ? 'right' : 'left', mode: 'yesno' }
  }
  if (kind === 1) {
    const n = 2 + rand(97)
    const claimOdd = Math.random() < 0.5
    return {
      text: `${n} is ${claimOdd ? 'ODD' : 'EVEN'}`,
      sub: 'true? answer on your phone',
      expected: (n % 2 === 1) === claimOdd ? 'right' : 'left',
      mode: 'yesno',
    }
  }
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const i = rand(24)
  const j = i + 1 + rand(Math.min(4, 25 - i))
  const flip = Math.random() < 0.5
  const [x, y] = flip ? [letters[j], letters[i]] : [letters[i], letters[j]]
  return {
    text: `${x} comes before ${y}`,
    sub: 'true? answer on your phone',
    expected: flip ? 'left' : 'right',
    mode: 'yesno',
  }
}

const COLORS = [
  ['RED', '#C0392B'], ['BLUE', '#2E6F95'], ['GREEN', '#4E7A3A'], ['ORANGE', '#D97757'],
]
function stroopPrompt() {
  const word = rand(COLORS.length)
  const match = Math.random() < 0.45
  const ink = match ? word : (word + 1 + rand(COLORS.length - 1)) % COLORS.length
  return {
    text: COLORS[word][0],
    ink: COLORS[ink][1],
    sub: 'COLOR matches word?',
    expected: match ? 'right' : 'left',
    mode: 'yesno',
  }
}

/** Category mix shifts nastier as rounds climb: fewer freebies, more brain-benders. */
export function generateRound(round) {
  let prompt
  if (round <= 2) {
    prompt = reflexPrompt() // warm up on pure reflex
  } else {
    const late = round >= 9
    const pool = [
      [late ? 2 : 3, reflexPrompt], // DON'T TAP at a 0.7s window stays lethal
      [2, () => mathPrompt(round)],
      [late ? 1 : 2, logicPrompt],
      [late ? 3 : 2, stroopPrompt],
      [late ? 2 : 1, () => countPrompt(round)],
      [late ? 2 : 1, () => comparePrompt(round)],
      [1, letterCountPrompt],
      [late ? 2 : 1, () => sequencePrompt(round)],
    ]
    const total = pool.reduce((s, [w]) => s + w, 0)
    let roll = Math.random() * total
    prompt = pool[0][1]()
    for (const [w, fn] of pool) {
      roll -= w
      if (roll <= 0) {
        prompt = fn()
        break
      }
    }
  }
  return { round, windowMs: windowFor(round), ...prompt }
}

