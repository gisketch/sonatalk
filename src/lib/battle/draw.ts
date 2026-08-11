import type { BattleState } from './engine'
import { TEAM_EMOJI } from './rps'

const TEAM_COLOR: Record<string, string> = {
  rock: '#7A776E',
  paper: '#4A7A8C',
  scissors: '#C4633F',
}

/** Draws one frame of the battle onto a 2D context sized to state.w × state.h. */
export function renderBattle(
  ctx: CanvasRenderingContext2D,
  state: BattleState,
  images: Map<string, HTMLImageElement>,
  /** pre-battle preview: positions only, weapons stay secret */
  opts: { hideTeams?: boolean } = {},
) {
  ctx.clearRect(0, 0, state.w, state.h)

  // arena walls (shrink during the forced-end ramp)
  ctx.strokeStyle = '#DAD5C9'
  ctx.lineWidth = 2
  ctx.strokeRect(state.inset, state.inset, state.w - state.inset * 2, state.h - state.inset * 2)

  ctx.textAlign = 'center'
  for (const e of state.entities) {
    if (!e.alive) continue
    const img = images.get(e.id)
    if (img) {
      // Raw square render — the PNG's paper background matches the arena, so only
      // the drawn strokes read: a stickman is just a stickman, no circle, no frame.
      ctx.drawImage(img, e.x - e.r, e.y - e.r, e.r * 2, e.r * 2)
    } else {
      ctx.beginPath()
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2)
      ctx.fillStyle = opts.hideTeams ? '#B8B3A6' : TEAM_COLOR[e.team]
      ctx.fill()
    }

    ctx.font = '14px "JetBrains Mono", monospace'
    ctx.fillStyle = '#3D3A34'
    ctx.fillText(e.name, e.x, e.y + e.r + 18)
    if (!opts.hideTeams) {
      ctx.font = '16px sans-serif'
      ctx.fillText(TEAM_EMOJI[e.team], e.x + e.r * 0.8, e.y - e.r * 0.8)
    }
  }
}

/** Hit-test for the presenter kill-switch. */
export function entityAt(state: BattleState, x: number, y: number): string | null {
  for (const e of state.entities) {
    if (e.alive && Math.hypot(e.x - x, e.y - y) <= e.r) return e.id
  }
  return null
}
