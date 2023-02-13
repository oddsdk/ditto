<script lang="ts">
  import { patchStore, presetsStore } from '../../stores'
  import type { Patch } from '$lib/patch'
  import AddPresetIcon from '$components/icons/AddPreset.svelte'
  import PresetInfo from '$components/Presets/PresetInfo.svelte'

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
  }

  // Update the selectedPatch and load it into the patchStore
  const handlePresetClick = (id: string) => {
    presetsStore.update((state) => ({
      ...state,
      selectedPatch: id,
    }))

    patchStore.update(() => ({ ...selectedPreset as Patch }))
  }

  console.log('presetsStore', $presetsStore)
</script>

<!-- <AddPresetIcon /> -->

<!-- <div class="grid-container grid grid-cols-3">
  <input type="text" placeholder="Search presets" class="col-span-1 w-full text-sm rounded h-10 py-3 px-4 focus:outline-none" />
</div> -->
<div class="grid-container grid grid-cols-3 mt-2 mb-2">
  <h4 class="col-span-1 pl-8 py-3">Categories</h4>
  <h4 class="col-span-1 pl-10 py-3">Presets</h4>
  <h4 class="col-span-1 pl-8 py-3">Preset Info</h4>
</div>
<div class="grid-container grid grid-cols-3 divide-x-2 min-h-screen gap-4">

  <div class="col-span-1 px-4">
    <div class="w-full">
      {#each $presetsStore.categories as category}
        <button on:click={() => handleCategoryClick(category)} class="w-full flex cursor-pointer py-2 px-4 hover:bg-primary rounded capitalize text-sm {$presetsStore.selectedCategory === category ? 'bg-primary' : ''}">
          <h5>{category}</h5>
        </button>
      {/each}
    </div>
  </div>

  <div class="col-span-1 px-4">
    <div class="w-full">
      {#each presets as preset}
        <button on:click={() => handlePresetClick(preset.id)} class="w-full flex cursor-pointer py-2 px-4 hover:bg-primary rounded capitalize text-sm {$presetsStore.selectedPatch === preset.id ? 'bg-primary' : ''}">
          <h5>{preset.name}</h5>
        </button>
      {/each}
    </div>
  </div>

  <div class="col-span-1 px-4">
    <PresetInfo preset={selectedPreset} />
  </div>
</div>



<!-- <div class="bg-gray-50 min-h-screen flex items-center justify-center px-16">
  <div class="relative w-full max-w-lg">
    <div class="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob "></div>
    <div class="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
    <div class="absolute -bottom-32 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    <div class="m-8 relative space-y-4">
      <div class="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
        <div class="flex-1 flex justify-between items-center">
          <div class="h-4 w-48 bg-gray-300 rounded"></div>
          <div class="w-24 h-6 rounded-lg bg-purple-300"></div>
        </div>
      </div>
      <div class="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
        <div class="flex-1 flex justify-between items-center">
          <div class="h-4 w-48 bg-gray-300 rounded"></div>
          <div class="w-24 h-6 rounded-lg bg-purple-300"></div>
        </div>
      </div>
      <div class="p-5 bg-white rounded-lg flex items-center justify-between space-x-8">
        <div class="flex-1 flex justify-between items-center">
          <div class="h-4 w-48 bg-gray-300 rounded"></div>
          <div class="w-24 h-6 rounded-lg bg-purple-300"></div>
        </div>
      </div>
    </div>
  </div>
</div> -->
