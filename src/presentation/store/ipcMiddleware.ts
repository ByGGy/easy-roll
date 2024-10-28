import { Middleware, UnknownAction } from 'redux'

import { update as sessionUpdate } from './sessionSlice'
import { update as discordUpdate } from './discordSlice'
import { add } from './rollHistorySlice'

export const ipcMiddleware: Middleware = (store) => {
  window.electronAPI.onMessage('Domain.Session.update', (data: string) => {
    const states = JSON.parse(data)
    store.dispatch(sessionUpdate(states.current.character))
  })

  window.electronAPI.onMessage('Domain.Discord.update', (data: string) => {
    const states = JSON.parse(data)
    store.dispatch(discordUpdate(states.current.isEnabled))
  })

  window.electronAPI.onMessage('Domain.Roll.new', (data: string) => {
    const rollResult = JSON.parse(data)
    store.dispatch(add(rollResult))
  })

  return (next) => (action: UnknownAction) => {
    // Pass all actions through by default
    return next(action)
  }
}