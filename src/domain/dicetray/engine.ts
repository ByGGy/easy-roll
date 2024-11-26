import { messageBus } from '../events/messageBus'

import { RollDiceDetails, RollResult } from '../common/types'
import { CharacterData } from '../character/character'
import { rollDice } from './roll'
import { createRPG01 } from './calculator/factory'

const rollDices = (character: CharacterData, diceFaceQty: number, diceQty: number, modifier: number): RollResult => {
  const rolls = [...Array(diceQty)].map(_ => rollDice(diceFaceQty))
  const total = rolls.reduce((acc, value) => acc + value, modifier)

  const diceDetails: RollDiceDetails = {
    diceFaceQty,
    diceQty,
    modifier,
    rolls,
    total,
  }

  const result: RollResult = {
    characterId: character.id,
    checkDetails: null,
    diceDetails
  }

  messageBus.emit('Domain.DiceTray.roll', result)
  return result
}

const evaluate = (character: CharacterData, expression: string): RollResult | null => {
  const calculator = createRPG01()
  const total = calculator.compute(expression)
  if (total !== null ) {
    const diceDetails: RollDiceDetails = {
      diceFaceQty: -1,
      diceQty: -1,
      modifier: 0,
      rolls: [],
      total,
    }

    const result: RollResult = {
      characterId: character.id,
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