import type * as odd from '@oddjs/odd'
import { derived, writable, type Readable, type Writable } from 'svelte/store'

import type { Notification } from '$lib/notifications'
import { DEFAULT_PATCH, type Patch } from '$lib/patch'
import { DEFAULT_CATEGORIES } from '$lib/presets/constants'
import type { Session } from '$lib/auth/session'
import type { Presets } from '$lib/presets'
import type { Views } from '$lib/views'

export const fileSystemStore: Writable<odd.FileSystem | null> = writable(null)

export const notificationStore: Writable<Notification[]> = writable([])

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

export const programStore: Writable<odd.Program | null> = writable(null)

export const authStore: Readable<{
  authStrategy: odd.AuthenticationStrategy | null
  connectedStatus: boolean
  session: odd.Session | null
}> = derived(
  [ programStore, sessionStore ],
  ([ $program, $session ]) => {
    return {
      authStrategy: $program?.auth ?? null,
      connectedStatus: $session.connectedStatus,
      session: $session.session
    }
  })

export const viewStore: Writable<Views> = writable({
  globalView: 'effect',
  presetsView: 'view',
  showShortcuts: false
})
