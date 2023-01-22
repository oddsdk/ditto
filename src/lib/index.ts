import type { NodeRepr_t } from '@elemaudio/core'

export type Channels = { left: NodeRepr_t | number; right: NodeRepr_t | number }

export type Limits = {
  [key: string]: { min: number; max: number }
}

export type Param = {
  label: string
  value: number
  min: number
  max: number
  step: number
  unitLabel: string
  hidden?: boolean
}