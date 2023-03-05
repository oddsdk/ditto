<script lang="ts">
  import { fly } from 'svelte/transition'

  import type { Patch } from '$lib/patch'
  import { DEFAULT_CATEGORIES } from '$lib/presets/constants'
  import { presetsStore, viewStore } from '../../stores'
  import Delete from '$components/icons/Delete.svelte'
  import Edit from '$components/icons/Edit.svelte'
  import Favorite from '$components/icons/Favorite.svelte'

  export let preset: Patch
  export let handleCategoryClick: (category: string) => void

  const handleEditClick = () => viewStore.update((state) => ({
    ...state,
    presetsView: 'edit',
  }))


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

  <h5 class="font-semibold mb-2">Parameters:</h5>
  <div class="stats shadow mb-6">
    <div class="stat">
      <div class="stat-title text-[10px]">Time</div>
      <div class="stat-value text-[12px] leading-6 text-slate-900/70">{preset?.params?.delayTime?.toFixed(0)}<span class="text-[11px]">ms</span></div>
    </div>
    <div class="stat">
      <div class="stat-title text-[10px]">Feedback</div>
      <div class="stat-value text-[12px] leading-6 text-slate-900/70">{preset?.params?.feedback?.toFixed(0)}<span class="text-[11px]">%</span></div>
    </div>
    <div class="stat">
      <div class="stat-title text-[10px]">Mix</div>
      <div class="stat-value text-[12px] leading-6 text-slate-900/70">{preset?.params?.mix?.toFixed(0)}<span class="text-[11px]">%</span></div>
    </div>
  </div>

  {#if preset?.tags?.length}
    <div class="flex items-start justify-start capitalize">
      <span class="text-sm font-semibold">Tags:</span>
      <div class="-translate-y-0.5">
        {#each preset.tags as tag}
          <div on:click={() => {
            if ($presetsStore.selectedCategory === tag) {
              presetsStore.update((state) => ({ ...state, selectedCategory: DEFAULT_CATEGORIES[0] }))
            } else {
              handleCategoryClick(tag)
            }
          }} on:keydown={() => handleCategoryClick(tag)} class="badge badge-slate-900 pb-5 cursor-pointer text-base-100 ml-2 mb-1.5 inline-block hover:bg-secondary/70 hover:border-secondary/70 ease-in-out {$presetsStore.selectedCategory === tag ? 'bg-secondary/70 border-secondary/70' : ''}">{tag}</div>
        {/each}
      </div>
    </div>
  {/if}
</div>
