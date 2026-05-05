import { randomUUID } from 'crypto'
import { messageBus } from '../events/messageBus'

import { DiceActionRequest, DiceTrayRequest, RollCheckDetails, RollDiceDetails, RollOutcomeDetails, RollResult } from '../common/types'
import { CharacterData } from '../character/character'
import { createRPG02 } from './calculator/factory'
import { diceRolls } from './calculator/core/operators'
import { OperatorResult, OutValue } from './calculator/core/types'
import { ExpressionValidationResult } from './calculator/factory'

const calculator = createRPG02()

const validate = (expressions: Array<string>): boolean => {
  let areValid = true

  const result = expressions.reduce((acc, expression) => {
    const r = calculator.validate(expression)
    acc[expression] = r
    areValid = areValid && r.operand !== null
    return acc
  }, {} as Record<string, ExpressionValidationResult>)
  
  messageBus.emit('Domain.DiceTray.validation', result)
  return areValid
}

type ComparisonResult = OperatorResult<boolean>
const isComparison = (operatorResult: OperatorResult<OutValue>): operatorResult is ComparisonResult => {
  return typeof operatorResult.value === 'boolean'
}

const findComparison = (operatorResults: Array<OperatorResult<OutValue>>): ComparisonResult | undefined => {
  return operatorResults.filter(isComparison)[0]
}

// TODO: "threshold" with < and > operators, but "expectedValue" with == and != ?
const evaluate = (name: string, expression: string): Omit<RollResult, 'id' | 'request'> | null => {
  const calcResult = calculator.compute(expression)
  if (calcResult !== null ) {
    const rolls = calcResult.details.filter(d => d.operatorInfo.name === diceRolls.name)
    const condition = findComparison(calcResult.details)

    const title = name
    const checkDetails: RollCheckDetails | null = condition
      ? {
        factors: [
          {
            type: 'base',
            name: expression.split(condition.operatorInfo.symbol)[0],
            value: condition.operands[0]
          },
        ],
        successThreshold: condition.operands[1],
      }
      : null

    const diceDetails: RollDiceDetails = {
      groups: rolls.map(r => (
        {
          diceQty: r.operands[0],
          diceFaceQty: r.operands[1],
          rolls: r.extra,
        })),
      total: condition ? condition.operands[0] : typeof calcResult.value === 'number' ? calcResult.value : NaN
    }

    const outcome = condition ? (condition.value ? 'success' : 'failure') : 'value'
    const outcomeDetails: RollOutcomeDetails = {
      quality: 'normal'
    }

    return {
      title,
      outcome,
      outcomeDetails,
      diceDetails,
      checkDetails,
    }
  }

  return null
}

const checkCustomRoll = (character: CharacterData, request: DiceTrayRequest): RollResult | null => {
  const partialResult = evaluate(request.expression, request.expression)
  if (partialResult !== null) {
    const result: RollResult = {
      id: randomUUID(),
      request,
      ...partialResult
    }

    messageBus.emit('Domain.DiceTray.roll', result)
    return result
  }

  return null
}

const checkAction = (character: CharacterData, request: DiceActionRequest): RollResult | null => {
  const action = character.state.diceActions.find((a) => a.name === request.actionName)
  if (action !== undefined) {
    const partialResult = evaluate(action.name, action.expression)
    if (partialResult !== null) {
      const result: RollResult = {
        id: randomUUID(),
        request,
        ...partialResult
      }

      messageBus.emit('Domain.DiceTray.roll', result)
      return result
    }
  }

  return null
}

export const engine = {
  validate,
  checkCustomRoll,
  checkAction
}