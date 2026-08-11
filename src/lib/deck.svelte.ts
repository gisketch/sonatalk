import { presenter } from './net/presenter.svelte'
import { toggleMute } from './sfx'

/** Deck navigation state — the shell owns this; slides never touch it. */
class Deck {
  count = 0
  current = $state(0)
  leaving = $state(-1)
  showNotes = $state(false)
  #leaveTimer: ReturnType<typeof setTimeout> | undefined

  go(n: number) {
    const target = Math.max(0, Math.min(this.count - 1, n))
    if (target === this.current) return
    if (this.#leaveTimer) clearTimeout(this.#leaveTimer)
    this.leaving = this.current
    this.current = target
    this.#leaveTimer = setTimeout(() => (this.leaving = -1), 520)
  }

  next() {
    this.go(this.current + 1)
  }

  prev() {
    this.go(this.current - 1)
  }

  handleKey(e: KeyboardEvent) {
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' '].includes(e.key)) {
      e.preventDefault()
      this.next()
    } else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) {
      e.preventDefault()
      this.prev()
    } else if (e.key === 'Home') this.go(0)
    else if (e.key === 'End') this.go(this.count - 1)
    else if (e.key.toLowerCase() === 'n') this.showNotes = !this.showNotes
    else if (e.key.toLowerCase() === 'm') toggleMute()
    else if (e.key.toLowerCase() === 'o') presenter.forceOffline = !presenter.forceOffline
    // Shift+R so a stray keypress can't nuke the session mid-talk
    else if (e.key.toLowerCase() === 'r' && e.shiftKey) {
      presenter.forceOffline = false // a full reset always lands back in live mode
      presenter.reset()
    }
    else if (e.key.toLowerCase() === 'f') {
      if (document.fullscreenElement) document.exitFullscreen()
      else document.documentElement.requestFullscreen()
    }
  }

  static CLICK_GUARDS =
    '.notes, .hud, .sim-wrap, .arena-wrap, .arena-ctl, .reveal-wrap, .reveal-ctl, .tree-wrap, .livebar, .player-rail, .game-qr, .race-wrap, .race-ctl, .champs, .gauntlet-wrap, .gauntlet-ctl, .sensor-wrap, .docs-wrap'

  handleClick(e: MouseEvent) {
    const t = e.target as Element
    if (t.closest(Deck.CLICK_GUARDS)) return
    if (e.clientX > window.innerWidth / 3) this.next()
    else this.prev()
  }
}

export const deck = new Deck()
