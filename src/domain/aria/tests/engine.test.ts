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

describe('Aria module', () => {
  test('checks engine roll evaluator is working correctly', () => {
    // 1-5 are always critical success, no matter the threshold
    expect(evaluate(1, 1)).toEqual({ outcome: 'success', quality: 'critical' })
    expect(evaluate(2, 1)).toEqual({ outcome: 'success', quality: 'critical' })
    expect(evaluate(3, 1)).toEqual({ outcome: 'success', quality: 'critical' })
    expect(evaluate(4, 1)).toEqual({ outcome: 'success', quality: 'critical' })
    expect(evaluate(5, 1)).toEqual({ outcome: 'success', quality: 'critical' })

    // standard failure
    expect(evaluate(6, 1)).toEqual({ outcome: 'failure', quality: 'normal' })
    
    // check <= threshold
    expect(evaluate(6, 5)).toEqual({ outcome: 'failure', quality: 'normal' })
    expect(evaluate(6, 6)).toEqual({ outcome: 'success', quality: 'normal' })
    expect(evaluate(95, 94)).toEqual({ outcome: 'failure', quality: 'normal' })
    expect(evaluate(95, 95)).toEqual({ outcome: 'success', quality: 'normal' })

    // standard success
    expect(evaluate(95, 100)).toEqual({ outcome: 'success', quality: 'normal' })

    // 96-100 are always critical failure, no matter the threshold
    expect(evaluate(96, 100)).toEqual({ outcome: 'failure', quality: 'critical' })
    expect(evaluate(97, 100)).toEqual({ outcome: 'failure', quality: 'critical' })
    expect(evaluate(98, 100)).toEqual({ outcome: 'failure', quality: 'critical' })
    expect(evaluate(99, 100)).toEqual({ outcome: 'failure', quality: 'critical' })
    expect(evaluate(100, 100)).toEqual({ outcome: 'failure', quality: 'critical' })
  })
})