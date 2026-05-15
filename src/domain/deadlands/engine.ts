import { randomUUID } from 'crypto'
import { messageBus } from '../events/messageBus'

import { DeadlandsCheckAbilityRequest, DeadlandsCheckAttributeRequest, RollCheckDetails, RollCheckOutcome, RollCheckQuality, RollDiceDetails, RollResult } from '../common/types'
import { CharacterData } from '../character/character'
import { rollDice } from '../dicetray/roll'

// livre règle: https://cdn.1j1ju.com/medias/4b/b5/6e-deadlands-reloaded-livre-de-base.pdf
// https://docs.google.com/spreadsheets/d/143Yg9EwFzvayI78Wk-BtuJM3bc53B-69h6126Z2dzYI/edit?gid=0#gid=0
// https://black-book-editions.fr/forums.php?topic_id=5981&srsltid=AfmBOoqXb1CTRcD3zCj8-BRUpLsYKpHYoZR_6AXFVAP5LdLva52yfTg6
// https://arcane.forumgratuit.org/t16-deadlands-reloaded-le-systeme-de-jeu

// PNJ do not have the joker dice !!

export const evaluateOutcome = (baseValue: number, jokerValue: number, totalValue: number, threshold: number): RollCheckOutcome => {
  if (baseValue === 1 && jokerValue === 1) {
    return 'failure'
  }

  return totalValue >= threshold ? 'success' : 'failure'
}

export const evaluateQuality = (outcome: 'success' | 'failure', baseValue: number, jokerValue: number, totalValue: number, threshold: number): RollCheckQuality => {
  switch (outcome) {
    case 'failure':
      return baseValue === 1 && jokerValue === 1 ? 'critical' : 'normal'

    case 'success': {
      const raiseQty = Math.floor(Math.max(0, (totalValue - threshold)) / 4)
      switch (raiseQty) {
        case 0: return 'normal'
        case 1: return 'significant'
        case 2: return 'particular'
        default: return 'critical'
      }
    }
  }
}

const findCheckThreshold = (difficulty: number): number => {
  return Math.max(0, 4 + difficulty)
}

const rollDiceWithRaise = (maxDiceValue: number): Array<number> => {
  const result: Array<number> = []
  while (result.length === 0 || result[result.length -1] === maxDiceValue) {
    result.push(rollDice(maxDiceValue))
  }
  return result
}

const evaluateFailureRatio = (maxDiceValue: number, currentValue: number, modifier: number, threshold: number) => {
  if (currentValue + modifier >= threshold)
    return 0

  const baseP = 1 / maxDiceValue

  let p = 0
  for (let v=1; v < maxDiceValue; v++) {
    if (currentValue + v + modifier < threshold) {
      p += baseP
    }
  }

  p += baseP * evaluateFailureRatio(maxDiceValue, currentValue + maxDiceValue, modifier, threshold)

  return p
}

const isJokerCharacter = (character: CharacterData) => character.state.tags.some(tag => tag.toLowerCase() === 'joker')

const evaluateCheckAttributeRatio = (character: CharacterData, request: DeadlandsCheckAttributeRequest) => {
  const attribute = character.state.attributes.find((a) => a.name === request.attributeName)
  if (attribute !== undefined) {
    const threshold = findCheckThreshold(request.difficulty)
    const baseFailure = evaluateFailureRatio(attribute.value, 0, request.modifier, threshold)

    const jokerFailure = isJokerCharacter(character) ? evaluateFailureRatio(6, 0, request.modifier, threshold) : 1

    const totalFailure = baseFailure * jokerFailure
    const ratio = 1 - totalFailure

    messageBus.emit('Domain.Deadlands.successRatio', (ratio).toFixed(2))
  }
}

const checkAttribute = (character: CharacterData, request: DeadlandsCheckAttributeRequest): RollResult | null => {
  const attribute = character.state.attributes.find((a) => a.name === request.attributeName)
  if (attribute !== undefined) {
    const title = attribute.name

    const baseDiceValues = rollDiceWithRaise(attribute.value)
    const baseValue = baseDiceValues.reduce((acc, v) => acc += v, 0)

    const jokerDiceValues = isJokerCharacter(character) ? rollDiceWithRaise(6) : []
    const jokerValue = jokerDiceValues.reduce((acc, v) => acc += v, 0)

    const totalValue = Math.max(baseValue, jokerValue) + request.modifier

    const successThreshold = findCheckThreshold(request.difficulty)
    const outcome = evaluateOutcome(baseValue, jokerValue, totalValue, successThreshold)
    const quality = evaluateQuality(outcome, baseValue, jokerValue, totalValue, successThreshold)

    const checkDetails: RollCheckDetails = {
      factors: [
        {
          type: 'base',
          name: attribute.name,
          value: attribute.value
        },
        {
          type: 'offset',
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
        diceFaceQty: attribute.value,
        rolls: baseDiceValues,
      },
      {
        diceQty: 1,
        diceFaceQty: 6,
        rolls: jokerDiceValues,
      }],   
      total: totalValue
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
  
    messageBus.emit('Domain.Deadlands.check', result)
    return result
  }

  return null
}

const evaluateCheckAbilityRatio = (character: CharacterData, request: DeadlandsCheckAbilityRequest) => {
  const ability = character.state.abilities.find((a) => a.name === request.abilityName)
  if (ability !== undefined) {
    const threshold = findCheckThreshold(request.difficulty)
    const baseFailure = evaluateFailureRatio(ability.value, 0, request.modifier, threshold)
    
    const jokerFailure = isJokerCharacter(character) ? evaluateFailureRatio(6, 0, request.modifier, threshold) : 1
    
    const totalFailure = baseFailure * jokerFailure
    const ratio = 1 - totalFailure

    messageBus.emit('Domain.Deadlands.successRatio', (ratio).toFixed(2))
  }
}

const checkAbility = (character: CharacterData, request: DeadlandsCheckAbilityRequest): RollResult | null => {
  const ability = character.state.abilities.find((a) => a.name === request.abilityName)
  if (ability !== undefined) {
    const title = ability.name

    const baseDiceValues = rollDiceWithRaise(ability.value)
    const baseValue = baseDiceValues.reduce((acc, v) => acc += v, 0)

    const jokerDiceValues = isJokerCharacter(character) ? rollDiceWithRaise(6) : []
    const jokerValue = jokerDiceValues.reduce((acc, v) => acc += v, 0)

    const totalValue = Math.max(baseValue, jokerValue) + request.modifier

    const successThreshold = findCheckThreshold(request.difficulty)
    const outcome = evaluateOutcome(baseValue, jokerValue, totalValue, successThreshold)
    const quality = evaluateQuality(outcome, baseValue, jokerValue, totalValue, successThreshold)

    const checkDetails: RollCheckDetails = {
      factors: [
        {
          type: 'base',
          name: ability.name,
          value: ability.value
        },
        {
          type: 'offset',
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
        diceFaceQty: ability.value,
        rolls: baseDiceValues,
      },
      {
        diceQty: 1,
        diceFaceQty: 6,
        rolls: jokerDiceValues,
      }],   
      total: totalValue
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
  
    messageBus.emit('Domain.Deadlands.check', result)
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