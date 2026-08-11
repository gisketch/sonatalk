/** Deck copy for the gauntlet: correct-answer labels and miss roasts. */

const ROASTS = [
  '{names} pressed vibes instead of buttons',
  'reading is hard for {names}',
  '{names} blinked',
  'math wasn’t mathing for {names}',
  '{names} chose chaos',
  'a moment of silence for {names}',
  '{names} got played by their own thumbs',
  '{names} said “trust me” and were wrong',
]

/** Gentle bullying, rotated per round, capped at 3 names. */
export function buildRoast(round: number, missed: string[]): string {
  if (!missed.length) return ''
  const names =
    missed.length <= 3
      ? missed.join(', ').replace(/, ([^,]*)$/, ' and $1')
      : `${missed.slice(0, 3).join(', ')} and ${missed.length - 3} others`
  return ROASTS[(round * 7 + missed.length) % ROASTS.length].replace('{names}', names)
}

export function buildLabel(mode: string, correct: string): string {
  if (mode === 'yesno') return correct === 'right' ? 'YES was correct' : 'NO was correct'
  return {
    once: 'exactly ONE tap was the move',
    double: 'exactly TWO taps was the move',
    none: 'the move was NOT to tap',
  }[correct] ?? ''
}
