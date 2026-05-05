import { Operand, IsOperation, InValue, OutValue, OperatorResult, Operator } from './types'

export type SolverResult = {
  value: OutValue
  details: Array<OperatorResult<OutValue>>
}

type SolverResultOperand = SolverResult & {
  value: InValue
}

const isSolverResultOperand = (r: SolverResult | null): r is SolverResultOperand => {
  return r !== null && typeof r.value === 'number'
}

export const createSolver = () => {
  const validate = (op: Operand) => {
    const count = (operand: Operand, predicate: (operator: Operator) => boolean): number => {
      if (IsOperation(operand)) {
        return (predicate(operand.operator) ? 1 : 0) + count(operand.a, predicate) + count(operand.b, predicate)
      }

      return 0
    }

    const qty = count(op, (o: Operator) => o.category === 'comparative')
    if (qty > 1) {
      throw new Error(`Too many comparative operators (${qty} found)`)
    }
  }

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

    throw new Error(`invalid arguments for "${op.operator.name}": ${JSON.stringify(op.a)}, ${JSON.stringify(op.b)}`)
  }

  return {
    validate,
    solve
  }
}
