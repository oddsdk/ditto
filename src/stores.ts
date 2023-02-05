import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'

import type { Preset } from '$lib/audio'

export const presetStore: Writable<Preset> = writable({
  delayTime: {
    label: 'Time',
    value: 200,
    min: 0,
    max: 1000,
    unitLabel: 'ms'
  },
  feedback: {
    label: 'Feedback',
    value: 0,
    min: 0,
    max: 100,
    unitLabel: '%'
  },
  mix: {
    label: 'Mix',
    value: 50,
    min: 0,
    max: 100,
    unitLabel: '%'
  }
})