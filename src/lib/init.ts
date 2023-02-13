import * as webnative from 'webnative'
import { get as getStore } from 'svelte/store'
import { getLocalOnlyFs } from './filesystem/local'

import * as CustomAuth from '$lib/auth'
import { hydratePresetsStore } from '$lib/presets'
import { fileSystemStore, localOnlyFsStore, patchStore, programStore, sessionStore } from '../stores'
import { checkConnectedStatus } from '$lib/auth/connected'
import type { Patch } from './patch'

export const initialize = async (): Promise<void> => {
  try {
    const localOnlyFs = await getLocalOnlyFs()

    localOnlyFsStore.set(localOnlyFs)
    await hydratePresetsStore()

    // TODO Delete this test once we have a presets UI
    await testLocalFs(localOnlyFs)

    const configuration = {
      namespace: { creator: 'fission', name: 'ditto' },
      debug: true,
    }

    const program = await webnative.program({
      ...configuration,
      auth: await CustomAuth.implementation(configuration)
    })
    programStore.set(program)

    const { session } = program

    if (session && session.fs) {
      const fs = session.fs
      fileSystemStore.set(fs)

      const connectedStatus = await checkConnectedStatus(fs)
      sessionStore.set({
        connectedStatus,
        session
      })

    } else {
      const localOnlyFs = await getLocalOnlyFs()
      fileSystemStore.set(localOnlyFs)

      // TODO Delete this test once we have a presets UI
      await testLocalFs(localOnlyFs)

    }


  } catch (error) {
    console.error(error)

  }
}

async function testLocalFs(localOnlyFs: webnative.FileSystem) {
  const contentPath = webnative.path.file('private', 'presets', 'default.json')
  const defaultPatch = getStore(patchStore)

  await localOnlyFs.write(
    contentPath,
    new TextEncoder().encode(JSON.stringify(defaultPatch))
  )
  await localOnlyFs.publish()

  const storedPatch = JSON.parse(new TextDecoder().decode(
    await localOnlyFs.read(contentPath)
  ))

  console.log('stored patch', storedPatch)
}
