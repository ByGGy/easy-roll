import path from 'path'
import { app } from 'electron'
import fs from 'fs'
import { JSONFileSyncPreset } from 'lowdb/node'

import { Entity, EntityId, CharacterSheet } from '../../domain/common/types'

type CharacterdbType = {
  characters: CharacterSheet[]
}

const initialState: CharacterdbType = { characters: [] }

export type Repository<T extends Entity> = {
  getAll: () => Readonly<Array<T>>
  getById: (id: EntityId) => T | undefined
  insert: (item: T) => void
  update: (item: T) => void
  deleteById: (id: EntityId) => void
}

export const createRepository = (): Repository<CharacterSheet> => {
  const storageFolder = path.join(app.getPath('userData'), 'lowdb')
  fs.mkdirSync(storageFolder, { recursive: true })

  const storagePath = path.join(storageFolder, 'characters.json')
  const lowdbInstance = JSONFileSyncPreset<CharacterdbType>(storagePath, initialState)

  const getAll = () => lowdbInstance.data.characters
  const getById = (id: EntityId) => lowdbInstance.data.characters.find((sheet) => sheet.id === id)
  
  const insert = (item: CharacterSheet) => {
    lowdbInstance.data.characters.push(item)
    lowdbInstance.write()
  }

  const update = (item: CharacterSheet) => {
    const targetIndex = lowdbInstance.data.characters.findIndex(c => c.id === item.id)
    if (targetIndex !== -1) {
      lowdbInstance.data.characters[targetIndex] = {...item}
      lowdbInstance.write()
    }
  }

  const deleteById = (id: EntityId) => {
    lowdbInstance.data.characters = lowdbInstance.data.characters.filter(c => c.id !== id)
    lowdbInstance.write()
  }

  return {
    getAll,
    getById,
    insert,
    update,
    deleteById
  }
}