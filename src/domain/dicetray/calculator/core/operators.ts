import { Operator, InValue, OutValue, OperatorInfo } from './types'
import { rollDice } from '../../roll'

const createOperator = (name: string, symbol: string, compute: (a: number, b: number) => { value: OutValue, extra: Array<InValue> }): Operator => {
  const info: OperatorInfo = {
    name,
    symbol,
    arity: 2
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

export const addition = createOperator('addition', '+', (a, b) => ({ value: a+b, extra: [] }))
export const substraction = createOperator('substraction', '-', (a, b) => ({ value: a-b, extra: [] }))
export const multiplication = createOperator('multiplication', '*', (a, b) => ({ value: a*b, extra: [] }))
export const division = createOperator('division', '/', (a, b) => ({ value: a/b, extra: [] }))

export const exponentiation = createOperator('exponentiation', '^', (a, b) => ({ value: a**b, extra: [] }))
export const modulo = createOperator('modulo', '%', (a, b) => ({ value: a%b, extra: [] }))

export const diceRolls = createOperator('diceRolls', 'd', (a, b) => {
  const rolls = [...Array(a)].map(_ => rollDice(b))
  const total = rolls.reduce((acc, value) => acc + value, 0)

  return {
    value: total,
    extra: rolls,
  }
})

export const lessThan = createOperator('lessThan', '<', (a, b) => ({ value: a<b, extra: [] }))
export const lessThanOrEqualTo = createOperator('lessThanOrEqualTo', '<=', (a, b) => ({ value: a<=b, extra: [] }))
export const greaterThan = createOperator('greaterThan', '>', (a, b) => ({ value: a>b, extra: [] }))
export const greaterThanOrEqualTo = createOperator('greaterThanOrEqualTo', '>=', (a, b) => ({ value: a>=b, extra: [] }))
export const equalTo = createOperator('equalTo', '==', (a, b) => ({ value: a===b, extra: [] }))
export const notEqualTo = createOperator('notEqualTo', '!=', (a, b) => ({ value: a!==b, extra: [] }))
