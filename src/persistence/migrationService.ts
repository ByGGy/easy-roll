import { app } from 'electron'
import path from 'path'
import fs, { readFileSync, writeFileSync } from 'fs'
import { globSync } from 'glob'
import { randomUUID } from 'crypto'
import { get, identity } from 'lodash'

import { Character } from '../domain/character/character'
import { Session } from '../domain/session/session'

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

const updateRepository = (fileName: string, fromVersion: number, updateItem: (oldItem: unknown) => unknown) => {
  const pathToLookAt = path.join(app.getPath('userData'), 'lowdb', `v${fromVersion}`, fileName)
  if (fs.existsSync(pathToLookAt)) {
    const data = readFileSync(pathToLookAt, 'utf8')
    const oldLowdb = JSON.parse(data)

    const newLowdb = {
      version: fromVersion +1,
      items: oldLowdb.items.map(updateItem)
    }

    const pathToNextStorageVersion = path.join(app.getPath('userData'), 'lowdb', `v${fromVersion +1}`)
    fs.mkdirSync(pathToNextStorageVersion, { recursive: true })

    const storagePath = path.join(pathToNextStorageVersion, fileName)
    writeFileSync(storagePath, JSON.stringify(newLowdb, null, 2))
  }
}

const maybeUpdateFromV1Repositories = () => {
  const pathToNextStorageVersion = path.join(app.getPath('userData'), 'lowdb', 'v2')
  const isMigrationRequired = !fs.existsSync(pathToNextStorageVersion)

  if (isMigrationRequired) {
    // NB: we do not really need to adapt the shape of the data
    // we are just forcing the app to work on a new set of data
    // in order to avoid crashes in case someone reverts to a previous version of the app
    // which didn't handle new game types
    updateRepository('characters.json', 1, identity)
    updateRepository('sessions.json', 1, identity)
  }
}

const maybeUpdateFromV2Repositories = () => {
  const pathToNextStorageVersion = path.join(app.getPath('userData'), 'lowdb', 'v3')
  const isMigrationRequired = !fs.existsSync(pathToNextStorageVersion)

  if (isMigrationRequired) {
    updateRepository('characters.json', 2, (oldCharacter: Character) => {
      const newCharacter = { ...oldCharacter }
      newCharacter.state.diceActions = []
      return newCharacter 
    })

    updateRepository('sessions.json', 2, identity)
  }
}

const sequence: Array<() => void> = [
  maybeUpdateFromCharacterFiles,
  maybeUpdateFromFirstLowdbImplementation,
  maybeUpdateFromV1Repositories,
  maybeUpdateFromV2Repositories,
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