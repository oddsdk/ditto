<script lang="ts">
  import { viewStore } from '../../stores'

  let strokeWidth = 1.5

  function handleClick() {
    viewStore.update((state) => ({ ...state, globalView: 'effect', presetsView: 'view' }))
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
  <line x1="18" y1="6" x2="6" y2="18" />
  <line x1="6" y1="6" x2="18" y2="18" />
</svg>

<style>
  svg {
    transition: stroke-width 0.2s ease-in-out;
  }
</style>

