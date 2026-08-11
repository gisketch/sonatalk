<script lang="ts">
  import { fx } from '../fx'
  import LagControl from '../components/LagControl.svelte'
  import { presenter } from '../net/presenter.svelte'

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
  const winner = $derived(presenter.payload.winner as { id: string; name: string } | undefined)
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
  const size = $derived(wall.length > 12 ? 2.4 : wall.length > 8 ? 2.9 : 3.4)
  const benched = (id: string) => tiebreak && leaderIds.length > 0 && !leaderIds.includes(id)
  /** results moment: green for the sharp, red for the missed */
  const verdictFor = (id: string) => {
    if (stage !== 'results' || winner || benched(id)) return ''
    return correctIds.includes(id) ? 'good' : 'bad'
  }

  const label = $derived.by(() => {
    if (mode === 'yesno') return correct === 'right' ? 'YES was correct' : 'NO was correct'
    return {
      once: 'exactly ONE tap was the move',
      double: 'exactly TWO taps was the move',
      none: 'the move was NOT to tap',
    }[correct] ?? ''
  })

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
    presenter.advance('winners', { survivors: [winner.id] })
  }
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
      {/if}
    </div>
  {:else}
    <div class="center">
      <p class="gtitle small">{inGauntlet ? 'ready.' : 'the final game'}</p>
    </div>
  {/if}

  <div class="wall">
    {#each wall as p (p.id)}
      <figure class="pl {verdictFor(p.id)}" class:out={benched(p.id)} style:width="{size}rem">
        {#if avatar(p.id)}
          <img src={avatar(p.id)} alt={p.name ?? 'player'} style:width="{size}rem" style:height="{size}rem" />
        {:else}
          <span class="blank" style:width="{size}rem" style:height="{size}rem">{(p.name ?? '?').slice(0, 1).toUpperCase()}</span>
        {/if}
        <span class="scorechip">{p.score}</span>
        <figcaption>{p.name ?? 'anon'}</figcaption>
      </figure>
    {/each}
  </div>
</div>
<div class="gauntlet-ctl">
  {#if winner && !crowned}
    <button class="btn" onclick={crown}>crown the champion →</button>
  {:else if winner && crowned}
    <button class="btn" onclick={begin}>↺ run it again</button>
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

  .wall {
    flex: 0 0 auto; display: flex; flex-wrap: wrap; justify-content: center;
    align-items: flex-end; gap: 0.4rem 0.7rem; padding: 0.6rem 1rem 0.8rem;
    border-top: 1px dashed var(--line);
  }
  .pl {
    position: relative; display: flex; flex-direction: column; align-items: center;
    gap: 0.1rem; padding: 0.3rem 0.2rem 0.15rem; border-radius: 0.7rem;
    transition: opacity 0.4s, transform 0.4s, background 0.25s, box-shadow 0.25s;
  }
  .pl.good {
    background: rgba(107, 143, 94, 0.18);
    box-shadow: 0 0 0 2px rgba(107, 143, 94, 0.55);
    animation: verdictPop 0.3s ease;
  }
  .pl.good figcaption { color: #3d6b2f; }
  .pl.bad {
    background: rgba(192, 57, 43, 0.12);
    box-shadow: 0 0 0 2px rgba(192, 57, 43, 0.45);
    animation: verdictShake 0.35s ease;
  }
  .pl.bad figcaption { color: #a03325; }
  @keyframes verdictPop {
    40% { transform: translateY(-6px) scale(1.06); }
  }
  @keyframes verdictShake {
    25% { transform: translateX(-4px); }
    50% { transform: translateX(3px); }
    75% { transform: translateX(-2px); }
  }
  .pl img { object-fit: contain; }
  .pl .blank {
    border-radius: 50%; border: 1px solid var(--line); background: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); color: var(--muted);
  }
  .pl figcaption {
    font-family: var(--mono); font-size: 0.54rem; color: var(--ink-soft);
    max-width: 4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .pl.out { opacity: 0.28; filter: grayscale(1); }
  .scorechip {
    position: absolute; top: -0.5rem; right: -0.4rem;
    font-family: var(--mono); font-size: 0.58rem; color: var(--clay-deep);
    background: var(--paper); border: 1px solid var(--clay); border-radius: 999px;
    min-width: 1.2rem; text-align: center; padding: 0.05rem 0.25rem;
  }
  .sub.hot { color: var(--clay-deep); }
  @media (prefers-reduced-motion: reduce) { .gdance { animation: none !important; } }

  .gauntlet-ctl {
    display: flex; justify-content: center; align-items: center; gap: 1.4rem; padding-top: 0.8rem;
  }
  .wait { font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.1em; color: var(--muted); }
</style>
