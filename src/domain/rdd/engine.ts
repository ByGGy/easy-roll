import { messageBus } from '../events/messageBus'

import { CharacterSheet, RollCheckDetails, RollDiceDetails, RollResult } from '../common/types'
import { rollDice } from '../dicetray/roll'

const findThreshold = (attributeValue: number, modifier: number): number => {
  // cf manual rules p16
  const multiplier = modifier >= -8 ? 1 + (modifier +8) * 0.5 : 1 / (2 * Math.abs(modifier +8))
  return Math.floor(attributeValue * multiplier)
}

const checkAttribute = (character: CharacterSheet, attributeName: string, abilityName: string, modifier: number): RollResult | null => {
  const attribute = character.attributes.find((a) => a.name === attributeName)
  if (attribute !== undefined) {
    const ability = character.abilities.find((a) => a.name === abilityName)
    const successThreshold = findThreshold(attribute.value, (ability !== undefined ? ability.value : 0) + modifier)
    const diceValue = rollDice(100)

    const checkDetails: RollCheckDetails = {
      factors: [
        {
          type: 'base',
          name: attribute.name,
          value: attribute.value
        },
        ...(ability !== undefined ? [{
          type: 'base' as const, // TODO: should be an offset ?
          name: ability.name,
          value: ability.value
        }] : []),
        {
          type: 'offset',
          name: 'difficulty',
          value: modifier
        },
      ],
      successThreshold
    }

    const diceDetails: RollDiceDetails = {
      diceFaceQty: 100,
      diceQty: 1,
      modifier: 0,
      rolls: [diceValue],
      total: diceValue
    }
  
    const result: RollResult = {
      characterId: character.id,
      checkDetails: checkDetails,
      diceDetails
    }
  
    messageBus.emit('Domain.Rdd.check', result)
    return result
  }

  return null
}

export const engine = {
  checkAttribute,
}