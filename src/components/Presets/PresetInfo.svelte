<script lang="ts">
  import type { Patch } from '$lib/patch'

  export let preset: Patch
</script>

<h3 class="text-sm title-font text-gray-500 tracking-widest">{preset?.creator}</h3>
<h4 class="text-gray-900 text-3xl title-font font-medium mb-1">{preset?.name}</h4>

<div class="flex items-center mb-4">
  <!-- <span class="flex items-center justify-end"> -->
    <!-- <button class="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500"> -->
      <svg fill="{preset?.favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 text-red-500" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      </svg>
    <!-- </button> -->
    <!-- <span class="text-gray-600 ml-3">Favorited</span> -->
  <!-- </span> -->

  <!-- <span class="flex ml-3 pl-3 py-2 border-l-2 border-gray-200">

  </span> -->
</div>
{#if preset?.notes}
  <p class="leading-relaxed">{preset.notes}</p>
{/if}

<div class="flex mt-6 items-center justify-between py-5 border-t-2 border-b-2 border-gray-200 mb-5">
  <div class="text-center">
    <h6 class="text-lg">Time</h6>
    <p class="text-sm">{preset?.params?.delayTime}</p>
  </div>
  <div class="text-center">
    <h6 class="text-lg">Feedback</h6>
    <p class="text-sm">{preset?.params?.feedback}</p>
  </div>
  <div class="text-center">
    <h6 class="text-lg">Mix</h6>
    <p class="text-sm">{preset?.params?.mix}</p>
  </div>
</div>
<div class="flex">
  <button class="flex ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded">Select</button>
</div>
