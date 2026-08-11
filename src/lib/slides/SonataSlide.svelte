<script lang="ts">
  import { fx } from '../fx'

  // One continuously-running machine: the build lane feeds the check lane.
  // SMIL timeline restarts on mount (App only renders the active slide), so the
  // pass-times below stay in step with the traveling chip forever.
  const LOOP = 13 // seconds per full cycle
  const PATH = 'M 90 150 L 890 150 Q 940 150 940 200 L 940 250 Q 940 300 890 300 L 230 300'

  const STATIONS = [
    { c: 240, t: 1.03, label: 'grill', sub: 'decide, once' },
    { c: 405, t: 2.16, label: 'spec', sub: 'the contract' },
    { c: 570, t: 3.29, label: 'tickets', sub: 'thin slices' },
    { c: 735, t: 4.43, label: 'implement', sub: 'inside the rails' },
  ]
  const ARCHES = [
    { c: 780, t: 7.67, label: 'lint · types' },
    { c: 560, t: 9.18, label: 'tests' },
    { c: 340, t: 10.69, label: '300-line gate' },
  ]
  const arch = (c: number) => `M ${c - 58} 300 Q ${c - 58} 244 ${c} 244 Q ${c + 58} 244 ${c + 58} 300`
</script>

<div class="eyebrow" use:fx>My Harness</div>
<h2 use:fx={{ d: 0.1 }}>Sonata — the same two ideas, made concrete</h2>

