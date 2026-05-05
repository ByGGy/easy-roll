import { InValue, OperatorInfo, ArithmeticOperator, ComparativeOperator } from './types'
import { rollDice } from '../../roll'

const createArithmeticOperator = (name: string, symbol: string, compute: (a: number, b: number) => { value: number, extra: Array<InValue> }): ArithmeticOperator => {
  const info: OperatorInfo = {
    name,
    symbol,
    arity: 2,
    category: 'arithmetic'
  }

  return {
    ...info,
    f: (a: number, b: number) => {
      const result = compute(a, b)
      return {
        operatorInfo: info,
        operands: [a, b],
        value: result.value,
        extra: result.extra
      }
    }
  }
}

const createComparativeOperator = (name: string, symbol: string, compute: (a: number, b: number) => { value: boolean, extra: Array<InValue> }): ComparativeOperator => {
  const info: OperatorInfo = {
    name,
    symbol,
    arity: 2,
    category: 'comparative'
  }

  return {
    ...info,
    f: (a: number, b: number) => {
      const result = compute(a, b)
      return {
        operatorInfo: info,
        operands: [a, b],
        value: result.value,
        extra: result.extra
      }
    }
  }
}

export const addition = createArithmeticOperator('addition', '+', (a, b) => ({ value: a+b, extra: [] }))
export const substraction = createArithmeticOperator('substraction', '-', (a, b) => ({ value: a-b, extra: [] }))
export const multiplication = createArithmeticOperator('multiplication', '*', (a, b) => ({ value: a*b, extra: [] }))
export const division = createArithmeticOperator('division', '/', (a, b) => ({ value: a/b, extra: [] }))

export const exponentiation = createArithmeticOperator('exponentiation', '^', (a, b) => ({ value: a**b, extra: [] }))
export const modulo = createArithmeticOperator('modulo', '%', (a, b) => ({ value: a%b, extra: [] }))

export const diceRolls = createArithmeticOperator('diceRolls', 'd', (a, b) => {
  const rolls = [...Array(a)].map(_ => rollDice(b))
  const total = rolls.reduce((acc, value) => acc + value, 0)

  return {
    value: total,
    extra: rolls,
  }
})

export const lessThan = createComparativeOperator('lessThan', '<', (a, b) => ({ value: a<b, extra: [] }))
export const lessThanOrEqualTo = createComparativeOperator('lessThanOrEqualTo', '<=', (a, b) => ({ value: a<=b, extra: [] }))
export const greaterThan = createComparativeOperator('greaterThan', '>', (a, b) => ({ value: a>b, extra: [] }))
export const greaterThanOrEqualTo = createComparativeOperator('greaterThanOrEqualTo', '>=', (a, b) => ({ value: a>=b, extra: [] }))
export const equalTo = createComparativeOperator('equalTo', '==', (a, b) => ({ value: a===b, extra: [] }))
export const notEqualTo = createComparativeOperator('notEqualTo', '!=', (a, b) => ({ value: a!==b, extra: [] }))
