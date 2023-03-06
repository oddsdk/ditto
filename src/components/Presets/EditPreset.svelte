<script lang="ts">
  import { fly } from 'svelte/transition'

  import { patchStore, presetsStore } from '../../stores'
  import { getUsername } from '$lib/auth'
  import { addNotification } from '$lib/notifications'
  import { type Patch, Visibility } from '$lib/patch'
  import { deriveCategoriesFromPresets, savePreset } from '$lib/presets'
  import { DEFAULT_CATEGORIES } from '$lib/presets/constants'

  export let preset: Patch
  export let handleCancelClick: () => void

  let name: string = preset?.name
  let notes: string = preset?.notes || ''
  let tags: string = preset?.tags?.join(', ')
  let visibility: Visibility = preset?.visibility

  const handleSubmit = async (): Promise<void> => {
    try {
      const updatedPreset: Patch = {
        ...preset,
        creator: preset.creator ?? getUsername(),
        name,
        notes,
        tags: tags ? tags?.toLowerCase().split(',')?.map((tag: string) => tag.trim()) : [],
        visibility: visibility,
      }

      await savePreset(updatedPreset)

      presetsStore.update(state => {
        return {
          ...state,
          // Parse tags as categories from presets
          categories: deriveCategoriesFromPresets(state.presets),
          selectedCategory: DEFAULT_CATEGORIES[0]
        }
      })

      // Load the new patch into the patchStore
      patchStore.update(() => ({ ...updatedPreset }))

      // Leave the edit view
      handleCancelClick()

      addNotification('Patch updated', 'success')
    } catch (error) {
      addNotification('Failed to update patch', 'error')
      console.error(error)
    }
  }
</script>

<form on:submit={handleSubmit} class="relative" in:fly={{ x: -20, duration: 400 }}>
  <h1 class="text-2xl font-bold mb-4">Edit Preset</h1>

  <label for="name" class="mb-1 text-xs">Name</label>
  <input type="text" name="name" bind:value={name} class="input input-bordered focus:outline-0 w-full mb-3" spellcheck="false" />

  <label for="notes" class="mb-1 text-xs">Notes</label>
  <textarea class="textarea textarea-bordered focus:outline-0 w-full mb-3" name="notes" bind:value={notes}></textarea>

  <label for="visibility" class="mb-1 text-xs">Tags(comma separated)</label>
  <input type="text" name="tags" bind:value={tags} class="input input-bordered focus:outline-0 w-full mb-3" spellcheck="false" />

  <label for="visibility" class="mb-1 text-xs">Visibility</label>
  <select class="select select-bordered focus:outline-0 w-full mb-6" bind:value={visibility} name="visibility">
    <option value={Visibility.public}>Public</option>
    <option value={Visibility.private}>Private</option>
  </select>

  <div class="flex items-center justify-end gap-4">
    <button type="submit" class="btn flex text-white bg-primary border-0 py-2 px-6 focus:outline-none rounded">Save</button>
    <button on:click={handleCancelClick} class="btn bg-accent border-0 flex text-white py-2 px-6 focus:outline-none rounded">Cancel</button>
  </div>
</form>
