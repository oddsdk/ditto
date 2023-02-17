<script lang="ts">
  import { presetsStore } from '../../stores'
  import type { Patch } from '$lib/patch'

  export let presets: Patch[]
  export let handlePresetClick: (id: string) => void
  export let isSearching: boolean
</script>

{#if isSearching && !presets.length}
  <h5 class="text-center text-lg pt-40">No search results</h5>
{:else}
  <div class="max-h-[calc(100vh-165px)] overflow-auto">
    <table class="table table-compact w-full">
      <!-- head -->
      <thead>
        <tr>
          <th class="bg-transparent text-lg font-normal">
            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </th>
          <th class="bg-transparent text-lg font-normal opacity-80">Name</th>
          <th class="bg-transparent text-lg font-normal opacity-80">Categories</th>
          <th class="bg-transparent text-lg font-normal opacity-80">Designer</th>
        </tr>
      </thead>

      <!-- body -->
      <tbody>
        {#each presets as preset}
          <tr on:click={() => handlePresetClick(preset?.id)} class="group cursor-pointer">
            <td class="group-hover:bg-base-200 group-hover:text-primary {$presetsStore.selectedPatch === preset?.id ? 'bg-base-200' : ''}">
              <svg fill="{preset?.favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 text-primary" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </td>
            <td class="group-hover:bg-base-200 group-hover:text-primary {$presetsStore.selectedPatch === preset?.id ? 'bg-base-200 text-primary' : ''}">{preset.name}</td>
            <td class="group-hover:bg-base-200 group-hover:text-primary {$presetsStore.selectedPatch === preset?.id ? 'bg-base-200 text-primary' : ''} capitalize">{preset.tags?.join(', ')}</td>
            <td class="group-hover:bg-base-200 group-hover:text-primary {$presetsStore.selectedPatch === preset?.id ? 'bg-base-200 text-primary' : ''}">{preset.creator}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
