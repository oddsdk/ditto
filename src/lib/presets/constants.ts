import * as odd from '@oddjs/odd'

import { Visibility } from '$lib/patch'

export const DEFAULT_CATEGORIES = ['all', 'favorites']

export const PRESETS_DIRS = {
  [ Visibility.public ]: odd.path.directory('public', 'presets'),
  [ Visibility.private ]: odd.path.directory('private', 'presets'),
}
