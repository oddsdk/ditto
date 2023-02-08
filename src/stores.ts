import { writable } from 'svelte/store'
import type { Writable } from 'svelte/store'


import type { FileSystem } from 'webnative'
import { version } from '../package.json'
import type { Patch } from '$lib/patch'

export const localOnlyFsStore: Writable<FileSystem | null> = writable(null)

export const patchStore: Writable<Patch> = writable({
  version,
  id: 'default',
  creator: 'bgins',
  params: {
    delayTime: 200,
    feedback: 0,
    mix: 50
  },
  notes: '',
  tags: [],
  visibility: 'public'
})
