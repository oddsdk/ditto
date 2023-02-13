import { writable, type Writable } from 'svelte/store'
import type { FileSystem } from 'webnative'

import { DEFAULT_PATCH, type Patch } from '$lib/patch'
import { DEFAULT_CATEGORIES } from '$lib/presets/constants'
import type { Presets } from '$lib/presets'

export const localOnlyFsStore: Writable<FileSystem | null> = writable(null)

export const patchStore: Writable<Patch> = writable(DEFAULT_PATCH)

export const presetsStore = writable<Presets>({
  categories: [],
  presets: [],
  selectedCategory: DEFAULT_CATEGORIES[0],
  selectedPatch: DEFAULT_PATCH.id,
})
