import path from 'path'
import { app } from 'electron'
import fs from 'fs'
import { JSONFileSyncPreset } from 'lowdb/node'

import { messageBus } from '../../domain/events/messageBus'
import { EntityId } from '../../domain/common/types'
import { Repository } from '../common/types'
import { Session, SessionData, SessionState, rehydrate } from '../../domain/session/session'

type SessiondbType = {
  sessions: SessionData[]
}

const initialState: SessiondbType = { sessions: [] }

// TODO: make a Repository<T> implementation to avoid duplicated code
export const createRepository = (): Repository<Session, SessionState> => {
  const storageFolder = path.join(app.getPath('userData'), 'lowdb')
  fs.mkdirSync(storageFolder, { recursive: true })

  const storagePath = path.join(storageFolder, 'sessions.json')
  const lowdbInstance = JSONFileSyncPreset<SessiondbType>(storagePath, initialState)

  let cache: Array<Session> = lowdbInstance.data.sessions.map(c => rehydrate(c))

  const pulse =  () => {
    messageBus.emit('Domain.SessionRepository.update', getAll())
  }

  const getAll = () => [...cache]
  const getById = (id: EntityId) => cache.find((c) => c.id === id)
  
  const insert = (item: Session) => {
    cache.push(item)
    pulse()

    lowdbInstance.data.sessions.push(item)
    lowdbInstance.write()
  }

  const update = (item: Session) => {
    const targetIndex = lowdbInstance.data.sessions.findIndex(c => c.id === item.id)
    if (targetIndex !== -1) {
      lowdbInstance.data.sessions[targetIndex] = {...item}
      lowdbInstance.write()
    }
  }

  const deleteById = (id: EntityId) => {
    cache = cache.filter(c => c.id !== id)
    pulse()
  
    lowdbInstance.data.sessions = lowdbInstance.data.sessions.filter(c => c.id !== id)
    lowdbInstance.write()
  }

  const handleSessionUpdate = (id: EntityId) => {
    const targetSession = getById(id)
    if (targetSession) {
      update(targetSession)
    }
  }

  messageBus.on('Domain.Session.update', handleSessionUpdate)

  return {
    pulse,
    getAll,
    getById,
    insert,
    update,
    deleteById
  }
}