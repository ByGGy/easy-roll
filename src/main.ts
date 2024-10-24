import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path';

import { createRepository } from './domain/character/repository'
import { createSession } from './domain/session/session'
import { engine as diceTrayEngine } from './domain/dicetray/engine'
import { engine as ariaEngine } from './domain/aria/engine'
import { engine as rddEngine } from './domain/rdd/engine'
import { createRelay as createDiscordRelay } from './domain/discord/relay'
import { createRelay as createFrontRelay } from './domain/front/relay'
import { EntityId } from './domain/common/types'

// import { runTest } from './domain/dice/roll'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const characterRepository = createRepository()
const discordRelay = createDiscordRelay(characterRepository)
const session = createSession(characterRepository)
let frontRelay

// runTest()

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1100,
    backgroundColor: '#0e100b',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Hide the menu bad (needed in DEV mode)
  mainWindow.setMenuBarVisibility(true)

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  frontRelay = createFrontRelay(mainWindow)
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
});

app.on('before-quit', () => {
  // Not working ?
  session.end()
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

const handleToggleDiscordNotification = (event: unknown, enable: boolean) => {
  enable ? discordRelay.enable() : discordRelay.disable()
}

const handleGetAllCharacterSheets = (event: unknown) => {
  return JSON.stringify(characterRepository.getAll())
}

const handleOpenSession = (event: unknown, id: EntityId) => {
  session.start(id)
}

const handleCloseSession = (event: unknown) => {
  session.end()
}

const handleDiceTrayRoll = (event: unknown, diceFaceQty: number, diceQty: number, modifier: number) => {
  const currentCharacter = session.state.character
  if (currentCharacter !== null) {
    diceTrayEngine.rollDices(currentCharacter, diceFaceQty, diceQty, modifier)
  }
}

const handleAriaCheckAttribute = (event: unknown, attributeName: string, difficulty: number, modifier: number) => {
  const currentCharacter = session.state.character
  if (currentCharacter !== null) {
    ariaEngine.checkAttribute(currentCharacter, attributeName, difficulty, modifier)
  }
}

const handleAriaCheckAbility = (event: unknown, abilityName: string, modifier: number) => {
  const currentCharacter = session.state.character
  if (currentCharacter !== null) {
    ariaEngine.checkAbility(currentCharacter, abilityName, modifier)
  }
}

const handleRddCheckAttribute = (event: unknown, attributeName: string, abilityName: string, modifier: number) => {
  const currentCharacter = session.state.character
  if (currentCharacter !== null) {
    rddEngine.checkAttribute(currentCharacter, attributeName, abilityName, modifier)
  }
}

app.whenReady().then(() => {
  ipcMain.handle('toggleDiscordNotification', handleToggleDiscordNotification)

  ipcMain.handle('getAllCharacterSheets', handleGetAllCharacterSheets)
  ipcMain.handle('openSession', handleOpenSession)
  ipcMain.handle('closeSession', handleCloseSession)

  ipcMain.handle('diceTrayRoll', handleDiceTrayRoll)

  ipcMain.handle('ariaCheckAttribute', handleAriaCheckAttribute)
  ipcMain.handle('ariaCheckAbility', handleAriaCheckAbility)

  ipcMain.handle('rddCheckAttribute', handleRddCheckAttribute)
})
