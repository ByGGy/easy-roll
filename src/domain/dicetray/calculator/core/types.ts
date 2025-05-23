export type InValue = number
export type OutValue = number | boolean

export type OperatorResult = {
  operatorInfo: OperatorInfo
  operands: Array<InValue>
  value: OutValue
  extra: Array<InValue>
}

export type OperatorInfo = {
  name: string
  symbol: string
  arity: number
}

export type Operator = OperatorInfo & {
  f: (...operands: Array<InValue>) => OperatorResult
}

export type Operation = {
  operator: Operator
  a: Operand
  b: Operand
}

export type Operand = Operation | InValue

export const IsOperation = (operand: Operand): operand is Operation => {
  return (operand as Operation).operator  !== undefined
}
