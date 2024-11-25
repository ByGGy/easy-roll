import { Operator } from '../core/operators'
import { Operand } from '../core/operation'

const templateNumber = `(\\d+[.|,]?\\d*)(.*)`
const isNumber = (input: string) => {
    const regResult = input.match(templateNumber)
    // NB: ugly, mais çà fonctionne
    return regResult && regResult.length === 3 && regResult[2] === ''
}

export const create = (supportedOperators: Array<Operator>) => {
  // NB: brackets such as parentheses are not supported atm 
  const atomize = (input: string): Operand => {
      if (isNumber(input)) {
          return parseFloat(input)
      }
  
      const operator = supportedOperators.find(operator => input.indexOf(operator.symbol) !== -1)
      if (operator !== undefined) {
          // NB: operator arity is not supported atm
          // TODO: we should already know the index of the symbol from the "find" above
          const position = input.indexOf(operator.symbol)
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