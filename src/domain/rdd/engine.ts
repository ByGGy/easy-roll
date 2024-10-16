import { messageBus } from '../events/messageBus'

import { EntityId } from '../common/types'
import { CharacterSheet } from '../character/characterSheet'
import { rollDice } from '../dice/roll'

// modifiers from -10 to +7
const thresholdLUT: Record<number, Array<number>> = {
  '6': [1, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51],
  '7': [1, 3, 7, 10, 14, 17, 21, 24, 28, 31, 35, 38, 42, 45, 49, 52, 56, 59],
  '8': [2, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68],
  '9': [2, 4, 9, 13, 18, 22, 27, 31, 36, 40, 45, 49, 54, 58, 63, 67, 72, 76],
  '10': [2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85],
  '11': [2, 5, 11, 16, 22, 27, 33, 38, 44, 49, 55, 60, 66, 71, 77, 82, 88, 93],
  '12': [3, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102],
  '13': [3, 6, 13, 19, 26, 32, 39, 45, 52, 58, 65, 71, 78, 84, 91, 97, 104, 110],
  '14': [3, 7, 14, 21, 28, 35, 42, 49, 56, 63, 70, 77, 84, 91, 98, 105, 112, 119],
  '15': [3, 7, 15, 22, 30, 37, 45, 52, 60, 67, 75, 82, 90, 97, 105, 112, 120, 127],
  '16': [4, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 128, 136],
  '17': [4, 8, 17, 25, 34, 42, 51, 59, 68, 76, 85, 93, 102, 110, 119, 127, 136, 144],
  '18': [4, 9, 18, 27, 36, 45, 54, 63, 72, 81, 90, 99, 108, 117, 126, 135, 144, 153],
  '19': [4, 9, 19, 28, 38, 47, 57, 66, 76, 85, 95, 104, 114, 123, 133, 142, 152, 161],
  '20': [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170]
}

const findThreshold = (attributeValue: number, modifier: number): number | null => {
  const line = thresholdLUT[attributeValue]
  if (line !== undefined) {
    const value = line[modifier +10]
    if (value !== undefined) {
      return value
    }
  }

  return null
}

export type RollCheck = Readonly<{
  characterId: EntityId
  attributeName: string
  attributeValue: number
  abilityName?: string
  abilityValue?: number
  modifier: number
  threshold: number | null
  value: number
  isSuccess: boolean
}>

const checkAttribute = (character: CharacterSheet, attributeName: string, abilityName: string, modifier: number): RollCheck | null => {
  const attribute = character.attributes.find((a) => a.name === attributeName)
  if (attribute !== undefined) {
    const ability = character.abilities.find((a) => a.name === abilityName)
    const threshold = findThreshold(attribute.value, (ability !== undefined ? ability.value : 0) + modifier)
    const diceValue = rollDice(100)
    const isSuccess = threshold !== null && diceValue <= threshold
    const rollCheck = {
      characterId: character.id,
      attributeName: attribute.name,
      attributeValue: attribute.value,
      abilityName: ability?.name,
      abilityValue: ability?.value,
      modifier,
      threshold,
      value: diceValue,
      isSuccess
    }
  
    messageBus.emit('Domain.Rdd.check', rollCheck)
    return rollCheck
  }

  return null
}

export const engine = {
  checkAttribute,
}