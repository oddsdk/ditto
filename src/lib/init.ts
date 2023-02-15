import * as webnative from 'webnative'
import { getLocalOnlyFs } from './filesystem/local'

import * as CustomAuth from '$lib/auth'
import { hydratePresetsStore } from '$lib/presets'
import { fileSystemStore, programStore, sessionStore } from '../stores'
import { checkConnectedStatus } from '$lib/auth/connected'

export const initialize = async (): Promise<void> => {
  try {
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

    }

    await hydratePresetsStore()

  } catch (error) {
    console.error(error)

  }
}