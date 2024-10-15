// import { randomUUID } from 'crypto'
// import { messageBus } from '../events/messageBus'

// import { Entity, EntityId } from '../common/types'
// import { CharacterSheet } from './characterSheet'

// export type Character = Entity & Readonly<{
//   sheet: CharacterSheet
//   checkAttribute: (attributeName: string, difficulty: number, modifier: number) => RollCheck | null
//   checkAbility: (abilityName: string, modifier: number) => RollCheck | null
// }>

// // NB: there is always a difficulty multiplier and a difficulty offset
// export type RollCheck = Readonly<{
//   characterId: EntityId
//   statName: string
//   statValue: number
//   difficulty?: number
//   modifier: number
//   value: number
//   isSuccess: boolean
// }>

// const rollDice = (max: number) => Math.round(Math.random() * max)

// export const createCharacter = (sheet: CharacterSheet): Character => {
//   const id = randomUUID()

//   const checkAttribute = (attributeName: string, difficulty: number, modifier: number): RollCheck | null => {
//     const attribute = sheet.attributes.find((a) => a.name === attributeName)
//     if (attribute) {
//       const diceValue = rollDice(100)
//       const isSuccess = diceValue <= attribute.value * difficulty + modifier
//       const rollCheck = {
//         characterId: id,
//         statName: attribute.name,
//         statValue: attribute.value,
//         difficulty: difficulty,
//         modifier,
//         value: diceValue,
//         isSuccess
//       }

//       messageBus.emit('Domain.Character.check', rollCheck)
//       return rollCheck
//     }
//     return null
//   }

//   const checkAbility = (abilityName: string, modifier: number): RollCheck | null => {
//     const ability = sheet.abilities.find((a) => a.name === abilityName)
//     if (ability) {
//       const diceValue = rollDice(100)
//       const isSuccess = diceValue <= ability.value + modifier
//       const rollCheck = {
//         characterId: id,
//         statName: ability.name,
//         statValue: ability.value,
//         modifier,
//         value: diceValue,
//         isSuccess
//       }

//       messageBus.emit('Domain.Character.check', rollCheck)
//       return rollCheck
//     }
//     return null
//   }

//   return {
//     id,
//     sheet,
//     checkAttribute,
//     checkAbility,
//   }
// }