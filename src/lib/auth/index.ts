import { get as getStore } from 'svelte/store'
import * as odd from '@oddjs/odd'
import type { Auth, Components } from '@oddjs/odd/components'
import type { Configuration } from '@oddjs/odd'

import { sessionStore } from '../../stores'
import { asyncDebounce } from '$lib/utils'

// export const dittoAppURL = 'https://long-round-glass-crow.fission.app'
export const dittoAppURL = 'http://localhost:5173'
export const usernamePrefix = 'ditto-'


// Custom Implementation

export async function implementation(configuration: Configuration): Promise<Auth.Implementation<Components>> {
  const base = await odd.auth.fissionWebCrypto(configuration)

  return {
    ...base,
    isUsernameAvailable: asyncDebounce(base.isUsernameAvailable, 300)
  }
}

/**
 * Return the username without the prepended 'ditto-'
 *
 * @returns string
 */
export const getUsername = (): string | undefined => {
  const session = getStore(sessionStore)
  const fullUsername = session?.session?.username

  if (fullUsername) {
    return fullUsername.split('-')[1]
  }

  return 'you'
}
