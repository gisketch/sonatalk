<script lang="ts">
  import { fx } from '../fx'
</script>

<div class="title-wrap">
  <div use:fx={{ d: 0.1 }}>
    <svg class="spark spin" width="52" height="52" viewBox="0 0 100 100"><use href="#sparkShape" /></svg>
  </div>
  <div class="eyebrow" use:fx={{ d: 0.25 }}>Weekly Tech Talk · AI Session</div>
  <h1 use:fx={{ d: 0.4 }}>Harness<br />Engineering</h1>
  <p class="sub" style="margin-top:1.2rem" use:fx={{ d: 0.6 }}>
    Building trust in coding agents — and the one I built for myself.
  </p>
  <p class="defn" use:fx={{ d: 0.75 }}>
    <b>har·ness</b> <i>/ˈhär-nəs/</i> — everything you build <u>around</u> the model:
    the docs, rules, and checks that turn raw speed into work you can trust.
  </p>
  <div class="byline" use:fx={{ d: 0.9 }}>
    <b>Ghe Jimenez</b><span>gisketch</span><span>·</span><span>8 minutes</span>
  </div>
</div>

<style>
  .defn {
    margin-top: 1.4rem; max-width: 34rem;
    font-family: var(--mono); font-size: clamp(0.72rem, 1.5vw, 0.92rem);
    line-height: 1.65; color: var(--muted); letter-spacing: 0.02em;
    border-left: 2px solid var(--clay); padding-left: 1rem;
  }
  .defn b { color: var(--ink-soft); font-weight: 500; }
  .defn i { color: var(--line); font-style: normal; }
  .defn u { text-decoration-color: var(--clay); text-underline-offset: 3px; }
</style>
