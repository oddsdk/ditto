<script lang="ts">
  import { notificationStore, patchStore, viewStore } from '../../stores'
  import ArrowLeft from '$components/icons/ArrowLeft.svelte'
  import ArrowRight from '$components/icons/ArrowRight.svelte'
  import Favorite from '$components/icons/Favorite.svelte'
  import Notifications from '$components/notifications/Notifications.svelte'

  $: isDefault = $patchStore.id === 'default'

  const handleClick = () => {
    viewStore.update((state) => ({ ...state, globalView: 'presets', presetsView: 'view' }))
  }

  // Change border colours based on notification type
  let borderColor = 'border-base-300'
  notificationStore.subscribe((state) => {
    if (state.length) {
      borderColor = state[0].type == 'success' ? 'border-success' : 'border-error'
    } else {
      borderColor = 'border-base-300'
    }
  })
</script>

<div class="relative flex gap-2 min-w-[450px] max-w-[300px] text-ellipsis overflow-hidden items-center justify-between translate-x-[56px] p-2 rounded-lg border-2 text-slate-900 hover:border-secondary/50 transition-colors ease-in-out bg-base-300 {borderColor}">
  <Notifications />

  <!-- {#if !isDefault} -->
  <div class="flex items-center justify-center mr-auto">
    <Favorite preset={$patchStore} textColor="{$patchStore.favorite ? 'text-primary' : 'text-slate-900'}" />
  </div>
  <!-- {/if} -->

  <h3 class="text-lg"><button on:click={handleClick}>{$patchStore.name}</button></h3>

  <div class="flex items-center justify-center ml-auto gap-2">
    <ArrowLeft />
    <ArrowRight />
  </div>
</div>
