import { messageBus } from '../events/messageBus'

import { RollCheckDetails, RollCheckOutcome, RollCheckQuality, RollResult } from '../common/types'
import { CharacterData } from '../character/character'
import { engine as diceTrayEngine } from '../dicetray/engine'

export const evaluateOutcome = (value: number, threshold: number): RollCheckOutcome => {
  if (value === 100) {
      return 'failure'
  }

  return value <= threshold ? 'success' : 'failure'   
}

export const evaluateQuality = (outcome: 'success' | 'failure', value: number, threshold: number): RollCheckQuality => {
  if (threshold <= 100 || outcome === 'success') {
    if (value <= Math.ceil(threshold / 5)) {
      return 'particular'
    }

    if (value <= Math.floor(threshold / 2)) {
      return 'significant'
    }

    if (value >= Math.min(Math.floor(((threshold -1) / 5) /2) + 92, 100)) {
      return 'critical'
    }

    if (value >= Math.ceil(100 - (100 - threshold) / 5)) {
      return 'particular'
    }
  }

  return 'normal'
}

const findThreshold = (attributeValue: number, modifier: number): number => {
  // cf manual rules p16
  const multiplier = modifier >= -8 ? 1 + (modifier +8) * 0.5 : 1 / (2 * Math.abs(modifier +8))
  return Math.max(0, Math.min(Math.floor(attributeValue * multiplier), 100))
}

const evaluateCheckAttributeRatio = (character: CharacterData, attributeName: string, abilityName: string, modifier: number) => {
  const attribute = character.state.attributes.find((a) => a.name === attributeName)
  if (attribute !== undefined) {
    const ability = character.state.abilities.find((a) => a.name === abilityName)
    messageBus.emit('Domain.Rdd.successRatio', (findThreshold(attribute.value, (ability !== undefined ? ability.value : 0) + modifier) * 0.01).toFixed(2))
  }
}

const checkAttribute = (character: CharacterData, attributeName: string, abilityName: string, modifier: number): RollResult | null => {
  const attribute = character.state.attributes.find((a) => a.name === attributeName)
  if (attribute !== undefined) {
    const ability = character.state.abilities.find((a) => a.name === abilityName)

    const title = [attribute.name, ...(ability !== undefined ? [ability.name] : [])].join(' + ')

    const successThreshold = findThreshold(attribute.value, (ability !== undefined ? ability.value : 0) + modifier)
    const expression = `1d100<=${successThreshold}`

    const checkDetails: RollCheckDetails = {
      factors: [
        {
          type: 'base',
          name: attribute.name,
          value: attribute.value
        },
        ...(ability !== undefined ? [{
          type: 'offset' as const,
          name: ability.name,
          value: ability.value
        }] : []),
        {
          type: 'offset',
          name: 'difficulty',
          value: modifier
        },
      ],
      successThreshold,
      evaluateOutcome,
      evaluateQuality,
    }

    return diceTrayEngine.evaluateCheck(character, title, checkDetails, expression)
  }

  return null
}

export const engine = {
  evaluateCheckAttributeRatio,
  checkAttribute,
}