import { randomUUID } from 'crypto'
import { Attribute, Ability, CharacterSheet } from '../common/types'

const ATTRIBUTE_AVERAGE_VALUE = Math.floor(60 / 5)
const ABILITY_AVERAGE_VALUE = ATTRIBUTE_AVERAGE_VALUE * 5

// TODO: id generation and discord configuration should not be handled by game templates
export const createDefault = (): CharacterSheet => {
  return {
    id: randomUUID(),
    game: 'Aria',
    name: 'Average Joe',
    attributes: [
      { name: 'Force', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Dextérité', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Endurance', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Intelligence', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Charisme', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
    ],
    abilities: [
      { name: 'Artisanat, construire', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Combat rapproché', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Combat à distance', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Connaissance de la nature', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Connaissance des secrets', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Courir, Sauter', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Discrétion', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Droit', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Esquiver', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Intimider', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Lire, écrire', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Mentir, convaincre', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Perception', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Piloter', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Psychologie', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Réflexes', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Serrures et pièges', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Soigner', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Survie', value: ABILITY_AVERAGE_VALUE } as Ability,
      { name: 'Voler', value: ABILITY_AVERAGE_VALUE } as Ability,
    ],
    discordNotification: {
      enable: true,
      level: 'Standard',
      channelId: ''
    }
  }
}