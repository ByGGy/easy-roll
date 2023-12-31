// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

declare global {
  interface Window {
    electronAPI?: any;
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  getCurrentCharacter: () => ipcRenderer.invoke('getCurrentCharacter'),
  checkAttribute: (attributeName: string, difficulty: number, modifier: number) => ipcRenderer.invoke('checkAttribute', attributeName, difficulty, modifier),
  checkAbility: (abilityName: string, modifier: number) => ipcRenderer.invoke('checkAbility', abilityName, modifier),
})