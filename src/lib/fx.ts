import { animate } from 'motion/mini'

export interface FxOptions {
  /** delay in seconds, mirrors the reference deck's --d custom property */
  d?: number
  /** use the springy pop-in instead of the fade-up */
  pop?: boolean
}

const reduced = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Svelte action: entrance animation via Motion's WAAPI engine.
 * Transform-string keyframes keep the animation compositor-driven, so it
 * survives rAF throttling (projectors, mirrored displays, background tabs).
 * Slides mount fresh on activation, so entrances replay on every re-entry.
 */
export function fx(node: HTMLElement, options: FxOptions = {}) {
  if (reduced()) return
  const { d = 0, pop = false } = options
  node.style.opacity = '0'
  const controls = pop
    ? animate(
        node,
        { opacity: [0, 1], transform: ['scale(0.8)', 'scale(1)'] },
        { duration: 0.55, delay: d, ease: [0.3, 1.4, 0.5, 1] },
      )
    : animate(
        node,
        { opacity: [0, 1], transform: ['translateY(20px)', 'translateY(0px)'] },
        { duration: 0.7, delay: d, ease: [0.22, 0.9, 0.3, 1] },
      )
  node.style.opacity = ''
  return {
    destroy() {
      controls.stop()
    },
  }
}
