import * as webnative from 'webnative'
import type { Auth, Components } from 'webnative/components'
import type { Configuration } from 'webnative'

import { asyncDebounce } from '$lib/utils'

export async function implementation(configuration: Configuration): Promise<Auth.Implementation<Components>> {
  const base = await webnative.auth.fissionWebCrypto(configuration)

  return {
    ...base,
    isUsernameAvailable: asyncDebounce(base.isUsernameAvailable, 300)
  }
}