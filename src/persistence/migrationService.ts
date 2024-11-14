import { app } from 'electron'
import path from 'path'
import fs, { readFileSync, writeFileSync } from 'fs'
import { globSync } from 'glob'
import { randomUUID } from 'crypto'
import { get } from 'lodash'

// TODO: might have some duplicated code with characterService.tryCreateFromFile
// although characterService only cares about latest dataModel version
// anyway, code below is far from robust, but does the job atm
const maybeUpdateFromCharacterFiles = () => {
  const pathToNextStorageVersion = path.join(app.getPath('userData'), 'lowdb')
  const isMigrationRequired = !fs.existsSync(pathToNextStorageVersion)

  if (isMigrationRequired) {   
    const pathToLookAt = path.join(app.getPath('userData'), 'characters')
    const searchPattern = path.join(pathToLookAt, '*.json').replace(/\\/g,'/')
    const relevantFiles = globSync(searchPattern, { posix: true })
    const characters = relevantFiles.map((filePath) => {
      const data = readFileSync(filePath, 'utf8')
      const maybeSheet = JSON.parse(data)

      const id = randomUUID()
      const game = get(maybeSheet, 'game')
      const name = get(maybeSheet, 'name', 'Migrated Joe')
      const attributes = get(maybeSheet, 'attributes', [])
      const abilities = get(maybeSheet, 'abilities', [])
      const discordNotification = { enable: false, level: 'Standard', channelId: get(maybeSheet, ['discordConfiguration', 'channelId'], '')}

      return {
        id,
        game,
        name,
        attributes,
        abilities,
        discordNotification
      }
    })

    const updatedData = {
      characters
    }

    fs.mkdirSync(pathToNextStorageVersion, { recursive: true })
    const storagePath = path.join(pathToNextStorageVersion, 'characters.json')
    writeFileSync(storagePath, JSON.stringify(updatedData, null, 2))
  }
}

const maybeUpdateFromFirstLowdbImplementation = () => {
  const pathToNextStorageVersion = path.join(app.getPath('userData'), 'lowdb', 'v1')
  const isMigrationRequired = !fs.existsSync(pathToNextStorageVersion)

  if (isMigrationRequired) {
    const pathToLookAt = path.join(app.getPath('userData'), 'lowdb', 'characters.json')
    const data = readFileSync(pathToLookAt, 'utf8')
    const oldLowdb = JSON.parse(data)

    const newLowdb = {
      version: 1,
      items: oldLowdb.characters.map(oldCharacter => {
        return {
          id: oldCharacter.id,
          state: {
            name: oldCharacter.name,
            tags: [oldCharacter.game],
            attributes: oldCharacter.attributes,
            abilities: oldCharacter.abilities,
            discordNotification: oldCharacter.discordNotification
          }
        }
      })
    }

    fs.mkdirSync(pathToNextStorageVersion, { recursive: true })
    const storagePath = path.join(pathToNextStorageVersion, 'characters.json')
    writeFileSync(storagePath, JSON.stringify(newLowdb, null, 2))
  }
}

const sequence: Array<() => void> = [
  maybeUpdateFromCharacterFiles,
  maybeUpdateFromFirstLowdbImplementation
]

export type MigrationService = {
  maybeUpdateData: () => void
}

export const createMigrationService = (): MigrationService => {

  const maybeUpdateData = () => {
    sequence.forEach(f => f())
  }

  return {
    maybeUpdateData,
  }
}