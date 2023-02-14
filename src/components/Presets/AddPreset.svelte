<script lang="ts">
  import { version } from '../../../package.json'
  import { patchStore, presetsStore } from '../../stores'
  import { type Patch, Visibility } from '$lib/patch'
  import { savePreset } from '$lib/presets'
  import { DEFAULT_CATEGORIES } from '$lib/presets/constants'

  export let handleCancelClick: () => void

  let name: string
  let notes: string
  let tags: string
  let visibility: Visibility

  const handleSubmit = async (): Promise<void> => {
    const preset: Patch = {
      favorite: false,
      id: crypto.randomUUID(),
      name,
      notes,
      params: {
        delayTime: 200,
        feedback: 0,
        mix: 50
      },
      tags: tags ? tags?.split(',')?.map((tag: string) => tag.trim()) : [],
      version,
      visibility,
    }

    await savePreset(preset)

    // Parse tags as categories from presets
    const categories = [...DEFAULT_CATEGORIES]
    presetsStore.update(state => {
      state.presets.forEach(({ tags }) => tags.forEach((tag) => categories.push(tag)))
      return {
        ...state,
        categories,
        selectedPatch: preset.id,
      }
    })

    // Load the new patch into the patchStore
    patchStore.update(() => ({ ...preset }))

    // Leave the edit view
    handleCancelClick()
  }
</script>

<form on:submit={handleSubmit}>
  <label for="name" class="mb-1 text-xs">Name</label>
  <input type="text" name="name" bind:value={name} class="input input-bordered w-full mb-3" spellcheck="false" required />

  <label for="notes" class="mb-1 text-xs">Notes</label>
  <textarea class="textarea textarea-bordered w-full mb-3" bind:value={notes} name="notes"></textarea>

  <label for="visibility" class="mb-1 text-xs">Tags(comma separated)</label>
  <input type="text" name="tags" bind:value={tags} class="input input-bordered w-full mb-3" spellcheck="false" />

  <label for="visibility" class="mb-1 text-xs">Visibility</label>
  <select class="select select-bordered w-full mb-8" bind:value={visibility} name="visibility" required>
    <option selected value={Visibility.public}>Public</option>
    <option value={Visibility.private}>Private</option>
  </select>

  <div class="flex items-center justify-end gap-4">
    <button type="submit" class="btn flex text-white bg-primary border-0 py-2 px-6 focus:outline-none rounded">Save</button>
    <button on:click={handleCancelClick} class="btn bg-accent border-0 flex text-white py-2 px-6 focus:outline-none rounded">Cancel</button>
  </div>
</form>
