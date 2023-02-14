import type * as webnative from 'webnative'
import { derived, writable, type Readable, type Writable } from 'svelte/store'

import { DEFAULT_PATCH, type Patch } from '$lib/patch'
import { DEFAULT_CATEGORIES } from '$lib/presets/constants'
import type { Session } from '$lib/auth/session'
import type { Presets } from '$lib/presets'

export const fileSystemStore: Writable<webnative.FileSystem | null> = writable(null)

export const patchStore: Writable<Patch> = writable(DEFAULT_PATCH)

export const presetsStore = writable<Presets>({
  categories: [],
  presets: [],
  selectedCategory: DEFAULT_CATEGORIES[0],
  selectedPatch: DEFAULT_PATCH.id,
})

export const sessionStore: Writable<Session> = writable({
  connectedStatus: false,
  session: null
})

export const programStore: Writable<webnative.Program | null> = writable(null)

export const authStore: Readable<{
  authStrategy: webnative.AuthenticationStrategy | null
  connectedStatus: boolean
  session: webnative.Session | null
}> = derived(
  [ programStore, sessionStore ],
  ([ $program, $session ]) => {
    return {
      authStrategy: $program?.auth ?? null,
      connectedStatus: $session.connectedStatus,
      session: $session.session
    }
  })