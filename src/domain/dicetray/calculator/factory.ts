import { create as createParser } from './input/parser'
import { Operator, addition, substraction, multiplication, division, exponentiation, diceRolls } from './core/operators'
import { createSolver } from './core/operation'

const create = (supportedOperators: Array<Operator>) => {
  const parser = createParser(supportedOperators)
  const solver = createSolver()

  // TODO: how could we get the list of roll results ?
  const compute = (expression: string) => {
    const operand = parser.parse(expression)
    if (operand !== null) {
      return solver.solve(operand)
    }

    return null
  }
  
  return {
    // TODO: add something to check that an expression is valid before tryin to compute it ? (UI validation)
    compute,
  }
}

// NB: operator order is important: this guaranty that multiplication and division will be evaluated first
export const createBasic = () => create([addition, substraction])
export const createBM01 = () => create([addition, substraction, multiplication, division, exponentiation])
export const createRPG01 = () => create([addition, substraction, diceRolls])