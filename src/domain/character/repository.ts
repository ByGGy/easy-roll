import { globSync } from 'glob'
import { readFileSync } from 'fs'
import { randomUUID } from 'crypto'
import { isNotNull } from '../common/tools'
import { Entity, EntityId } from '../common/types'
import { CharacterSheet, isCharacterSheet } from './characterSheet'

export type Repository<T extends Entity> = {
  getAll: () => Readonly<Array<T>>
  getById: (id: EntityId) => T | undefined
}

const loadSheetsFromDisk = (): Array<CharacterSheet> => {
  // TODO: would be better to check in the user profile AppData folder (or allow browsing for a specific file..)
  const relevantFiles = globSync('characters/*.json')
  return relevantFiles.map((filePath) => {
    const data = readFileSync(filePath, 'utf8')
    const maybeSheet = JSON.parse(data)
    // TODO: we do not need to store the ids at the moment ?
    maybeSheet.id = randomUUID()
    if (isCharacterSheet(maybeSheet)) {
      return maybeSheet
    }

    console.log(`invalid character sheet: ${filePath}`)
    return null
  }).filter(isNotNull)
}

export const createRepository = (): Repository<CharacterSheet> => {
  const characterSheets = loadSheetsFromDisk()

  const getAll = () => characterSheets
  const getById = (id: EntityId) => characterSheets.find((sheet) => sheet.id === id)

  return {
    getAll,
    getById,
  }
}