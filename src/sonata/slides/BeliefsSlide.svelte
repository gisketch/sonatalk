<script lang="ts">
  import { fx } from '../../lib/fx'
</script>

<div class="eyebrow" use:fx>Philosophy</div>
<h2 use:fx={{ d: 0.1 }}>Three beliefs hold the whole thing up.</h2>
<div class="card-row three">
  <div class="qcard" use:fx={{ d: 0.3 }}>
    <span class="badge"><svg class="icon"><use href="#i-map" /></svg></span>
    <h3>The repo is the source of truth</h3>
    <p>
      If a decision only lives in chat, Slack, or a tracker, <b>the next agent doesn't know it exists</b>.
      Trackers coordinate; the repo remembers.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.55 }}>
    <span class="badge"><svg class="icon"><use href="#i-book" /></svg></span>
    <h3>Guides steer, checks correct</h3>
    <p>
      Docs and skills improve the <b>first attempt</b>; tests and gates catch what slips through.
      You need both halves.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.8 }}>
    <span class="badge"><svg class="icon"><use href="#i-sliders" /></svg></span>
    <h3>Ceremony scales with risk</h3>
    <p>
      A typo gets one cheap check. A payment flow gets focused evidence.
      <b>Never the same ritual for both.</b>
    </p>
  </div>
</div>
<p class="footline" use:fx={{ d: 1.1 }}>
  Plus one smell rule: 200–300 lines is a healthy file. <b>Above 300, the size gate fails</b> — split at a real boundary.
</p>
