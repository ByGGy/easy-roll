import { BrowserWindow } from 'electron'

import { messageBus } from '../events/messageBus'

import { EntityId } from '../common/types'

export const createRelay = (window: BrowserWindow) => {

  const handleSessionStart = (characterId: EntityId) => {
    window.webContents.send('domain-update', `character ${characterId} session has begun`)
  }

  const handleSessionEnd = (characterId: EntityId) => {
    window.webContents.send('domain-update', `character ${characterId} session has ended`)
  }

  messageBus.on('Domain.Session.start', handleSessionStart)
  messageBus.on('Domain.Session.end', handleSessionEnd)

  return {}
}