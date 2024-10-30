import { messageBus } from '../events/messageBus'

import { CharacterSheet, RollCheckDetails, RollDiceDetails, RollResult } from '../common/types'
import { rollDice } from '../dicetray/roll'

const checkAttribute = (character: CharacterSheet, attributeName: string, difficulty: number, modifier: number): RollResult | null => {
  const attribute = character.attributes.find((a) => a.name === attributeName)
  if (attribute !== undefined) {
    const successThreshold = attribute.value * difficulty + modifier
    const diceValue = rollDice(100)

    const checkDetails: RollCheckDetails = {
      factors: [
        {
          type: 'base',
          name: attribute.name,
          value: attribute.value
        },
        {
          type: 'multiplier',
          name: 'difficulty',
          value: difficulty
        },
        {
          type: 'offset',
          name: 'modifier',
          value: modifier
        }
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
  
    messageBus.emit('Domain.Aria.check', result)
    return result
  }

  return null
}

const checkAbility = (character: CharacterSheet, abilityName: string, modifier: number): RollResult | null => {
  const ability = character.abilities.find((a) => a.name === abilityName)
  if (ability !== undefined) {
    const successThreshold = ability.value + modifier
    const diceValue = rollDice(100)

    const checkDetails: RollCheckDetails = {
      factors: [
        {
          type: 'base',
          name: ability.name,
          value: ability.value
        },
        {
          type: 'offset',
          name: 'modifier',
          value: modifier
        }
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
  
    messageBus.emit('Domain.Aria.check', result)
    return result
  }

  return null
}

export const engine = {
  checkAttribute,
  checkAbility
}