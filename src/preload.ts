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

  getAllCharacterSheets: () => ipcRenderer.invoke('getAllCharacterSheets'),
  openSession: (id: EntityId) => ipcRenderer.invoke('openSession', id),
  closeSession: () => ipcRenderer.invoke('closeSession'),

  getCurrentCharacter: () => ipcRenderer.invoke('getCurrentCharacter'),
  checkAttribute: (attributeName: string, difficulty: number, modifier: number) => ipcRenderer.invoke('checkAttribute', attributeName, difficulty, modifier),
  checkAbility: (abilityName: string, modifier: number) => ipcRenderer.invoke('checkAbility', abilityName, modifier),
})