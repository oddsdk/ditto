import * as webnative from 'webnative'

import { Visibility } from '$lib/patch'

export const DEFAULT_CATEGORIES = ['all', 'favorites']

export const PRESETS_DIRS = {
  [ Visibility.public ]: webnative.path.directory('public', 'presets'),
  [ Visibility.private ]: webnative.path.directory('private', 'presets'),
}
