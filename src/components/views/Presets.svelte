<script lang="ts">
  import {  onDestroy } from 'svelte'
  import { fly } from 'svelte/transition'

  import { patchStore, presetsStore, sessionStore, viewStore } from '../../stores'
  import type { Patch } from '$lib/patch'
  import AddPreset from '$components/presets/AddPreset.svelte'
  import ClearSearch from '$components/icons/ClearSearch.svelte'
  import EditPreset from '$components/presets/EditPreset.svelte'
  import Plus from '$components/icons/Plus.svelte'
  import PresetInfo from '$components/presets/PresetInfo.svelte'
  import PresetsTable from '$components/presets/PresetsTable.svelte'
  import Search from '$components/icons/Search.svelte'

  let isSearching = false
  let maintainPresetSorting = false
  let presets = $presetsStore.presets
  let selectedPreset = $presetsStore.presets.find(({ id }) => id === $presetsStore.selectedPatch) as Patch

  const filterByCategory = (category: string): void => {
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
  }

  const unsubscribePresetsStore = presetsStore.subscribe((state) => {
    selectedPreset = state.presets.find(({ id }) => id === state.selectedPatch) as Patch

    if (!maintainPresetSorting) {
      presets = state.presets
      filterByCategory(state.selectedCategory)
    }
  })

  // Revert to preset detail view
  const handleCancelClick = () => viewStore.update((state) => ({
    ...state,
    presetsView: 'view',
  }))

  // Update the selectedCategory and load the associated presets column
  const handleCategoryClick = (category: string): void => {
    maintainPresetSorting = true
    presetsStore.update((state) => ({
      ...state,
      selectedCategory: category,
    }))

    filterByCategory(category)


    maintainPresetSorting = false
  }

  // Update the selectedPatch and load it into the patchStore
  const handlePresetClick = (id: string) => {
    maintainPresetSorting = true
    presetsStore.update((state) => ({
      ...state,
      selectedPatch: id,
    }))

    selectedPreset = $presetsStore.presets.find(({ id }) => id === $presetsStore.selectedPatch) as Patch

    patchStore.update(() => ({ ...selectedPreset  }))

    handleCancelClick()
    maintainPresetSorting = false
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
  const handleAddPresetClick = () => viewStore.update((state) => ({ ...state, presetsView: 'add' }))

  onDestroy(unsubscribePresetsStore)
</script>

<div class="grid-container grid grid-cols-8 divide-x h-full-no-header">

  <div class="col-span-1 pt-6 pr-4">
    <div class="w-full">
      {#each $presetsStore.categories as category, i}
        <button on:click={() => handleCategoryClick(category)} in:fly={{ x: -20, delay: 0+(i*20), duration: 400 }} class="w-full flex cursor-pointer py-2 px-4 hover:bg-primary hover:text-white transition-colors ease-in-out rounded capitalize text-xs {$presetsStore.selectedCategory === category ? 'bg-primary text-white' : ''}">
          <h5>{category}</h5>
        </button>
      {/each}
    </div>
  </div>

  <div class="col-span-5 pt-5 px-4 relative">
    <div class="flex items-center gap-4 w-full mb-4 group">
      <h1 class="text-2xl font-bold">Explore</h1>
      <div class="relative grow">
        <Search />
        <input on:input={handlePresetSearch} bind:value={searchTerm} type="text" placeholder="Search presets" spellcheck="false" name="search" class="w-full text-sm bg-base-100 border-2 border-base-300 transition-colors ease-in-out rounded-lg h-10 py-3 pl-8 pr-8 hover:border-secondary/50 focus:border-secondary focus:outline-none {isSearching ? 'border-secondary' : ''}" />
        {#if isSearching}
          <ClearSearch {clearSearch} />
        {/if}
      </div>
    </div>
    <PresetsTable {presets} {handlePresetClick} {isSearching} />

    <button on:click={handleAddPresetClick} in:fly={{ y: 20, duration: 400 }} class="btn btn-primary btn-2xl hover:scale-105 duration-250 ease-in-out rounded-lg absolute right-4 {!$sessionStore.connectedStatus ? 'bottom-12' : 'bottom-4'} text-white"><Plus /></button>
  </div>

  <div class="col-span-2 pt-5 pr-6 pl-4 bg-base-300">
    {#if $viewStore.presetsView === 'add'}
      <AddPreset {handleCancelClick} />
    {:else if $viewStore.presetsView === 'edit'}
      <EditPreset {handleCancelClick} preset={selectedPreset} />
    {:else}
      <PresetInfo {handleCategoryClick} preset={selectedPreset} />
    {/if}
  </div>
</div>

