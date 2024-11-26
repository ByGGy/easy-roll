import { Operator } from '../core/operators'
import { Operand } from '../core/operation'

export const create = (supportedOperators: Array<Operator>) => {
  // NB: brackets such as parentheses are not supported atm 
  const atomize = (input: string): Operand => {
    const maybeNumber = Number(input)
    // TODO: should consider empty string to be an invalid expression instead of 0 ?
    if (!isNaN(maybeNumber)) {
      console.log(`tryin to parse number ${input}`)
      return maybeNumber
    }
  
    const operator = supportedOperators.find(operator => input.indexOf(operator.symbol) !== -1)
    if (operator !== undefined) {
        // NB: operator arity is not supported atm
        // TODO: we should already know the index of the symbol from the "find" above
        const position = input.indexOf(operator.symbol)
        console.log(`found operator ${operator.symbol}, splitting ${input} at p${position}`)
        return { operator, a: atomize(input.substring(0, position)), b: atomize(input.substring(position+1, input.length)) }
    }

    throw new Error(`invalid expression in "${input}"`)
  }

  const parse = (input: string): Operand | null => {
    let result = null
    try {
      result = atomize(input.trim().replaceAll(' ', ''))      
    } catch (e) {
      console.log(`debug: ${e}`)
    }

    return result
  }

  return {
    parse, 
  }
}