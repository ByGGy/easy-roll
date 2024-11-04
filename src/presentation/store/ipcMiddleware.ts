import { Middleware, UnknownAction } from 'redux'

import { update as characterCollectionUpdate } from './characterCollectionSlice'
import { update as sessionUpdate } from './sessionSlice'
import { add as addToHistory } from './rollHistorySlice'

export const ipcMiddleware: Middleware = (store) => {
  window.electronAPI.onMessage('Domain.CharacterCollection.update', (data: string) => {
    const states = JSON.parse(data)
    store.dispatch(characterCollectionUpdate(states.current.characters))
  })

  window.electronAPI.onMessage('Domain.Session.update', (data: string) => {
    const states = JSON.parse(data)
    store.dispatch(sessionUpdate(states.current.characterId))
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