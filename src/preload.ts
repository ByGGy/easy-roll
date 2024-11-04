// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'

import { EntityId, Game, Attribute, Ability, NotificationLevel } from './domain/common/types'

declare global {
  interface Window {
    electronAPI?: any;
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  onMessage: (channel: string, callback: (data: string) => void) => ipcRenderer.on(channel, (event, data) => callback(data)),

  getAppVersion: () => ipcRenderer.invoke('getAppVersion'),

  tryImportCharacter: () => ipcRenderer.invoke('tryImportCharacter'),

  createDefaultCharacterSheet: (game: Game) => ipcRenderer.invoke('createDefaultCharacterSheet', game),
  renameCharacter: (id: EntityId, newName: string) => ipcRenderer.invoke('renameCharacter', id, newName),
  changeCharacterAttributes: (id: EntityId, newAttributes: Array<Attribute>) => ipcRenderer.invoke('changeCharacterAttributes', id, newAttributes),
  changeCharacterAbilities: (id: EntityId, newAbilities: Array<Ability>) => ipcRenderer.invoke('changeCharacterAbilities', id, newAbilities),
  changeCharacterDiscordNotification: (id: EntityId, enable: boolean, level: NotificationLevel, channelId: string) => ipcRenderer.invoke('changeCharacterDiscordNotification', id, enable, level, channelId),
  toggleCharacterDiscordNotification: (id: EntityId, enable: boolean) => ipcRenderer.invoke('toggleCharacterDiscordNotification', id, enable),

  openSession: (id: EntityId) => ipcRenderer.invoke('openSession', id),
  closeSession: () => ipcRenderer.invoke('closeSession'),

  diceTrayRoll: (diceFaceQty: number, diceQty: number, modifier: number) => ipcRenderer.invoke('diceTrayRoll', diceFaceQty, diceQty, modifier),

  ariaCheckAttribute: (attributeName: string, difficulty: number, modifier: number) => ipcRenderer.invoke('ariaCheckAttribute', attributeName, difficulty, modifier),
  ariaCheckAbility: (abilityName: string, modifier: number) => ipcRenderer.invoke('ariaCheckAbility', abilityName, modifier),

  rddCheckAttribute: (attributeName: string, abilityName: string, modifier: number) => ipcRenderer.invoke('rddCheckAttribute', attributeName, abilityName, modifier),
})