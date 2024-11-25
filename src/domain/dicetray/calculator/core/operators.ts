import { rollDice } from '../../roll'

export type Operator = {
  name: string,
  symbol: string,
  arity: number,
  f: (...operands: Array<number>) => number
}

export const addition: Operator = {
  name: 'addition',
  symbol: '+',
  arity: 2,
  f: (a: number, b: number) => a+b
}

export const substraction: Operator = {
  name: 'substraction',
  symbol: '-',
  arity: 2,
  f: (a: number, b: number) => a-b
}

export const multiplication: Operator = {
  name: 'multiplication',
  symbol: '*',
  arity: 2,
  f: (a: number, b: number) => a*b
}

export const division: Operator = {
  name: 'division',
  symbol: '/',
  arity: 2,
  f: (a: number, b: number) => a/b
}

export const exponentiation: Operator = {
  name: 'exponentiation',
  symbol: '^',
  arity: 2,
  f: (a: number, b: number) => a**b
}

export const diceRolls: Operator = {
  name: 'diceRolls',
  symbol: 'd',
  arity: 2,
  f: (a: number, b: number) => {
      const rolls = [...Array(a)].map(_ => rollDice(b))
      const total = rolls.reduce((acc, value) => acc + value, 0)
      return total
  }
}