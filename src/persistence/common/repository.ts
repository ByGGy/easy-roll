import path from 'path'
import { app } from 'electron'
import fs from 'fs'
import { JSONFileSyncPreset } from 'lowdb/node'
import { capitalize } from 'lodash'

import { messageBus } from '../../domain/events/messageBus'
import { EntityId, EntityWithState } from '../../domain/common/types'

const EXPECTED_DATA_MODEL_VERSION = 2

type LowdbShape<TState> = {
  version: number
  items: EntityWithState<TState>[]
}

export type Repository<TModel extends EntityWithState<TState>, TState extends object> = {
  pulse: () => void
  getAll: () => Readonly<Array<TModel>>
  getById: (id: EntityId) => TModel | undefined
  insert: (item: TModel) => void
  update: (item: TModel) => void
  deleteById: (id: EntityId) => void
}

export const createRepository = <TModel extends EntityWithState<TState>, TState extends object>(
  modelName: string,
  rehydrate: (data: EntityWithState<TState>) => TModel
): Repository<TModel, TState> => {

  const fileName = `${modelName.toLowerCase()}s.json`
  // TODO: shouldn't be a "Domain." event, but a "Persistence." event ?
  const repositoryUpdateEventName = `Domain.${capitalize(modelName)}Repository.update`
  const modelUpdateEventName = `Domain.${capitalize(modelName)}.update`

  const storageFolder = path.join(app.getPath('userData'), 'lowdb', `v${EXPECTED_DATA_MODEL_VERSION}`)
  fs.mkdirSync(storageFolder, { recursive: true })

  const storagePath = path.join(storageFolder, fileName)
  const initialState: LowdbShape<TState> = { version: EXPECTED_DATA_MODEL_VERSION, items: [] }
  const lowdbInstance = JSONFileSyncPreset<LowdbShape<TState>>(storagePath, initialState)

  let cache: Array<TModel> = lowdbInstance.data.items.map(c => rehydrate(c))

  const pulse =  () => {
    messageBus.emit(repositoryUpdateEventName, getAll())
  }

  const getAll = () => [...cache]
  const getById = (id: EntityId) => cache.find((model) => model.id === id)
  
  const insert = (item: TModel) => {
    cache.push(item)
    pulse()

    lowdbInstance.data.items.push(item)
    lowdbInstance.write()
  }

  const update = (item: TModel) => {
    const targetIndex = lowdbInstance.data.items.findIndex(dataModel => dataModel.id === item.id)
    if (targetIndex !== -1) {
      lowdbInstance.data.items[targetIndex] = {...item}
      lowdbInstance.write()
    }
  }

  const deleteById = (id: EntityId) => {
    cache = cache.filter(model => model.id !== id)
    pulse()
  
    lowdbInstance.data.items = lowdbInstance.data.items.filter(dataModel => dataModel.id !== id)
    lowdbInstance.write()
  }

  const handleItemUpdate = (id: EntityId) => {
    const targetItem = getById(id)
    if (targetItem) {
      update(targetItem)
    }
  }

  messageBus.on(modelUpdateEventName, handleItemUpdate)

  return {
    pulse,
    getAll,
    getById,
    insert,
    update,
    deleteById
  }
}