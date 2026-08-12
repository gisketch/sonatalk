<script lang="ts">
  import { clockSynced, serverNow } from '../lib/net/clock'

  /** The command, mirrored from the deck so nobody has to look up mid-round. */
  let { payload = {} }: { payload?: Record<string, unknown> } = $props()

  const prompt = $derived(
    payload.prompt as { text: string; sub: string; ink: string | null } | undefined,
  )
  const showAt = $derived(Number(payload.showAt ?? 0))
  const closesAt = $derived(Number(payload.closesAt ?? 0))

  // Everything here runs on the SERVER's clock (see lib/net/clock): showAt is already
  // shifted to when the AirPlayed TV shows the command, so phone and TV land together.
  let now = $state(serverNow())
  $effect(() => {
    const t = setInterval(() => (now = serverNow()), 50)
    return () => clearInterval(t)
  })

  /** presenter's TV-delay stepper tops out at 5s — anything beyond is a bad estimate */
  const MAX_LAG_MS = 6_500

  // Reveal is scheduled, not polled: a timer aimed at showAt beats waiting for the next
  // fuse tick. Never earlier than the TV; never stuck behind a clock we couldn't measure.
  let fired = $state(false)
  $effect(() => {
    const at = showAt
    const live = !!prompt
    fired = false
    if (!live) return
    // Synced: aim at the server instant. Not synced yet (just connected): hold for the
    // TV delay measured from arrival, so we still can't beat the room to the command.
    const wait = clockSynced() ? at - serverNow() : Number(payload.lagMs ?? 0)
    if (wait <= 0 || wait > MAX_LAG_MS) {
      fired = true
      return
    }
    const t = setTimeout(() => (fired = true), wait)
    return () => clearTimeout(t)
  })
  // The clock tick is the backstop: if the timer was scheduled off a stale offset (or
  // the OS held it), passing showAt reveals anyway.
  const revealed = $derived(!!prompt && (fired || (clockSynced() && now >= showAt)))
  const fuse = $derived(
    closesAt > showAt ? Math.max(0, Math.min(1, (closesAt - now) / (closesAt - showAt))) : 0,
  )
</script>

{#if revealed && prompt}
  <p class="cmd" style:color={prompt.ink ?? 'inherit'}>{prompt.text}</p>
  <!-- timer sits under the command, never behind it: stroop ink must stay readable -->
  <div class="fuse" class:low={fuse < 0.35}><i style:width="{fuse * 100}%"></i></div>
  <p class="cmdsub">{prompt.sub}</p>
{:else}
  <p class="cmdwait">hold…</p>
{/if}

<style>
  .cmd {
    font-family: var(--serif); font-weight: 600; line-height: 1.05;
    font-size: clamp(1.9rem, 9vw, 2.9rem); text-align: center;
    animation: cmdIn 0.14s ease-out;
  }
  @keyframes cmdIn {
    from { transform: scale(0.9); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  .fuse {
    width: min(20rem, 82%); height: 0.5rem; border-radius: 999px;
    background: var(--line); overflow: hidden; margin: 0.7rem 0 0.5rem;
  }
  .fuse i {
    display: block; height: 100%; background: var(--clay); border-radius: 999px;
    transition: width 0.08s linear;
  }
  .fuse.low i { background: #c0392b; }
  .cmdsub {
    font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.14em;
    color: var(--muted); text-transform: uppercase;
  }
  .cmdwait {
    font-family: var(--mono); font-size: 0.8rem; letter-spacing: 0.22em; color: var(--line);
    text-transform: uppercase;
  }
  @media (prefers-reduced-motion: reduce) { .cmd { animation: none; } }
</style>
