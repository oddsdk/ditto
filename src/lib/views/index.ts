type GlobalView = 'connect' | 'effect' | 'presets'
type PresetsView = 'add' | 'edit' | 'view'

export type Views = {
  globalView: GlobalView
  presetsView: PresetsView
  showShortcuts: boolean
}

