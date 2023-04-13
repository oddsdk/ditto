import * as odd from '@oddjs/odd'
import { get as getStore } from 'svelte/store'

import { fileSystemStore, patchStore, presetsStore } from '../../stores'
import { getUsername } from '$lib/auth'
import { DEFAULT_PATCH, Visibility, type Patch } from '$lib/patch'
import { DEFAULT_CATEGORIES, PRESETS_DIRS } from '$lib/presets/constants'

export type Presets = {
  categories: string[]
  presets: Patch[]
  selectedCategory: string
  selectedPatch: string
}

export let originalPresets: Patch[] = []

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
      odd.path.combine(PRESETS_DIRS[visibility], odd.path.file(name))
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
  originalPresets = JSON.parse(JSON.stringify(presets))

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
  const fs = getStore(fileSystemStore)
  const contentPath = odd.path.combine(PRESETS_DIRS[preset.visibility], odd.path.file(`${preset?.id}.json`))

  // Check for duplicate preset in the opposite directory and remove it
  const oppositeDirectory = preset.visibility === Visibility.private ? Visibility.public : Visibility.private
  const oppositeContentPath = odd.path.combine(PRESETS_DIRS[oppositeDirectory], odd.path.file(`${preset?.id}.json`))
  const exists = await fs?.exists(oppositeContentPath)
  if (exists) {
    await fs?.rm(
      oppositeContentPath
    )
  }

  await fs?.write(
    contentPath,
    new TextEncoder().encode(JSON.stringify(preset))
  )
  await fs?.publish()

  presetsStore.update((state) => {
    const updatedPresets = addOrUpdate(state.presets, preset).sort((a, b) => a.name.localeCompare(b.name, 'en', {'sensitivity': 'base'}))
    originalPresets = JSON.parse(JSON.stringify(updatedPresets))

    return {
      ...state,
      presets: updatedPresets,
    }
  })

  const storedPreset = JSON.parse(new TextDecoder().decode(
    await fs?.read(contentPath)
  )) as Patch

  // Update patchStore if it currently contains this preset
  const patch = getStore(patchStore)
  if (patch.id === preset?.id) {
    patchStore.update(() => preset)
  }

  console.log('saved preset', storedPreset)
}

/**
 * Batch write all presets before publishing to the file system
 *
 * @param presets Patch[]
 */
export const saveAllPresets = async (presets: Patch[]) => {
  const fs = getStore(fileSystemStore)
  const username = getUsername()

  const updatedPresets = []

  // Update and write presets sequentially
  for (const preset of presets) {
    const updatedPreset = {
      ...preset,
      creator: username
    }

    const contentPath = odd.path.combine(PRESETS_DIRS[ updatedPreset.visibility ], odd.path.file(`${updatedPreset?.id}.json`))

    await fs?.write(
      contentPath,
      new TextEncoder().encode(JSON.stringify(updatedPreset))
    )

    updatedPresets.push(updatedPreset)
  }

  await fs?.publish()

  await Promise.all(updatedPresets.map((preset) => {
    // Update presets store
    presetsStore.update((state) => {
      const updatedPresets = addOrUpdate(state.presets, preset).sort((a, b) => a.name.localeCompare(b.name, 'en', { 'sensitivity': 'base' }))

      return {
        ...state,
        presets: updatedPresets,
      }
    })

    // Update patchStore if it currently contains this preset
    const patch = getStore(patchStore)
    if (patch.id === preset?.id) {
      patchStore.update(() => preset)
    }
  }))
}

/**
 * Delete preset from the file system and remove it from the preset list
 *
 * @param preset Patch
 */
export const deletePreset = async (preset: Patch) => {
  const fs = getStore(fileSystemStore)
  const contentPath = odd.path.combine(PRESETS_DIRS[preset.visibility], odd.path.file(`${preset?.id}.json`))

  await fs?.rm(contentPath)

  await fs?.publish()

  presetsStore.update((state) => ({
    ...state,
    presets: state.presets.filter(({ id }) => id !== preset?.id),
    selectedCategory: DEFAULT_CATEGORIES[0],
    selectedPatch: DEFAULT_PATCH.id,
  }))

  patchStore.update(() => DEFAULT_PATCH)
}

/**
 * Parse tags as categories from presets
 *
 * @param presets Patch[]
 */
export const deriveCategoriesFromPresets = (presets: Patch[]): string[] => {
  const categories: string[] = []

  presets.forEach(({ tags }) => tags.forEach((tag) => {
    const lowerCaseTag = tag.toLowerCase()
    if (!categories.includes(lowerCaseTag)) categories.push(lowerCaseTag)
  }))

   categories.sort((a, b) => a.localeCompare(b, 'en', {'sensitivity': 'base'}))

  return [...DEFAULT_CATEGORIES, ...categories]
}
