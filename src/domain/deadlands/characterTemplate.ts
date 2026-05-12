import { Attribute, Ability } from '../common/types'

const ATTRIBUTE_DEFAULT_VALUE = 4 // 1d4 / 1d6 / 1d8 / 1d10 / 1d12
const ABILITY_DEFAULT_VALUE = 4

export const createDefaultAttributes = () => {
  return [
    { name: 'Agilité', value: ATTRIBUTE_DEFAULT_VALUE } as Attribute,
    { name: 'Ame', value: ATTRIBUTE_DEFAULT_VALUE } as Attribute,
    { name: 'Force', value: ATTRIBUTE_DEFAULT_VALUE } as Attribute,
    { name: 'Intellect', value: ATTRIBUTE_DEFAULT_VALUE } as Attribute,
    { name: 'Vigueur', value: ATTRIBUTE_DEFAULT_VALUE } as Attribute,
  ]
}

export const createDefaultAbilities = () => {
  return [
    { name: 'Combat', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Conduite', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Connaissances', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Culture générale', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Crochetage', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Discrétion', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Equitation', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Escalade', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Intimidation', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Jeu', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Lancer', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Natation', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Navigation', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Perception', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Persuasion', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Pilotage', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Pistage', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Recherche', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Réparation', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Réseaux', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Sarcasme', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Soins', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Survie', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Tir', value: ABILITY_DEFAULT_VALUE } as Ability,
    { name: 'Tripes', value: ABILITY_DEFAULT_VALUE } as Ability,
  ]
}