<script lang="ts">
  import { onMount } from 'svelte'
  import QRCode from 'qrcode'
  import { fx } from '../fx'
  import { presenter } from '../net/presenter.svelte'

  let qr = $state('')

  onMount(async () => {
    qr = await QRCode.toDataURL(`${location.origin}/join`, {
      margin: 1,
      width: 480,
      color: { dark: '#262624', light: '#FAF9F5' },
    })
  })
</script>

<div class="eyebrow" use:fx>Audience Time</div>
<h2 use:fx={{ d: 0.1 }}>Grab your phone.</h2>
<div class="qr-wrap">
  <div class="qr-card" use:fx={{ d: 0.3, pop: true }}>
    {#if qr}
      <img src={qr} alt="QR code to join" />
    {/if}
  </div>
  <div class="qr-side" use:fx={{ d: 0.55 }}>
    <p class="qr-url">{location.host}<b>/join</b></p>
    <p class="qr-count">
      <span class="big">{presenter.liveCount}</span>
      {presenter.liveCount === 1 ? 'person' : 'people'} in
    </p>
    <p class="sub">No app, no sign-up. Keep the tab open.</p>
  </div>
</div>

<style>
  .qr-wrap {
    flex: 1; display: flex; align-items: center; justify-content: center;
    gap: clamp(2rem, 6vw, 5rem); min-height: 0;
  }
  .qr-card {
    background: var(--paper); border: 1px solid var(--line); border-radius: 1.4rem;
    padding: clamp(1rem, 2.5vh, 1.6rem); box-shadow: 0 10px 40px rgba(38, 38, 36, 0.08);
  }
  .qr-card img { display: block; width: clamp(14rem, 36vh, 22rem); height: auto; }
  .qr-side { display: flex; flex-direction: column; gap: 1rem; }
  .qr-url { font-family: var(--mono); font-size: clamp(1rem, 1.8vw, 1.4rem); color: var(--muted); }
  .qr-url b { color: var(--clay-deep); font-weight: 500; }
  .qr-count { font-size: clamp(0.9rem, 1.4vw, 1.1rem); color: var(--muted); }
  .qr-count .big {
    font-family: var(--serif); font-size: clamp(2.4rem, 6vh, 4rem); color: var(--ink);
    display: block; line-height: 1;
  }
</style>
