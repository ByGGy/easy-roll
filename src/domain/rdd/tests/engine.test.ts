import { describe, expect, test } from '@jest/globals'
import { RollCheckOutcome, RollCheckQuality } from '../../common/types'
import { evaluateOutcome, evaluateQuality,  } from '../engine'

const evaluate = (value: number, threshold: number): { outcome: RollCheckOutcome, quality: RollCheckQuality } => {
  const outcome = evaluateOutcome(value, threshold)
  const quality = evaluateQuality(outcome, value, threshold)

  return {
    outcome,
    quality
  }
}

describe('RDD module', () => {
  test('checks engine roll evaluator is working correctly', () => {
    // 5 --
    expect(evaluate(1, 5)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(1, 5)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(2, 5)).toEqual({ outcome: 'success', quality: 'significant' })

    expect(evaluate(2, 5)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(2, 5)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(3, 5)).toEqual({ outcome: 'success', quality: 'normal' })

    expect(evaluate(4, 5)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(5, 5)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(6, 5)).toEqual({ outcome: 'failure', quality: 'normal' })

    expect(evaluate(80, 5)).toEqual({ outcome: 'failure', quality: 'normal' })
    expect(evaluate(81, 5)).toEqual({ outcome: 'failure', quality: 'particular' })
    expect(evaluate(82, 5)).toEqual({ outcome: 'failure', quality: 'particular' })

    expect(evaluate(91, 5)).toEqual({ outcome: 'failure', quality: 'particular' })
    expect(evaluate(92, 5)).toEqual({ outcome: 'failure', quality: 'critical' })
    expect(evaluate(93, 5)).toEqual({ outcome: 'failure', quality: 'critical' })

    // 21 --
    expect(evaluate(4, 21)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(5, 21)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(6, 21)).toEqual({ outcome: 'success', quality: 'significant' })

    expect(evaluate(9, 21)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(10, 21)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(11, 21)).toEqual({ outcome: 'success', quality: 'normal' })

    expect(evaluate(20, 21)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(21, 21)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(22, 21)).toEqual({ outcome: 'failure', quality: 'normal' })

    expect(evaluate(84, 21)).toEqual({ outcome: 'failure', quality: 'normal' })
    expect(evaluate(85, 21)).toEqual({ outcome: 'failure', quality: 'particular' })
    expect(evaluate(86, 21)).toEqual({ outcome: 'failure', quality: 'particular' })

    expect(evaluate(93, 21)).toEqual({ outcome: 'failure', quality: 'particular' })
    expect(evaluate(94, 21)).toEqual({ outcome: 'failure', quality: 'critical' })
    expect(evaluate(95, 21)).toEqual({ outcome: 'failure', quality: 'critical' })

    // 25 --
    expect(evaluate(4, 25)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(5, 25)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(6, 25)).toEqual({ outcome: 'success', quality: 'significant' })

    expect(evaluate(11, 25)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(12, 25)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(13, 25)).toEqual({ outcome: 'success', quality: 'normal' })

    expect(evaluate(24, 25)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(25, 25)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(26, 25)).toEqual({ outcome: 'failure', quality: 'normal' })

    expect(evaluate(84, 25)).toEqual({ outcome: 'failure', quality: 'normal' })
    expect(evaluate(85, 25)).toEqual({ outcome: 'failure', quality: 'particular' })
    expect(evaluate(86, 25)).toEqual({ outcome: 'failure', quality: 'particular' })

    expect(evaluate(93, 25)).toEqual({ outcome: 'failure', quality: 'particular' })
    expect(evaluate(94, 25)).toEqual({ outcome: 'failure', quality: 'critical' })
    expect(evaluate(95, 25)).toEqual({ outcome: 'failure', quality: 'critical' })

    // 46 --
    expect(evaluate(9, 46)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(10, 46)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(11, 46)).toEqual({ outcome: 'success', quality: 'significant' })

    expect(evaluate(22, 46)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(23, 46)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(24, 46)).toEqual({ outcome: 'success', quality: 'normal' })

    expect(evaluate(45, 46)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(46, 46)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(47, 46)).toEqual({ outcome: 'failure', quality: 'normal' })

    expect(evaluate(89, 46)).toEqual({ outcome: 'failure', quality: 'normal' })
    expect(evaluate(90, 46)).toEqual({ outcome: 'failure', quality: 'particular' })
    expect(evaluate(91, 46)).toEqual({ outcome: 'failure', quality: 'particular' })

    expect(evaluate(95, 46)).toEqual({ outcome: 'failure', quality: 'particular' })
    expect(evaluate(96, 46)).toEqual({ outcome: 'failure', quality: 'critical' })
    expect(evaluate(97, 46)).toEqual({ outcome: 'failure', quality: 'critical' })
   
    // 50 --
    expect(evaluate(9, 50)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(10, 50)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(11, 50)).toEqual({ outcome: 'success', quality: 'significant' })

    expect(evaluate(24, 50)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(25, 50)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(26, 50)).toEqual({ outcome: 'success', quality: 'normal' })

    expect(evaluate(49, 50)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(50, 50)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(51, 50)).toEqual({ outcome: 'failure', quality: 'normal' })

    expect(evaluate(89, 50)).toEqual({ outcome: 'failure', quality: 'normal' })
    expect(evaluate(90, 50)).toEqual({ outcome: 'failure', quality: 'particular' })
    expect(evaluate(91, 50)).toEqual({ outcome: 'failure', quality: 'particular' })

    expect(evaluate(95, 50)).toEqual({ outcome: 'failure', quality: 'particular' })
    expect(evaluate(96, 50)).toEqual({ outcome: 'failure', quality: 'critical' })
    expect(evaluate(97, 50)).toEqual({ outcome: 'failure', quality: 'critical' })

    // 76 --
    expect(evaluate(15, 76)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(16, 76)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(17, 76)).toEqual({ outcome: 'success', quality: 'significant' })

    expect(evaluate(37, 76)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(38, 76)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(39, 76)).toEqual({ outcome: 'success', quality: 'normal' })

    expect(evaluate(75, 76)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(76, 76)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(77, 76)).toEqual({ outcome: 'failure', quality: 'normal' })

    expect(evaluate(95, 76)).toEqual({ outcome: 'failure', quality: 'normal' })
    expect(evaluate(96, 76)).toEqual({ outcome: 'failure', quality: 'particular' })
    expect(evaluate(97, 76)).toEqual({ outcome: 'failure', quality: 'particular' })

    expect(evaluate(98, 76)).toEqual({ outcome: 'failure', quality: 'particular' })
    expect(evaluate(99, 76)).toEqual({ outcome: 'failure', quality: 'critical' })
    expect(evaluate(100, 76)).toEqual({ outcome: 'failure', quality: 'critical' })

    // 91 --
    expect(evaluate(18, 91)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(19, 91)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(20, 91)).toEqual({ outcome: 'success', quality: 'significant' })

    expect(evaluate(44, 91)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(45, 91)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(46, 91)).toEqual({ outcome: 'success', quality: 'normal' })

    expect(evaluate(90, 91)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(91, 91)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(92, 91)).toEqual({ outcome: 'failure', quality: 'normal' })

    expect(evaluate(98, 91)).toEqual({ outcome: 'failure', quality: 'normal' })
    expect(evaluate(99, 91)).toEqual({ outcome: 'failure', quality: 'particular' })
    expect(evaluate(99, 91)).toEqual({ outcome: 'failure', quality: 'particular' })

    expect(evaluate(99, 91)).toEqual({ outcome: 'failure', quality: 'particular' })
    expect(evaluate(100, 91)).toEqual({ outcome: 'failure', quality: 'critical' })
    expect(evaluate(100, 91)).toEqual({ outcome: 'failure', quality: 'critical' })

    // 99 --
    expect(evaluate(19, 99)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(20, 99)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(21, 99)).toEqual({ outcome: 'success', quality: 'significant' })

    expect(evaluate(48, 99)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(49, 99)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(50, 99)).toEqual({ outcome: 'success', quality: 'normal' })

    expect(evaluate(98, 99)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(99, 99)).toEqual({ outcome: 'success', quality: 'normal' })

    expect(evaluate(100, 99)).toEqual({ outcome: 'failure', quality: 'critical' })

    // 100 --
    expect(evaluate(19, 100)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(20, 100)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(21, 100)).toEqual({ outcome: 'success', quality: 'significant' })

    expect(evaluate(49, 100)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(50, 100)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(51, 100)).toEqual({ outcome: 'success', quality: 'normal' })

    expect(evaluate(99, 100)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(100, 100)).toEqual({ outcome: 'failure', quality: 'critical' })

    // 105 --
    expect(evaluate(20, 105)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(21, 105)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(22, 105)).toEqual({ outcome: 'success', quality: 'significant' })

    expect(evaluate(51, 105)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(52, 105)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(53, 105)).toEqual({ outcome: 'success', quality: 'normal' })

    expect(evaluate(99, 105)).toEqual({ outcome: 'success', quality: 'normal' })

    expect(evaluate(100, 105)).toEqual({ outcome: 'failure', quality: 'normal' })
  })
})