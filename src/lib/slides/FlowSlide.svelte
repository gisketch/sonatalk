<script lang="ts">
  import { fx } from '../fx'
</script>

<div class="eyebrow" use:fx>One Idea</div>
<h2 use:fx={{ d: 0.1 }}>Feedforward steers. Feedback corrects.</h2>

<div class="sources">
  <div class="src" use:fx={{ d: 0.2 }}>
    <span class="who">OpenAI · Codex team</span>
    <p>“Iterate on the <b>harness</b>, not the model.”</p>
    <span class="where">openai.com/index/harness-engineering</span>
  </div>
  <div class="src" use:fx={{ d: 0.3 }}>
    <span class="who">Birgitta Böckeler</span>
    <p><b>Guides</b> steer it. <b>Sensors</b> correct it.</p>
    <span class="where">martinfowler.com · 2026</span>
  </div>
</div>

<div class="diagram-area">
  <!-- SVG internals keep the reference's CSS fx/pop classes; SMIL drives the traveling pulses -->
  <!-- viewBox crops the ~100 units of dead space above the FEEDFORWARD label -->
  <svg viewBox="0 104 1000 296" font-family="Inter, sans-serif">
    <defs>
      <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#D97757"/></marker>
      <marker id="arrInk" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#7A776E"/></marker>
    </defs>

    <text class="fx" style="--d:.5s" x="322" y="118" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="12" letter-spacing="2.5" fill="#C4633F">FEEDFORWARD</text>

    <g class="fx" style="--d:.3s">
      <rect x="20" y="130" width="250" height="140" rx="18" fill="#FAF9F5" stroke="#DAD5C9"/>
      <g transform="translate(133,152)" stroke="#C4633F" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g transform="scale(1.35) translate(-12,-3)"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></g></g>
      <text x="145" y="205" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="14" letter-spacing="3" fill="#C4633F">GUIDES</text>
      <text x="145" y="230" text-anchor="middle" font-size="15" fill="#262624" font-weight="600">Steer before it acts</text>
      <text x="145" y="253" text-anchor="middle" font-size="13" fill="#7A776E">conventions · skills · docs</text>
    </g>

    <g class="pop" style="--d:.7s">
      <rect x="380" y="120" width="240" height="160" rx="18" fill="#262624"/>
      <g transform="translate(485,148) scale(0.3)"><path d="M50 4 C53 22 55 30 62 38 C70 45 78 47 96 50 C78 53 70 55 62 62 C55 70 53 78 50 96 C47 78 45 70 38 62 C30 55 22 53 4 50 C22 47 30 45 38 38 C45 30 47 22 50 4 Z" fill="#D97757"/></g>
      <text x="500" y="225" text-anchor="middle" font-size="17" fill="#F0EEE6" font-weight="600">Coding agent</text>
      <text x="500" y="250" text-anchor="middle" font-size="14" fill="#A8A49A">generates the change</text>
    </g>

    <g class="fx" style="--d:1.1s">
      <rect x="730" y="130" width="250" height="140" rx="18" fill="#FAF9F5" stroke="#DAD5C9"/>
      <g transform="translate(844,153)" stroke="#C4633F" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><g transform="scale(1.3) translate(-12,-4)"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></g></g>
      <text x="855" y="207" text-anchor="middle" font-size="15" fill="#262624" font-weight="600">The diff</text>
      <text x="855" y="232" text-anchor="middle" font-size="13" fill="#7A776E">what reaches human eyes</text>
    </g>

    <line class="fx flow-line" style="--d:.55s" x1="272" y1="200" x2="368" y2="200" stroke="#D97757" stroke-width="3" marker-end="url(#arr)"/>
    <line class="fx flow-line" style="--d:.95s" x1="622" y1="200" x2="718" y2="200" stroke="#D97757" stroke-width="3" marker-end="url(#arr)"/>

    <g class="fx" style="--d:1.5s">
      <rect x="380" y="330" width="240" height="62" rx="14" fill="#FAF9F5" stroke="#DAD5C9"/>
      <text x="500" y="356" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="13" letter-spacing="3" fill="#C4633F">SENSORS</text>
      <text x="500" y="378" text-anchor="middle" font-size="12.5" fill="#7A776E">linters · tests · checks · review agents</text>
    </g>
    <text class="fx" style="--d:1.7s" x="770" y="352" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="12" letter-spacing="2.5" fill="#7A776E">FEEDBACK</text>

    <g class="fx" style="--d:1.7s">
      <path d="M 855 272 L 855 361 L 626 361" fill="none" stroke="#7A776E" stroke-width="2.5" stroke-dasharray="7 6" marker-end="url(#arrInk)"/>
      <path d="M 374 361 L 296 361 Q 276 361 276 341 L 276 255 Q 276 240 291 240 L 368 240" fill="none" stroke="#7A776E" stroke-width="2.5" stroke-dasharray="7 6" marker-end="url(#arrInk)"/>
      <text x="316" y="330" text-anchor="middle" font-size="13" fill="#7A776E" font-style="italic">self-correct</text>
    </g>

    <!-- traveling pulses -->
    <circle r="5" fill="#D97757" opacity="0">
      <animateMotion dur="2.4s" begin="1.8s" repeatCount="indefinite" path="M 272 200 L 368 200"/>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.85;1" dur="2.4s" begin="1.8s" repeatCount="indefinite"/>
    </circle>
    <circle r="5" fill="#D97757" opacity="0">
      <animateMotion dur="2.4s" begin="2.6s" repeatCount="indefinite" path="M 622 200 L 718 200"/>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.85;1" dur="2.4s" begin="2.6s" repeatCount="indefinite"/>
    </circle>
    <circle r="4.5" fill="#7A776E" opacity="0">
      <animateMotion dur="3.2s" begin="3.2s" repeatCount="indefinite" path="M 855 272 L 855 361 L 626 361"/>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.9;1" dur="3.2s" begin="3.2s" repeatCount="indefinite"/>
    </circle>
    <circle r="4.5" fill="#7A776E" opacity="0">
      <animateMotion dur="3.2s" begin="4.2s" repeatCount="indefinite" path="M 374 361 L 296 361 Q 276 361 276 341 L 276 255 Q 276 240 291 240 L 368 240"/>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.9;1" dur="3.2s" begin="4.2s" repeatCount="indefinite"/>
    </circle>
  </svg>
