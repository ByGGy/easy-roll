import { randomUUID } from 'crypto'
import { messageBus } from '../events/messageBus'

declare const NOMINAL_BRAND: unique symbol
type Nominal<T extends string, U> = U & { [NOMINAL_BRAND]: T }

export type EntityId = string

export type Entity = {
  id: Readonly<EntityId>
}

export type Attribute = Nominal<'Attribute', Readonly<{
  name: string,
  value: number
}>>

export type Ability = Nominal<'Ability', Readonly<{
  name: string,
  value: number
}>>

export type Character = Entity & Readonly<{
  name: string
  attributes: Array<Attribute>
  abilities: Array<Ability>
  checkAttribute: (attributeName: string, difficulty: number, modifier: number) => RollCheck | null
  checkAbility: (abilityName: string, modifier: number) => RollCheck | null
}>

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

const rollDice = (max :number) => Math.round(Math.random() * max)

export const createCharacter = (): Character => {
  const id = randomUUID()

  const name = 'Anselme'
  const attributes = [
    { name: 'Force', value: 9 } as Attribute,
    { name: 'Dextérité', value: 13 } as Attribute,
    { name: 'Endurance', value: 10 } as Attribute,
    { name: 'Intelligence', value: 14 } as Attribute,
    { name: 'Charisme', value: 14 } as Attribute,
  ]
  const abilities = [
    { name: 'Artisanat, construire', value: 55 } as Ability,
    { name: 'Combat rapproché', value: 44 } as Ability,
    { name: 'Combat à distance', value: 60 } as Ability,
    { name: 'Connaissance de la nature', value: 54 } as Ability,
    { name: 'Connaissance des secrets', value: 60 } as Ability,
    { name: 'Courir, Sauter', value: 46 } as Ability,
    { name: 'Discrétion', value: 60 } as Ability,
    { name: 'Droit', value: 60 } as Ability,
    { name: 'Esquiver', value: 60 } as Ability,
    { name: 'Intimider', value: 46 } as Ability,
    { name: 'Lire, écrire', value: 65 } as Ability,
    { name: 'Mentir, convaincre', value: 65 } as Ability,
    { name: 'Mentir, convaincre', value: 65 } as Ability,
    { name: 'Perception', value: 60 } as Ability,
    { name: 'Piloter', value: 46 } as Ability,
    { name: 'Psychologie', value: 48 } as Ability,
    { name: 'Réflexes', value: 55 } as Ability,
    { name: 'Serrures et pièges', value: 46 } as Ability,
    { name: 'Soigner', value: 56 } as Ability,
    { name: 'Survie', value: 48 } as Ability,
    { name: 'Voler', value: 54 } as Ability,
  ]

  const checkAttribute = (attributeName: string, difficulty: number, modifier: number): RollCheck | null => {
    const attribute = attributes.find((a) => a.name === attributeName)
    if (attribute) {
      const diceValue = rollDice(100)
      const isSuccess = diceValue <= attribute.value * difficulty + modifier
      const rollCheck = {
        characterId: id,
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

  const checkAbility = (abilityName: string, modifier: number): RollCheck | null => {
    const ability = abilities.find((a) => a.name === abilityName)
    if (ability) {
      const diceValue = rollDice(100)
      const isSuccess = diceValue <= ability.value + modifier
      const rollCheck = {
        characterId: id,
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

  return {
    id,
    name,
    attributes,
    abilities,
    checkAttribute,
    checkAbility,
  }
}