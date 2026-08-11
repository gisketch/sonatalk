<script lang="ts">
  let {
    payload = {},
    steps = 0,
    myId = null,
    hasDrawing = false,
    winnerName = null,
    winnerAvatar = null,
    isWinner = false,
    ontap,
  }: {
    payload?: Record<string, unknown>
    /** server-confirmed steps (throttled) — display trusts local prediction, server reconciles */
    steps?: number
    myId?: string | null
    hasDrawing?: boolean
    winnerName?: string | null
    /** winner's drawing URL (null when they have none) — dances on the result screen */
    winnerAvatar?: string | null
    isWinner?: boolean
    ontap?: (side: 'left' | 'right') => void
  } = $props()

  const TARGET = $derived(Number(payload.target ?? 150))

  let now = $state(Date.now())
  let foot = $state<'left' | 'right' | null>(null)
  let shake = $state(false)
  let lockout = $state(false)
  let localSteps = $state(0)
  let lockTimer: ReturnType<typeof setTimeout> | undefined

  const startsAt = $derived(Number(payload.startsAt ?? 0))
  const countdown = $derived(Math.max(0, Math.ceil((startsAt - now) / 1000)))
  const go = $derived(now >= startsAt)
  // Latency shield: your own progress renders from the local prediction (0ms feel);
  // the server stays authoritative and its throttled count can only correct upward
  // (e.g. after a reload) — both sides enforce the same alternation rule.
  const shown = $derived(Math.max(localSteps, steps))

  $effect(() => {
    const t = setInterval(() => (now = Date.now()), 120)
    return () => clearInterval(t)
  })

  // New race (new startsAt) → fresh feet + fresh prediction.
  $effect(() => {
    void startsAt
    foot = null
    localSteps = 0
    lockout = false
  })

  const avatarUrl = $derived(hasDrawing && myId ? `/api/drawing/${myId}` : null)

  // One random dance per winner (stable across rebroadcasts).
  const DANCES = ['bounce', 'spin', 'sway', 'hop']
  let dance = $state('bounce')
  let dancedFor = ''
  $effect(() => {
    const key = winnerName ?? ''
    if (key && key !== dancedFor) {
      dancedFor = key
      dance = DANCES[Math.floor(Math.random() * DANCES.length)]
    }
  })

  function tap(side: 'left' | 'right') {
    if (!go || winnerName || lockout) return
    if (foot === side) {
      // stumble: both feet locked until the shake ends — alternation has a real cost
      shake = true
      lockout = true
      clearTimeout(lockTimer)
      lockTimer = setTimeout(() => {
        shake = false
        lockout = false
      }, 350)
      if (navigator.vibrate) navigator.vibrate(60)
      return
    }
    foot = side
    localSteps += 0.5
    ontap?.(side)
  }
</script>

