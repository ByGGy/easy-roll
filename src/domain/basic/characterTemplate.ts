import { Attribute, Ability } from '../common/types'

const ATTRIBUTE_AVERAGE_VALUE = 2*3+6

export const createDefaultAttributes = () => {
  return [
    { name: 'Force', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
    { name: 'Dextérité', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
    { name: 'Constitution', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
    { name: 'Apparence', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
    { name: 'Taille', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
    { name: 'Intelligence', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
    { name: 'Pouvoir', value: ATTRIBUTE_AVERAGE_VALUE } as Attribute,
  ]
}

export const createDefaultAbilities = () => {
  return [
    { name: 'Art, artisanat', value: 5 } as Ability,
    { name: 'Athlétisme', value: 15 } as Ability,
    { name: 'Bricolage', value: 10 } as Ability,
    { name: 'Cascade', value: 10 } as Ability,
    { name: 'Chercher, fouiller', value: 20 } as Ability,
    { name: 'Commerce', value: 20 } as Ability,
    { name: 'Culture générale', value: 20 } as Ability,
    { name: 'Déguisement', value: 10 } as Ability,
    { name: 'Discrétion', value: 15 } as Ability,
    { name: 'Droit, administration, usages', value: 10 } as Ability,
    { name: 'Equitation', value: 20 } as Ability,
    { name: 'Esquiver', value: 25 } as Ability,
    { name: 'Langue natale', value: 80 } as Ability,
    { name: 'Leadership', value: 15 } as Ability,
    { name: 'Navigation', value: 0 } as Ability,
    { name: 'Orientation', value: 15 } as Ability,
    { name: 'Persuasion', value: 15 } as Ability,
    { name: 'Sagacité', value: 20 } as Ability,
    { name: 'Secourisme', value: 30 } as Ability,
    { name: 'Survie', value: 10 } as Ability,
    { name: 'Vigilance', value: 20 } as Ability,
    { name: 'Bibliothèque', value: 25 } as Ability,
    { name: 'Comptabilité', value: 0 } as Ability,
    { name: 'Conduire', value: 20 } as Ability,
    { name: 'Connaissance de la rue', value: 10 } as Ability,
    { name: 'Histoire, géographie', value: 10 } as Ability,
    { name: 'Informatique', value: 20 } as Ability,
    { name: 'Médecine', value: 0 } as Ability,
    { name: 'Paranormal', value: 20 } as Ability,
    { name: 'Piloter', value: 0 } as Ability,
    { name: 'Plongée', value: 0 } as Ability,
    { name: 'Renseignements', value: 20 } as Ability,
    { name: 'Sabotage', value: 5 } as Ability,
    { name: 'Sciences appliquées', value: 0 } as Ability,
    { name: 'Sciences pures', value: 0 } as Ability,
    { name: 'Sciences sociales', value: 0 } as Ability,
    { name: 'Serrurerie', value: 15 } as Ability,
    { name: 'Bagarre', value: 50 } as Ability,
    { name: 'Lutte', value: 20 } as Ability,
    { name: 'Armes de mêlée', value: 25 } as Ability,
    { name: 'Armes de tir', value: 25 } as Ability,
    { name: 'Armes de poing', value: 20 } as Ability,
    { name: 'Fusil de chasse', value: 15 } as Ability,
    { name: 'Fusil', value: 20 } as Ability,
    { name: 'Mitraillette', value: 10 } as Ability,
  ]
}