<script lang="ts">
  import { patchStore, presetsStore } from '../../stores'
  import type { Patch } from '$lib/patch'
  import AddPreset from '$components/presets/AddPreset.svelte'
  import EditPreset from '$components/presets/EditPreset.svelte'
  import PresetInfo from '$components/presets/PresetInfo.svelte'

  let adding = false
  let editing = false
  let presets = $presetsStore.presets
  $: selectedPreset = $presetsStore.presets.find(({ id }) => id === $presetsStore.selectedPatch) as Patch

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

    patchStore.update(() => ({ ...selectedPreset as Patch }))

    adding = false
    editing = false
  }

  // Handle "Add Preset" button click
  const handleAddPresetClick = () => adding = true

  // Toggle edit view
  const handleEditClick = () => editing = !editing
</script>

<!-- <div class="grid-container grid grid-cols-3">
  <input type="text" placeholder="Search presets" class="col-span-1 w-full text-sm rounded h-10 py-3 px-4 focus:outline-none" />
</div> -->
<div class="grid-container grid grid-cols-3 mt-2 mb-2">
  <h4 class="col-span-1 pl-8 py-3 text-lg">Categories</h4>
  <h4 class="col-span-1 pl-10 py-3 text-lg flex items-center justify-between">Presets <button on:click={handleAddPresetClick} class="btn btn-secondary btn-xs">Add Preset</button></h4>
  <h4 class="col-span-1 pl-7 py-3 text-lg">Preset Info</h4>
</div>
<div class="grid-container grid grid-cols-3 divide-x-2 min-h-[calc(100vh-220px)] gap-4">

  <div class="col-span-1 px-4">
    <div class="w-full">
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

