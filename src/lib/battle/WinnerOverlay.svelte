<script lang="ts">
  import { fx } from '../fx'
  import { presenter } from '../net/presenter.svelte'
  import { TEAM_EMOJI, type Team } from './rps'

  let {
    winner,
    survivors,
    isChampion,
  }: {
    winner: Team
    survivors: Array<{ id: string; name: string }>
    isChampion: boolean
  } = $props()

  const IDLE_ANIMS = ['bounce', 'spin', 'sway', 'hop']
  const CONFETTI = Array.from({ length: 44 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 2.4,
    duration: 2.6 + Math.random() * 2.2,
    color: ['#D97757', '#C4633F', '#4A7A8C', '#6B8F5E', '#C9A227', '#262624'][i % 6],
    tilt: Math.random() * 360,
  }))

  const avatar = (id: string) => {
    const url = presenter.drawings[id]
    return url && url !== 'pending' ? url : null
  }
</script>

<div class="winner-overlay" use:fx={{ pop: true }}>
  <div class="confetti">
    {#each CONFETTI as c, i (i)}
      <span
        style:left="{c.left}%"
        style:background={c.color}
        style:animation-delay="{c.delay}s"
        style:animation-duration="{c.duration}s"
        style:transform="rotate({c.tilt}deg)"
      ></span>
    {/each}
  </div>
  <div class="winner-emoji">{isChampion ? '🏆' : TEAM_EMOJI[winner]}</div>
  <p class="winner-title">
    {isChampion ? `${survivors[0].name} wins!` : `Team ${winner} — ${survivors.length} still standing`}
  </p>
  {#if !isChampion}
    <p class="winner-note">Stand-off! Survivors re-pick weapon + spawn for the next round.</p>
  {/if}
  <div class="winner-crew">
    {#each survivors as s, i (s.id)}
      <figure
        class="crew {IDLE_ANIMS[i % IDLE_ANIMS.length]}"
        style:animation-duration="{1.3 + (i % 5) * 0.25}s"
        style:animation-delay="{(i % 7) * 0.13}s"
      >
        {#if avatar(s.id)}
          <img src={avatar(s.id)} alt={s.name} />
        {:else}
          <span class="crew-fallback">{isChampion ? '🏆' : TEAM_EMOJI[winner]}</span>
        {/if}
        <figcaption>{s.name}</figcaption>
      </figure>
    {/each}
  </div>
</div>

<style>
  .winner-overlay {
    position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 0.6rem; background: rgba(250, 249, 245, 0.88);
    border-radius: 1.2rem;
  }
  .winner-emoji { font-size: 3.4rem; }
  .winner-title { font-family: var(--serif); font-size: clamp(1.8rem, 4vw, 2.8rem); }
  .winner-note { font-family: var(--mono); font-size: 0.78rem; color: var(--muted); letter-spacing: 0.04em; }

  .winner-crew {
    display: flex; flex-wrap: wrap; justify-content: center; gap: 1.2rem;
    margin-top: 0.8rem; max-width: 80%;
  }
  .crew { display: flex; flex-direction: column; align-items: center; gap: 0.3rem; }
  .crew img {
    width: 4.6rem; height: 4.6rem; object-fit: contain; /* raw drawing, no frame */
  }
  .crew-fallback {
    width: 4.6rem; height: 4.6rem; display: flex; align-items: center;
    justify-content: center; font-size: 2rem;
  }
  .crew figcaption { font-family: var(--mono); font-size: 0.66rem; color: var(--ink-soft); }
  .crew.bounce { animation: crewBounce infinite ease-in-out; }
  .crew.spin { animation: crewSpin infinite linear; }
  .crew.sway { animation: crewSway infinite ease-in-out; }
  .crew.hop { animation: crewHop infinite cubic-bezier(0.3, 1.4, 0.5, 1); }
  @keyframes crewBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
  @keyframes crewSpin { to { transform: rotate(360deg); } }
  @keyframes crewSway { 0%, 100% { transform: rotate(-8deg); } 50% { transform: rotate(8deg); } }
  @keyframes crewHop { 0%, 100% { transform: translateY(0) scale(1); } 40% { transform: translateY(-10px) scale(1.08); } 60% { transform: translateY(-4px) scale(0.98); } }

  .confetti { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .confetti span {
    position: absolute; top: -4%; width: 0.55rem; height: 0.9rem; border-radius: 0.15rem;
    opacity: 0.9; animation-name: confettiFall; animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  @keyframes confettiFall {
    to { top: 104%; transform: rotate(720deg); }
  }
  @media (prefers-reduced-motion: reduce) {
    .crew, .confetti span { animation: none !important; }
  }
</style>
