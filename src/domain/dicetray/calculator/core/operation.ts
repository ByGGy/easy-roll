import { Operator } from './operators'

export type Operation = {
  operator: Operator,
  a: Operand,
  b: Operand
}

export type Operand = Operation | number

export const createSolver = () => {
  const solve = (op: Operand): number => {
    if (typeof op === 'number') {
      return op
    }
  
    return op.operator.f(solve(op.a), solve(op.b))
  }

  return {
    solve
  }
}
