// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'

import { EntityId, Game, Attribute, Ability, NotificationLevel, DiceAction, CharacterRollRequest } from './domain/common/types'

declare global {
  interface Window {
    electronAPI?: any;
  }
}

// TODO: that's a lot of boilerplates to trigger something from renderer to Main process
// NB: the other way is a lot easier, i.e. Main process to renderer, cause everything is goin through the onMessage
// but we're loosing data typing; btw, it's lost both ways: Window.electronAPI?: any
contextBridge.exposeInMainWorld('electronAPI', {
  onMessage: (channel: string, callback: (data: string) => void) => ipcRenderer.on(channel, (event, data) => callback(data)),

  getAppVersion: () => ipcRenderer.invoke('getAppVersion'),

  createSession: (game: Game) => ipcRenderer.invoke('createSession', game),
  renameSession: (id: EntityId, newName: string) => ipcRenderer.invoke('renameSession', id, newName),
  createCharacterForSession: (id: EntityId) => ipcRenderer.invoke('createCharacterForSession', id),
  tryImportCharacterForSession: (id: EntityId) => ipcRenderer.invoke('tryImportCharacterForSession', id),
  addCharacterToSession: (id: EntityId, characterId: EntityId) => ipcRenderer.invoke('addCharacterToSession', id, characterId),
  removeCharacterFromSession: (id: EntityId, characterId: EntityId) => ipcRenderer.invoke('removeCharacterFromSession', id, characterId),

  renameCharacter: (id: EntityId, newName: string) => ipcRenderer.invoke('renameCharacter', id, newName),
  changeCharacterAttributes: (id: EntityId, newAttributes: Array<Attribute>) => ipcRenderer.invoke('changeCharacterAttributes', id, newAttributes),
  changeCharacterAbilities: (id: EntityId, newAbilities: Array<Ability>) => ipcRenderer.invoke('changeCharacterAbilities', id, newAbilities),
  changeCharacterDiceActions: (id: EntityId, newDiceActions: Array<DiceAction>) => ipcRenderer.invoke('changeCharacterDiceActions', id, newDiceActions),
  changeCharacterDiscordNotification: (id: EntityId, enable: boolean, level: NotificationLevel, channelId: string) => ipcRenderer.invoke('changeCharacterDiscordNotification', id, enable, level, channelId),
  toggleCharacterDiscordNotification: (id: EntityId) => ipcRenderer.invoke('toggleCharacterDiscordNotification', id),

  evaluateCharacterSuccessRatio : (request: CharacterRollRequest) => ipcRenderer.invoke('evaluateCharacterSuccessRatio', request),
  checkCharacter: (request: CharacterRollRequest) => ipcRenderer.invoke('checkCharacter', request),

  diceTrayRoll: (characterId: EntityId, diceFaceQty: number, diceQty: number, modifier: number) => ipcRenderer.invoke('diceTrayRoll', characterId, diceFaceQty, diceQty, modifier),
  diceTrayValidate: (expression: string) => ipcRenderer.invoke('diceTrayValidate', expression),
  diceTrayEvaluate: (characterId: EntityId, expression: string) => ipcRenderer.invoke('diceTrayEvaluate', characterId, expression),
  diceActionExecute: (characterId: EntityId, actionName: string) => ipcRenderer.invoke('diceActionExecute', characterId, actionName),
})