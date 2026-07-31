<script lang="ts">
  import { tick } from 'svelte'
  import { deck } from '../deck.svelte'
  import { fx } from '../fx'
  import { presenter } from '../net/presenter.svelte'
  import {
    LIVE_ORDER, LIVE_SCENARIOS, LIVE_SHIPS, SCENARIOS, TABS, type ScenarioKey,
  } from './scenarios'

  interface Msg {
    who: 'user' | 'ai' | 'sys'
    html: string
    typing?: boolean
  }

  const live = $derived(presenter.live && !presenter.forceOffline)

  /** Deck-refresh recovery: resume the tier sequence from the server's current phase. */
  const shippedCount = () => {
    const shipped = Object.values(LIVE_SHIPS)
    const reached = ['names', 'canvas', 'tools', 'drawing', 'pick', 'battle', 'winners', 'reveal']
      .indexOf(presenter.phase)
    return reached < 0 ? 0 : Math.min(reached + 1, shipped.length)
  }

  let sc: ScenarioKey = $state('complex')
  let liveIndex = $state(presenter.live ? shippedCount() : 0)

  // Session reset (Shift+R) rewinds the tier sequence with it.
  $effect(() => {
    if (live && presenter.phase === 'lobby' && liveIndex > 0) {
      liveIndex = 0
      reset()
    }
  })
  let si = $state(0)
  let busy = $state(false)
  let stage = $state(-1)
  let messages = $state<Msg[]>([])
  let chatBody: HTMLDivElement | undefined

  const activeKey = $derived(live ? LIVE_ORDER[Math.min(liveIndex, LIVE_ORDER.length - 1)] : sc)
  const scen = $derived((live ? LIVE_SCENARIOS : SCENARIOS)[activeKey])
  const done = $derived(si >= scen.steps.length)
  const allShipped = $derived(live && liveIndex >= LIVE_ORDER.length)

  // Post-ship live flow: the same button starts the 60s draw, then opens the picks.
  let simNow = $state(Date.now())
  $effect(() => {
    if (!(live && presenter.phase === 'drawing')) return
    const tick = setInterval(() => (simNow = Date.now()), 500)
    return () => clearInterval(tick)
  })
  const drawRemaining = $derived(
    presenter.phase === 'drawing'
      ? Math.max(0, Math.ceil((Number(presenter.payload.endsAt ?? 0) - simNow) / 1000))
      : null,
  )

  // Presenter overrides: skip the wait when the whole room is already done.
  const connected = $derived(
    presenter.players.filter((p) => (p as (typeof presenter.players)[0] & { connected?: boolean }).connected),
  )
  const allUploaded = $derived(connected.length > 0 && connected.every((p) => p.hasDrawing))
  const allReady = $derived(connected.length > 0 && connected.every((p) => p.ready))

  function select(key: ScenarioKey) {
    if (live) return
    sc = key
    reset()
  }

  function reset() {
    si = 0
    busy = false
    stage = -1
    messages = []
  }

  async function scrollDown() {
    await tick()
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight
  }

  function liveNext() {
    if (presenter.phase === 'tools') presenter.advance('drawing')
    else if (presenter.phase === 'drawing' && (drawRemaining === 0 || allUploaded)) {
      presenter.advance('pick')
    } else if (presenter.phase === 'pick' && allReady) {
      deck.next() // everyone locked in — straight to the arena slide
    }
  }

  async function next() {
    if (busy) return
    if (allShipped) {
      liveNext()
      return
    }
    if (done && live) {
      // move to the next tier's script
      liveIndex++
      if (liveIndex < LIVE_ORDER.length) reset()
      return
    }
    if (done) return
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
      if (live) presenter.advance(LIVE_SHIPS[activeKey]) // the drop: feature ships to phones
    }
    busy = false
    await scrollDown()
  }

  const tierState = (key: ScenarioKey) =>
    live
      ? LIVE_ORDER.indexOf(key) < liveIndex || allShipped
        ? 'done'
        : LIVE_ORDER.indexOf(key) === liveIndex
          ? 'on'
          : 'pending'
      : sc === key
        ? 'on'
        : 'pending'

  const nextLabel = $derived.by(() => {
    if (allShipped) {
      if (presenter.phase === 'tools') return 'start the 60s draw →'
      if (presenter.phase === 'drawing') {
        if (drawRemaining === 0) return 'to the picks →'
        return allUploaded ? `everyone's done — picks →` : `drawing… ${drawRemaining}s`
      }
      if (presenter.phase === 'pick')
        return allReady ? 'everyone ready — arena →' : 'picks open ✓'
      return 'all shipped ✓'
    }
    if (done && live) return 'next feature →'
    if (done) return 'done — pick another task ↑'
    return 'next step →'
  })

  const nextDisabled = $derived(
    busy ||
      (allShipped &&
        ((presenter.phase === 'pick' && !allReady) ||
          (presenter.phase === 'drawing' && drawRemaining !== 0 && !allUploaded))),
  )
</script>

<div class="sim-wrap">
  <div class="sim-left" use:fx={{ d: 0.3 }}>
    <div class="tabs">
      {#each TABS as tab (tab.key)}
        <button
          class="tab"
          class:on={tierState(tab.key) === 'on'}
          class:shipped={tierState(tab.key) === 'done'}
          onclick={() => select(tab.key)}
        >
          <span class="badge">
            {#if tierState(tab.key) === 'done'}
              <svg class="icon"><use href="#i-check" /></svg>
            {:else}
              <svg class="icon"><use href="#{tab.icon}" /></svg>
            {/if}
          </span>
          <span><h4>{tab.label}</h4><p>{tab.blurb}</p></span>
        </button>
      {/each}
    </div>
    <div class="pipe">
      {#each scen.pipe as chip, k (chip)}
        <span class="chip" class:done={k < stage} class:lit={k === stage}>{chip}</span>
      {/each}
    </div>
  </div>
  <div class="sim-right" use:fx={{ d: 0.5 }}>
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
        <button class="btn ghost" onclick={reset}>↺ restart</button>
      {/if}
    </div>
  </div>
</div>
