import path from 'path'
import { app } from 'electron'
import fs from 'fs'
import { JSONFileSyncPreset } from 'lowdb/node'
// import { globSync } from 'glob'
// import { readFileSync } from 'fs'
import { randomUUID } from 'crypto'
// import { isNotNull } from '../../../domain/common/tools'
import { Entity, EntityId, CharacterSheet } from '../../domain/common/types'
// import { isCharacterSheet } from './characterSheet'

type CharacterdbType = {
  characters: CharacterSheet[]
}

const initialState: CharacterdbType = { characters: [] }

export type Repository<T extends Entity> = {
  getAll: () => Readonly<Array<T>>
  getById: (id: EntityId) => T | undefined

  // void Insert(TEntity item);
  // void Update(TEntity item);

  // void DeleteByID(EntityID id);
}

// const loadSheetsFromDisk = (): Array<CharacterSheet> => {
//   // TODO: would be better to allow browsing for a specific file..
//   const pathToLookAt = path.join(app.getPath('userData'), 'characters')
//   const searchPattern = path.join(pathToLookAt, '*.json').replace(/\\/g,'/')
//   const relevantFiles = globSync(searchPattern, { posix: true })
//   return relevantFiles.map((filePath) => {
//     const data = readFileSync(filePath, 'utf8')
//     const maybeSheet = JSON.parse(data)
//     // TODO: we do not need to store the ids at the moment ?
//     maybeSheet.id = randomUUID()
//     if (isCharacterSheet(maybeSheet)) {
//       return maybeSheet
//     }

//     console.log(`invalid character sheet: ${filePath}`)
//     return null
//   }).filter(isNotNull)
// }

export const createRepository = (): Repository<CharacterSheet> => {
  // const characterSheets = loadSheetsFromDisk()

  const storageFolder = path.join(app.getPath('userData'), 'lowdb')
  fs.mkdirSync(storageFolder, { recursive: true })

  const storagePath = path.join(storageFolder, 'characters.json')
  const lowdbInstance = JSONFileSyncPreset<CharacterdbType>(storagePath, initialState)

  if (lowdbInstance.data.characters.length === 0) {
    lowdbInstance.data.characters.push({ id: randomUUID(), name: 'Test', game: 'Aria', attributes: [], abilities: [], discordConfiguration: { channelId: '' } })
    lowdbInstance.write()
  }

  const getAll = () => lowdbInstance.data.characters
  const getById = (id: EntityId) => lowdbInstance.data.characters.find((sheet) => sheet.id === id)

  return {
    getAll,
    getById,
  }
}