<script lang="ts">
  // import { createEventDispatcher } from 'svelte'
  import { version } from '../../../package.json'
  import { Visibility } from '$lib/patch'
  import { savePreset } from '$lib/presets'

  let strokeWidth = 1.5

  // const dispatch = createEventDispatcher()

  export const DEFAULT_PATCH = {
    version,
    id: crypto.randomUUID(),
    creator: 'avivash',
    favorite: true,
    name: 'Ethereal',
    notes: 'How do ya like dem notes?',
    params: {
      delayTime: 100,
      feedback: 40,
      mix: 30,
    },
    tags: ['wavey'],
    visibility: Visibility.private,
  }

  const handleClick = async () => {
    console.log('DEFAULT_PATCH', DEFAULT_PATCH)
    await savePreset(DEFAULT_PATCH)
  }
</script>

<!-- <svg
  xmlns="http://www.w3.org/2000/svg"
  width="20"
  height="20"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  style:stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class="feather feather-file-plus cursor-pointer"
  on:mouseenter={() => (strokeWidth = 1.8)}
  on:mouseleave={() => (strokeWidth = 1.5)}
  on:click={handleClick}
  on:keydown={handleClick}
>
  <title>Add Preset</title>
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
  <path d="M14 2v6h6M12 18v-6M9 15h6"/>
</svg> -->

<div class="tooltip tooltip-bottom cursor-pointer" data-tip="Save Preset">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    style:stroke-width={strokeWidth}
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-plus-square"
    on:mouseenter={() => (strokeWidth = 1.8)}
    on:mouseleave={() => (strokeWidth = 1.5)}
    on:click={handleClick}
    on:keydown={handleClick}
  >
    <!-- <title>Add Preset</title> -->
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
    <path d="M12 8v8M8 12h8"/>
  </svg>
</div>

<style>
  svg {
    transition: stroke-width 0.2s ease-in-out;
  }
</style>
