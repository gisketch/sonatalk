<script lang="ts">
  import { presenter } from '../net/presenter.svelte'

  const wall = $derived(
    presenter.players.filter(
      (p) => (p as (typeof presenter.players)[0] & { connected?: boolean }).connected,
    ),
  )
  const stage = $derived(String(presenter.payload.state ?? 'idle'))
  const winner = $derived(presenter.payload.winner)
  const tiebreak = $derived(presenter.payload.tiebreak === true)
  const leaderIds = $derived((presenter.payload.leaderIds as string[] | undefined) ?? [])
  const correctIds = $derived((presenter.payload.correctIds as string[] | undefined) ?? [])

  const size = $derived(wall.length > 12 ? 2.4 : wall.length > 8 ? 2.9 : 3.4)
  const avatar = (id: string) => {
    const url = presenter.drawings[id]
    return url && url !== 'pending' ? url : null
  }
  const benched = (id: string) => tiebreak && leaderIds.length > 0 && !leaderIds.includes(id)
  /** results moment: green for the sharp, red for the missed */
  const verdictFor = (id: string) => {
    if (stage !== 'results' || winner || benched(id)) return ''
    return correctIds.includes(id) ? 'good' : 'bad'
  }
</script>

<div class="wall">
  {#each wall as p (p.id)}
    <figure class="pl {verdictFor(p.id)}" class:out={benched(p.id)} style:width="{size}rem">
      {#if avatar(p.id)}
        <img src={avatar(p.id)} alt={p.name ?? 'player'} style:width="{size}rem" style:height="{size}rem" />
      {:else}
        <span class="blank" style:width="{size}rem" style:height="{size}rem">{(p.name ?? '?').slice(0, 1).toUpperCase()}</span>
      {/if}
      <span class="scorechip" class:lit={p.streak >= 3}>{p.streak >= 3 ? '🔥' : ''}{p.score}</span>
      <figcaption>{p.name ?? 'anon'}</figcaption>
    </figure>
  {/each}
</div>

<style>
  .wall {
    flex: 0 0 auto; display: flex; flex-wrap: wrap; justify-content: center;
    align-items: flex-end; gap: 0.4rem 0.7rem; padding: 0.6rem 1rem 0.8rem;
    border-top: 1px dashed var(--line);
  }
  .pl {
    position: relative; display: flex; flex-direction: column; align-items: center;
    gap: 0.1rem; padding: 0.3rem 0.2rem 0.15rem; border-radius: 0.7rem;
    transition: opacity 0.4s, transform 0.4s, background 0.25s, box-shadow 0.25s;
  }
  /* verdict tint sits OVER the drawing (multiply keeps the strokes visible) */
  .pl::after {
    content: ''; position: absolute; inset: 0; border-radius: 0.7rem;
    pointer-events: none; mix-blend-mode: multiply; transition: background 0.25s;
  }
  .pl.good::after { background: rgba(107, 143, 94, 0.4); }
  .pl.bad::after { background: rgba(192, 57, 43, 0.35); }
  .pl.good {
    box-shadow: 0 0 0 2px rgba(107, 143, 94, 0.55);
    animation: verdictPop 0.3s ease;
  }
  .pl.good figcaption { color: #3d6b2f; }
  .pl.bad {
    box-shadow: 0 0 0 2px rgba(192, 57, 43, 0.45);
    animation: verdictShake 0.35s ease;
  }
  .pl.bad figcaption { color: #a03325; }
  @keyframes verdictPop {
    40% { transform: translateY(-6px) scale(1.06); }
  }
  @keyframes verdictShake {
    25% { transform: translateX(-4px); }
    50% { transform: translateX(3px); }
    75% { transform: translateX(-2px); }
  }
  .pl img { object-fit: contain; }
  .pl .blank {
    border-radius: 50%; border: 1px solid var(--line); background: #fff;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); color: var(--muted);
  }
  .pl figcaption {
    font-family: var(--mono); font-size: 0.54rem; color: var(--ink-soft);
    max-width: 4rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .pl.out { opacity: 0.28; filter: grayscale(1); }
  .scorechip {
    position: absolute; top: -0.5rem; right: -0.4rem;
    font-family: var(--mono); font-size: 0.58rem; color: var(--clay-deep);
    background: var(--paper); border: 1px solid var(--clay); border-radius: 999px;
    min-width: 1.2rem; text-align: center; padding: 0.05rem 0.25rem;
  }
  .scorechip.lit { border-color: #C9A227; color: #8a6d0f; animation: chipPulse 0.7s infinite ease-in-out; }
  @keyframes chipPulse {
    50% { transform: scale(1.18); }
  }
</style>
