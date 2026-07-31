<script lang="ts">
  const OPTIONS = [
    { key: 'rock', emoji: '🪨', beats: 'scissors' },
    { key: 'paper', emoji: '📄', beats: 'rock' },
    { key: 'scissors', emoji: '✂️', beats: 'paper' },
  ] as const

  let {
    pick,
    onpick,
  }: {
    pick: string | null
    onpick: (pick: 'rock' | 'paper' | 'scissors') => void
  } = $props()
</script>

<div class="eyebrow">choose your side</div>
<p class="phone-title">Your character fights as…</p>
<div class="picks">
  {#each OPTIONS as opt (opt.key)}
    <button class="pickbtn" class:on={pick === opt.key} onclick={() => onpick(opt.key)}>
      <span class="emoji">{opt.emoji}</span>
      <span class="label">{opt.key}</span>
      <span class="beats">beats {opt.beats}</span>
    </button>
  {/each}
</div>
<p class="phone-note">
  {pick ? 'You can change your mind until the battle starts.' : 'Pick one — collisions settle the rest.'}
</p>

<style>
  .picks { display: flex; gap: 0.7rem; }
  .pickbtn {
    display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
    background: var(--paper); border: 1px solid var(--line); border-radius: 1.1rem;
    padding: 1rem 0.9rem; cursor: pointer; min-width: 5.4rem;
    transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  }
  .pickbtn.on {
    border-color: var(--clay); box-shadow: 0 6px 18px rgba(217, 119, 87, 0.2);
    transform: translateY(-3px);
  }
  .emoji { font-size: 1.9rem; }
  .label { font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink); }
  .beats { font-size: 0.62rem; color: var(--muted); }
</style>
