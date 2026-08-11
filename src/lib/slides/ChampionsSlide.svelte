<script lang="ts">
  import { onMount } from 'svelte'
  import { fx } from '../fx'
  import { presenter } from '../net/presenter.svelte'
  import { airhorn } from '../sfx'

  const DANCES = ['bounce', 'spin', 'sway', 'hop']
  // unli confetti: lots of pieces, infinite fall
  const CONFETTI = Array.from({ length: 90 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 4,
    duration: 2.4 + Math.random() * 3,
    color: ['#D97757', '#C4633F', '#4A7A8C', '#6B8F5E', '#C9A227', '#262624'][i % 6],
    tilt: Math.random() * 360,
  }))

  const GAMES = ['game 1 · the arena', 'game 2 · the sprint', 'game 3 · the gauntlet']
  // center stage for the gauntlet champion (best prize), games 1 & 2 flank
  const champs = $derived(presenter.champions.slice(0, 3))
  const podium = $derived.by(() => {
    const [g1, g2, g3] = champs
    return [
      g1 ? { ...g1, game: GAMES[0], place: 'left' } : null,
      g3 ? { ...g3, game: GAMES[2], place: 'center' } : null,
      g2 ? { ...g2, game: GAMES[1], place: 'right' } : null,
    ].filter(Boolean) as Array<{ id: string; name: string; game: string; place: string }>
  })

  const audience = $derived(
    presenter.players.filter(
      (p) =>
        (p as (typeof presenter.players)[0] & { connected?: boolean }).connected &&
        !champs.some((c) => c.id === p.id),
    ),
  )
  const avatar = (id: string) => {
    const url = presenter.drawings[id]
    return url && url !== 'pending' ? url : null
  }
  const dance = (i: number) => DANCES[i % DANCES.length]

  onMount(() => airhorn())
</script>

<div class="eyebrow" use:fx>The Night's Champions</div>
<h2 use:fx={{ d: 0.1 }}>Give it up. 👏</h2>
<div class="podium-wrap" use:fx={{ d: 0.3 }}>
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

  <div class="stands">
    {#each podium as c, i (c.id + c.game)}
      <div class="stand {c.place}">
        <div class="champ-figure {dance(i)}" style:animation-delay="{i * 0.2}s">
          {#if avatar(c.id)}
            <img src={avatar(c.id)} alt={c.name} />
          {:else}
            <span class="blankface">👑</span>
          {/if}
        </div>
        <div class="block">
          <span class="medal">{c.place === 'center' ? '🏆' : '👑'}</span>
          <b>{c.name}</b>
          <span class="gname">{c.game}</span>
        </div>
      </div>
    {/each}
  </div>

  {#if audience.length}
    <div class="crowd">
      {#each audience as p, i (p.id)}
        <figure
          class="fan {dance(i + 1)}"
          style:animation-duration="{1.1 + (i % 5) * 0.22}s"
          style:animation-delay="{(i % 7) * 0.11}s"
        >
          {#if avatar(p.id)}
            <img src={avatar(p.id)} alt={p.name ?? 'fan'} />
          {:else}
            <span class="fanblank">{(p.name ?? '?').slice(0, 1).toUpperCase()}</span>
          {/if}
        </figure>
      {/each}
    </div>
  {/if}
</div>

<style>
  .podium-wrap {
    position: relative; flex: 1; min-height: 0; display: flex; flex-direction: column;
    justify-content: flex-end; overflow: hidden;
    background: var(--paper); border: 1px solid var(--line); border-radius: 1.2rem;
  }
  .stands {
    display: flex; justify-content: center; align-items: flex-end; gap: 1.4rem;
    padding-bottom: 0.4rem;
  }
  .stand { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; }
  .champ-figure img, .blankface {
    width: clamp(4.5rem, 12vh, 7rem); height: clamp(4.5rem, 12vh, 7rem); object-fit: contain;
    display: flex; align-items: center; justify-content: center; font-size: 3rem;
  }
  .champ-figure.bounce { animation: chBounce 0.9s infinite ease-in-out; }
  .champ-figure.spin { animation: chSpin 1.8s infinite linear; }
  .champ-figure.sway { animation: chSway 1.1s infinite ease-in-out; }
  .champ-figure.hop { animation: chHop 0.85s infinite cubic-bezier(0.3, 1.4, 0.5, 1); }
  .block {
    display: flex; flex-direction: column; align-items: center; gap: 0.15rem;
    background: #fff; border: 1px solid var(--line); border-radius: 0.9rem 0.9rem 0 0;
    padding: 0.8rem 1.6rem 0.9rem; min-width: 9rem;
  }
  .stand.center .block { padding-bottom: 3.2rem; border-color: #C9A227; }
  .stand.left .block, .stand.right .block { padding-bottom: 1.6rem; }
  .medal { font-size: 1.5rem; }
  .block b { font-family: var(--serif); font-size: clamp(1rem, 2.4vh, 1.5rem); }
  .gname { font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.14em; color: var(--muted); }

  .crowd {
    display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-end;
    gap: 0.3rem 0.55rem; padding: 0.7rem 1rem 0.8rem; border-top: 1px dashed var(--line);
  }
  .fan img, .fanblank {
    width: 2.1rem; height: 2.1rem; object-fit: contain;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: 0.7rem; color: var(--muted);
    border-radius: 50%;
  }
  .fan.bounce { animation: chBounce infinite ease-in-out; }
  .fan.spin { animation: chSpin infinite linear; }
  .fan.sway { animation: chSway infinite ease-in-out; }
  .fan.hop { animation: chHop infinite cubic-bezier(0.3, 1.4, 0.5, 1); }

  @keyframes chBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
  @keyframes chSpin { to { transform: rotate(360deg); } }
  @keyframes chSway { 0%, 100% { transform: rotate(-9deg); } 50% { transform: rotate(9deg); } }
  @keyframes chHop { 0%, 100% { transform: translateY(0) scale(1); } 40% { transform: translateY(-9px) scale(1.08); } 60% { transform: translateY(-3px) scale(0.97); } }

  .confetti { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .confetti span {
    position: absolute; top: -4%; width: 0.55rem; height: 0.9rem; border-radius: 0.15rem;
    opacity: 0.9; animation-name: cFall; animation-iteration-count: infinite;
    animation-timing-function: linear;
  }
  @keyframes cFall { to { top: 104%; transform: rotate(720deg); } }
  @media (prefers-reduced-motion: reduce) {
    .champ-figure, .fan, .confetti span { animation: none !important; }
  }
</style>
