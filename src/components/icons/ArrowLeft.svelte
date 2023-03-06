<script lang="ts">
  import { patchStore, presetsStore } from '../../stores'

  const handlePreviousClick = () => {
    const currentIndex = $presetsStore.presets.map((preset) => preset?.id).indexOf($presetsStore.selectedPatch)
    const prevIndex = (currentIndex - 1) < 0 ? ($presetsStore.presets.length - 1) : (currentIndex - 1)

    patchStore.update(() => ({ ...$presetsStore.presets[prevIndex] }))
    presetsStore.update((state) => ({ ...state, selectedPatch: $presetsStore.presets[prevIndex].id }))
  }

  // Enable keyboard navigation if the user has not focused on a form element
  const handleKeyDown = (event: KeyboardEvent) => {
    const tagName = (event?.target as HTMLElement).tagName.toLowerCase()
    const key = event.key

    if (!['input', 'select', 'textarea'].includes(tagName) && ['ArrowLeft', 'ArrowUp'].includes(key)) {
      handlePreviousClick()
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown}/>

<button on:click={handlePreviousClick}>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-arrow-left-circle"><circle cx="12" cy="12" r="10"/><path d="m12 8-4 4 4 4M16 12H8"/></svg>
</button>
