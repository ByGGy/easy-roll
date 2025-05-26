import { messageBus } from '../events/messageBus'

import { RollCheckDetails, RollResult } from '../common/types'
import { CharacterData } from '../character/character'
import { engine as diceTrayEngine } from '../dicetray/engine'

const checkAttribute = (character: CharacterData, attributeName: string, difficulty: number, modifier: number): RollResult | null => {
  const attribute = character.state.attributes.find((a) => a.name === attributeName)
  if (attribute !== undefined) {
    const title = attribute.name

    const successThreshold = attribute.value * difficulty + modifier
    const expression = `1d100<=${successThreshold}`

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

    return diceTrayEngine.evaluateCheck(character, title, checkDetails, expression)
  }

  return null
}

const checkAbility = (character: CharacterData, abilityName: string, modifier: number): RollResult | null => {
  const ability = character.state.abilities.find((a) => a.name === abilityName)
  if (ability !== undefined) {
    const title = ability.name
  
    const successThreshold = ability.value + modifier
    const expression = `1d100<=${successThreshold}`

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

    return diceTrayEngine.evaluateCheck(character, title, checkDetails, expression)
  }

  return null
}

export const engine = {
  checkAttribute,
  checkAbility
}