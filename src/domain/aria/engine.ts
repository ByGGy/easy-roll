// import { randomUUID } from 'crypto'
import { messageBus } from '../events/messageBus'

import { EntityId } from '../common/types'
import { CharacterSheet } from '../character/characterSheet'

// NB: there is always a difficulty multiplier and a difficulty offset
export type RollCheck = Readonly<{
  characterId: EntityId
  statName: string
  statValue: number
  difficulty?: number
  modifier: number
  value: number
  isSuccess: boolean
}>

const rollDice = (max: number) => Math.round(Math.random() * max)

const checkAttribute = (character: CharacterSheet, attributeName: string, difficulty: number, modifier: number): RollCheck | null => {
  const attribute = character.attributes.find((a) => a.name === attributeName)
  if (attribute !== undefined) {
    const diceValue = rollDice(100)
    const isSuccess = diceValue <= attribute.value * difficulty + modifier
    const rollCheck = {
      characterId: character.id,
      statName: attribute.name,
      statValue: attribute.value,
      difficulty: difficulty,
      modifier,
      value: diceValue,
      isSuccess
    }
  
    messageBus.emit('Domain.Character.check', rollCheck)
    return rollCheck
  }

  return null
}

const checkAbility = (character: CharacterSheet, abilityName: string, modifier: number): RollCheck | null => {
  const ability = character.abilities.find((a) => a.name === abilityName)
  if (ability !== undefined) {
    const diceValue = rollDice(100)
    const isSuccess = diceValue <= ability.value + modifier
    const rollCheck = {
      characterId: character.id,
      statName: ability.name,
      statValue: ability.value,
      modifier,
      value: diceValue,
      isSuccess
    }
  
    messageBus.emit('Domain.Character.check', rollCheck)
    return rollCheck
  }

  return null
}

export const engine = {
  checkAttribute,
  checkAbility
}