import { globSync } from 'glob'
import { readFileSync } from 'fs'
import { isNotNull } from '../common/tools'
import { Entity, EntityId } from '../common/types'
import { CharacterSheet, isCharacterSheet } from './characterSheet'
import { createCharacter, Character } from "./character"

export type Repository<T extends Entity> = {
  getAll: () => Readonly<Array<T>>
  getById: (id: EntityId) => T | undefined
}

const loadSheetsFromDisk = (): Array<CharacterSheet> => {
  const relevantFiles = globSync('characters/*.json')
  return relevantFiles.map((filePath) => {
    const data = readFileSync(filePath, 'utf8')
    const maybeSheet = JSON.parse(data)
    if (isCharacterSheet(maybeSheet)) {
      return maybeSheet
    }

    console.log(`invalid character sheet: ${filePath}`)
    return null
  }).filter(isNotNull)
}

export const createRepository = (): Repository<Character> => {
  const characters = loadSheetsFromDisk().map(createCharacter)

  const getAll = () => characters
  const getById = (id: EntityId) => characters.find((c) => c.id === id)

  return {
    getAll,
    getById,
  }
}