import path from 'path'
import { app } from 'electron'
import fs from 'fs'
import { JSONFileSyncPreset } from 'lowdb/node'

import { messageBus } from '../../domain/events/messageBus'
import { EntityId, EntityWithState } from '../../domain/common/types'
import { Character, CharacterData, CharacterState, rehydrate } from '../../domain/character/character'

export type Repository<TModel extends EntityWithState<TState>, TState extends object> = {
  pulse: () => void
  getAll: () => Readonly<Array<TModel>>
  getById: (id: EntityId) => TModel | undefined
  insert: (item: TModel) => void
  update: (item: TModel) => void
  deleteById: (id: EntityId) => void
}

type CharacterdbType = {
  characters: CharacterData[]
}

const initialState: CharacterdbType = { characters: [] }

export const createRepository = (): Repository<Character, CharacterState> => {
  const storageFolder = path.join(app.getPath('userData'), 'lowdb')
  fs.mkdirSync(storageFolder, { recursive: true })

  const storagePath = path.join(storageFolder, 'characters.json')
  const lowdbInstance = JSONFileSyncPreset<CharacterdbType>(storagePath, initialState)

  let cache: Array<Character> = lowdbInstance.data.characters.map(c => rehydrate(c))

  const pulse =  () => {
    messageBus.emit('Domain.CharacterRepository.update', getAll())
  }

  const getAll = () => [...cache]
  const getById = (id: EntityId) => cache.find((c) => c.id === id)
  
  const insert = (item: Character) => {
    cache.push(item)
    pulse()

    lowdbInstance.data.characters.push(item)
    lowdbInstance.write()
  }

  const update = (item: Character) => {
    const targetIndex = lowdbInstance.data.characters.findIndex(c => c.id === item.id)
    if (targetIndex !== -1) {
      lowdbInstance.data.characters[targetIndex] = {...item}
      lowdbInstance.write()
    }
  }

  const deleteById = (id: EntityId) => {
    cache = cache.filter(c => c.id !== id)
    pulse()
  
    lowdbInstance.data.characters = lowdbInstance.data.characters.filter(c => c.id !== id)
    lowdbInstance.write()
  }

  const handleCharacterUpdate = (id: EntityId) => {
    const targetCharacter = getById(id)
    if (targetCharacter) {
      update(targetCharacter)
    }
  }

  messageBus.on('Domain.Character.update', handleCharacterUpdate)

  return {
    pulse,
    getAll,
    getById,
    insert,
    update,
    deleteById
  }
}