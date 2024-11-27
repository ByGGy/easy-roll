import { create as createParser } from './input/parser'
import { Operator, addition, substraction, multiplication, division, exponentiation, diceRolls } from './core/operators'
import { createSolver } from './core/operation'

const create = (supportedOperators: Array<Operator>) => {
  const parser = createParser(supportedOperators)
  const solver = createSolver()

  const validate = (expression: string) => {
    return parser.parse(expression)
  }

  const compute = (expression: string) => {
    const result = parser.parse(expression)
    if (result.operand !== null) {
      return solver.solve(result.operand)
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
export const createRPG01 = () => create([addition, substraction, diceRolls])