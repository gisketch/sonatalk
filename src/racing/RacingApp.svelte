<script lang="ts">
  import { onMount } from 'svelte'
  import QRCode from 'qrcode'
  import Defs from '../lib/components/Defs.svelte'
  import ChampionsStrip from '../lib/components/ChampionsStrip.svelte'
  import RaceTrack from '../lib/race/RaceTrack.svelte'
  import { presenter } from '../lib/net/presenter.svelte'

  // TEST HARNESS ONLY — talk night runs the race from deck slide 16 with the
  // same session/characters. This page exists to test the race in isolation.
  presenter.start()

  let qr = $state('')
  onMount(async () => {
    qr = await QRCode.toDataURL(`${location.origin}/join`, {
      margin: 1,
      width: 240,
      color: { dark: '#262624', light: '#FAF9F5' },
    })
  })
</script>

<Defs />

<main class="race-page">
  <header>
    <div>
      <div class="eyebrow">race test harness · not the talk</div>
      <h2>The Sprint — test track</h2>
    </div>
    <div class="join-box">
      {#if qr}<img src={qr} alt="QR to join" />{/if}
      <div class="join-meta">
        <span>{location.host}<b>/join</b></span>
        <span class="cnt">{presenter.liveCount} connected</span>
        {#if !presenter.live}<span class="warn">add ?key=&lt;token&gt; to control</span>{/if}
      </div>
    </div>
  </header>
  <RaceTrack />
  <ChampionsStrip />
</main>

<style>
  .race-page {
    height: 100%; display: flex; flex-direction: column; gap: 1rem;
    padding: clamp(1rem, 3vh, 2rem) clamp(1rem, 4vw, 3rem);
  }
  header { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
  h2 { font-family: var(--serif); font-size: clamp(1.6rem, 4vh, 2.4rem); }
  .join-box {
    display: flex; gap: 0.7rem; align-items: center;
    background: var(--paper); border: 1px solid var(--line); border-radius: 0.9rem;
    padding: 0.55rem 0.8rem 0.55rem 0.55rem;
  }
  .join-box img { width: 4.6rem; height: 4.6rem; display: block; border-radius: 0.4rem; }
  .join-meta {
    display: flex; flex-direction: column; gap: 0.25rem;
    font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.06em; color: var(--muted);
  }
  .join-meta b { color: var(--clay-deep); font-weight: 500; }
  .join-meta .cnt { color: var(--ink-soft); }
  .join-meta .warn { color: var(--clay-deep); }
</style>
