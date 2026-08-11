<script lang="ts">
  import { fx } from '../fx'
  import LagControl from '../components/LagControl.svelte'
  import { presenter } from '../net/presenter.svelte'
  import { airhorn, beep } from '../sfx'

  /** onnext: after the crown, advance to the next game (talk deck only; test page replays) */
  let { onnext }: { onnext?: () => void } = $props()

  let now = $state(Date.now())
  $effect(() => {
    const t = setInterval(() => (now = Date.now()), 150)
    return () => clearInterval(t)
  })

  const racing = $derived(presenter.phase === 'race')
  const startsAt = $derived(Number(presenter.payload.startsAt ?? 0))
  const TARGET = $derived(Number(presenter.payload.target ?? 150))
  const countdown = $derived(Math.max(0, Math.ceil((startsAt - now) / 1000)))
  const winner = $derived(presenter.payload.winner as { id: string; name: string } | undefined)
  const crowned = $derived(presenter.phase === 'winners')

  const racers = $derived(
    presenter.players
      .filter((p) => (p as (typeof presenter.players)[0] & { connected?: boolean }).connected)
      .sort((a, b) => a.id.localeCompare(b.id)),
  )
  /** current first place gets the crown mid-race */
  const leaderId = $derived.by(() => {
    let best: string | null = null
    let bestSteps = 0
    for (const p of racers) {
      if (p.steps > bestSteps) {
        bestSteps = p.steps
        best = p.id
      }
    }
    return best
  })
  /** 18 racers still fit: avatars shrink as the grid fills */
  const size = $derived(racers.length > 12 ? 2.3 : racers.length > 8 ? 2.7 : 3.1)

  const avatar = (id: string) => {
    const url = presenter.drawings[id]
    return url && url !== 'pending' ? url : null
  }
  /** stepping look: tilt flips with each half-step */
  const tilt = (steps: number) => (Math.floor(steps * 2) % 2 === 0 ? -9 : 9)

  // Lead-change hype: "X takes the lead!" toasts as the crown hops racers.
  const LEAD_LINES = ['👑 {n} takes the lead!', '👑 {n} storms ahead!', '👑 {n} says bye!', '👑 {n} is cooking!']
  let toast = $state<{ n: number; text: string } | null>(null)
  let toastN = 0
  let lastLeader = ''
  $effect(() => {
    if (!racing || winner || !leaderId || leaderId === lastLeader) return
    const wasFirst = lastLeader === ''
    lastLeader = leaderId
    if (wasFirst) return // no hype for the very first step of the race
    const name = racers.find((r) => r.id === leaderId)?.name ?? 'someone'
    const n = ++toastN
    toast = { n, text: LEAD_LINES[Math.floor(Math.random() * LEAD_LINES.length)].replace('{n}', name) }
    setTimeout(() => { if (toast?.n === n) toast = null }, 2_200)
  })
  $effect(() => {
    if (!racing) lastLeader = ''
  })
  /** last stretch: the leader's chip pulses */
  const leaderSteps = $derived(racers.find((r) => r.id === leaderId)?.steps ?? 0)
  const almostThere = $derived(racing && !winner && leaderSteps / TARGET > 0.85)

  // Winner celebration: one random dance per win (stable across rebroadcasts).
  const DANCES = ['bounce', 'spin', 'sway', 'hop']
  let dance = $state('bounce')
  let dancedFor = ''
  $effect(() => {
    const id = winner?.id ?? ''
    if (id && id !== dancedFor) {
      dancedFor = id
      dance = DANCES[Math.floor(Math.random() * DANCES.length)]
    }
  })

  function startRace() {
    presenter.advance('race')
  }

  function crown() {
    if (!winner) return
    presenter.crown([winner.id])
    // winner rides along so the post-crown control (next game) stays reachable
    presenter.advance('winners', { survivors: [winner.id], winner })
    airhorn()
  }

  // countdown beeps: 3-2-1 low, GO high
  let lastBeep = -1
  $effect(() => {
    if (!racing || winner) return
    if (countdown !== lastBeep && countdown <= 3) {
      lastBeep = countdown
      beep(countdown === 0)
    }
  })
</script>

