<script lang="ts">
  import { fx } from '../../lib/fx'
</script>

<div class="eyebrow" use:fx>Stage 3 · <span style="text-transform:none">$sonata-tickets</span></div>
<h2 use:fx={{ d: 0.1 }}>Tickets — slice the cake vertically.</h2>
<div class="diagram-area">
  <svg viewBox="0 0 1000 340" font-family="Inter, sans-serif">
    <defs>
      <marker id="tarr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#D97757"/></marker>
    </defs>

    <g class="fx" style="--d:.3s">
      <text x="220" y="42" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="13" letter-spacing="2.5" fill="#A8543A">LAYER BY LAYER ✗</text>
      <rect x="60" y="70" width="320" height="52" rx="10" fill="#FAF9F5" stroke="#DAD5C9"/>
      <text x="220" y="102" text-anchor="middle" font-size="14" fill="#7A776E">all the UI first…</text>
      <rect x="60" y="132" width="320" height="52" rx="10" fill="#FAF9F5" stroke="#DAD5C9"/>
      <text x="220" y="164" text-anchor="middle" font-size="14" fill="#7A776E">…then all the logic…</text>
      <rect x="60" y="194" width="320" height="52" rx="10" fill="#FAF9F5" stroke="#DAD5C9"/>
      <text x="220" y="226" text-anchor="middle" font-size="14" fill="#7A776E">…then all the database</text>
      <text x="220" y="290" text-anchor="middle" font-size="13.5" fill="#7A776E" font-style="italic">nothing works until everything works</text>
    </g>

    <line class="fx" style="--d:.55s" x1="480" y1="60" x2="480" y2="280" stroke="#DAD5C9" stroke-width="1.5"/>

    <g class="fx" style="--d:.7s">
      <text x="770" y="42" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="13" letter-spacing="2.5" fill="#C4633F">VERTICAL SLICES ✓</text>
    </g>
    {#each [580, 720, 860] as x, i (x)}
      <g class="pop" style="--d:{0.8 + i * 0.2}s">
        <rect x={x} y="70" width="110" height="176" rx="12" fill="#FAF9F5" stroke="#DAD5C9"/>
        <rect x={x + 12} y="84" width="86" height="42" rx="7" fill="rgba(217,119,87,0.12)"/>
        <text x={x + 55} y="110" text-anchor="middle" font-size="11.5" fill="#C4633F">UI</text>
        <rect x={x + 12} y="136" width="86" height="42" rx="7" fill="rgba(217,119,87,0.12)"/>
        <text x={x + 55} y="162" text-anchor="middle" font-size="11.5" fill="#C4633F">logic</text>
        <rect x={x + 12} y="188" width="86" height="42" rx="7" fill="rgba(217,119,87,0.12)"/>
        <text x={x + 55} y="214" text-anchor="middle" font-size="11.5" fill="#C4633F">data</text>
        <text x={x + 55} y="272" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="11.5" fill="#C4633F">✓ demoable</text>
      </g>
      {#if i < 2}
        <line class="fx flow-line" style="--d:{1.1 + i * 0.2}s" x1={x + 114} y1="158" x2={x + 134} y2="158" stroke="#D97757" stroke-width="2.5" marker-end="url(#tarr)"/>
      {/if}
    {/each}
    <text class="fx" style="--d:1.5s" x="770" y="302" text-anchor="middle" font-family="'JetBrains Mono',monospace" font-size="11.5" fill="#7A776E">blocked-by edges make the order explicit</text>
  </svg>
</div>
<p class="footline" use:fx={{ d: 1.7 }}>
  Every ticket: delivered behavior, acceptance criteria, validation, <b>Blocked by</b> —
  sized to <b>fit one fresh agent context</b>.
</p>
