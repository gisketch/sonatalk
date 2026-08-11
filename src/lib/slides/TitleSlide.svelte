<script lang="ts">
  import { fx } from '../fx'
</script>

<div class="title-wrap">
  <div use:fx={{ d: 0.1 }}>
    <svg class="spark spin" width="52" height="52" viewBox="0 0 100 100"><use href="#sparkShape" /></svg>
  </div>
  <div class="eyebrow" use:fx={{ d: 0.25 }}>Netzon Halo-Halo</div>
  <h1 use:fx={{ d: 0.4 }}>Harness<br />Engineering</h1>
  <p class="sub" style="margin-top:1.2rem" use:fx={{ d: 0.6 }}>
    Building trust in coding agents — and the one I built for myself.
  </p>
  <p class="defn" use:fx={{ d: 0.75 }}>
    <b>har·ness</b> <i>/ˈhär-nəs/</i> — everything you build <u>around</u> the model:
    the docs, rules, and checks that turn raw speed into work you can trust.
  </p>
  <div class="byline" use:fx={{ d: 0.9 }}>
    <b>Ghegi Jimenez</b><span>·</span><span>10–15 minutes</span>
  </div>
</div>

<style>
  /* the spark wears the light-mode background color against the dark slide */
  .title-wrap :global(.spark) { fill: var(--ivory); }

  /* title slide is always dark — colors are explicit, not theme vars */
  .defn {
    margin-top: 1.4rem; max-width: 34rem;
    font-family: var(--mono); font-size: clamp(0.72rem, 1.5vw, 0.92rem);
    line-height: 1.65; color: #9b968a; letter-spacing: 0.02em;
    border-left: 2px solid var(--clay); padding-left: 1rem;
  }
  .defn b { color: #ece9e0; font-weight: 500; }
  .defn i { color: #6d6960; font-style: normal; }
  .defn u { text-decoration-color: var(--clay); text-underline-offset: 3px; color: #c9c4b8; }
</style>
