<script lang="ts">
  import { fx } from '../fx'
  import LagControl from '../components/LagControl.svelte'
  import { presenter } from '../net/presenter.svelte'
  import { airhorn, tick, womp } from '../sfx'
  import GauntletWall from './GauntletWall.svelte'
  import { buildLabel, buildRoast } from './lines'

  /** finale: last game — after the crown, onnext leads to the podium */
  let { finale = false, onnext }: { finale?: boolean; onnext?: () => void } = $props()

  let now = $state(Date.now())
  $effect(() => {
    const t = setInterval(() => (now = Date.now()), 50) // fuse ring needs a fast clock
    return () => clearInterval(t)
  })

  const inGauntlet = $derived(presenter.phase === 'gauntlet')
  const stage = $derived(String(presenter.payload.state ?? 'idle'))
  const prompt = $derived(presenter.payload.prompt as { text: string; sub: string; ink: string | null } | undefined)
  const round = $derived(Number(presenter.payload.round ?? 0))
  const mode = $derived(String(presenter.payload.mode ?? 'arrows'))
  const showAt = $derived(Number(presenter.payload.showAt ?? 0))
  const closesAt = $derived(Number(presenter.payload.closesAt ?? 0))
  // A winner only counts here if it's THIS game's: mid-gauntlet, or a gauntlet crown.
  // (Another game's crowned winner rides the winners payload too — ignore it.)
  const winner = $derived.by(() => {
    const w = presenter.payload.winner as { id: string; name: string } | undefined
    if (!w) return undefined
    if (presenter.phase === 'gauntlet') return w
    if (presenter.phase === 'winners' && presenter.payload.from === 'gauntlet') return w
    return undefined
  })
  const crowned = $derived(presenter.phase === 'winners')
  const tiebreak = $derived(presenter.payload.tiebreak === true)
  const leaders = $derived(
    (presenter.payload.leaders as Array<{ id: string; name: string }> | undefined) ?? [],
  )
  const leaderIds = $derived((presenter.payload.leaderIds as string[] | undefined) ?? [])
  const correctIds = $derived((presenter.payload.correctIds as string[] | undefined) ?? [])
  const correctCount = $derived(Number(presenter.payload.correctCount ?? 0))
  const fieldCount = $derived(Number(presenter.payload.fieldCount ?? 0))
  const correct = $derived(String(presenter.payload.correct ?? ''))

  // The deck itself is AirPlayed: render the prompt immediately, but the fuse tracks the
  // server-stamped window (which is already shifted to TV time by displayLagMs).
  const fuse = $derived(
    stage === 'prompt' && closesAt > showAt
      ? Math.max(0, Math.min(1, (closesAt - now) / (closesAt - showAt)))
      : 0,
  )

  const wall = $derived(
    presenter.players.filter(
      (p) => (p as (typeof presenter.players)[0] & { connected?: boolean }).connected,
    ),
  )
  const avatar = (id: string) => {
    const url = presenter.drawings[id]
    return url && url !== 'pending' ? url : null
  }
  const benched = (id: string) => tiebreak && leaderIds.length > 0 && !leaderIds.includes(id)

  const onFire = $derived.by(() => {
    if (stage !== 'results' || winner) return ''
    const hot = wall.filter((p) => p.streak >= 3).map((p) => p.name ?? 'anon')
    if (!hot.length) return ''
    if (hot.length === 1) return `🔥 ${hot[0]} is ON FIRE`
    if (hot.length === 2) return `🔥 ${hot[0]} and ${hot[1]} are ON FIRE`
    return `🔥 ${hot.length} players are ON FIRE`
  })

  const missRoast = $derived.by(() => {
    if (stage !== 'results' || correctCount === 0 || winner) return ''
    const missed = wall
      .filter((p) => !benched(p.id) && !correctIds.includes(p.id))
      .map((p) => p.name ?? 'anon')
    return buildRoast(round, missed)
  })
  const label = $derived(buildLabel(mode, correct))

  // Winner dance (same family as the other games).
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

  function begin() {
    presenter.advance('gauntlet')
  }
  function start() {
    presenter.gauntletStart()
  }
  function crown() {
    if (!winner) return
    presenter.crown([winner.id])
    // winner rides along (tagged) so the podium control stays reachable
    // without leaking into other game slides
    presenter.advance('winners', { survivors: [winner.id], winner, from: 'gauntlet' })
    airhorn()
  }

  // Timer ticks while a command is live; urgent pitch in the last stretch.
  // `fuse` is read inside the interval callback — async reads are NOT tracked by
  // $effect (Svelte 5), so this effect re-runs only on stage/winner changes.
  $effect(() => {
    if (stage !== 'prompt' || !!winner) return
    const t = setInterval(() => tick(fuse < 0.35), 500)
    return () => clearInterval(t)
  })
  // one womp per roast beat
  let womped = -1
  $effect(() => {
    if (stage === 'results' && round !== womped && correctCount > 0 && missRoast) {
      womped = round
      womp()
    }
  })
</script>

