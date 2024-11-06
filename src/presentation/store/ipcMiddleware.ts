import { Middleware, UnknownAction } from 'redux'

import { updateCollection as updateCharacterCollection, updateCharacter } from './characterCollectionSlice'
import { update as updateSession } from './sessionSlice'
import { add as addToHistory } from './rollHistorySlice'

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

  window.electronAPI.onMessage('Domain.Session.update', (data: string) => {
    const states = JSON.parse(data)
    store.dispatch(updateSession(states.current.characterId))
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