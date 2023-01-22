<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let id: string
  export let value: number
  export let label: string
  export let unitLabel: string
  export let min: number
  export let max: number
  export let step: number

  const dispatch = createEventDispatcher()

  const setValue = (event: {
    type: string
    currentTarget: HTMLInputElement
  }) => {
    const { value: val } = event.currentTarget

    value = +val

    switch (event.type) {
      case 'input':
        dispatch('input', { id, value })
        break

      case 'change':
        dispatch('change', { id, value })
        break

      default:
        break
    }
  }
</script>

<div class="grid grid-flow-row grid-rows-2 gap-2">
  <div class="grid grid-flow-col grid-columns-2">
    <span class="text-xs">{label}</span>
    <div class="grid grid-flow-row justify-end">
      <span class="text-xs text-neutral">{value}{unitLabel}</span>
    </div>
  </div>
  <input
    type="range"
    class="range range-xs"
    {min}
    {max}
    {step}
    {value}
    on:input={setValue}
    on:change={setValue}
  />
</div>
