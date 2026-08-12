<script lang="ts">
  import GauntletPrompt from './GauntletPrompt.svelte'

  let {
    payload = {},
    myId = null,
    score = 0,
    winnerName = null,
    isWinner = false,
    ontap,
  }: {
    payload?: Record<string, unknown>
    myId?: string | null
    /** server-confirmed score */
    score?: number
    winnerName?: string | null
    isWinner?: boolean
    ontap?: (side: 'left' | 'right') => void
  } = $props()

  // The command is mirrored here (top) with the pads below, so a player never has to
  // ping-pong between phone and TV. The server's broadcast state — not the phone clock —
  // still opens the pads, so clock skew can't shrink or widen anyone's window.
  const stage = $derived(String(payload.state ?? 'idle'))
  const mode = $derived(String(payload.mode ?? 'tap'))
  const open = $derived(stage === 'prompt')
  const round = $derived(Number(payload.round ?? 0))
  const tiebreak = $derived(payload.tiebreak === true)
  const leaderIds = $derived((payload.leaderIds as string[] | undefined) ?? [])
  const benched = $derived(tiebreak && !!myId && leaderIds.length > 0 && !leaderIds.includes(myId))
  const correctIds = $derived((payload.correctIds as string[] | undefined) ?? [])
  const gotIt = $derived(stage === 'results' && !!myId && correctIds.includes(myId))

  let taps = $state(0)
  let locked = $state<'left' | 'right' | null>(null) // yes/no auto lock-in
  let pulse = $state(0) // retriggers the tap animation

  $effect(() => {
    void round
    void stage
    if (stage === 'prompt') {
      taps = 0
      locked = null
    }
  })

  function tap(side: 'left' | 'right') {
    if (!open || benched || locked) return
    taps++
    pulse++
    if (mode === 'yesno') locked = side // one answer, locked in — no fat-finger flips
    if (navigator.vibrate) navigator.vibrate(30)
    ontap?.(side)
  }
</script>

<div class="gauntlet">
  {#if winnerName}
    <div class="bigmoji">{isWinner ? '🏆' : '🏁'}</div>
    <p class="phone-title">{isWinner ? 'You survive the gauntlet!' : `${winnerName} takes the prize!`}</p>
    <p class="phone-note">
      {isWinner ? 'The big prize is yours. Go claim it.' : `You scored ${score}. Watch the big screen.`}
    </p>
  {:else if benched}
    <div class="bigmoji">🍿</div>
    <p class="phone-title">Tiebreak!</p>
    <p class="phone-note">The leaders settle it — watch the big screen. You scored {score}.</p>
  {:else}
    <div class="scorebar">
      <span class="chip">score <b>{score}</b></span>
      {#if tiebreak}<span class="chip hotchip">SUDDEN DEATH</span>{/if}
    </div>

    <!-- command zone: the round's command, or its verdict once the window closes -->
    <div class="cmdzone">
      {#if stage === 'results'}
        <div class="verdict" class:good={gotIt} class:bad={!gotIt}>
          <span class="vmark">{gotIt ? '✓' : '✗'}</span>
          <span class="vtext">{gotIt ? '+1' : 'missed'}</span>
        </div>
      {:else if open}
        <GauntletPrompt {payload} />
      {:else}
        <p class="phone-note">next command incoming…</p>
      {/if}
    </div>

    <!-- fixed-height: the pads must never move under a sub-second window -->
    <div class="feedback">
      {#if open && locked}
        <div class="lockin {locked === 'right' ? 'yes' : 'no'}">
          {locked === 'right' ? 'YES ✓' : 'NO ✓'}
        </div>
      {:else if open && taps > 0}
        {#key pulse}
          <div class="tapcount">{taps}</div>
        {/key}
      {/if}
    </div>

    <div class="pads" class:hot={open && !locked}>
      {#if mode === 'yesno'}
        <button
          class="pad no"
          disabled={!open || !!locked}
          onpointerdown={(e) => { e.preventDefault(); tap('left') }}>NO</button>
        <button
          class="pad yes"
          disabled={!open || !!locked}
          onpointerdown={(e) => { e.preventDefault(); tap('right') }}>YES</button>
      {:else}
        <!-- count commands (TAP ONCE / TWICE / DON'T TAP): one giant pad, count is everything.
             No remount per tap — rapid taps must never race a recreated button. -->
        <button
          class="pad big"
          disabled={!open}
          onpointerdown={(e) => { e.preventDefault(); tap('left') }}>TAP</button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .gauntlet {
    display: flex; flex-direction: column; align-items: center;
    width: 100%; flex: 1; justify-content: space-evenly;
  }
  /* command above, pads below, evenly spread — no dead gap in the middle */
  .cmdzone {
    flex: 0 0 auto; min-height: 8rem; width: 100%;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }
  .feedback {
    height: 3.6rem; display: flex; align-items: center; justify-content: center;
  }
  .scorebar { display: flex; gap: 0.5rem; }
  .chip {
    font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.12em; color: var(--muted);
    border: 1px solid var(--line); border-radius: 999px; padding: 0.3rem 0.8rem;
  }
  .chip b { color: var(--clay-deep); font-weight: 500; }
  .hotchip { color: var(--clay-deep); border-color: var(--clay); }

  .tapcount {
    font-family: var(--serif); font-size: 3.2rem; line-height: 1; color: var(--clay-deep);
    animation: tapPop 0.18s ease;
  }
  @keyframes tapPop {
    0% { transform: scale(1.35); }
    100% { transform: scale(1); }
  }
  .lockin {
    font-family: var(--serif); font-size: 2rem; line-height: 1.1; padding: 0.3rem 1.4rem;
    border-radius: 1rem; animation: tapPop 0.18s ease;
  }
  .lockin.yes { color: #3d6b2f; background: rgba(107, 143, 94, 0.16); }
  .lockin.no { color: #a03325; background: rgba(192, 57, 43, 0.13); }

  .verdict {
    display: flex; align-items: baseline; gap: 0.7rem; animation: tapPop 0.2s ease;
    font-family: var(--serif);
  }
  .vmark { font-size: 3.4rem; line-height: 1; }
  .vtext { font-size: 1.3rem; }
  .verdict.good { color: #3d6b2f; }
  .verdict.bad { color: #a03325; }

  .pads {
    display: flex; gap: 0.8rem; width: 100%; max-width: 24rem; margin-top: 0.4rem;
    touch-action: manipulation;
  }
  .pad {
    flex: 1; padding: 3rem 0; border-radius: 1.4rem; border: 2px solid var(--line);
    background: var(--paper); font-size: 1.7rem; color: var(--ink-soft);
    font-family: var(--mono); letter-spacing: 0.08em;
    user-select: none; -webkit-user-select: none; touch-action: manipulation;
    transition: transform 0.08s ease;
  }
  .pad:active { transform: scale(0.94); }
  .pad:disabled { opacity: 0.35; }
  .hot .pad { border-color: var(--clay); color: var(--clay-deep); }
  .pad.yes { background: rgba(107, 143, 94, 0.14); border-color: #6b8f5e; color: #3d6b2f; }
  .pad.no { background: rgba(192, 57, 43, 0.11); border-color: #c0392b; color: #a03325; }
  .pad.yes:disabled, .pad.no:disabled { opacity: 0.3; }
  .pad.big { padding: 3.8rem 0; font-size: 2.1rem; letter-spacing: 0.2em; }
</style>
