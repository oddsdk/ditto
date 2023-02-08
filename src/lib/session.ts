import type * as webnative from 'webnative'

export type Session = {
  fileSystem: 'local-only' | 'synced'
  session: webnative.Session | null
  username: string
  // authStrategy: webnative.AuthenticationStrategy | null
  // program: webnative.Program
  // loading: boolean
  // backupCreated: boolean
  // error?: SessionError
}