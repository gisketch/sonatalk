<script lang="ts">
  import { fx } from '../fx'
</script>

<div class="eyebrow" use:fx>Sonata · The Feedforward Half, Continued</div>
<h2 use:fx={{ d: 0.1 }}>Skills — teach it once, invoke it forever.</h2>
<div class="skills-row">
  <div class="qcard" use:fx={{ d: 0.3 }}>
    <span class="badge"><svg class="icon"><use href="#i-spec" /></svg></span>
    <h3>What is a skill?</h3>
    <p>A markdown file the agent loads on demand. No plugin, no platform — <b>a checklist it actually follows.</b></p>
  </div>
  <div class="qcard" use:fx={{ d: 0.5 }}>
    <span class="badge"><svg class="icon"><use href="#i-zap" /></svg></span>
    <h3>How do you use it?</h3>
    <p>Type <b>/its-name</b>, or the description auto-triggers it. Description = <b>when</b>, body = <b>how</b>.</p>
  </div>
  <div class="qcard" use:fx={{ d: 0.7 }}>
    <span class="badge"><svg class="icon"><use href="#i-repeat" /></svg></span>
    <h3>When do you write one?</h3>
    <p>The <b>second time</b> you explain something. Deploy runbook, review checklist, release notes.</p>
  </div>
  <div class="doc" use:fx={{ d: 0.9 }}>
    <div class="doc-name">
      <svg class="icon"><use href="#i-spec" /></svg>skills/release-notes/SKILL.md
    </div>
    <div class="doc-body">
      <h5>description</h5>
      <ul><li>Draft release notes from merged PRs. Use when a release is tagged.</li></ul>
      <h5>steps</h5>
      <ul>
        <li>list PRs since last tag</li>
        <li>group: features · fixes · breaking</li>
        <li>user-facing lines, link each PR</li>
      </ul>
    </div>
  </div>
</div>
<p class="footline" use:fx={{ d: 1.15 }}>
  Docs are what the agent <b>knows</b> — skills are what it <b>does</b>. 20 lines of markdown and
  <b>your best explanation becomes the whole team's default.</b> Every Sonata workflow tonight is one.
</p>

<style>
  .skills-row {
    flex: 1; display: grid; grid-template-columns: 1fr 1fr 1fr 1.3fr;
    gap: clamp(1rem, 2vw, 1.6rem); align-content: center; align-items: stretch; min-height: 0;
  }
  .skills-row .qcard { padding: clamp(1rem, 2.4vh, 1.6rem) clamp(1rem, 1.8vw, 1.4rem); }
  .skills-row .doc { margin-top: 0; max-width: none; align-self: center; }
</style>
