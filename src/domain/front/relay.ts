import { BrowserWindow } from 'electron'

import { messageBus } from '../events/messageBus'

import { SessionState } from '../session/session'

export const createRelay = (window: BrowserWindow) => {

  // NB: this is just to guaranty that we will propagate the event with the same name
  const transfer = (eventName: string, listener: (...args: any[]) => void) => {
    messageBus.on(eventName, (...args) => listener(eventName, ...args))
  }

  const handleSessionUpdate = (eventName: string, previousState: SessionState, currentState: SessionState) => {
    const data = JSON.stringify({ previous: previousState, current: currentState })
    window.webContents.send(eventName, data)
  }

  transfer('Domain.Session.update', handleSessionUpdate)

  return {}
}