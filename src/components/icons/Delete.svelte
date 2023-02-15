<script lang="ts">
  import { addNotification } from '$lib/notifications'
  import type { Patch } from '$lib/patch'
  import { deletePreset } from '$lib/presets'

  export let preset: Patch
  export let handleCancelClick: () => void
  let loading = false

  // Delete the current preset
  const handleDeleteClick = async () => {
    loading = true
    try {
      await deletePreset(preset)
      handleCancelClick()
      addNotification('Preset deleted', 'success')
    } catch (error) {
      console.error(error)
      addNotification('Failed to delete preset', 'error')
    }
    loading = false
  }
</script>

<button disabled={loading} on:click={handleDeleteClick}>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" class="feather feather-trash-2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/></svg>
</button>
