import { version } from '../../../package.json'
import type { Params } from '$lib/audio'

export enum Visibility {
  public,
  private,
}

export type Patch = {
  version: string
  id: string
  creator: string
  favorite: boolean
  params: { [Property in keyof Params]: number }
  name: string
  notes: string
  tags: string[]
  visibility: Visibility
}

export const DEFAULT_PATCH = {
  version,
  id: 'default',
  creator: 'bgins',
  favorite: false,
  name: 'Default',
  notes: '',
  params: {
    delayTime: 200,
    feedback: 0,
    mix: 50
  },
  tags: [],
  visibility: Visibility.public,
}
