import { Operand, IsOperation, InValue, OutValue, OperatorResult } from './types'

export type SolverResult = {
  value: OutValue
  details: Array<OperatorResult>
}

type SolverResultOperand = SolverResult & {
  value: InValue
}

const isSolverResultOperand = (r: SolverResult | null): r is SolverResultOperand => {
  return r !== null && typeof r.value === 'number'
}

export const createSolver = () => {
  const solve = (op: Operand): SolverResult | null => {
    if (!IsOperation(op)) {
      return {
        value: op,
        details: [],
      }
    }
  
    const aResult = solve(op.a)
    const bResult = solve(op.b)

    if (isSolverResultOperand(aResult) && isSolverResultOperand(bResult)) {
      const opResult = op.operator.f(aResult.value, bResult.value)

      return {
        value: opResult.value,
        details: [...aResult.details, ...bResult.details, opResult],
      }
    }

    // console.log(`invalid arguments for "${op.operator.name}": ${JSON.stringify(op.a)}, ${JSON.stringify(op.b)}`)
    return null
  }

  return {
    solve
  }
}
