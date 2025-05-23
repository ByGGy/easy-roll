import { create as createParser } from './input/parser'
import { Operator } from './core/types'
import {
  addition, substraction, multiplication, division, exponentiation, modulo,
  diceRolls,
  lessThan, greaterThan, lessThanOrEqualTo, greaterThanOrEqualTo, equalTo, notEqualTo,
} from './core/operators'
import { createSolver } from './core/operation'

const create = (supportedOperators: Array<Operator>) => {
  const parser = createParser(supportedOperators)
  const solver = createSolver()

  const validate = (expression: string) => {
    // TODO: parser success does not guaranty solver success anymore, e.g. multiple conditional operators
    return parser.parse(expression)
  }

  const compute = (expression: string) => {
    const parserResult = parser.parse(expression)
    if (parserResult.operand !== null) {
      return solver.solve(parserResult.operand)
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

// TODO: support conditional evaluation with operators <, >, <=, >=, !=, == (e.g. 1d100<75, 1d100%2==0)
// TODO: support parentheses to alter priority sequence
// TODO: support variables / references to character property somehow (e.g. 1d100<=force*5+10)
// TODO: look at https://lets-role.com/dice-tester for more ideas ?
export const createRPG01 = () => create([modulo, addition, substraction, multiplication, division, diceRolls])

export const createRPG02 = () => create([
  lessThanOrEqualTo, lessThan, greaterThanOrEqualTo, greaterThan, equalTo, notEqualTo,
  modulo,
  addition, substraction, multiplication, division,
  diceRolls
])
