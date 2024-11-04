import { randomUUID } from 'crypto'
import { Attribute, Ability, CharacterSheet } from '../common/types'

const ATTRIBUTE_AVERAGE_VALUE = 10

const ABILITY_GENERAL_BASE_VALUE = -4
const ABILITY_FIGHT_MELEE_BASE_VALUE = -6
const ABILITY_FIGHT_RANGE_BASE_VALUE = -8
const ABILITY_PARTICULAR_BASE_VALUE = -8
const ABILITY_SPECIALIZED_BASE_VALUE = -11
const ABILITY_KNOWLEDGE_BASE_VALUE = -11
const ABILITY_DRACONIC_BASE_VALUE = -11

export const createDefault = (): CharacterSheet => {
  return {
    id: randomUUID(),
    game: 'Rêve de Dragon',
    name: 'Average Joe',
    attributes: [
      { name: 'Taille', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Apparence', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Constitution', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Force', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Agilité', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Dextérité', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Vue', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Ouïe', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Odorat-Goût', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Volonté', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Intellect', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Empathie', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Rêve', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Chance', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Mêlée', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Tir', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Lancer', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
      { name: 'Dérobée', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
    ],
    abilities: [
      // General
      { name: 'Bricolage', value: ABILITY_GENERAL_BASE_VALUE } as Ability,
      { name: 'Chant', value: ABILITY_GENERAL_BASE_VALUE } as Ability,
      { name: 'Course', value: ABILITY_GENERAL_BASE_VALUE } as Ability,
      { name: 'Cuisine', value: ABILITY_GENERAL_BASE_VALUE } as Ability,
      { name: 'Danse', value: ABILITY_GENERAL_BASE_VALUE } as Ability,
      { name: 'Dessin', value: ABILITY_GENERAL_BASE_VALUE } as Ability,
      { name: 'Discrétion', value: ABILITY_GENERAL_BASE_VALUE } as Ability,
      { name: 'Escalade', value: ABILITY_GENERAL_BASE_VALUE } as Ability,
      { name: 'Saut', value: ABILITY_GENERAL_BASE_VALUE } as Ability,
      { name: 'Séduction', value: ABILITY_GENERAL_BASE_VALUE } as Ability,
      { name: 'Vigilance', value: ABILITY_GENERAL_BASE_VALUE } as Ability,
      // Fight Melee
      { name: 'Bouclier', value: ABILITY_FIGHT_MELEE_BASE_VALUE } as Ability,
      { name: 'Corps à corps', value: ABILITY_FIGHT_MELEE_BASE_VALUE } as Ability,
      { name: 'Esquive', value: ABILITY_FIGHT_MELEE_BASE_VALUE } as Ability,
      { name: 'Dague de mêlée', value: ABILITY_FIGHT_MELEE_BASE_VALUE } as Ability,
      { name: 'Epée à une main', value: ABILITY_FIGHT_MELEE_BASE_VALUE } as Ability,
      { name: 'Epée à deux mains', value: ABILITY_FIGHT_MELEE_BASE_VALUE } as Ability,
      { name: 'Fléau', value: ABILITY_FIGHT_MELEE_BASE_VALUE } as Ability,
      { name: 'Hache à une main', value: ABILITY_FIGHT_MELEE_BASE_VALUE } as Ability,
      { name: 'Hache à deux mains', value: ABILITY_FIGHT_MELEE_BASE_VALUE } as Ability,
      { name: 'Lance', value: ABILITY_FIGHT_MELEE_BASE_VALUE } as Ability,
      { name: 'Masse à une main', value: ABILITY_FIGHT_MELEE_BASE_VALUE } as Ability,
      { name: 'Masse à deux mains', value: ABILITY_FIGHT_MELEE_BASE_VALUE } as Ability,
      { name: 'Arme d\'hast', value: ABILITY_FIGHT_MELEE_BASE_VALUE } as Ability,
      // Fight Range
      { name: 'Arbalète', value: ABILITY_FIGHT_RANGE_BASE_VALUE } as Ability,
      { name: 'Arc', value: ABILITY_FIGHT_RANGE_BASE_VALUE } as Ability,
      { name: 'Fronde', value: ABILITY_FIGHT_RANGE_BASE_VALUE } as Ability,
      { name: 'Dague de jet', value: ABILITY_FIGHT_RANGE_BASE_VALUE } as Ability,
      { name: 'Javelot', value: ABILITY_FIGHT_RANGE_BASE_VALUE } as Ability,
      { name: 'Fouet', value: ABILITY_FIGHT_RANGE_BASE_VALUE } as Ability,
      // Particular
      { name: 'Charpenterie', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      { name: 'Comédie', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      { name: 'Commerce', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      { name: 'Equitation', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      { name: 'Maçonnerie', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      { name: 'Musique', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      { name: 'Pickpocket', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      { name: 'Survie en Cité', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      { name: 'Survie en Extérieur', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      { name: 'Survie en Désert', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      { name: 'Survie en Forêt', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      { name: 'Survie en Glaces', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      { name: 'Survie en Marais', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      { name: 'Survie en Montagne', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      { name: 'Survie en Sous-sol', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      { name: 'Travestissement', value: ABILITY_PARTICULAR_BASE_VALUE } as Ability,
      // Specialized
      { name: 'Acrobatie', value: ABILITY_SPECIALIZED_BASE_VALUE } as Ability,
      { name: 'Chirurgie', value: ABILITY_SPECIALIZED_BASE_VALUE } as Ability,
      { name: 'Jeu', value: ABILITY_SPECIALIZED_BASE_VALUE } as Ability,
      { name: 'Jonglerie', value: ABILITY_SPECIALIZED_BASE_VALUE } as Ability,
      { name: 'Maroquinerie', value: ABILITY_SPECIALIZED_BASE_VALUE } as Ability,
      { name: 'Métallurgie', value: ABILITY_SPECIALIZED_BASE_VALUE } as Ability,
      { name: 'Natation', value: ABILITY_SPECIALIZED_BASE_VALUE } as Ability,
      { name: 'Navigation', value: ABILITY_SPECIALIZED_BASE_VALUE } as Ability,
      { name: 'Orfèvrerie', value: ABILITY_SPECIALIZED_BASE_VALUE } as Ability,
      { name: 'Serrurerie', value: ABILITY_SPECIALIZED_BASE_VALUE } as Ability,
      // Knowledge
      { name: 'Alchimie', value: ABILITY_KNOWLEDGE_BASE_VALUE } as Ability,
      { name: 'Astrologie', value: ABILITY_KNOWLEDGE_BASE_VALUE } as Ability,
      { name: 'Botanique', value: ABILITY_KNOWLEDGE_BASE_VALUE } as Ability,
      { name: 'Légendes', value: ABILITY_KNOWLEDGE_BASE_VALUE } as Ability,
      { name: 'Ecriture', value: ABILITY_KNOWLEDGE_BASE_VALUE } as Ability,
      { name: 'Médecine', value: ABILITY_KNOWLEDGE_BASE_VALUE } as Ability,
      { name: 'Zoologie', value: ABILITY_KNOWLEDGE_BASE_VALUE } as Ability,
      // Draconic
      { name: 'Oniros', value: ABILITY_DRACONIC_BASE_VALUE } as Ability,
      { name: 'Hypnos', value: ABILITY_DRACONIC_BASE_VALUE } as Ability,
      { name: 'Narcos', value: ABILITY_DRACONIC_BASE_VALUE } as Ability,
      { name: 'Thanatos', value: ABILITY_DRACONIC_BASE_VALUE } as Ability,
    ],
    discordNotification: {
      enable: false,
      level: 'Full',
      channelId: ''
    }
  }
}