<div class="race-wrap" use:fx={{ d: 0.25 }}>
  <div class="finish"><span>FINISH</span></div>
  {#each racers as p (p.id)}
    <figure
      class="racer"
      class:won={winner?.id === p.id}
      style:left="{racers.length > 1 ? 4 + (racers.indexOf(p) / (racers.length - 1)) * 88 : 46}%"
      style:bottom="{4 + Math.min(1, p.steps / TARGET) * 84}%"
      style:transform="rotate({tilt(p.steps)}deg)"
      style:width="{size}rem"
      style:margin-left="-{size / 2}rem"
    >
      {#if leaderId === p.id && p.steps > 0}
        <span class="lead-crown" class:hot={almostThere}>👑</span>
      {/if}
      {#if avatar(p.id)}
        <img src={avatar(p.id)} alt={p.name ?? 'racer'} style:width="{size}rem" style:height="{size}rem" />
      {:else}
        <span class="blank" style:width="{size}rem" style:height="{size}rem">{(p.name ?? '?').slice(0, 1).toUpperCase()}</span>
      {/if}
      <figcaption>{p.name ?? 'anon'}</figcaption>
    </figure>
  {/each}
  {#if toast}
    {#key toast.n}
      <div class="lead-toast">{toast.text}</div>
    {/key}
  {/if}
  {#if racing && !winner && countdown > 0}
    <div class="overlay"><div class="count">{countdown}</div></div>
  {:else if racing && !winner && now - startsAt < 900}
    <div class="overlay go"><div class="count">GO!</div></div>
  {/if}
  {#if winner}
    <div class="overlay winner" use:fx={{ pop: true }}>
      <div class="wemoji">🏆</div>
      {#if avatar(winner.id)}
        <img class="wdance {dance}" src={avatar(winner.id)} alt={winner.name} />
      {/if}
      <p class="wtitle">{winner.name} wins the sprint!</p>
    </div>
  {/if}
</div>
<div class="race-ctl">
  {#if winner && !crowned}
    <button class="btn" onclick={crown}>crown the winner →</button>
  {:else if winner && crowned}
    {#if onnext}
      <button class="btn" onclick={onnext}>next game — the final →</button>
    {:else}
      <button class="btn" onclick={startRace}>↺ race again</button>
    {/if}
  {:else if !racing}
    <button class="btn" onclick={startRace}>start the race — 3·2·1 →</button>
  {:else if countdown > 0}
    <span class="race-note">on your marks…</span>
  {:else}
    <span class="race-note">first to {TARGET} steps — alternate taps!</span>
  {/if}
  <LagControl />
</div>

<style>
  .race-wrap {
    position: relative; flex: 1; min-height: 0;
    background: var(--paper); border: 1px solid var(--line); border-radius: 1.2rem;
    overflow: hidden;
  }
  .finish {
    position: absolute; top: 3.2%; left: 0; right: 0; height: 0.7rem;
    /* checkered flag strip */
    background:
      repeating-conic-gradient(#262624 0% 25%, #faf9f5 0% 50%)
      0 0 / 0.7rem 0.7rem;
    border-block: 1px solid var(--line);
    text-align: right;
  }
  .finish span {
    position: absolute; right: 0.8rem; top: 0.9rem;
    font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.2em; color: var(--clay-deep);
  }
  .racer {
    position: absolute; display: flex; flex-direction: column; align-items: center;
    gap: 0.15rem;
    /* slightly longer than the broadcast interval → continuous glide between snapshots */
    transition: bottom 0.18s linear, transform 0.14s linear;
  }
  .racer img { object-fit: contain; }
  .racer .blank {
    border-radius: 50%; border: 1px solid var(--line);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); color: var(--muted); background: #fff;
  }
  .lead-crown {
    position: absolute; top: -1.1rem; font-size: 0.95rem;
    filter: drop-shadow(0 2px 4px rgba(38, 38, 36, 0.25));
  }
  .lead-crown.hot { animation: crownPulse 0.5s infinite ease-in-out; }
  @keyframes crownPulse {
    50% { transform: scale(1.45) rotate(-8deg); }
  }
  .lead-toast {
    position: absolute; top: 1.1rem; left: 50%; transform: translateX(-50%);
    font-family: var(--mono); font-size: 0.82rem; letter-spacing: 0.06em; color: var(--clay-deep);
    background: rgba(250, 249, 245, 0.95); border: 1px solid var(--clay); border-radius: 999px;
    padding: 0.4rem 1rem; pointer-events: none; white-space: nowrap;
    animation: toastIn 0.35s cubic-bezier(0.2, 1.6, 0.4, 1);
  }
  @keyframes toastIn {
    0% { transform: translateX(-50%) translateY(-14px) scale(0.7); opacity: 0; }
    60% { transform: translateX(-50%) translateY(2px) scale(1.05); opacity: 1; }
    100% { transform: translateX(-50%) translateY(0) scale(1); }
  }
  .racer figcaption {
    font-family: var(--mono); font-size: 0.56rem; color: var(--ink-soft);
    max-width: 4.4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .racer.won img { filter: drop-shadow(0 0 12px rgba(217, 119, 87, 0.7)); }

  .overlay {
    position: absolute; inset: 0; display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 0.4rem;
    background: rgba(250, 249, 245, 0.72); pointer-events: none;
  }
  .overlay.winner { background: rgba(250, 249, 245, 0.88); }
  .count { font-family: var(--serif); font-size: clamp(4rem, 16vh, 8rem); color: var(--ink); }
  .overlay.go .count { color: var(--clay-deep); }
  .wemoji { font-size: 3.4rem; }
  .wtitle { font-family: var(--serif); font-size: clamp(1.8rem, 4vw, 2.8rem); }
  .wdance { width: 6.4rem; height: 6.4rem; object-fit: contain; }
  .wdance.bounce { animation: danceBounce 0.9s infinite ease-in-out; }
  .wdance.spin { animation: danceSpin 1.6s infinite linear; }
  .wdance.sway { animation: danceSway 1.1s infinite ease-in-out; }
  .wdance.hop { animation: danceHop 0.8s infinite cubic-bezier(0.3, 1.4, 0.5, 1); }
  @keyframes danceBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
  @keyframes danceSpin { to { transform: rotate(360deg); } }
  @keyframes danceSway { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
  @keyframes danceHop { 0%, 100% { transform: translateY(0) scale(1); } 40% { transform: translateY(-12px) scale(1.1); } 60% { transform: translateY(-4px) scale(0.96); } }
  @media (prefers-reduced-motion: reduce) { .wdance { animation: none !important; } }

  .race-ctl {
    display: flex; justify-content: center; align-items: center; gap: 1rem; padding-top: 0.8rem;
  }
  .race-note {
    font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.08em; color: var(--muted);
  }
</style>
