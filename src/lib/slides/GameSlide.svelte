<script lang="ts">
  import { onMount } from 'svelte'
  import QRCode from 'qrcode'
  import { fx } from '../fx'
  import { deck } from '../deck.svelte'
  import { presenter } from '../net/presenter.svelte'
  import Arena from '../battle/Arena.svelte'
  import ChampionsStrip from '../components/ChampionsStrip.svelte'

  let qr = $state('')

  onMount(async () => {
    qr = await QRCode.toDataURL(`${location.origin}/join`, {
      margin: 1,
      width: 240,
      color: { dark: '#262624', light: '#FAF9F5' },
    })
  })
</script>

<div class="eyebrow" use:fx>After Hours · Game Time</div>
<h2 use:fx={{ d: 0.1 }}>Rematch. Same characters, one champion.</h2>
<Arena rematchable onnext={() => deck.next()} />
<ChampionsStrip />

<!-- compact QR for late joiners: scan → name → draw (no timer) → pick -->
<div class="game-qr" use:fx={{ d: 0.4 }}>
  {#if qr}
    <img src={qr} alt="QR code to join" />
  {/if}
  <div class="game-qr-meta">
    <span class="url">{location.host}<b>/join</b></span>
    <span class="count">{presenter.liveCount} in</span>
  </div>
</div>

<style>
  .game-qr {
    position: fixed; right: 1.1rem; bottom: 1.1rem; z-index: 10;
    display: flex; align-items: center; gap: 0.7rem;
    background: var(--paper); border: 1px solid var(--line); border-radius: 0.9rem;
    padding: 0.55rem 0.8rem 0.55rem 0.55rem;
    box-shadow: 0 6px 24px rgba(38, 38, 36, 0.1);
  }
  .game-qr img { width: 4.6rem; height: 4.6rem; display: block; border-radius: 0.4rem; }
  .game-qr-meta {
    display: flex; flex-direction: column; gap: 0.25rem;
    font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.06em; color: var(--muted);
  }
  .game-qr-meta .url b { color: var(--clay-deep); font-weight: 500; }
  .game-qr-meta .count { color: var(--ink-soft); }
</style>
