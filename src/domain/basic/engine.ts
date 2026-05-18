import { randomUUID } from 'crypto'
import { messageBus } from '../events/messageBus'

import { BasicCheckAbilityRequest, BasicCheckAttributeRequest, RollCheckDetails, RollCheckOutcome, RollCheckQuality, RollDiceDetails, RollResult } from '../common/types'
import { CharacterData } from '../character/character'
import { rollDice } from '../dicetray/roll'

export const evaluateOutcome = (value: number, threshold: number): RollCheckOutcome => {
  if (value <= 5) {
    return 'success'
  }

  if (value >= 96) {
    return 'failure'
  }
  
  return value <= threshold ? 'success' : 'failure'   
}

export const evaluateQuality = (outcome: 'success' | 'failure', value: number, threshold: number): RollCheckQuality => {
  return value <= 5 || value >= 96 ? 'critical' : 'normal'
}

const findCheckAttributeThreshold = (attributeValue: number, modifier: number): number => {
  return Math.max(0, Math.min(attributeValue * 5 + modifier, 100))
}

const evaluateCheckAttributeRatio = (character: CharacterData, request: BasicCheckAttributeRequest) => {
  const attribute = character.state.attributes.find((a) => a.name === request.attributeName)
  if (attribute !== undefined) {
    messageBus.emit('Domain.Basic.successRatio', (findCheckAttributeThreshold(attribute.value, request.modifier) * 0.01).toFixed(2))
  }
}

const checkAttribute = (character: CharacterData, request: BasicCheckAttributeRequest): RollResult | null => {
  const attribute = character.state.attributes.find((a) => a.name === request.attributeName)
  if (attribute !== undefined) {
    const title = attribute.name

    const diceValue = rollDice(100)
    const successThreshold = findCheckAttributeThreshold(attribute.value, request.modifier)
    const outcome = evaluateOutcome(diceValue, successThreshold)
    const quality = evaluateQuality(outcome, diceValue, successThreshold)

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
          value: 5
        },
        {
          type: 'offset',
          name: 'modifier',
          value: request.modifier
        }
      ],
      successThreshold,
    }
  
    const diceDetails: RollDiceDetails = {
      groups: [{
        diceQty: 1,
        symbol: 'd',
        diceFaceQty: 100,
        rolls: [diceValue],
      }],   
      total: diceValue
    }

    const result: RollResult = {
      id: randomUUID(),
      request,
      title,
      outcome,
      outcomeDetails: { quality },
      checkDetails,
      diceDetails,
    }
  
    messageBus.emit('Domain.Basic.check', result)
    return result
  }

  return null
}

const findCheckAbilityThreshold = (abilityValue: number, difficulty: number, modifier: number): number => {
  return Math.max(0, Math.min(abilityValue * difficulty + modifier, 100))
}

const evaluateCheckAbilityRatio = (character: CharacterData, request: BasicCheckAbilityRequest) => {
  const ability = character.state.abilities.find((a) => a.name === request.abilityName)
  if (ability !== undefined) {
    messageBus.emit('Domain.Basic.successRatio', (findCheckAbilityThreshold(ability.value, request.difficulty, request.modifier) * 0.01).toFixed(2))
  }
}

const checkAbility = (character: CharacterData, request: BasicCheckAbilityRequest): RollResult | null => {
  const ability = character.state.abilities.find((a) => a.name === request.abilityName)
  if (ability !== undefined) {
    const title = ability.name

    const diceValue = rollDice(100)
    const successThreshold = findCheckAbilityThreshold(ability.value,  request.difficulty, request.modifier)
    const outcome = evaluateOutcome(diceValue, successThreshold)
    const quality = evaluateQuality(outcome, diceValue, successThreshold)

    const checkDetails: RollCheckDetails = {
      factors: [
        {
          type: 'base',
          name: ability.name,
          value: ability.value
        },
        {
          type: 'multiplier',
          name: 'difficulty',
          value: request.difficulty
        },
        {
          type: 'offset',
          name: 'modifier',
          value: request.modifier
        }
      ],
      successThreshold,
    }

    const diceDetails: RollDiceDetails = {
      groups: [{
        diceQty: 1,
        symbol: 'd',
        diceFaceQty: 100,
        rolls: [diceValue],
      }],   
      total: diceValue
    }

    const result: RollResult = {
      id: randomUUID(),
      request,
      title,
      outcome,
      outcomeDetails: { quality },
      checkDetails,
      diceDetails,
    }
  
    messageBus.emit('Domain.Basic.check', result)
    return result
  }

  return null
}

export const engine = {
  evaluateCheckAttributeRatio,
  checkAttribute,
  evaluateCheckAbilityRatio,
  checkAbility
}