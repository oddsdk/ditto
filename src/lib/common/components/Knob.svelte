<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { isOutMouseMove, mouseOutside } from '../actions/mouse-outside'
  import { translateToRange } from '../utils'

  export let id: string
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
      />

      <svg viewBox="0 0 100 100">
        <path
          d="M20,76 A 40 40 0 1 1 80 76"
          fill="none"
          stroke="#525252"
        /><path
          d="M20,76 A 40 40 0 1 1 80 76"
          fill="none"
          stroke="#1eafed"
          style:stroke-dashoffset={`${strokeDashOffset}px`}
        />
      </svg>
    </div>
    <div class="control-label">{label}</div>
  </div>
</div>

<style>
  .control {
    position: relative;
    display: inline-block;
    padding: 40px;
    border: 0;
    border-radius: 3px;
    background-color: #414141;
    overflow: hidden;
  }

  .control-label {
    position: relative;
    display: block;
    max-width: 100px;
    font-size: 16px;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    color: #f4f8fa;
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
    width: 72px;
    height: 72px;
    border: 6px solid #313131;
    border-radius: 100%;
    cursor: pointer;
  }
  .control-knob .dial > div::after {
    position: absolute;
    top: 5px;
    left: 50%;
    width: 2px;
    height: 10px;
    background: #e4e8ea;
    content: '';
    transform: translateX(-50%);
  }
  .control-knob .dial > svg {
    position: absolute;
    pointer-events: none;
    touch-action: none;
    stroke-width: 8;
    stroke-dasharray: 184 184;
  }
  .control-knob .dial > svg path {
    transition: 300ms cubic-bezier(0, 0, 0.24, 1);
  }
</style>
