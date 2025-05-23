import { messageBus } from '../events/messageBus'

import { RollCheckDetails, RollDiceDetails, RollResult } from '../common/types'
import { CharacterData } from '../character/character'
import { rollDice } from '../dicetray/roll'

const checkAttribute = (character: CharacterData, attributeName: string, difficulty: number, modifier: number): RollResult | null => {
  const attribute = character.state.attributes.find((a) => a.name === attributeName)
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
      groups: [{
        diceQty: 1,
        diceFaceQty: 100,
        rolls: [diceValue],
      }],
      total: diceValue
    }
  
    const result: RollResult = {
      characterId: character.id,
      title: attribute.name,
      checkDetails,
      diceDetails
    }
  
    messageBus.emit('Domain.Aria.check', result)
    return result
  }

  return null
}

const checkAbility = (character: CharacterData, abilityName: string, modifier: number): RollResult | null => {
  const ability = character.state.abilities.find((a) => a.name === abilityName)
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
      groups: [{
        diceQty: 1,
        diceFaceQty: 100,
        rolls: [diceValue],
      }],   
      total: diceValue
    }
  
    const result: RollResult = {
      characterId: character.id,
      title: ability.name,
      checkDetails,
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