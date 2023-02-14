<script lang="ts">
  import type { Patch } from '$lib/patch'
  import { savePreset } from '$lib/presets'

  export let preset: Patch
  let loading = false

  // Update favorite value
  const handleFavoriteClick = async () => {
    loading = true

    await savePreset({
      ...preset,
      favorite: !preset.favorite,
    })

    loading = false
  }
</script>

<button disabled={loading} on:click={handleFavoriteClick}>
  <svg fill="{preset?.favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 text-red-500" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
  </svg>
</button>
