<script lang="ts">
  import { fade } from 'svelte/transition'

  import { patchStore } from '../../stores'
  import { addNotification } from '$lib/notifications'
  import { originalPresets, savePreset } from '$lib/presets'
  import Edit from '$components/icons/Edit.svelte'

  let unsavedChanges = false

  const handleSavePatch = async (): Promise<void> => {
    try {
      await savePreset($patchStore)
      addNotification('Patch updated', 'success')
    } catch (error) {
      addNotification('Failed to update patch', 'error')
      console.error(error)
    }
  }

  $: {
    // Check if the patch params have been modified from the original preset
    const associatedPreset = originalPresets.find(({ id }) => id === $patchStore.id)
    unsavedChanges = (associatedPreset?.params.delayTime !== $patchStore.params.delayTime) || (associatedPreset?.params.feedback !== $patchStore.params.feedback) || (associatedPreset?.params.mix !== $patchStore.params.mix)
  }
</script>

{#if $patchStore.id !== 'default' && unsavedChanges}
  <button in:fade on:click={handleSavePatch} class="animate-pulse absolute top-1/2 -translate-y-1/2 right-14 cursor-pointer flex items-center gap-2 text-primary"><title>Save changes</title><Edit /></button>
{/if}
