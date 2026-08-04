<script lang="ts">
  import { fx } from '../../lib/fx'
</script>

<div class="eyebrow" use:fx>One Door</div>
<h2 use:fx={{ d: 0.1 }}><code style="font-family:var(--mono);font-size:0.85em;color:var(--clay-deep)">/sonata-work</code> — you never pick the workflow.</h2>
<div class="diagram-area">
  <svg viewBox="0 0 1000 430" font-family="Inter, sans-serif">
    <defs>
      <marker id="sarr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#D97757"/></marker>
      <marker id="sarrInk" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#7A776E"/></marker>
    </defs>

    <g class="fx" style="--d:.2s">
      <rect x="20" y="175" width="172" height="80" rx="14" fill="#FAF9F5" stroke="#DAD5C9"/>
      <text x="106" y="211" text-anchor="middle" font-size="15" fill="#262624" font-weight="600">Your request</text>
      <text x="106" y="233" text-anchor="middle" font-size="12.5" fill="#7A776E">plain language</text>
    </g>

    <line class="fx flow-line" style="--d:.4s" x1="196" y1="215" x2="244" y2="215" stroke="#D97757" stroke-width="3" marker-end="url(#sarr)"/>

    <g class="pop" style="--d:.5s">
      <rect x="252" y="155" width="190" height="120" rx="18" fill="#262624"/>
      <g transform="translate(334,175) scale(0.18)"><path d="M50 4 C53 22 55 30 62 38 C70 45 78 47 96 50 C78 53 70 55 62 62 C55 70 53 78 50 96 C47 78 45 70 38 62 C30 55 22 53 4 50 C22 47 30 45 38 38 C45 30 47 22 50 4 Z" fill="#D97757"/></g>
      <text x="347" y="230" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="14.5" fill="#D97757">/sonata-work</text>
      <text x="347" y="253" text-anchor="middle" font-size="12" fill="#A8A49A">routes to the smallest path</text>
    </g>

    <path class="fx" style="--d:.8s" d="M 442 195 C 490 195, 480 60, 526 60" fill="none" stroke="#7A776E" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#sarrInk)"/>
    <path class="fx" style="--d:.95s" d="M 442 210 C 486 210, 484 165, 526 165" fill="none" stroke="#7A776E" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#sarrInk)"/>
    <path class="fx" style="--d:1.1s" d="M 442 235 C 486 235, 484 270, 526 270" fill="none" stroke="#7A776E" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#sarrInk)"/>
    <path class="fx" style="--d:1.25s" d="M 442 250 C 490 250, 480 380, 526 380" fill="none" stroke="#7A776E" stroke-width="2" stroke-dasharray="6 5" marker-end="url(#sarrInk)"/>

    <g class="fx" style="--d:1s">
      <rect x="534" y="34" width="170" height="52" rx="12" fill="#FAF9F5" stroke="#DAD5C9"/>
      <text x="619" y="66" text-anchor="middle" font-size="14" fill="#262624" font-weight="600">just do it</text>
      <text x="720" y="66" font-family="'JetBrains Mono',monospace" font-size="11.5" fill="#7A776E">trivial · one cheap check</text>
    </g>
    <g class="fx" style="--d:1.15s">
      <rect x="534" y="139" width="170" height="52" rx="12" fill="#FAF9F5" stroke="#DAD5C9"/>
      <text x="619" y="171" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="13" fill="#C4633F">$sonata-fix</text>
      <text x="720" y="171" font-family="'JetBrains Mono',monospace" font-size="11.5" fill="#7A776E">broken · evidence first</text>
    </g>
    <g class="fx" style="--d:1.3s">
      <rect x="534" y="244" width="170" height="52" rx="12" fill="#FAF9F5" stroke="#DAD5C9"/>
      <text x="619" y="276" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="13" fill="#C4633F">$sonata-implement</text>
      <text x="720" y="276" font-family="'JetBrains Mono',monospace" font-size="11.5" fill="#7A776E">clear, focused work</text>
    </g>

    <text class="fx" style="--d:1.45s" x="534" y="343" font-family="'JetBrains Mono',monospace" font-size="11.5" fill="#7A776E">big or fuzzy · decisions first</text>
    {#each [['grill', 534], ['spec', 626], ['tickets', 718], ['implement', 810], ['review', 902]] as [name, x], i (name)}
      <g class="fx" style="--d:{1.5 + i * 0.12}s">
        <rect x={x} y="357" width="82" height="46" rx="10" fill={i === 0 ? '#262624' : '#FAF9F5'} stroke={i === 0 ? '#262624' : '#DAD5C9'}/>
        <text x={Number(x) + 41} y="385" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="12" fill={i === 0 ? '#D97757' : '#C4633F'}>{name}</text>
      </g>
      {#if i < 4}
        <line class="fx flow-line" style="--d:{1.6 + i * 0.12}s" x1={Number(x) + 84} y1="380" x2={Number(x) + 90} y2="380" stroke="#D97757" stroke-width="2.5" marker-end="url(#sarr)"/>
      {/if}
    {/each}

    <circle r="5" fill="#D97757" opacity="0">
      <animateMotion dur="2.2s" begin="2.2s" repeatCount="indefinite" path="M 196 215 L 244 215"/>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.85;1" dur="2.2s" begin="2.2s" repeatCount="indefinite"/>
    </circle>
    <circle r="4.5" fill="#7A776E" opacity="0">
      <animateMotion dur="2.6s" begin="2.8s" repeatCount="indefinite" path="M 442 250 C 490 250, 480 380, 526 380"/>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.08;.9;1" dur="2.6s" begin="2.8s" repeatCount="indefinite"/>
    </circle>
  </svg>
</div>
<p class="footline" use:fx={{ d: 2 }}>
  Describe the outcome. The router picks the path — and <b>skips every stage that adds no confidence</b>.
</p>
