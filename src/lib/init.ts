import * as webnative from 'webnative'
import { get as getStore } from 'svelte/store'
import { getLocalOnlyFs } from './filesystem/local'
import { localOnlyFsStore, patchStore } from '../stores'
import type { Patch } from './patch'

export const initialize = async (): Promise<void> => {
  try {
    const localOnlyFs = await getLocalOnlyFs()

    localOnlyFsStore.set(localOnlyFs)

    // TODO Delete this test once we have a presets UI
    await testLocalFs(localOnlyFs)

  } catch (error) {
    console.error(error)

  }
}

async function testLocalFs(localOnlyFs: webnative.FileSystem) {
  const contentPath = webnative.path.file('private', 'default.json')
  const defaultPatch = getStore(patchStore)

  await localOnlyFs.write(
    contentPath,
    new TextEncoder().encode(JSON.stringify(defaultPatch))
  )
  await localOnlyFs.publish()

  const storedPatch = JSON.parse(new TextDecoder().decode(
    await localOnlyFs.read(contentPath)
  )) as Patch

  console.log('stored patch', storedPatch)
}