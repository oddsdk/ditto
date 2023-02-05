import type { ActionReturn } from 'svelte/action'

interface Attributes {
  'on:outmousemove': (e: CustomEvent<{ pageY: number }>) => void
  'on:outmouseup': (e: CustomEvent<void>) => void
}

export function mouseOutside(node: HTMLElement): ActionReturn<unknown, Attributes> {
  const handleMouseMove = (event: { target: EventTarget | null; pageY: number }) => {
    if (event && !node.contains(event.target as Node)) {
      node.dispatchEvent(new CustomEvent('outmousemove', { detail: { pageY: event.pageY } }))
    }
  }

  const handleMouseUp = (event: { target: EventTarget | null }) => {
    if (event && !node.contains(event.target as Node)) {
      node.dispatchEvent(new CustomEvent('outmouseup'))
    }
  }

  document.addEventListener('mousemove', handleMouseMove, true)
  document.addEventListener('mouseup', handleMouseUp, true)

  return {
    destroy() {
      document.removeEventListener('mousemove', handleMouseMove, true)
      document.removeEventListener('mouseup', handleMouseUp, true)
    }
  }
}


export function isOutMouseMove(event: unknown): event is CustomEvent {
  return (
    event !== null &&
    typeof event === 'object' &&
    'detail' in event &&
    event.detail !== null &&
    typeof event.detail === 'object' &&
    'pageY' in event.detail
  )
}