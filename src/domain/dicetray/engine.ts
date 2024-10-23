import { messageBus } from '../events/messageBus'

import { RollDiceDetails, RollResult } from '../common/types'
import { CharacterSheet } from '../character/characterSheet'
import { rollDice } from './roll'

const rollDices = (character: CharacterSheet, diceFaceQty: number, diceQty: number, modifier: number): RollResult => {
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

export const engine = {
  rollDices,
}