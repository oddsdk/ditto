<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { fade } from 'svelte/transition'

  import { isOutMouseMove, mouseOutside } from '$lib/actions/mouse-outside'
  import { translateToRange } from '$lib/utils'

  export let id: 'delayTime' | 'feedback' | 'mix'
  export let label: string
  export let value: number
  export let min: number
  export let max: number
  export let unitLabel: string
  export let selected: boolean = false

  const dispatch = createEventDispatcher()

  let currentY = 0
  let rotation = translateToRange({
    num: value,
    original: { min, max },
    scaled: { min: -132, max: 132 }
  })
  let strokeDashOffset = getStrokeDashOffset(rotation)

  function handleMouseDown(event: Event & { pageY: number }) {
    event.preventDefault()
    currentY = event.pageY

    dispatch('mousedown', { id })
  }

  function handleMouseUp(event: Event) {
    event.preventDefault()

    if (selected) {
      dispatch('mouseup', { id })
    }
  }

  function handleMouseMove(
    event: (Event & { pageY: number }) | CustomEvent<{ pageY: number }>
  ) {
    if (selected) {
      const pageY = isOutMouseMove(event) ? event.detail.pageY : event.pageY

      if (pageY - currentY !== 0) {
        rotation = rotation - (pageY - currentY)
      }
      currentY = pageY

      // Enforce min and max rotation
      if (rotation >= 132) {
        rotation = 132
      } else if (rotation <= -132) {
        rotation = -132
      }

      // Update dasharray offset of level indicator
      strokeDashOffset = getStrokeDashOffset(rotation)
    }

    // Prepare and dispatch audio update
    const udpatedValue = translateToRange({
      num: rotation,
      original: { min: -132, max: 132 },
      scaled: { min, max }
    })

    dispatch('input', { id, value: udpatedValue })
  }

  function getStrokeDashOffset(rotation: number): number {
    return 184 - 184 * ((rotation * 1 + 132) / 264)
  }

  type ColorMap = {
    delayTime: string
    feedback: string
    mix: string
  }
  const colorMap: ColorMap = {
    delayTime: 'E24A6E',
    feedback: '818CF8',
    mix: '83F42C',
  }

  $: {
    rotation = translateToRange({
      num: value,
      original: { min, max },
      scaled: { min: -132, max: 132 }
    })
    strokeDashOffset = getStrokeDashOffset(rotation)
  }
</script>

<div
  class="control control-knob"
  use:mouseOutside
  on:outmousemove={handleMouseMove}
  on:outmouseup={handleMouseUp}
  on:mousemove={handleMouseMove}
  on:mouseup={handleMouseUp}
>
  <div class={selected ? 'tooltip' : ''} data-tip={`${Math.round(value)}${unitLabel}`}>
    <div class="dial">
      <div
        style:transform={`translate(-50%, -50%) rotate(${rotation}deg)`}
        on:mousedown={handleMouseDown}
        class="transition-transform"
      />

      <svg viewBox="0 0 100 100">
        <!-- <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#818CF8" />
            <stop offset="50%" stop-color="#E24A6E" />
            <stop offset="100%" stop-color="#E24A6E" />
          </linearGradient>
          stroke="url(#gradient)"
        </defs> -->
        <path
          d="M20,76 A 40 40 0 1 1 80 76"
          fill="none"
          stroke="#FAFAFA"
        /><path
          d="M20,76 A 40 40 0 1 1 80 76"
          fill="none"
          stroke={`#${colorMap[id]}`}
          style:stroke-dashoffset={`${strokeDashOffset}px`}
        />
      </svg>
    </div>
    <div class="control-label" in:fade>{label}</div>
  </div>
</div>

<style>
  .control {
    position: relative;
    display: inline-block;
    padding: 30px;
    border: 0;
    border-radius: 3px;
    overflow: hidden;
  }

  .control-label {
    position: relative;
    display: block;
    max-width: 100px;
    @apply text-lg text-slate-900 text-center;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-family: monospace;
  }

  .control-knob .dial {
    position: relative;
    display: block;
    margin-bottom: 1px;
    width: 100px;
    height: 100px;
  }
  .control-knob .dial > div {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 55px;
    height: 55px;
    padding: 10px;
    @apply shadow bg-slate-100/80 bg-gradient-to-r from-slate-100/80 to-[#F9FCFF] animate-gradient-xy;
    border-radius: 100%;
    cursor: pointer;
  }
  .control-knob .dial > div::after {
    position: absolute;
    top: 5px;
    left: 50%;
    width: 1px;
    height: 10px;
    @apply bg-slate-900;
    content: '';
    transform: translateX(-50%);
  }
  .control-knob .dial > svg {
    position: absolute;
    pointer-events: none;
    touch-action: none;
    stroke-width: 2;
    stroke-dasharray: 184 184;
  }
  .control-knob .dial > svg path {
    transition: 300ms cubic-bezier(0, 0, 0.24, 1);
  }
</style>
