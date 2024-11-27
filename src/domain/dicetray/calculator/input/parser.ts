import { Operator } from '../core/operators'
import { Operand } from '../core/operation'

export type ParseResult = {
  operand: Operand | null
  errorMessage: string
  helpMessage: string
}

export const create = (supportedOperators: Array<Operator>) => {
  // NB: brackets such as parentheses are not supported atm 
  const atomize = (input: string): Operand => {
    const maybeNumber = Number(input)
    // TODO: should consider empty string to be an invalid expression instead of 0 ?
    if (!isNaN(maybeNumber)) {
      return maybeNumber
    }
  
    const operator = supportedOperators.find(operator => input.indexOf(operator.symbol) !== -1)
    if (operator !== undefined) {
      // NB: operator arity is not supported atm
      // TODO: we should already know the index of the symbol from the "find" above
      const position = input.indexOf(operator.symbol)
      return { operator, a: atomize(input.substring(0, position)), b: atomize(input.substring(position+1, input.length)) }
    }

    throw new Error(`invalid expression at "${input}"`)
  }

  const parse = (input: string): ParseResult => {
    let result = null
    let errorMessage = ''

    try {
      result = atomize(input.trim().replaceAll(' ', ''))      
    } catch (e) {
      console.log(`debug: ${e}`)
      errorMessage = e.toString()
    }

    return {
      operand: result,
      errorMessage,
      helpMessage: `List of supported operators: ${supportedOperators.map(o => o.symbol).join(', ')}`
    }
  }

  return {
    parse, 
  }
}