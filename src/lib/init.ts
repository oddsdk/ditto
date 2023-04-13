import { get as getStore } from 'svelte/store'
import * as odd from '@oddjs/odd'

import { getLocalOnlyFs } from './filesystem/local'
import * as CustomAuth from '$lib/auth'
import { Visibility } from '$lib/patch'
import { hydratePresetsStore } from '$lib/presets'
import { PRESETS_DIRS } from '$lib/presets/constants'
import { fileSystemStore, programStore, sessionStore } from '../stores'
import { checkConnectedStatus } from '$lib/auth/connected'

export const initialize = async (): Promise<void> => {
  try {
    const configuration = {
      namespace: { creator: 'fission', name: 'ditto' },
      debug: true,
    }

    const program = await odd.program({
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

    }

    // Make directories if they don't yet exist
    const fs = getStore(fileSystemStore)
    if (!fs?.exists(PRESETS_DIRS[Visibility.private])) {
      await fs?.mkdir(PRESETS_DIRS[Visibility.private])
    }
    if (!fs?.exists(PRESETS_DIRS[Visibility.public])) {
      await fs?.mkdir(PRESETS_DIRS[Visibility.public])
    }

    await hydratePresetsStore()

  } catch (error) {
    console.error(error)

  }
}
