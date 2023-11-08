import { randomUUID } from 'crypto'
import { messageBus } from './messageBus'

declare const NOMINAL_BRAND: unique symbol
type Nominal<T extends string, U> = U & { [NOMINAL_BRAND]: T }

type EntityId = string

type Entity = {
  id: EntityId
}

type Attribute = Nominal<'Attribute', {
  name: string,
  value: number
}>

type Ability = Nominal<'Ability', {
  name: string,
  value: number
}>

export type Character = Entity & {
  name: string
  attributes: Array<Attribute>
  abilities: Array<Ability>
  attemptTo: (abilityName: string, modifier: number) => RollCheck
}

export type RollCheck = Readonly<{
  characterId: EntityId,
  statName: string,
  modifier: number
  value: number
  isSuccess: boolean
}>

const rollDice = (max :number) => Math.round(Math.random() * max)

export const createCharacter = (): Character => {
  const id = randomUUID()

  const name = 'Anselme'
  const attributes = [{ name: 'Force', value: 9 } as Attribute, { name: 'Dextérité', value: 13 } as Attribute]
  const abilities = [{ name: 'Perception', value: 60 } as Ability, { name: 'Courir, Sauter', value: 46 } as Ability]

  const attemptTo = (abilityName: string, modifier: number): RollCheck => {
    const ability = abilities.find((a) => a.name === abilityName)
    if (ability) {
      const diceValue = rollDice(100)
      const isSuccess = diceValue <= ability.value + modifier
      const rollCheck = {
        characterId: id,
        statName: abilityName,
        modifier,
        value: diceValue,
        isSuccess
      }

      messageBus.emit('Character.attempt', rollCheck)
      return rollCheck
    }
  }

  return {
    id,
    name,
    attributes,
    abilities,
    attemptTo,
  }
}