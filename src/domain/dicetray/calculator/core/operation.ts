import { Operator, OperatorResult } from './operators'

export type Operation = {
  operator: Operator,
  a: Operand,
  b: Operand
}

export type Operand = Operation | number

export type SolverResult = {
  value: number
  details: Array<OperatorResult>
}

export const createSolver = () => {
  const solve = (op: Operand): SolverResult => {
    if (typeof op === 'number') {
      return {
        value: op,
        details: []
      }
    }
  
    const aResult = solve(op.a)
    const bResult = solve(op.b)
    const opResult = op.operator.f(aResult.value, bResult.value)

    return {
      value: opResult.value,
      details: [...aResult.details, ...bResult.details, opResult]
    }
  }

  return {
    solve
  }
}