</div>
<p class="footline" use:fx={{ d: 2.2 }}>
  Only feedback → it <b>repeats the same mistakes</b>. Only feedforward → you <b>never learn if the rules worked</b>.
</p>

<style>
  /* the two ideas the whole talk stands on — showcased, not footnoted */
  .sources {
    display: grid; grid-template-columns: 1fr 1fr; gap: clamp(0.8rem, 1.8vw, 1.6rem);
    margin-bottom: clamp(0.4rem, 1.4vh, 1rem);
  }
  .src {
    background: var(--paper); border: 1px solid var(--line); border-left: 3px solid var(--clay);
    border-radius: 0.7rem; padding: clamp(0.5rem, 1.3vh, 0.8rem) clamp(0.8rem, 1.4vw, 1.1rem);
  }
  .who {
    display: block; font-family: var(--mono); font-size: clamp(0.55rem, 0.92vw, 0.68rem);
    letter-spacing: 0.16em; text-transform: uppercase; color: var(--clay-deep);
  }
  .src p {
    font-family: var(--serif); font-size: clamp(0.95rem, 1.75vw, 1.3rem); line-height: 1.25;
    color: var(--ink); margin: 0.22em 0 0.28em;
  }
  .src p b { font-weight: 600; color: var(--clay-deep); }
  .where {
    font-family: var(--mono); font-size: clamp(0.5rem, 0.85vw, 0.64rem);
    color: var(--muted); letter-spacing: 0.04em;
  }
</style>
