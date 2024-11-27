import { describe, expect, test, jest } from '@jest/globals'

import { createRPG01 } from '../factory'

describe('calculator module', () => {
  test('checks RPG01 is working correctly', () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.49)

    const calculator = createRPG01()

    expect(calculator.compute('1d0')?.value).toBe(0)
    expect(calculator.compute('1d1')?.value).toBe(1)
    expect(calculator.compute('1d1-1')?.value).toBe(0)
    expect(calculator.compute('1d1+1d1')?.value).toBe(2)
    expect(calculator.compute('3d1+7d1')?.value).toBe(10)

    expect(calculator.compute('1d100')?.value).toBe(50)
    expect(calculator.compute('3d8+2')?.value).toBe(14)
    expect(calculator.compute('10d100-1d1000')?.value).toBe(9)
    expect(calculator.compute('1d4-2+1d4-2+1d4-2+1d4-2')?.value).toBe(0)

    expect(calculator.compute('3d1d8')?.value).toBe(6)
    
    // TODO: should consider one dice instead of zero in this case ?
    expect(calculator.compute('d8')?.value).toBe(0)
    expect(calculator.compute('3dd8')?.value).toBe(0)

    // TODO: allow to roll "negative" dices and expect -4
    // or should support it like 1d8*-1 instead ?
    expect(calculator.compute('1d-8')?.value).toBe(-8)

    // TODO: followin tests should be supported ?
    expect(calculator.compute('1D4')).toBe(null)
    expect(calculator.compute('1d4*2')).toBe(null)
    expect(calculator.compute('1d100<75')).toBe(null)

    expect(calculator.compute('wtf')).toBe(null)
    expect(calculator.compute('sqrt(100)')).toBe(null)

    jest.spyOn(global.Math, 'random').mockRestore()
  })
})
