import { el } from '@elemaudio/core'

import type { Channels, Limits } from '../index.js'

export const limits: Limits = {
  delayTime: { min: 0, max: 1000 },
  feedback: { min: 0, max: 1 },
  mix: { min: 0, max: 1 }
}

export type Options = {
  input: Channels
  delayTime: number
  feedback: number
  mix: number
}

/**
 * @param options processing options
 * @param options.input left and right input channels
 * @param options.delayTime delay time in ms
 * @param options.feedback feedback amount
 * @param options.mix amount wet signal to output
 * @returns original + delayed output
 */
export const process = (options: Options): Channels => {
  const { input, delayTime, feedback, mix } = options

  const delayTimeNode = el.sm(el.const({ key: 'simpleDelay:delayTime', value: delayTime }))
  const feedbackNode = el.sm(el.const({ key: 'simpleDelay:feedback', value: feedback }))
  const mixNode = el.sm(el.const({ key: 'simpleDelay:mix', value: mix }))

  const left = el.add(
    el.mul(input.left, el.sub(1, mixNode)),
    el.mul(
      el.delay({ size: 44100 }, el.ms2samps(delayTimeNode), feedbackNode, input.left),
      mixNode
    )
  )
  const right = el.add(
    el.mul(input.right, el.sub(1, mixNode)),
    el.mul(
      el.delay({ size: 44100 }, el.ms2samps(delayTimeNode), feedbackNode, input.right),
      mixNode
    )
  )

  return { left, right }
}