<div class="diagram-area">
  <svg viewBox="0 0 1000 400" font-family="Inter, sans-serif">
    <defs>
      <marker id="mArr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
        <path d="M0 0 L10 5 L0 10 z" fill="#7A776E" />
      </marker>
    </defs>

    <!-- lane labels sit outside the machine group so they keep their air -->
    <g class="fx" style="--d:.2s">
      <text x="20" y="24" font-family="'JetBrains Mono',monospace" font-size="13" letter-spacing="3" fill="#C4633F">SKILLS THAT BUILD</text>
      <text x="20" y="42" font-size="12.5" fill="#7A776E" font-style="italic">feedforward — idea becomes code</text>
    </g>
    <g class="fx" style="--d:1.1s">
      <text x="980" y="378" text-anchor="end" font-family="'JetBrains Mono',monospace" font-size="13" letter-spacing="3" fill="#57544D">CHECKS THAT VALIDATE</text>
      <text x="980" y="396" text-anchor="end" font-size="12.5" fill="#7A776E" font-style="italic">feedback — code becomes trustworthy</text>
    </g>

    <!-- the whole machine, nudged clear of the lane labels -->
    <g transform="translate(0,22)">
    <!-- rails -->
    <path class="fx" style="--d:.3s" d="M 90 150 L 890 150 Q 940 150 940 200" fill="none" stroke="#E4B9A4" stroke-width="4" stroke-linecap="round" />
    <path class="fx" style="--d:.9s" d="M 940 200 L 940 250 Q 940 300 890 300 L 230 300" fill="none" stroke="#CFCABE" stroke-width="4" stroke-linecap="round" marker-end="url(#mArr)" />

    <!-- build lane: stamp stations -->
    {#each STATIONS as s, i (s.label)}
      <g class="fx" style="--d:{0.4 + i * 0.12}s">
        <rect x={s.c - 70} y="52" width="140" height="60" rx="14" fill="#FAF9F5" stroke="#DAD5C9" />
        <text x={s.c} y="80" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="15" fill="#C4633F">{s.label}</text>
        <text x={s.c} y="99" text-anchor="middle" font-size="11.5" fill="#7A776E">{s.sub}</text>
        <g>
          <animateTransform attributeName="transform" type="translate" begin="{s.t - 0.14}s" dur="{LOOP}s"
            repeatCount="indefinite" values="0 0;0 9;0 0;0 0" keyTimes="0;0.014;0.036;1" />
          <line x1={s.c} y1="112" x2={s.c} y2="130" stroke="#DAD5C9" stroke-width="3" />
          <rect x={s.c - 18} y="130" width="36" height="10" rx="3" fill="#E4B9A4" />
        </g>
        <g opacity="0">
          <animate attributeName="opacity" begin="{s.t}s" dur="{LOOP}s" repeatCount="indefinite"
            values="0;1;1;0;0" keyTimes="0;0.012;0.72;0.76;1" />
          <rect x={s.c - 70} y="52" width="140" height="60" rx="14" fill="rgba(217,119,87,0.13)" stroke="#D97757" stroke-width="2" />
          <text x={s.c + 52} y="70" text-anchor="middle" font-size="15" fill="#C4633F">✓</text>
        </g>
      </g>
    {/each}

    <!-- check lane: scanner arches -->
    {#each ARCHES as a, i (a.label)}
      <g class="fx" style="--d:{1.2 + i * 0.12}s">
        <path d={arch(a.c)} fill="none" stroke="#DAD5C9" stroke-width="3" />
        <text x={a.c} y="232" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="13.5" fill="#57544D">{a.label}</text>
        <g opacity="0">
          <animate attributeName="opacity" begin="{a.t}s" dur="{LOOP}s" repeatCount="indefinite"
            values="0;1;1;0;0" keyTimes="0;0.012;0.72;0.76;1" />
          <path d={arch(a.c)} fill="none" stroke="#6B8F5E" stroke-width="3.5" />
          <text x={a.c} y="276" text-anchor="middle" font-size="22" fill="#3D6B2F">✓</text>
        </g>
      </g>
    {/each}

    <!-- the traveling work item: idea → code -->
    <g class="fx" style="--d:.5s">
      <g opacity="1">
        <animateMotion dur="{LOOP}s" repeatCount="indefinite" path={PATH} calcMode="linear"
          keyPoints="0;1;1" keyTimes="0;0.88;1" />
        <animate attributeName="opacity" dur="{LOOP}s" repeatCount="indefinite"
          values="1;1;0;0" keyTimes="0;0.878;0.9;1" />
        <rect x="-38" y="-17" width="76" height="34" rx="10" fill="#D97757">
          <animate attributeName="fill" dur="{LOOP}s" repeatCount="indefinite"
            values="#D97757;#D97757;#262624;#262624" keyTimes="0;0.45;0.48;1" />
        </rect>
        <text y="5" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="14" fill="#FAF9F5">
          idea
          <animate attributeName="opacity" dur="{LOOP}s" repeatCount="indefinite" values="1;1;0;0" keyTimes="0;0.44;0.47;1" />
        </text>
        <text y="5" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="14" fill="#FAF9F5" opacity="0">
          code
          <animate attributeName="opacity" dur="{LOOP}s" repeatCount="indefinite" values="0;0;1;1" keyTimes="0;0.45;0.48;1" />
        </text>
      </g>
    </g>

    <!-- what drops out the end -->
    <g opacity="0">
      <animate attributeName="opacity" begin="11.44s" dur="{LOOP}s" repeatCount="indefinite"
        values="0;1;1;0;0" keyTimes="0;0.015;0.115;0.135;1" />
      <animateTransform attributeName="transform" type="translate" begin="11.44s" dur="{LOOP}s"
        repeatCount="indefinite" values="0 14;0 0;0 0" keyTimes="0;0.022;1" />
      <rect x="28" y="268" width="178" height="64" rx="16" fill="rgba(107,143,94,0.10)" stroke="#6B8F5E" stroke-width="2" />
      <text x="117" y="296" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="15" fill="#3D6B2F">✓ trusted diff</text>
      <text x="117" y="316" text-anchor="middle" font-size="11.5" fill="#7A776E">checked before I read it</text>
    </g>
    </g>
  </svg>
</div>

<p class="footline" use:fx={{ d: 1.8 }}>
  <svg class="icon" style="color:var(--clay-deep)"><use href="#i-gh" /></svg>&ensp;github.com/gisketch/sonata
  — one machine, two halves. <b>Grown feature by feature on real work</b>, not designed in a vacuum.
</p>
