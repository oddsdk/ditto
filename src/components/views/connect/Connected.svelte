<script lang="ts">
  import clipboardCopy from 'clipboard-copy'
  import { createEventDispatcher } from 'svelte'

  import { dittoAppURL } from '$lib/auth'

  const dispatch = createEventDispatcher()

  function handleRelink() {
    dispatch('relink')
  }

  const copyLink = async () => {
    await clipboardCopy(dittoAppURL)
  }
</script>

<div class="grid grid-flow-row auto-rows gap-4">
  <div>You've connected with the Ditto web app.</div>
  <button class="btn btn-outline" on:click={copyLink}>Copy app link</button>
  <button class="btn btn-outline" on:click={handleRelink}>
    Connect again
  </button>
</div>
