import * as webnative from 'webnative'
import { get as getStore } from 'svelte/store'

import { fileSystemStore, presetsStore } from '../../stores'
import { DEFAULT_PATCH, Visibility, type  Patch } from '$lib/patch'
import { DEFAULT_CATEGORIES, PRESETS_DIRS } from '$lib/presets/constants'

export type Presets = {
  categories: string[]
  presets: Patch[]
  selectedCategory: string
  selectedPatch: string
}

/**
 * Load patches from either a public or private file system
 *
 * @param visibility Visibility
 * @returns Promise<Patch[]>
 */
export const loadFromFilesystem: (visibility: Visibility) => Promise<Patch[]> = async (visibility) => {
  const fs = getStore(fileSystemStore)
  const directoryExists = await fs?.exists(PRESETS_DIRS[visibility])
  if (!directoryExists) {
    return []
  }


  const linksObject = await fs?.ls(PRESETS_DIRS[visibility])
  if (!linksObject) {
    return []
  }

  // convert links object to a list
  const links = Object.entries(linksObject)

  const data = await Promise.all(links.map(async ([name, _]) =>
    JSON.parse(new TextDecoder().decode(await fs?.read(
      webnative.path.combine(PRESETS_DIRS[visibility], webnative.path.file(name))
    ))) as Patch
  ))

  return data
}

/**
 * Do the inital hydration of the presetsStore
 */
export const hydratePresetsStore = async () => {
  // Merge public and private presets and sort alphabetically by name
  const publicPresets = await loadFromFilesystem(Visibility.public)
  const privatePresets = await loadFromFilesystem(Visibility.private)
  const presets = [DEFAULT_PATCH, ...publicPresets, ...privatePresets].sort((a, b) => a.name.localeCompare(b.name, 'en', {'sensitivity': 'base'}))

  presetsStore.set({
    categories: deriveCategoriesFromPresets(presets),
    presets,
    selectedCategory: DEFAULT_CATEGORIES[0],
    selectedPatch: DEFAULT_PATCH.id,
  })
}

/**
 * Replace a patch in an array if it exists, otherwise insert it
 *
 * @param arr Patch[]
 * @param element Patch
 */
const addOrUpdate = (arr: Patch[], element: Patch): Patch[] => {
  const i = arr.findIndex(_element => _element.id === element.id)

  if (i > -1) {
    arr[i] = element
  } else {
    arr.push(element)
  }

  return arr
}

/**
 * Save preset to file system and push it into the presetsStore
 *
 * @param preset Patch
 */
export const savePreset = async (preset: Patch) => {
  const localOnlyFs = getStore(fileSystemStore)
  const contentPath = webnative.path.combine(PRESETS_DIRS[preset.visibility], webnative.path.file(`${preset.id}.json`))

  await localOnlyFs?.write(
    contentPath,
    new TextEncoder().encode(JSON.stringify(preset))
  )
  await localOnlyFs?.publish()

  presetsStore.update((state) => ({
    ...state,
    presets: addOrUpdate(state.presets, preset).sort((a, b) => a.name.localeCompare(b.name, 'en', {'sensitivity': 'base'})),
  }))

  const storedPreset = JSON.parse(new TextDecoder().decode(
    await localOnlyFs?.read(contentPath)
  )) as Patch

  console.log('saved preset', storedPreset)
}

/**
 * Parse tags as categories from presets
 *
 * @param presets Patch[]
 */
export const deriveCategoriesFromPresets = (presets: Patch[]): string[] => {
  const categories = [...DEFAULT_CATEGORIES]

  presets.forEach(({ tags }) => tags.forEach((tag) => {
    const lowerCaseTag = tag.toLowerCase()
    if (!categories.includes(lowerCaseTag)) categories.push(lowerCaseTag)
  }))

  return categories.sort((a, b) => a.localeCompare(b, 'en', {'sensitivity': 'base'}))
}

/**
 * Store patches to either a public or private file system
 *
 * @param presets Presets to store
 * @param visibility Visibility
 * @returns Promise<Patch[]>
 */
export const storeToFilesystem: (presets: Patch[], visibility: Visibility) => Promise<void> = async (presets, visibility) => {
  const fs = getStore(fileSystemStore)

  await Promise.all(presets.map(async preset => {
    await fs?.write(
      webnative.path.combine(PRESETS_DIRS[visibility], webnative.path.file(`${preset.id}.json`)),
      new TextEncoder().encode(JSON.stringify(preset))
      )
  }))
  await fs?.publish()
}
