import { BrowserWindow } from 'electron'

import { messageBus } from '../events/messageBus'
import { EntityId, RollResult } from '../common/types'
import { Character } from '../character/character'
import { Session } from '../session/session'
import { ParserResult } from '../dicetray/calculator/input/parser'

export const createRelay = (window: BrowserWindow) => {

  // NB: this is just to guaranty that we will propagate the event with the same name
  const transfer = (eventName: string, listener: (...args: any[]) => void) => {
    messageBus.on(eventName, (...args) => listener(eventName, ...args))
  }

  const handleStateUpdate = <T>(eventName: string, id: EntityId, previousState: T, currentState: T) => {
    const data = JSON.stringify({ id, previous: previousState, current: currentState })
    window.webContents.send(eventName, data)
  }

  transfer('Domain.Session.update', handleStateUpdate)
  transfer('Domain.Character.update', handleStateUpdate)

  const handleCharacterRepositoryUpdate = (eventName: string, characters: Array<Character>) => {
    window.webContents.send(eventName, JSON.stringify(characters))
  }

  transfer('Domain.CharacterRepository.update', handleCharacterRepositoryUpdate)
  
  const handleSessionRepositoryUpdate = (eventName: string, sessions: Array<Session>) => {
    window.webContents.send(eventName, JSON.stringify(sessions))
  }

  transfer('Domain.SessionRepository.update', handleSessionRepositoryUpdate)

  const handleNumber = (eventName: string, value: number) => {
    window.webContents.send(eventName, value)
  }

  transfer('Domain.Aria.successRatio', handleNumber)

  const handleDiceTrayValidation = (eventName: string, validationResult: ParserResult) => {
    window.webContents.send(eventName, JSON.stringify(validationResult))
  }

  transfer('Domain.DiceTray.validation', handleDiceTrayValidation)

  const handleRollResult = (roll: RollResult) => {
    window.webContents.send('Domain.Roll.new', JSON.stringify(roll))
  }

  messageBus.on('Domain.DiceTray.roll', handleRollResult)

  return {}
}