import { messageBus } from '../events/messageBus'

import { EntityId } from '../common/types'
import { CharacterSheet } from '../character/characterSheet'
import { rollDice } from './roll'

export type DiceTrayRoll = Readonly<{
  characterId: EntityId
  diceFaceQty: number
  diceQty: number
  modifier: number
  rolls: Array<number>
  total: number
}>

const rollDices = (character: CharacterSheet, diceFaceQty: number, diceQty: number, modifier: number): DiceTrayRoll => {
  const rolls = [...Array(diceQty)].map(_ => rollDice(diceFaceQty))
  const total = rolls.reduce((acc, value) => acc + value, modifier)
  const roll = {
    characterId: character.id,
    diceFaceQty,
    diceQty,
    modifier,
    rolls,
    total,
  }

  messageBus.emit('Domain.DiceTray.roll', roll)
  return roll
}

export const engine = {
  rollDices,
}