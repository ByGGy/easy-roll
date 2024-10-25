// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron'

import { EntityId } from './domain/common/types'

declare global {
  interface Window {
    electronAPI?: any;
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  onMessage: (channel: string, callback: (data: string) => void) => ipcRenderer.on(channel, (event, data) => callback(data)),

  getAppVersion: () => ipcRenderer.invoke('getAppVersion'),

  toggleDiscordNotification: (enable: boolean) => ipcRenderer.invoke('toggleDiscordNotification', enable),

  getAllCharacterSheets: () => ipcRenderer.invoke('getAllCharacterSheets'),
  openSession: (id: EntityId) => ipcRenderer.invoke('openSession', id),
  closeSession: () => ipcRenderer.invoke('closeSession'),

  diceTrayRoll: (diceFaceQty: number, diceQty: number, modifier: number) => ipcRenderer.invoke('diceTrayRoll', diceFaceQty, diceQty, modifier),

  ariaCheckAttribute: (attributeName: string, difficulty: number, modifier: number) => ipcRenderer.invoke('ariaCheckAttribute', attributeName, difficulty, modifier),
  ariaCheckAbility: (abilityName: string, modifier: number) => ipcRenderer.invoke('ariaCheckAbility', abilityName, modifier),

  rddCheckAttribute: (attributeName: string, abilityName: string, modifier: number) => ipcRenderer.invoke('rddCheckAttribute', attributeName, abilityName, modifier),
})