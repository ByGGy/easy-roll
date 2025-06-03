import { messageBus } from '../events/messageBus'

import { RollCheckDetails, RollCheckOutcome, RollDiceDetails, RollOutcomeDetails, RollResult } from '../common/types'
import { CharacterData } from '../character/character'
import { rollDice } from './roll'
import { createRPG02 } from './calculator/factory'
import { diceRolls } from './calculator/core/operators'
import { OperatorResult } from './calculator/core/types'

const rollDices = (character: CharacterData, diceFaceQty: number, diceQty: number, modifier: number): RollResult => {
  const rolls = [...Array(diceQty)].map(_ => rollDice(diceFaceQty))
  const total = rolls.reduce((acc, value) => acc + value, modifier)

  const diceDetails: RollDiceDetails = {
    groups: [{
      diceQty,
      diceFaceQty,
      rolls
    }],
    total,
  }

  const outcomeDetails: RollOutcomeDetails = {
    quality: 'normal'
  }

  const result: RollResult = {
    characterId: character.id,
    title: `${diceQty}d${diceFaceQty}${modifier !== 0 ? `${modifier > 0 ? '+' :''}${modifier}` : ''}`,
    outcome: 'value',
    outcomeDetails, 
    diceDetails,
    checkDetails: null,
  }

  messageBus.emit('Domain.DiceTray.roll', result)
  return result
}

const calculator = createRPG02()

const validate = (expression: string): boolean => {
  const result = calculator.validate(expression)
  
  messageBus.emit('Domain.DiceTray.validation', result)
  return result.operand !== null
}

type ComparisonResult = OperatorResult & { value: boolean }
const isComparison = (operatorResult: OperatorResult): operatorResult is ComparisonResult => {
  return typeof operatorResult.value === 'boolean'
}

const findComparison = (operatorResults: Array<OperatorResult>): ComparisonResult | undefined => {
  return operatorResults.filter(isComparison)[0]
}

//TODO: cleanup this mess (should split in evaluateRoll and evaluateCheck ?)
//TODO: "threshold" with < and > operators, but "expectedValue" with == and != ?
const evaluate = (character: CharacterData, expression: string): RollResult | null => {
  const calcResult = calculator.compute(expression)
  if (calcResult !== null ) {
    const rolls = calcResult.details.filter(d => d.operatorInfo.name === diceRolls.name)
    const condition = findComparison(calcResult.details)

    const title = expression
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
        //TODO: a roll against 100 from the diceTray should use the quality evaluator from the current game ?
        evaluateOutcome: (value: number, threshold: number) => condition.value ? 'success' : 'failure',
        evaluateQuality: (outcome: RollCheckOutcome, value: number, threshold: number) => 'normal',
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

    const outcome = checkDetails?.evaluateOutcome(diceDetails.total, checkDetails.successThreshold) ?? 'value'
    const outcomeDetails: RollOutcomeDetails = {
      quality: checkDetails?.evaluateQuality(outcome, diceDetails.total, checkDetails.successThreshold) ?? 'normal'
    }

    const result: RollResult = {
      characterId: character.id,
      title,
      outcome,
      outcomeDetails,
      diceDetails,
      checkDetails,
    }

    messageBus.emit('Domain.DiceTray.roll', result)
    return result
  }

  return null
}

const evaluateCheck = (character: CharacterData, title: string, checkDetails: RollCheckDetails, expression: string): RollResult | null => {
  const calcResult = calculator.compute(expression)
  if (calcResult !== null ) {
    const rolls = calcResult.details.filter(d => d.operatorInfo.name === diceRolls.name)
    const condition = findComparison(calcResult.details)

    const diceDetails: RollDiceDetails = {
      groups: rolls.map(r => (
        {
          diceQty: r.operands[0],
          diceFaceQty: r.operands[1],
          rolls: r.extra,
        })),
      total: condition ? condition.operands[0] : typeof calcResult.value === 'number' ? calcResult.value : NaN
    }

    const outcome = checkDetails.evaluateOutcome(diceDetails.total, checkDetails.successThreshold)
    const outcomeDetails: RollOutcomeDetails = {
      quality: checkDetails.evaluateQuality(outcome, diceDetails.total, checkDetails.successThreshold)
    }

    const result: RollResult = {
      characterId: character.id,
      title,
      outcome,
      outcomeDetails,      
      diceDetails,
      checkDetails,
    }

    messageBus.emit('Domain.DiceTray.roll', result)
    return result
  }

  return null
}

export const engine = {
  rollDices,
  validate,
  evaluate,
  evaluateCheck
}