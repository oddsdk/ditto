<script lang="ts">
  import { onDestroy } from 'svelte'

  import { limits, process } from '$lib/audio/delay.js'
  import { presetStore } from '../../stores.js'
  import { translateToRange } from '$lib/utils.js'
  import type { Channels, Preset } from '$lib/audio/index.js'
  import Knob from '$components/controls/Knob.svelte'

  export let input: Channels
  export let render: (channels: Channels) => void

  let params: Preset
  let selectedParam: keyof typeof params | null = null

  const unsubscribePresetStore = presetStore.subscribe(val => {
    params = val
  })

  onDestroy(unsubscribePresetStore)

  function selectParam(event: CustomEvent<{ id: keyof typeof params }>) {
    const { id } = event.detail

    selectedParam = id
  }

  function unselectParam(event: CustomEvent<{ id: keyof typeof params }>) {
    const { id } = event.detail

    if (id === selectedParam) {
      selectedParam = null
    }
  }

  function setParam(
    event: CustomEvent<{ id: keyof typeof params; value: number }>
  ) {
    const { id, value } = event.detail

    switch (id) {
      case 'delayTime':
        params.delayTime.value = value
        break

      case 'feedback':
        params.feedback.value = value
        break

      case 'mix':
        params.mix.value = value
        break
    }

    presetStore.set(params)
  }

  $: {
    const feedback = translateToRange({
      num: params.feedback.value,
      original: { min: 0, max: 100 },
      scaled: { min: limits.feedback.min, max: limits.feedback.max }
    })

    const mix = translateToRange({
      num: params.mix.value,
      original: { min: 0, max: 100 },
      scaled: { min: limits.mix.min, max: limits.mix.max }
    })

    render(
      process({
        input,
        delayTime: params.delayTime.value,
        feedback,
        mix
      })
    )
  }
</script>

<div class="grid grid-flow-col auto-cols-max gap-2">
  {#each Object.entries(params) as [id, param]}
    <Knob
      {id}
      label={param.label}
      value={param.value}
      min={param.min}
      max={param.max}
      unitLabel={param.unitLabel}
      selected={selectedParam === id}
      on:mousedown={selectParam}
      on:mouseup={unselectParam}
      on:input={setParam}
    />
  {/each}
</div>
