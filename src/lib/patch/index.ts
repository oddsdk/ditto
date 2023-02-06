import type { Params } from '$lib/audio'

export type Patch = {
  version: string
  id: string
  creator: string
  params: { [Property in keyof Params]: number }
  notes: string
  tags: string[]
  visibility: 'public' | 'private'
}