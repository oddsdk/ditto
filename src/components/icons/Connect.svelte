<script lang="ts">
  import { viewStore } from '../../stores'

  let strokeWidth = 1.5

  function handleClick() {
    viewStore.update((state) => ({ ...state, globalView: 'connect' }))
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
  <title>Connect</title>
  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
</svg>

<style>
  svg {
    transition: stroke-width 0.2s ease-in-out;
  }
</style>
