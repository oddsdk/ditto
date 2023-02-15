<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { notificationStore, patchStore } from '../../stores'
  import ArrowLeft from '$components/icons/ArrowLeft.svelte'
  import ArrowRight from '$components/icons/ArrowRight.svelte'
  import Notifications from '$components/notifications/Notifications.svelte'

  const dispatch = createEventDispatcher()

  const handleClick = () => {
    dispatch('click', { view: 'presets' })
  }

  // Change border colours based on notification type
  let borderColor = 'border-secondary'
  notificationStore.subscribe((state) => {
    if (state.length) {
      borderColor = state[0].type == 'success' ? 'border-success' : 'border-error'
    } else {
      borderColor = 'border-secondary'
    }
  })
</script>

<div class="relative flex flex-col gap-2 min-w-[300px] items-center justify-center p-2 rounded border-2 transition-colors ease-in-out {borderColor}">
  <Notifications />

  <h3 class="text-lg"><button on:click={handleClick}>{$patchStore.name}</button></h3>

  <div class="flex w-full mt-auto justify-between">
    {#if $patchStore.tags.length}
      <span class="text-xs mr-auto">Category: {$patchStore.tags.join(', ')}</span>
    {/if}
    {#if $patchStore.creator}
      <span class="text-xs ml-auto">By: {$patchStore.creator}</span>
    {/if}
  </div>

  <ArrowLeft />
  <ArrowRight />
</div>
