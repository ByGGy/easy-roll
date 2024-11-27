import { rollDice } from '../../roll'

export type OperatorResult = {
  name: string
  operands: Array<number>
  value: number
  extra: Array<number>
}

export type Operator = {
  name: string
  symbol: string
  arity: number
  f: (...operands: Array<number>) => OperatorResult
}

export const addition: Operator = {
  name: 'addition',
  symbol: '+',
  arity: 2,
  f: (a: number, b: number) => {
    // TODO: name and operands should be automatically derived from the function call somehow
    return {
      name: 'addition',
      operands: [a, b],
      value: a+b,
      extra: [],
    }
  }
}

export const substraction: Operator = {
  name: 'substraction',
  symbol: '-',
  arity: 2,
  f: (a: number, b: number) => {
    return {
      name: 'substraction',
      operands: [a, b],
      value: a-b,
      extra: [],
    }
  }
}

export const multiplication: Operator = {
  name: 'multiplication',
  symbol: '*',
  arity: 2,
  f: (a: number, b: number) => {
    return {
      name: 'multiplication',
      operands: [a, b],
      value: a*b,
      extra: [],
    }
  }
}

export const division: Operator = {
  name: 'division',
  symbol: '/',
  arity: 2,
  f: (a: number, b: number) => {
    return {
      name: 'division',
      operands: [a, b],
      value: a/b,
      extra: [],
    }
  }
}

export const exponentiation: Operator = {
  name: 'exponentiation',
  symbol: '^',
  arity: 2,
  f: (a: number, b: number) => {
    return {
      name: 'exponentiation',
      operands: [a, b],
      value: a**b,
      extra: [],
    }
  }
}

export const diceRolls: Operator = {
  name: 'diceRolls',
  symbol: 'd',
  arity: 2,
  f: (a: number, b: number) => {
    const rolls = [...Array(a)].map(_ => rollDice(b))
    const total = rolls.reduce((acc, value) => acc + value, 0)

    return {
      name: 'diceRolls',
      operands: [a, b],
      value: total,
      extra: rolls,
    }
  }
}