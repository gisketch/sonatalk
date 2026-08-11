<script lang="ts">
  import { tick } from 'svelte'
  import { deck } from '../deck.svelte'
  import { fx } from '../fx'
  import { presenter } from '../net/presenter.svelte'
  import { ORDER, SCENARIOS, SHIPS } from './scenarios'

  interface Msg {
    who: 'user' | 'ai' | 'sys'
    html: string
    typing?: boolean
  }

  const live = $derived(presenter.live && !presenter.forceOffline)

  /** Deck-refresh recovery: resume the tier sequence from the server's current phase. */
  const shippedCount = () => {
    const reached = ['names', 'canvas', 'tools', 'drawing', 'pick', 'battle', 'winners', 'reveal']
      .indexOf(presenter.phase)
    return reached < 0 ? 0 : Math.min(reached + 1, ORDER.length)
  }

  let tierIndex = $state(presenter.live ? shippedCount() : 0)
  let si = $state(0)
  let busy = $state(false)
  let stage = $state(-1)
  let messages = $state<Msg[]>([])
  let chatBody: HTMLDivElement | undefined

  // Session reset (Shift+R) rewinds the tier sequence with it — even mid-forceOffline.
  $effect(() => {
    if (presenter.live && presenter.phase === 'lobby' && tierIndex > 0) {
      tierIndex = 0
      reset()
    }
  })

  const activeKey = $derived(ORDER[Math.min(tierIndex, ORDER.length - 1)])
  const scen = $derived(SCENARIOS[activeKey])
  const done = $derived(si >= scen.steps.length)
  const allShipped = $derived(tierIndex >= ORDER.length)

  // Post-ship live flow: the same button starts the 60s draw, then opens the picks.
  let simNow = $state(Date.now())
  $effect(() => {
    if (!(live && presenter.phase === 'drawing')) return
    const t = setInterval(() => (simNow = Date.now()), 500)
    return () => clearInterval(t)
  })
  const drawRemaining = $derived(
    presenter.phase === 'drawing'
      ? Math.max(0, Math.ceil((Number(presenter.payload.endsAt ?? 0) - simNow) / 1000))
      : null,
  )

  // Presenter overrides: skip the wait when the whole room is already done.
  const connected = $derived(
    presenter.players.filter(
      (p) => (p as (typeof presenter.players)[0] & { connected?: boolean }).connected && p.alive,
    ),
  )
  const allReady = $derived(connected.length > 0 && connected.every((p) => p.ready))
  /** Drawing can end early only when every phone pressed "I'm done" — unready re-blocks. */
  const drawSkippable = $derived(drawRemaining === 0 || allReady)

  function reset() {
    si = 0
    busy = false
    stage = -1
    messages = []
  }

  function restartOffline() {
    tierIndex = 0
    reset()
  }

  async function scrollDown() {
    await tick()
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight
  }

  function liveNext() {
    if (presenter.phase === 'tools') presenter.advance('drawing')
    else if (presenter.phase === 'drawing' && drawSkippable) {
      presenter.advance('pick')
    } else if (presenter.phase === 'pick' && allReady) deck.next()
  }

  async function next() {
    if (busy) return
    if (allShipped) {
      if (live) liveNext()
      return
    }
    if (done) {
      tierIndex++
      if (tierIndex < ORDER.length) reset()
      return
    }
    busy = true
    const step = scen.steps[si]
    stage = step.stage
    if (step.who === 'ai') {
      messages.push({ who: 'ai', html: '', typing: true })
      await scrollDown()
      await new Promise((r) => setTimeout(r, 700))
      messages[messages.length - 1] = { who: 'ai', html: step.html }
    } else {
      messages.push({ who: step.who, html: step.html })
    }
    si++
    if (si >= scen.steps.length) {
      stage = scen.pipe.length
      if (live) presenter.advance(SHIPS[activeKey]) // the drop: feature ships to phones
    }
    busy = false
    await scrollDown()
  }

  const tierState = (i: number) =>
    i < tierIndex || allShipped ? 'done' : i === tierIndex ? 'on' : 'pending'

  const nextLabel = $derived.by(() => {
    if (allShipped && live) {
      if (presenter.phase === 'tools') return 'start the 60s draw →'
      if (presenter.phase === 'drawing') {
        if (drawRemaining === 0) return 'to the picks →'
        return drawSkippable ? `everyone's done — picks →` : `drawing… ${drawRemaining}s`
      }
      if (presenter.phase === 'pick')
        return allReady ? 'everyone ready — arena →' : 'picks open ✓'
      return 'all shipped ✓'
    }
    if (allShipped) return 'all shipped ✓'
    if (done) return 'next feature →'
    return 'next step →'
  })

  const nextDisabled = $derived(
    busy ||
      (allShipped && !live) ||
      (allShipped &&
        live &&
        ((presenter.phase === 'pick' && !allReady) ||
          (presenter.phase === 'drawing' && !drawSkippable))),
  )
</script>

<div class="sim-wrap">
  <div class="sim-strip" use:fx={{ d: 0.3 }}>
    {#each ORDER as key, i (key)}
      <span class="tier" class:on={tierState(i) === 'on'} class:shipped={tierState(i) === 'done'}>
        {#if tierState(i) === 'done'}<svg class="icon"><use href="#i-check" /></svg>{/if}
        {SCENARIOS[key].label}
      </span>
      {#if i < ORDER.length - 1}<span class="tier-sep">→</span>{/if}
    {/each}
    <span class="strip-gap"></span>
    <span class="pipe">
      {#each scen.pipe as chip, k (chip)}
        <span class="chip" class:done={k < stage} class:lit={k === stage}>{chip}</span>
      {/each}
    </span>
  </div>
  <div class="sim-right" use:fx={{ d: 0.45 }}>
    <div class="chat">
      <div class="chat-bar">
        <span class="l">
          <span class="dots"><i></i><i></i><i></i></span>
          <span>{live ? scen.title + ' · live' : scen.title}</span>
        </span>
        <span>{si} / {scen.steps.length}</span>
      </div>
      <div class="chat-body" bind:this={chatBody}>
        {#each messages as msg}
          {#if msg.who === 'sys'}
            <div class="sysnote">{@html msg.html}</div>
          {:else}
            <div class="msg" class:user={msg.who === 'user'} class:ai={msg.who === 'ai'}>
              {#if msg.who === 'user'}
                <span class="avatar">G</span>
              {:else}
                <span class="avatar">
                  <svg width="14" height="14" viewBox="0 0 100 100" class="spark"><use href="#sparkShape" /></svg>
                </span>
              {/if}
              <div class="bubble">
                {#if msg.typing}
                  <span class="typing"><i></i><i></i><i></i></span>
                {:else}
                  {@html msg.html}
                {/if}
              </div>
            </div>
          {/if}
        {/each}
      </div>
    </div>
    <div class="sim-ctl">
      <button class="btn" disabled={nextDisabled} onclick={next}>{nextLabel}</button>
      {#if !live}
        <button class="btn ghost" onclick={restartOffline}>↺ restart</button>
      {/if}
    </div>
  </div>
</div>
