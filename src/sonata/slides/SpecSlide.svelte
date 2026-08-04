<script lang="ts">
  import { fx } from '../../lib/fx'
</script>

<div class="eyebrow" use:fx>Stage 2 · <span style="text-transform:none">$sonata-spec</span></div>
<h2 use:fx={{ d: 0.1 }}>Spec — the contract you agree on before building.</h2>
<div class="spec-row">
  <div class="spec-cards">
    <div class="qcard" use:fx={{ d: 0.3 }}>
      <span class="badge"><svg class="icon"><use href="#i-spec" /></svg></span>
      <h3>A blueprint, not an essay</h3>
      <p>
        Problem, scope, <b>observable acceptance criteria</b>, settled decisions, risks.
        The smallest spec that removes ambiguity — length follows risk.
      </p>
    </div>
    <div class="qcard" use:fx={{ d: 0.55 }}>
      <span class="badge"><svg class="icon"><use href="#i-repeat" /></svg></span>
      <h3>Why write it down</h3>
      <p>
        It survives the session. Tomorrow's agent — or teammate — builds <b>what was agreed</b>,
        not a fresh guess. Trackers get a link, never the truth.
      </p>
    </div>
  </div>
  <div class="doc" use:fx={{ d: 0.8 }}>
    <div class="doc-name">
      <svg class="icon"><use href="#i-spec" /></svg>docs/specs/2026-08-04-player-rejoin.md
    </div>
    <div class="doc-body">
      <h5>problem</h5>
      <ul><li>Eliminated players drop out and can never return.</li></ul>
      <h5>acceptance criteria</h5>
      <ul>
        <li>Rejoining player reappears in the lobby within 2s</li>
        <li>Name persists; score resets to zero</li>
      </ul>
      <h5>out of scope</h5>
      <ul><li>Spectator mode</li></ul>
      <h5>validation</h5>
      <ul><li>Reconnect test at the WebSocket seam</li></ul>
    </div>
  </div>
</div>
<p class="footline" use:fx={{ d: 1.1 }}>
  Acceptance criteria are <b>what you can watch it do</b> — never how the code does it.
</p>

<style>
  .spec-row {
    flex: 1; display: grid; grid-template-columns: 1fr 1.2fr;
    gap: clamp(1.2rem, 2.5vw, 2rem); align-content: center; align-items: center; min-height: 0;
  }
  .spec-cards { display: flex; flex-direction: column; gap: clamp(0.9rem, 2vh, 1.4rem); }
  .spec-row .doc { margin-top: 0; max-width: none; }
</style>
