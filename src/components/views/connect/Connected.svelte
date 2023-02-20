<script lang="ts">
  import clipboardCopy from 'clipboard-copy'
  import { createEventDispatcher } from 'svelte'
  import { fly } from 'svelte/transition'

  import { dittoAppURL } from '$lib/auth'

  const dispatch = createEventDispatcher()

  function handleRelink() {
    dispatch('relink')
  }

  const copyLink = async () => {
    await clipboardCopy(dittoAppURL)
  }
</script>

<div
  in:fly={{ y: 20, duration: 400 }}
  class="flex flex-col items-center justify-center auto-rows gap-4 h-full-no-header"
>
  <div class="font-semibold text-lg">
    You've connected with the Ditto web app.
  </div>
  <div class="flex gap-4 items-ceneter justify-center">
    <button class="btn btn-primary" on:click={copyLink}>Copy app link</button>
    <button class="btn btn-outline" on:click={handleRelink}>
      Connect again
    </button>
  </div>
</div>
