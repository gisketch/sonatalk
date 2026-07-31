<script lang="ts">
  import { fx } from '../fx'
</script>

<div class="eyebrow" use:fx>Sonata · The Feedforward Half</div>
<h2 use:fx={{ d: 0.1 }}>Documentation the agent actually reads</h2>
<div class="card-row three">
  <div class="qcard" use:fx={{ d: 0.3 }}>
    <span class="badge"><svg class="icon"><use href="#i-map" /></svg></span>
    <h3>Architecture notes</h3>
    <p>
      How the system fits together — so the agent extends the design instead of
      <b>inventing a parallel one</b>.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.55 }}>
    <span class="badge"><svg class="icon"><use href="#i-layers" /></svg></span>
    <h3>Conventions &amp; how-tos</h3>
    <p>
      How we name, structure, test, and ship here. Loaded <b>before generation</b> — feedback I
      never have to type twice.
    </p>
  </div>
  <div class="qcard" use:fx={{ d: 0.8 }}>
    <span class="badge"><svg class="icon"><use href="#i-repeat" /></svg></span>
    <h3>Kept alive by the flow</h3>
    <p>Docs update as part of every feature — <b>not a wiki that rots</b>, a context system that compounds.</p>
  </div>
</div>
<p class="footline" use:fx={{ d: 1.1 }}>
  Documentation stopped being for humans only. <b>It's executable context now.</b>
</p>
