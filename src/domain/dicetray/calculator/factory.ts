import { create as createParser } from './input/parser'
import { Operand, Operator } from './core/types'
import {
  addition, substraction, multiplication, division, exponentiation, modulo,
  diceRolls, explodingDiceRolls,
  lessThan, greaterThan, lessThanOrEqualTo, greaterThanOrEqualTo, equalTo, notEqualTo,
} from './core/operators'
import { createSolver } from './core/operation'

export type ExpressionValidationResult = {
  operand: Operand | null
  errorMessage: string
  helpMessage: string
}

const create = (supportedOperators: Array<Operator>) => {
  const parser = createParser(supportedOperators)
  const solver = createSolver()

  const validate = (expression: string): ExpressionValidationResult => {
    let maybeOperand: Operand | null = null
    let errorMessage = ''

    try {
      maybeOperand = parser.parse(expression)
      solver.validate(maybeOperand)
    } catch (e) {
      console.log(`debug: ${e}`)
      maybeOperand = null
      errorMessage = e.message
    }

    return {
      operand: maybeOperand,
      errorMessage,
      helpMessage: `List of supported operators: ${supportedOperators.map(o => o.symbol).join(', ')}`
    }
  }

  const compute = (expression: string) => {
    try {
      const maybeOperand = parser.parse(expression)
      return solver.solve(maybeOperand)
    } catch (e) {
      console.log(`debug: ${e}`)
    }

    return null
  }
  
  return {
    validate,
    compute,
  }
}

// NB: operator order is important: e.g. for BM01, this guaranty that multiplication and division will be evaluated first
export const createBasic = () => create([addition, substraction])
export const createBM01 = () => create([addition, substraction, multiplication, division, exponentiation])

// TODO: support parentheses to alter priority sequence
// TODO: support variables / references to character property somehow (e.g. 1d100<=force*5+10)
// TODO: look at https://lets-role.com/dice-tester for more ideas ?
export const createRPG01 = () => create([modulo, addition, substraction, multiplication, division, diceRolls])

export const createRPG02 = () => create([
  lessThanOrEqualTo, lessThan, greaterThanOrEqualTo, greaterThan, equalTo, notEqualTo,
  modulo,
  addition, substraction, multiplication, division,
  explodingDiceRolls, diceRolls
])
