<script lang="ts">
  import {  onDestroy } from 'svelte'

  import { patchStore, presetsStore } from '../../stores'
  import type { Patch } from '$lib/patch'
  import AddPreset from '$components/presets/AddPreset.svelte'
  import EditPreset from '$components/presets/EditPreset.svelte'
  import PresetInfo from '$components/presets/PresetInfo.svelte'
  import ClearSearch from '$components/icons/ClearSearch.svelte'

  let isSearching = false
  let adding = false
  let editing = false
  let presets = $presetsStore.presets
  let selectedPreset = $presetsStore.presets.find(({ id }) => id === $presetsStore.selectedPatch) as Patch

  const unsubscribePresetsStore = presetsStore.subscribe((state) => {
    selectedPreset = state.presets.find(({ id }) => id === state.selectedPatch) as Patch
    presets = state.presets
  })

  // Update the selectedCategory and load the associated presets column
  const handleCategoryClick = (category: string): void => {
    presetsStore.update((state) => ({
      ...state,
      selectedCategory: category,
    }))

    switch (category) {
      case $presetsStore.categories[0]:
        presets = $presetsStore.presets
        break

      case $presetsStore.categories[1]:
        presets = $presetsStore.presets.filter((preset) => preset.favorite)
        break

      default:
        presets = $presetsStore.presets.filter((preset) => preset.tags.includes(category))
        break
    }

    adding = false
    editing = false
  }

  // Update the selectedPatch and load it into the patchStore
  const handlePresetClick = (id: string) => {
    presetsStore.update((state) => ({
      ...state,
      selectedPatch: id,
    }))

    selectedPreset = $presetsStore.presets.find(({ id }) => id === $presetsStore.selectedPatch) as Patch

    patchStore.update(() => ({ ...selectedPreset  }))

    adding = false
    editing = false
  }

  // Filter presets based on a search parameter
  let searchTerm = ''
  const handlePresetSearch = (event: Event): void => {
    const { value } = event.target as HTMLInputElement
    isSearching = !!value.length
    presets = $presetsStore.presets.filter(({ name }) => name.toLowerCase().indexOf(value.toLowerCase()) !== -1)
  }
  const clearSearch = () => {
    isSearching = false
    presets = $presetsStore.presets
    searchTerm = ''
  }

  // Handle "Add Preset" button click
  const handleAddPresetClick = () => adding = true

  // Toggle edit view
  const handleEditClick = () => editing = !editing

  onDestroy(unsubscribePresetsStore)
</script>

<div class="grid-container grid grid-cols-3 mt-2 mb-2">
  <h4 class="col-span-1 pl-8 py-3 text-lg">Categories</h4>
  <h4 class="col-span-1 pl-10 py-3 text-lg flex items-center justify-between">Presets <button on:click={handleAddPresetClick} class="btn btn-secondary btn-xs">Add Preset</button></h4>
  <h4 class="col-span-1 pl-7 py-3 text-lg">Preset Info</h4>
</div>

<div class="grid-container grid grid-cols-3 divide-x-2 min-h-[calc(100vh-220px)] gap-4">

  <div class="col-span-1 px-4">
    <div class="w-full">
      <div class="relative w-full mb-2">
        <input on:input={handlePresetSearch} bind:value={searchTerm} type="text" placeholder="Search presets" spellcheck="false" name="search" class="w-full text-sm bg-base-100 border-2 transition-colors rounded h-10 py-3 pl-4 pr-8 focus:border-secondary focus:outline-none {isSearching ? 'border-secondary' : ''}" />
        {#if isSearching}
          <ClearSearch {clearSearch} />
        {/if}
      </div>

      {#each $presetsStore.categories as category}
        <button on:click={() => handleCategoryClick(category)} class="w-full flex cursor-pointer py-2 px-4 hover:bg-primary hover:text-white transition-colors ease-in-out rounded capitalize text-sm {$presetsStore.selectedCategory === category ? 'bg-primary text-white' : ''}">
          <h5>{category}</h5>
        </button>
      {/each}
    </div>
  </div>

  <div class="col-span-1 px-4">
    <div class="w-full">
      {#each presets as preset}
        <button on:click={() => handlePresetClick(preset.id)} class="w-full flex cursor-pointer py-2 px-4 hover:bg-primary hover:text-white transition-colors ease-in-out rounded capitalize text-sm {$presetsStore.selectedPatch === preset.id ? 'bg-primary text-white' : ''}">
          <h5>{preset.name}</h5>
        </button>
      {/each}

      {#if isSearching && !presets.length}
        <h5 class="text-center text-sm pt-8">No search results</h5>
      {/if}
    </div>
  </div>

  <div class="col-span-1 px-4">
    {#if adding}
      <AddPreset handleCancelClick={() => adding = false} />
    {:else}
      {#if editing}
        <EditPreset handleCancelClick={handleEditClick} preset={selectedPreset} />
      {:else}
        <PresetInfo {handleEditClick} preset={selectedPreset} />
      {/if}
    {/if}
  </div>
</div>