<div class="race">
  {#if winnerName}
    <div class="bigmoji">{isWinner ? '🏆' : '🏁'}</div>
    {#if winnerAvatar}
      <img class="wdance {dance}" src={winnerAvatar} alt={winnerName} />
    {/if}
    <p class="phone-title">{isWinner ? 'You win the sprint!' : `${winnerName} takes it!`}</p>
    <p class="phone-note">
      {isWinner ? 'Go collect your reward.' : `You made ${Math.floor(shown)} steps. Watch the big screen.`}
    </p>
  {:else if !go}
    <div class="eyebrow">game 2 · the sprint</div>
    <div class="count">{countdown === 0 ? 'GO' : countdown}</div>
    <p class="phone-note">Alternate LEFT / RIGHT to run. Same foot twice = stumble.</p>
  {:else}
    <div class="eyebrow">run!</div>
    {#if avatarUrl}
      <img
        class="me"
        class:running={!shake}
        class:stumbling={shake}
        style:transform="rotate({foot === 'left' ? -10 : foot === 'right' ? 10 : 0}deg)"
        src={avatarUrl}
        alt="you"
      />
    {/if}
    <div class="progress">
      <b>{Math.floor(shown)}</b> / {TARGET} steps
      <span class="bar"><i style:width="{Math.min(100, (shown / TARGET) * 100)}%"></i></span>
    </div>
  {/if}

  {#if !winnerName}
    <div class="feet" class:shaking={shake}>
      <button
        class="foot"
        class:lit={go && !lockout && foot !== 'left'}
        disabled={!go || lockout}
        onpointerdown={(e) => { e.preventDefault(); tap('left') }}
      >
        {shake ? "CAN'T" : '← LEFT'}
      </button>
      <button
        class="foot"
        class:lit={go && !lockout && foot !== 'right'}
        disabled={!go || lockout}
        onpointerdown={(e) => { e.preventDefault(); tap('right') }}
      >
        {shake ? "CAN'T" : 'RIGHT →'}
      </button>
    </div>
  {/if}
</div>

<style>
  .race {
    display: flex; flex-direction: column; align-items: center; gap: 1rem;
    width: 100%; flex: 1; justify-content: center;
  }
  .count {
    font-family: var(--serif); font-size: 5rem; line-height: 1; color: var(--ink);
  }
  .me {
    width: 5.4rem; height: 5.4rem; object-fit: contain;
    transition: transform 0.1s ease;
  }
  .me.running { animation: runBounce 0.34s infinite ease-in-out; }
  .me.stumbling { animation: stumble 0.35s ease; }
  .wdance { width: 6rem; height: 6rem; object-fit: contain; }
  .wdance.bounce { animation: danceBounce 0.9s infinite ease-in-out; }
  .wdance.spin { animation: danceSpin 1.6s infinite linear; }
  .wdance.sway { animation: danceSway 1.1s infinite ease-in-out; }
  .wdance.hop { animation: danceHop 0.8s infinite cubic-bezier(0.3, 1.4, 0.5, 1); }
  @keyframes danceBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
  @keyframes danceSpin { to { transform: rotate(360deg); } }
  @keyframes danceSway { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
  @keyframes danceHop { 0%, 100% { transform: translateY(0) scale(1); } 40% { transform: translateY(-11px) scale(1.1); } 60% { transform: translateY(-4px) scale(0.96); } }
  @media (prefers-reduced-motion: reduce) { .wdance, .me.running { animation: none !important; } }
  @keyframes runBounce {
    0%, 100% { translate: 0 0; }
    50% { translate: 0 -7px; }
  }
  .progress {
    font-family: var(--mono); font-size: 0.85rem; color: var(--muted);
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  }
  .progress b { color: var(--clay-deep); font-size: 1.6rem; font-weight: 500; }
  .bar {
    width: 14rem; height: 0.5rem; border-radius: 999px; background: var(--line);
    overflow: hidden; display: block;
  }
  .bar i { display: block; height: 100%; background: var(--clay); border-radius: 999px; }

  .feet {
    display: flex; gap: 0.8rem; width: 100%; max-width: 24rem; margin-top: 0.5rem;
    touch-action: manipulation; /* no double-tap zoom mid-race */
  }
  .feet.shaking { animation: stumble 0.35s ease; }
  .foot {
    flex: 1; padding: 2.6rem 0; border-radius: 1.2rem; border: 1px solid var(--line);
    background: var(--paper); font-family: var(--mono); font-size: 1rem;
    letter-spacing: 0.1em; color: var(--ink-soft); user-select: none;
    -webkit-user-select: none; touch-action: manipulation;
  }
  .foot:disabled { opacity: 0.4; }
  .foot.lit { border-color: var(--clay); color: var(--clay-deep); }
  .feet.shaking .foot {
    background: rgba(217, 119, 87, 0.14); border-color: var(--clay-deep); color: var(--clay-deep);
  }
  @keyframes stumble {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-7px); }
    50% { transform: translateX(6px); }
    75% { transform: translateX(-4px); }
  }
</style>
