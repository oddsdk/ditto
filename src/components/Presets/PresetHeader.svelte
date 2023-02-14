<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { patchStore } from '../../stores'
  import { addNotification } from '$lib/notifications'
  import ArrowLeft from '$components/icons/ArrowLeft.svelte'
  import ArrowRight from '$components/icons/ArrowRight.svelte'
  import Notifications from '$components/notifications/Notifications.svelte'

  const dispatch = createEventDispatcher()

  const handleClick = () => {
    // dispatch('click', { view: 'presets' })
    addNotification('A notification', 'success')
  }
</script>

<div class="relative flex flex-col gap-2 min-w-[300px] items-center justify-center p-2 rounded border-2 border-secondary">
  <Notifications />
  <h3 class="text-lg"><button on:click={handleClick}>{$patchStore.name}</button></h3>

  <div class="flex w-full mt-auto justify-between">
    {#if $patchStore.tags.length}
      <span class="text-xs mr-auto">Category: {$patchStore.tags.join(', ')}</span>
    {/if}
    <span class="text-xs ml-auto">By: {$patchStore.creator}</span>
  </div>

  <ArrowLeft />
  <ArrowRight />
</div>
