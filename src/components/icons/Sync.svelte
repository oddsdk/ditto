<script lang="ts">
  import { fileSystemStore, patchStore, presetsStore, programStore, sessionStore } from '../../stores'
  // import { initialize } from '$lib/init'
  import type { Patch } from '$lib/patch'
  import { hydratePresetsStore } from '$lib/presets'
  import { addNotification } from '$lib/notifications'

  const handleSyncClick = async () => {
    try {
      // window.location.reload()
      if ($sessionStore.session?.username) {
        const fs = await $programStore?.fileSystem.load($sessionStore.session?.username)
        if (fs) {
          fileSystemStore.set(fs)
          await hydratePresetsStore()
          // await initialize()
          patchStore.update((): Patch => {
            const patch = $presetsStore.presets.find(({ id }) => id === $presetsStore.selectedPatch)
            return patch as Patch
          })
        }
      }
      addNotification('Synced presets', 'success')
    } catch (error) {
      console.error(error)
      addNotification('Failed to sync', 'error')
    }
  }
</script>

<button on:click={handleSyncClick}>
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" class="feather feather-refresh-cw" viewBox="0 0 24 24"><title>Sync</title><path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
</button>
