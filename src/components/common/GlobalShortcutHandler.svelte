<script lang="ts">
  import { patchStore, viewStore } from '../../stores'
  import { addNotification } from '$lib/notifications'
  import { DEFAULT_PATCH } from '$lib/patch'

  type KeyMap = {
    [key: string]: () => void
  }

  // Map keys to actions
  const keyMap: KeyMap = {
    c: () => viewStore.update((state) => ({
      ...state,
      globalView: 'connect',
    })),
    Escape: () => viewStore.update((state) => ({
      ...state,
      globalView: 'effect',
      presetsView: 'view',
    })),
    e: () => {
      if ($patchStore.id === DEFAULT_PATCH.id) {
        addNotification('Cannot edit default patch', 'warning')
        return
      }

      viewStore.update((state) => ({
        ...state,
        globalView: 'presets',
        presetsView: 'edit',
      }))
    },
    n: () => viewStore.update((state) => ({
      ...state,
      globalView: 'presets',
      presetsView: 'add',
    })),
    l: () => viewStore.update((state) => ({
      ...state,
      globalView: 'presets',
      presetsView: 'view',
    })),
    Shift: () => viewStore.update((state) => ({
      ...state,
      showShortcuts: true,
    })),
  }

  // Only register key strokes from the keyMap
  const allowedKeys = Object.keys(keyMap)

  // Shortcuts are disabled if these elements are focused on
  const formElements = ['input', 'select', 'textarea']

  // Enable global keyboard shortcuts if the user has not focused on a form element
  const handleKeyDown = (event: KeyboardEvent): void => {
    const tagName = (event?.target as HTMLElement).tagName.toLowerCase()
    const key = event.key

    if (!formElements.includes(tagName) && allowedKeys.includes(key)) {
      keyMap[key]()
    }
  }

  const handleKeyUp = (event: KeyboardEvent): void => {
    const tagName = (event?.target as HTMLElement).tagName.toLowerCase()
    const key = event.key

    if (!formElements.includes(tagName) && key === 'Shift') {
      viewStore.update((state) => ({
        ...state,
        showShortcuts: false,
      }))
    }
  }
</script>

<svelte:window on:keydown={handleKeyDown} on:keyup={handleKeyUp} />
