<script lang="ts">
  import type { Patch } from '$lib/patch'
  import Edit from '$components/icons/Edit.svelte'
  import Favorite from '$components/icons/Favorite.svelte'

  export let preset: Patch
  export let handleEditClick: () => void

  $: isDefault = preset.id === 'default'
</script>

<div class="relative">
  {#if !isDefault}
    <button on:click={handleEditClick} class="absolute top-0 right-0"><Edit /></button>
  {/if}

  {#if preset?.creator}
    <h3 class="text-sm title-font text-gray-500 tracking-widest">{preset.creator}</h3>
  {/if}
  <h4 class="text-gray-900 text-3xl title-font font-medium mb-1">{preset?.name}</h4>

  <div class="flex items-center mb-4">
    {#if !isDefault}
      <Favorite {preset} />
    {/if}
  </div>

  {#if preset?.notes}
    <p class="leading-relaxed mb-6">{preset.notes}</p>
  {/if}

  <div class="flex items-center justify-between py-5 border-t-2 border-b-2 border-gray-200 mb-5">
    <div class="text-center">
      <h6 class="text-lg">Time</h6>
      <p class="text-sm">{preset?.params?.delayTime?.toFixed(0)}</p>
    </div>
    <div class="text-center">
      <h6 class="text-lg">Feedback</h6>
      <p class="text-sm">{preset?.params?.feedback?.toFixed(0)}</p>
    </div>
    <div class="text-center">
      <h6 class="text-lg">Mix</h6>
      <p class="text-sm">{preset?.params?.mix?.toFixed(0)}</p>
    </div>
  </div>

  {#if preset?.tags?.length}
    <p class="text-xs"><span class="text-sm">Tags: </span>{preset.tags.join(', ')}</p>
  {/if}
</div>
