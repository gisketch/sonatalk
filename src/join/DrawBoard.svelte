<script lang="ts">
  import { fx } from '../lib/fx'
  import Canvas from './Canvas.svelte'
  import Tools from './Tools.svelte'

  let {
    phase,
    name,
    payload = {},
    myId = null,
    ready = false,
    onready,
  }: {
    phase: string
    name: string | null
    payload?: Record<string, unknown>
    myId?: string | null
    /** server-mirrored "I'm done" flag — survives a phone reload */
    ready?: boolean
    onready?: (ready: boolean) => void
  } = $props()

  let canvas: Canvas
  let color = $state('#262624')
  let brush = $state(8)
  let mode = $state<'draw' | 'fill'>('draw')
  let now = $state(Date.now())
  let submitted = $state(false)

  // 'onboard' = late joiner drawing untimed during a game's pick phase
  const toolsUnlocked = $derived(phase === 'tools' || phase === 'drawing' || phase === 'onboard')
  const endsAt = $derived(Number(payload.endsAt ?? 0))
  const remaining = $derived(phase === 'drawing' ? Math.max(0, Math.ceil((endsAt - now) / 1000)) : null)
  const locked = $derived(phase === 'drawing' && remaining === 0)

  $effect(() => {
    if (phase !== 'drawing') return
    const tick = setInterval(() => (now = Date.now()), 250)
    return () => clearInterval(tick)
  })

  $effect(() => {
    if (locked && !submitted) void upload()
  })

  /** "I'm done" — uploads now so the deck can skip the timer once everyone's in. */
  function readyUp() {
    submitted = true
    void upload()
    onready?.(true)
  }

  function unready() {
    submitted = false // timer-end auto-upload re-arms with the latest strokes
    onready?.(false)
  }

  // Late-joiner submit: one-way — the snapshot's hasDrawing flips this phone to the pick screen.
  let sending = $state(false)
  async function submitCharacter() {
    sending = true
    await upload()
  }

  async function upload() {
    submitted = true // single-shot; a failed upload just means spectating, by design
    const blob = await canvas.toPngBlob()
    if (!blob || !myId) return
    await fetch(`/api/drawing?player=${encodeURIComponent(myId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'image/png' },
      body: blob,
    }).catch(() => {})
  }

  const eyebrow = $derived(
    phase === 'canvas'
      ? 'just shipped · canvas'
      : phase === 'tools'
        ? 'just shipped · tools'
        : phase === 'onboard'
          ? 'welcome in · no rush'
          : locked
            ? 'pencils down'
            : 'the 60 second draw',
  )
</script>

<div class="board">
  <div class="eyebrow">{eyebrow}</div>
  {#if locked}
    <p class="phone-title">Submitted ✓</p>
    <p class="phone-note">Your character enters the arena. Watch the big screen.</p>
  {:else if ready}
    <p class="phone-title">Submitted ✓</p>
    <p class="phone-note">Waiting for the room — or keep drawing until the timer runs out.</p>
  {:else}
    <p class="phone-title">
      {#if remaining !== null}
        <span class="countdown" class:urgent={remaining <= 10}>{remaining}s</span>
      {:else}
        Draw your character{name ? `, ${name}` : ''}.
      {/if}
    </p>
  {/if}
  <Canvas bind:this={canvas} {color} {brush} {mode} locked={locked || ready} />
  {#if toolsUnlocked && !locked && !ready}
    <div use:fx={{ pop: true }}>
      <Tools
        bind:color
        bind:brush
        bind:mode
        onundo={() => canvas.undo()}
        onclear={() => canvas.clear()}
      />
    </div>
  {/if}
  {#if phase === 'drawing' && !locked}
    {#if ready}
      <button class="btn ghost" onclick={unready}>↺ keep drawing</button>
    {:else}
      <button class="btn" onclick={readyUp}>I'm done ✓</button>
    {/if}
  {/if}
  {#if phase === 'onboard'}
    <button class="btn" disabled={sending} onclick={submitCharacter}>
      {sending ? 'uploading…' : 'submit character →'}
    </button>
  {/if}
</div>

<style>
  .board {
    display: flex; flex-direction: column; align-items: center; gap: 0.9rem;
    width: 100%;
  }
  .countdown { font-family: var(--mono); font-size: 1.6rem; color: var(--ink); }
  .countdown.urgent { color: var(--clay-deep); }
</style>
