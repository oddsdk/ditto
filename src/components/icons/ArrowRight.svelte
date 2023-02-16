<script lang="ts">
  import { patchStore, presetsStore } from '../../stores'

  const handleNextClick = () => {
    const currentIndex = $presetsStore.presets.map((preset) => preset.id).indexOf($presetsStore.selectedPatch)
    const nextIndex = (currentIndex + 1) > ($presetsStore.presets.length - 1) ? 0 : (currentIndex + 1)

    patchStore.update(() => ({ ...$presetsStore.presets[nextIndex] }))
    presetsStore.update((state) => ({ ...state, selectedPatch: $presetsStore.presets[nextIndex].id }))
  }

  // Enable keyboard navigation if the user has not focused on a form element
  const handleKeyDown = (event: KeyboardEvent) => {
    const tagName = (event?.target as HTMLElement).tagName.toLowerCase()
    const key = event.key

    if (!['input', 'select', 'textarea'].includes(tagName) && ['ArrowRight', 'ArrowDown'].includes(key)) {
      handleNextClick()
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown}/>

<button on:click={handleNextClick} class="">
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-arrow-right-circle"><circle cx="12" cy="12" r="10"/><path d="m12 16 4-4-4-4M8 12h8"/></svg>
</button>
