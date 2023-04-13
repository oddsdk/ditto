import type * as odd from '@oddjs/odd'

export type Session = {
  connectedStatus: boolean
  session: odd.Session | null
}