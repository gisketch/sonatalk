<script lang="ts">
  import { marked } from 'marked'
  import { fx } from '../fx'
  import { DEFAULT_DOC, TREE, type TreeNode } from '../anatomy/files'

  let selected = $state<{ name: string; doc: string }>(DEFAULT_DOC as { name: string; doc: string })

  const html = $derived(marked.parse(selected.doc, { async: false }) as string)

  function pick(node: TreeNode) {
    if (node.doc) selected = { name: node.name, doc: node.doc }
  }
</script>

{#snippet branch(nodes: TreeNode[], depth: number)}
  {#each nodes as node (node.name)}
    <button
      class="row"
      class:dim={!node.doc && !node.children?.length}
      class:folder={!!node.children}
      class:on={selected.doc === node.doc && !!node.doc}
      style:padding-left="{0.6 + depth * 1.1}rem"
      onclick={() => pick(node)}
      tabindex={node.doc ? 0 : -1}
    >
      <span class="glyph">{node.children ? '▸' : node.doc ? '▪' : '·'}</span>{node.name}
    </button>
    {#if node.children}
      {@render branch(node.children, depth + 1)}
    {/if}
  {/each}
{/snippet}

<div class="eyebrow" use:fx>Sonata · On Disk</div>
<h2 use:fx={{ d: 0.1 }}>The whole harness is files.</h2>
<div class="anatomy tree-wrap">
  <div class="tree" use:fx={{ d: 0.3 }}>
    <div class="tree-root">this repo/</div>
    {@render branch(TREE, 0)}
  </div>
  <div class="preview" use:fx={{ d: 0.45 }}>
    <div class="preview-bar">
      <span class="dots"><i></i><i></i><i></i></span>
      <span class="fname">{selected.name}</span>
    </div>
    <div class="md-body">{@html html}</div>
  </div>
</div>

<style>
  .anatomy {
    flex: 1; display: grid; grid-template-columns: 4fr 8fr;
    gap: clamp(1.2rem, 2.5vw, 2rem); min-height: 0;
  }
  .tree {
    background: var(--paper); border: 1px solid var(--line); border-radius: 1.2rem;
    padding: 0.9rem 0.5rem; overflow-y: auto; font-family: var(--mono);
    font-size: clamp(0.66rem, 1.05vw, 0.8rem); display: flex; flex-direction: column;
  }
  .tree-root { color: var(--muted); letter-spacing: 0.08em; padding: 0 0.6rem 0.5rem; }
  .row {
    display: flex; align-items: center; gap: 0.5em; text-align: left; cursor: pointer;
    font: inherit; color: var(--ink-soft); border-radius: 0.5rem; padding: 0.22em 0.6rem;
  }
  .row.folder { color: var(--muted); cursor: default; }
  .row.dim { color: var(--line); cursor: default; }
  .row:not(.folder):not(.dim):hover { background: rgba(217, 119, 87, 0.08); }
  .row.on { background: var(--ink); color: var(--clay); }
  .glyph { width: 1em; flex: 0 0 auto; opacity: 0.7; }

  .preview {
    background: var(--paper); border: 1px solid var(--line); border-radius: 1.2rem;
    display: flex; flex-direction: column; min-height: 0; overflow: hidden;
    box-shadow: 0 10px 40px rgba(38, 38, 36, 0.08);
  }
  .preview-bar {
    display: flex; align-items: center; gap: 0.6rem; padding: 0.6rem 1rem;
    border-bottom: 1px solid var(--line); flex: 0 0 auto;
  }
  .preview-bar .dots { display: flex; gap: 0.35rem; }
  .preview-bar .dots i { width: 0.6rem; height: 0.6rem; border-radius: 50%; background: var(--line); }
  .preview-bar .dots i:first-child { background: var(--clay); }
  .fname { font-family: var(--mono); font-size: 0.66rem; color: var(--muted); letter-spacing: 0.08em; }
  .md-body {
    padding: clamp(0.9rem, 2vh, 1.4rem) clamp(1rem, 2vw, 1.6rem);
    overflow-y: auto; min-height: 0; font-size: clamp(0.72rem, 1.15vw, 0.88rem);
    line-height: 1.55; color: var(--ink-soft);
  }
  .md-body :global(h1), .md-body :global(h2), .md-body :global(h3) {
    font-family: var(--serif); font-weight: 600; color: var(--ink);
    margin: 0.9em 0 0.35em; line-height: 1.2; font-size: 1.25em;
  }
  .md-body :global(h1) { font-size: 1.5em; margin-top: 0; }
  .md-body :global(h3) { font-size: 1.05em; }
  .md-body :global(p) { margin: 0.4em 0; }
  .md-body :global(ul), .md-body :global(ol) { margin: 0.4em 0 0.4em 1.3em; }
  .md-body :global(li) { margin: 0.15em 0; }
  .md-body :global(code) {
    font-family: var(--mono); font-size: 0.88em; background: rgba(38, 38, 36, 0.06);
    padding: 0.1em 0.35em; border-radius: 0.35em;
  }
  .md-body :global(pre) {
    background: var(--ink); color: var(--cream-on-dark); border-radius: 0.7rem;
    padding: 0.8em 1em; overflow-x: auto; margin: 0.5em 0;
  }
  .md-body :global(pre code) { background: none; padding: 0; }
  .md-body :global(a) { color: var(--clay-deep); }
  .md-body :global(table) { border-collapse: collapse; margin: 0.5em 0; }
  .md-body :global(th), .md-body :global(td) {
    border: 1px solid var(--line); padding: 0.3em 0.7em; text-align: left;
  }
  .md-body :global(blockquote) {
    border-left: 3px solid var(--clay); padding-left: 0.8em; color: var(--muted); margin: 0.5em 0;
  }
</style>
