<script lang="ts">
  import { ARENA_H, ARENA_W } from '../lib/battle/engine'

  const OPTIONS = [
    { key: 'rock', emoji: '🪨', beats: 'scissors' },
    { key: 'paper', emoji: '📄', beats: 'rock' },
    { key: 'scissors', emoji: '✂️', beats: 'paper' },
  ] as const

  let {
    pick,
    onpick,
    onready,
  }: {
    pick: string | null
    onpick: (pick: 'rock' | 'paper' | 'scissors') => void
    onready: (spawn: { x: number; y: number }) => void
  } = $props()

  let spawn = $state<{ x: number; y: number } | null>(null)
  let field = $state<HTMLButtonElement | undefined>()

  function place(e: MouseEvent) {
    if (!field) return
    const rect = field.getBoundingClientRect()
    spawn = {
      x: Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)),
      y: Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)),
    }
  }
</script>

<div class="eyebrow">choose your side</div>
<div class="picks">
  {#each OPTIONS as opt (opt.key)}
    <button class="pickbtn" class:on={pick === opt.key} onclick={() => onpick(opt.key)}>
      <span class="emoji">{opt.emoji}</span>
      <span class="label">{opt.key}</span>
      <span class="beats">beats {opt.beats}</span>
    </button>
  {/each}
</div>

{#if pick}
  <div class="eyebrow spawn-label">choose your spawn</div>
  <button
    class="field"
    bind:this={field}
    style:aspect-ratio="{ARENA_W} / {ARENA_H}"
    onclick={place}
    aria-label="tap to choose spawn position"
  >
    {#if spawn}
      <span class="marker" style:left="{spawn.x * 100}%" style:top="{spawn.y * 100}%">
        {OPTIONS.find((o) => o.key === pick)?.emoji}
      </span>
    {:else}
      <span class="hint">tap anywhere — this is the arena</span>
    {/if}
  </button>
{/if}

<button class="btn ready" disabled={!pick || !spawn} onclick={() => spawn && onready(spawn)}>
  READY →
</button>
<p class="phone-note">
  {!pick ? 'Pick a side first.' : !spawn ? 'Now tap where you want to start.' : 'Locked once you hit ready.'}
</p>

<style>
  .picks { display: flex; gap: 0.6rem; }
  .pickbtn {
    display: flex; flex-direction: column; align-items: center; gap: 0.2rem;
    background: var(--paper); border: 1px solid var(--line); border-radius: 1rem;
    padding: 0.7rem 0.8rem; cursor: pointer; min-width: 4.8rem;
    transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .pickbtn.on {
    border-color: var(--clay); box-shadow: 0 6px 18px rgba(217, 119, 87, 0.2);
    transform: translateY(-3px);
  }
  .emoji { font-size: 1.6rem; }
  .label { font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink); }
  .beats { font-size: 0.58rem; color: var(--muted); }

  .spawn-label { margin-top: 0.4rem; }
  .field {
    position: relative; width: min(88vw, 24rem); background: #faf9f5;
    border: 1px solid var(--line); border-radius: 0.9rem; cursor: crosshair;
    box-shadow: inset 0 0 0 6px rgba(38, 38, 36, 0.03);
  }
  .hint {
    position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: 0.62rem; color: var(--muted); letter-spacing: 0.06em;
  }
  .marker {
    position: absolute; transform: translate(-50%, -50%); font-size: 1.3rem;
    filter: drop-shadow(0 2px 4px rgba(38, 38, 36, 0.3));
  }
  .ready { margin-top: 0.3rem; }
</style>