<div class="gauntlet-wrap" use:fx={{ d: 0.25 }}>
  {#if winner}
    <div class="center winner" use:fx={{ pop: true }}>
      <div class="gemoji">🏆</div>
      {#if avatar(winner.id)}
        <img class="gdance {dance}" src={avatar(winner.id)} alt={winner.name} />
      {/if}
      <p class="gtitle">{winner.name} survives the gauntlet!</p>
    </div>
  {:else if stage === 'prompt' && prompt}
    <div class="center">
      {#if tiebreak}<p class="sub hot">SUDDEN DEATH</p>{/if}
      <div class="promptbox">
        <p class="prompt" style:color={prompt.ink ?? 'inherit'}>{prompt.text}</p>
      </div>
      <!-- timer lives OUTSIDE the prompt so it can never fight the ink color -->
      <div class="timerbar" class:low={fuse < 0.35}>
        <i style:width="{fuse * 100}%"></i>
      </div>
      <p class="sub">{prompt.sub}</p>
      <p class="roundtag">round {round}</p>
    </div>
  {:else if stage === 'results'}
    <div class="center" use:fx={{ pop: true }}>
      {#if leaders.length > 1}
        <p class="gtitle small">TIE — {leaders.map((l) => l.name).join(' · ')}</p>
        <p class="sub hot">sudden death: only they answer now</p>
      {:else if correctCount === 0}
        <p class="gtitle">NOBODY got it.</p>
        <p class="sub">{label}</p>
      {:else}
        <p class="gtitle small">{correctCount} / {fieldCount} scored</p>
        <p class="sub">{label}</p>
        {#if missRoast}
          <p class="roast">{missRoast}</p>
        {/if}
        {#if onFire}
          <p class="fire">{onFire}</p>
        {/if}
      {/if}
    </div>
  {:else}
    <div class="center">
      <p class="gtitle small">{inGauntlet ? 'ready.' : 'the final game'}</p>
    </div>
  {/if}

  <GauntletWall />
</div>
<div class="gauntlet-ctl">
  {#if winner && !crowned}
    <button class="btn" onclick={crown}>crown the champion →</button>
  {:else if winner && crowned}
    {#if finale && onnext}
      <button class="btn" onclick={onnext}>the podium →</button>
    {:else if finale}
      <span class="wait">that's the night — champions up top 👑</span>
    {:else}
      <button class="btn" onclick={begin}>↺ run it again</button>
    {/if}
  {:else if !inGauntlet}
    <button class="btn" onclick={begin}>open the gauntlet →</button>
  {:else if stage === 'idle'}
    <button class="btn" onclick={start}>start — it runs itself →</button>
  {:else}
    <span class="wait">auto-running · round {round}</span>
  {/if}
  <LagControl />
</div>

<style>
  .gauntlet-wrap {
    position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column;
    background: var(--paper); border: 1px solid var(--line); border-radius: 1.2rem;
    overflow: hidden;
  }
  .center {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 0.7rem; padding: 1rem; min-height: 0;
  }
  .promptbox {
    border-radius: 1.4rem; padding: clamp(1rem, 4vh, 2.2rem) clamp(2rem, 6vw, 4rem);
    border: 1px solid var(--line); background: #fff;
  }
  .timerbar {
    width: min(34rem, 70%); height: 0.7rem; border-radius: 999px;
    background: var(--line); overflow: hidden;
  }
  .timerbar i {
    display: block; height: 100%; background: var(--clay); border-radius: 999px;
    transition: width 0.08s linear;
  }
  .timerbar.low i { background: #C0392B; }
  .prompt {
    font-family: var(--serif); font-weight: 600; text-align: center; line-height: 1.1;
    font-size: clamp(2.6rem, 9vw, 6rem); letter-spacing: 0.01em;
  }
  .sub {
    font-family: var(--mono); font-size: clamp(0.7rem, 1.6vw, 1rem);
    letter-spacing: 0.14em; color: var(--muted); text-transform: uppercase;
  }
  .roundtag { font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.2em; color: var(--line); }
  .gtitle { font-family: var(--serif); font-size: clamp(2rem, 6vw, 3.6rem); text-align: center; }
  .gtitle.small { font-size: clamp(1.4rem, 4vw, 2.4rem); }
  .gemoji { font-size: 3.2rem; }
  .gdance { width: 6.4rem; height: 6.4rem; object-fit: contain; }
  .gdance.bounce { animation: gBounce 0.9s infinite ease-in-out; }
  .gdance.spin { animation: gSpin 1.6s infinite linear; }
  .gdance.sway { animation: gSway 1.1s infinite ease-in-out; }
  .gdance.hop { animation: gHop 0.8s infinite cubic-bezier(0.3, 1.4, 0.5, 1); }
  @keyframes gBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
  @keyframes gSpin { to { transform: rotate(360deg); } }
  @keyframes gSway { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
  @keyframes gHop { 0%, 100% { transform: translateY(0) scale(1); } 40% { transform: translateY(-12px) scale(1.1); } 60% { transform: translateY(-4px) scale(0.96); } }

  .sub.hot { color: var(--clay-deep); }
  .roast {
    font-family: var(--mono); font-size: clamp(0.68rem, 1.4vw, 0.9rem); color: var(--clay-deep);
    letter-spacing: 0.06em; animation: roastIn 0.4s cubic-bezier(0.2, 1.6, 0.4, 1);
  }
  .fire {
    font-family: var(--mono); font-size: clamp(0.72rem, 1.5vw, 0.95rem); color: #C9A227;
    letter-spacing: 0.08em; animation: roastIn 0.4s cubic-bezier(0.2, 1.6, 0.4, 1) 0.15s backwards;
  }
  @keyframes roastIn {
    0% { transform: translateY(8px) scale(0.85); opacity: 0; }
    100% { transform: translateY(0) scale(1); opacity: 1; }
  }
  @media (prefers-reduced-motion: reduce) { .gdance { animation: none !important; } }

  .gauntlet-ctl {
    display: flex; justify-content: center; align-items: center; gap: 1.4rem; padding-top: 0.8rem;
  }
  .wait { font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.1em; color: var(--muted); }
</style>
