import type * as webnative from 'webnative'

export type Session = {
  connectedStatus: boolean
  session: webnative.Session | null
}