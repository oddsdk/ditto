<script lang="ts">
  export let clearSearch: () => void

  let strokeWidth = 1.5
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
  class="feather feather-link absolute z-10 top-1/2 right-2 -translate-y-1/2"
  on:click={clearSearch}
  on:keydown={clearSearch}
>
  <line x1="18" y1="6" x2="6" y2="18" />
  <line x1="6" y1="6" x2="18" y2="18" />
</svg>
