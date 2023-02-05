<script lang="ts">
  import type { Channels, Param } from '../../index.js'

  import { limits, process } from './simple.js'
  import { translateToRange } from '$lib/common/utils.js'
  import Knob from '$lib/common/components/Knob.svelte'

  export let input: Channels
  export let render: (channels: Channels) => void

  const params: Record<string, Param> = {
    delayTime: {
      label: 'Time',
      value: 200,
      min: 0,
      max: 1000,
      step: 1,
      unitLabel: 'ms'
    },
    feedback: {
      label: 'Feedback',
      value: 0,
      min: 0,
      max: 100,
      step: 1,
      unitLabel: '%'
    },
    mix: {
      label: 'Mix',
      value: 50,
      min: 0,
      max: 100,
      step: 1,
      unitLabel: '%'
    }
  }

  let selectedParam: keyof typeof params | null = null

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

<div class="grid grid-flow-row auto-rows-max gap-5 px-10 py-5">
  <div class="grid justify-center">
    <h2 class="text-lg">Simple Delay</h2>
  </div>
  <div class="grid grid-flow-col auto-cols-max gap-4">
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
</div>
