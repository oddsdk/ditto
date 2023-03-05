<script lang="ts">
  import { viewStore } from '../../stores'

  let strokeWidth = 1.5

  function handleClick() {
    viewStore.update((state) => ({ ...state, globalView: 'presets', presetsView: 'view' }))
  }
</script>

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
  style:cursor="pointer"
  class="feather feather-link"
  on:mouseenter={() => (strokeWidth = 1.8)}
  on:mouseleave={() => (strokeWidth = 1.5)}
  on:click={handleClick}
  on:keydown={handleClick}
>
  <title>Presets</title>
  <line x1="8" y1="6" x2="21" y2="6" />
  <line x1="8" y1="12" x2="21" y2="12" />
  <line x1="8" y1="18" x2="21" y2="18" />
  <line x1="3" y1="6" x2="3.01" y2="6" />
  <line x1="3" y1="12" x2="3.01" y2="12" />
  <line x1="3" y1="18" x2="3.01" y2="18" />
</svg>

<style>
  svg {
    transition: stroke-width 0.2s ease-in-out;
  }
</style>
