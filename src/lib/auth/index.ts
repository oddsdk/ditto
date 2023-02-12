import * as webnative from 'webnative'
import type { Auth, Components } from 'webnative/components'
import type { Configuration } from 'webnative'

import { asyncDebounce } from '$lib/utils'

export const dittoAppURL = 'https://ditto.fission.app'
export const usernamePrefix = 'ditto-'

export async function implementation(configuration: Configuration): Promise<Auth.Implementation<Components>> {
  const base = await webnative.auth.fissionWebCrypto(configuration)

  return {
    ...base,
    isUsernameAvailable: asyncDebounce(base.isUsernameAvailable, 300)
  }
}


// Connected Status

export type ConnectedStatus = { connected: boolean }

export function isConnectedStatus(status: unknown): status is ConnectedStatus {
  return (
    status !== null &&
    typeof status === 'object' &&
    'connected' in status &&
    status.connected !== null &&
    typeof status.connected === 'boolean'
  )
}