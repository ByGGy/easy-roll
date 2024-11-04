import { BrowserWindow } from 'electron'

import { messageBus } from '../events/messageBus'

import { RollResult } from '../common/types'

export const createRelay = (window: BrowserWindow) => {

  // NB: this is just to guaranty that we will propagate the event with the same name
  const transfer = (eventName: string, listener: (...args: any[]) => void) => {
    messageBus.on(eventName, (...args) => listener(eventName, ...args))
  }

  const handleStateUpdate = <T>(eventName: string, previousState: T, currentState: T) => {
    const data = JSON.stringify({ previous: previousState, current: currentState })
    window.webContents.send(eventName, data)
  }

  transfer('Domain.Session.update', handleStateUpdate)
  transfer('Domain.CharacterCollection.update', handleStateUpdate)

  const handleRollResult = (roll: RollResult) => {
    window.webContents.send('Domain.Roll.new', JSON.stringify(roll))
  }

  messageBus.on('Domain.DiceTray.roll', handleRollResult)
  messageBus.on('Domain.Aria.check', handleRollResult)
  messageBus.on('Domain.Rdd.check', handleRollResult)

  return {}
}