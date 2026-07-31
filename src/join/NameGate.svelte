<script lang="ts">
  let { onsubmit }: { onsubmit: (name: string) => void } = $props()
  let name = $state('')

  function submit(e: SubmitEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed) onsubmit(trimmed)
  }
</script>

<div class="eyebrow">just shipped · name input</div>
<p class="phone-title">Who's drawing?</p>
<form class="name-form" onsubmit={submit}>
  <input
    type="text"
    maxlength="24"
    placeholder="your name"
    bind:value={name}
    autocomplete="off"
    autocapitalize="words"
  />
  <button class="btn" type="submit" disabled={!name.trim()}>join in</button>
</form>

<style>
  .name-form { display: flex; flex-direction: column; gap: 0.8rem; width: min(20rem, 80vw); }
  input {
    font: inherit; text-align: center; padding: 0.7em 1em; border-radius: 1rem;
    border: 1px solid var(--line); background: var(--paper); color: var(--ink); outline: none;
  }
  input:focus { border-color: var(--clay); }
</style>
