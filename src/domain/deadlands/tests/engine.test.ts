import { describe, expect, test } from '@jest/globals'
import { RollCheckOutcome, RollCheckQuality } from '../../common/types'
import { evaluateOutcome, evaluateQuality,  } from '../engine'

const evaluate = (baseValue: number, jokerValue: number, totalValue: number, threshold: number): { outcome: RollCheckOutcome, quality: RollCheckQuality } => {
  const outcome = evaluateOutcome(baseValue, jokerValue, totalValue, threshold)
  const quality = evaluateQuality(outcome, baseValue, jokerValue, totalValue, threshold)

  return {
    outcome,
    quality
  }
}

describe('Deadlands module', () => {
  test('checks engine roll evaluator is working correctly', () => {
    // non joker cannot suffer from evil eye
    expect(evaluate(1, 0, 1, 2)).toEqual({ outcome: 'failure', quality: 'normal' })

    // double 1 are always critical failure, no matter the threshold
    expect(evaluate(1, 1, 10, 1)).toEqual({ outcome: 'failure', quality: 'critical' })

    // standard failure
    expect(evaluate(1, 2, 2, 4)).toEqual({ outcome: 'failure', quality: 'normal' })
    
    // check <= threshold
    expect(evaluate(3, 2, 3, 4)).toEqual({ outcome: 'failure', quality: 'normal' })
    expect(evaluate(4, 2, 4, 4)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(5, 2, 5, 4)).toEqual({ outcome: 'success', quality: 'normal' })

    // standard success
    expect(evaluate(7, 2, 7, 4)).toEqual({ outcome: 'success', quality: 'normal' })

    // different success quality depending on the amount of +4
    expect(evaluate(7, 2, 7, 4)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(8, 2, 8, 4)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(11, 2, 11, 4)).toEqual({ outcome: 'success', quality: 'significant' })
    expect(evaluate(12, 2, 12, 4)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(15, 2, 15, 4)).toEqual({ outcome: 'success', quality: 'particular' })
    expect(evaluate(16, 2, 16, 4)).toEqual({ outcome: 'success', quality: 'critical' })
    expect(evaluate(76, 2, 76, 4)).toEqual({ outcome: 'success', quality: 'critical' })
  })
})