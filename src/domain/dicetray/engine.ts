import { messageBus } from '../events/messageBus'

import { RollDiceDetails, RollResult } from '../common/types'
import { CharacterData } from '../character/character'
import { rollDice } from './roll'
import { createRPG01 } from './calculator/factory'
import { diceRolls } from './calculator/core/operators'

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

  const result: RollResult = {
    characterId: character.id,
    title: `${diceQty}d${diceFaceQty}${modifier !== 0 ? `${modifier > 0 ? '+' :''}${modifier}` : ''}`,
    checkDetails: null,
    diceDetails
  }

  messageBus.emit('Domain.DiceTray.roll', result)
  return result
}

const evaluate = (character: CharacterData, expression: string): RollResult | null => {
  const calculator = createRPG01()
  const calcResult = calculator.compute(expression)
  if (calcResult !== null ) {
    const rolls = calcResult.details.filter(d => d.name.includes(diceRolls.name))
    const diceDetails: RollDiceDetails = {
      groups: rolls.map(r => (
        {
          diceQty: r.operands[0],
          diceFaceQty: r.operands[1],
          rolls: r.extra,
        })),
      total: calcResult.value
    }

    const result: RollResult = {
      characterId: character.id,
      title: expression,
      checkDetails: null,
      diceDetails
    }

    messageBus.emit('Domain.DiceTray.roll', result)
    return result
  }

  return null
}

export const engine = {
  rollDices,
  evaluate,
}