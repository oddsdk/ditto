<script lang="ts">
  import { fly } from 'svelte/transition'

  import { version } from '../../../package.json'
  import { patchStore, presetsStore } from '../../stores'
  import { addNotification } from '$lib/notifications'
  import { type Patch, Visibility } from '$lib/patch'
  import { getUsername } from '$lib/auth'
  import { deriveCategoriesFromPresets, savePreset } from '$lib/presets'
  import { DEFAULT_CATEGORIES } from '$lib/presets/constants'

  export let handleCancelClick: () => void

  let name: string
  let notes: string
  let tags: string
  let visibility: Visibility

  const handleSubmit = async (): Promise<void> => {
    try {
      const preset: Patch = {
        creator: getUsername(),
        favorite: false,
        id: crypto.randomUUID(),
        name,
        notes,
        params: {
          delayTime: $patchStore.params.delayTime ?? 200,
          feedback: $patchStore.params.feedback ?? 0,
          mix: $patchStore.params.mix ?? 50,
        },
        tags: tags ? tags?.toLowerCase().split(',')?.map((tag: string) => tag.trim()) : [],
        version,
        visibility,
      }

      await savePreset(preset)

      presetsStore.update(state => {
        return {
          ...state,
          // Parse tags as categories from presets
          categories: deriveCategoriesFromPresets(state.presets),
          selectedCategory: DEFAULT_CATEGORIES[0],
          selectedPatch: preset?.id,
        }
      })

      // Load the new patch into the patchStore
      patchStore.update(() => ({ ...preset }))

      // Leave the edit view
      handleCancelClick()

      addNotification('Patch created', 'success')
    } catch (error) {
      addNotification('Failed to create patch', 'error')
      console.error(error)
    }
  }
</script>

<form on:submit={handleSubmit} in:fly={{ x: -20, duration: 400 }}>
  <h1 class="text-2xl font-bold mb-4">New Preset</h1>

  <label for="name" class="mb-1 text-xs">Name</label>
  <input type="text" name="name" bind:value={name} class="input input-bordered focus:outline-0 w-full mb-3" spellcheck="false" required />

  <label for="notes" class="mb-1 text-xs">Notes</label>
  <textarea class="textarea textarea-bordered focus:outline-0 w-full mb-3" bind:value={notes} name="notes"></textarea>

  <label for="visibility" class="mb-1 text-xs">Tags(comma separated)</label>
  <input type="text" name="tags" bind:value={tags} class="input input-bordered focus:outline-0 w-full mb-3" spellcheck="false" />

  <label for="visibility" class="mb-1 text-xs">Visibility</label>
  <select class="select select-bordered focus:outline-0 w-full mb-8" bind:value={visibility} name="visibility" required>
    <option selected value={Visibility.private}>Private</option>
    <option value={Visibility.public}>Public</option>
  </select>

  <div class="flex items-center justify-end gap-4">
    <button type="submit" class="btn flex text-white bg-primary border-0 py-2 px-6 focus:outline-none rounded">Save</button>
    <button on:click={handleCancelClick} class="btn bg-accent border-0 flex text-white py-2 px-6 focus:outline-none rounded">Cancel</button>
  </div>
</form>
