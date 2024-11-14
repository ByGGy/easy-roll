import { Middleware, UnknownAction } from 'redux'

import { updateCollection as updateCharacterCollection, updateCharacter } from './characterCollectionSlice'
import { updateCollection as updateSessionCollection, updateSession } from './sessionCollectionSlice'
import { add as addToHistory } from './rollHistorySlice'
import { pickCharacter } from './selectionSlice'

import { EntityId } from '../../domain/common/types'

export const ipcMiddleware: Middleware = (store) => {
  window.electronAPI.onMessage('Domain.CharacterRepository.update', (data: string) => {
    // TODO: need data validation and typing instead of just parsing with implicit any
    const characters = JSON.parse(data)
    store.dispatch(updateCharacterCollection(characters))
  })

  window.electronAPI.onMessage('Domain.Character.update', (data: string) => {
    const states = JSON.parse(data)
    store.dispatch(updateCharacter(states))
  })

  window.electronAPI.onMessage('Domain.SessionRepository.update', (data: string) => {
    const sessions = JSON.parse(data)
    store.dispatch(updateSessionCollection(sessions))
  })

  window.electronAPI.onMessage('Domain.Session.update', (data: string) => {
    const states = JSON.parse(data)
    store.dispatch(updateSession(states))

    // Auto select a new character added to the session
    const oldCharacterIds: Array<EntityId> = states.previous.characterIds
    const newCharacterIds: Array<EntityId> = states.current.characterIds
    if (newCharacterIds.length > oldCharacterIds.length) {
      const newCharacterId = newCharacterIds.find(id => !oldCharacterIds.includes(id))
      if (newCharacterId) {
        store.dispatch(pickCharacter(newCharacterId))
      }
    }
  })

  window.electronAPI.onMessage('Domain.Roll.new', (data: string) => {
    const rollResult = JSON.parse(data)
    store.dispatch(addToHistory(rollResult))
  })

  return (next) => (action: UnknownAction) => {
    // Pass all actions through by default
    return next(action)
  }
}