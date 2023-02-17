<script lang="ts">
  import { fly } from 'svelte/transition'

  import type { Patch } from '$lib/patch'
  import Delete from '$components/icons/Delete.svelte'
  import Edit from '$components/icons/Edit.svelte'
  import Favorite from '$components/icons/Favorite.svelte'

  export let preset: Patch
  export let handleEditClick: () => void

  $: isDefault = preset?.id === 'default'
</script>

<div class="relative pt-6" in:fly={{ x: 20, duration: 400 }}>
  {#if !isDefault}
    <div class="absolute top-0 right-0 flex items-center gap-4 text-slate-900">
      {#if !isDefault}
        <Favorite {preset} />
      {/if}
      <button on:click={handleEditClick}><Edit /></button>
      <Delete {preset} />
    </div>
  {/if}

  {#if preset?.creator}
    <h3 class="text-sm title-font text-gray-500 tracking-widest">{preset.creator}</h3>
  {/if}
  <h4 class="text-gray-900 text-3xl font-semibold title-font font-medium mb-6">{preset?.name}</h4>

  {#if preset?.notes}
    <h5 class="font-semibold mb-1">Notes:</h5>
    <p class="leading-relaxed mb-6">{preset.notes}</p>
  {/if}

  <h5 class="font-semibold mb-1">Parameters:</h5>
  <ul class="pl-6 mb-6 text-xs list-disc">
    <li>Time: {preset?.params?.delayTime?.toFixed(0)}</li>
    <li>Feedback: {preset?.params?.feedback?.toFixed(0)}</li>
    <li>Mix: {preset?.params?.mix?.toFixed(0)}</li>
  </ul>

  {#if preset?.tags?.length}
    <p class="text-xs capitalize"><span class="text-sm font-semibold">Tags: </span>{preset.tags.join(', ')}</p>
  {/if}
</div>
