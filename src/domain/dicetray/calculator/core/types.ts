export type InValue = number
export type Category = 'arithmetic' | 'comparative' | 'diceRoll'

export type OperatorInfo = {
  name: string
  symbol: string
  arity: number
  category: Category
}

export type OperatorResult<TOutValue> = {
  operatorInfo: OperatorInfo
  operands: Array<InValue>
  value: TOutValue
  extra: Array<InValue>
}

export type BaseOperator<TOutValue> = OperatorInfo & {
  f: (...operands: Array<InValue>) => OperatorResult<TOutValue>
}

export type ArithmeticOperator = BaseOperator<number>
export type ComparativeOperator = BaseOperator<boolean>
export type DiceRollOperator = BaseOperator<number>
export type Operator = ArithmeticOperator | ComparativeOperator | DiceRollOperator

export type OutValue = ReturnType<Operator['f']>['value']

export type Operation = {
  operator: Operator
  a: Operand
  b: Operand
}

export type Operand = Operation | InValue

export const IsOperation = (operand: Operand): operand is Operation => {
  return (operand as Operation).operator  !== undefined
}
