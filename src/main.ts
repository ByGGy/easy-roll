import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path';

import { createRepository } from './persistence/character/repository'
import { createCharacterCollection } from './domain/character/characterCollection'
import { createSession } from './domain/session/session'
import { engine as diceTrayEngine } from './domain/dicetray/engine'
import { engine as ariaEngine } from './domain/aria/engine'
import { engine as rddEngine } from './domain/rdd/engine'
import { createRelay as createDiscordRelay } from './domain/discord/relay'
import { createRelay as createFrontRelay } from './domain/front/relay'
import { EntityId, Game, Attribute } from './domain/common/types'

// import { runTest } from './domain/dicetray/roll'
// runTest()

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const characterRepository = createRepository()
const characterCollection = createCharacterCollection(characterRepository)
const discordRelay = createDiscordRelay(characterRepository)
const session = createSession()
let frontRelay

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1650,
    height: 950,
    backgroundColor: '#0e100b',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Hide the menu bad (needed in DEV mode)
  mainWindow.setMenuBarVisibility(false)

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  frontRelay = createFrontRelay(mainWindow)

  mainWindow.webContents.once('did-finish-load', () => {
    characterCollection.initialize()
  })
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

const handleGetAppVersion = (event: unknown) => {
  return app.getVersion()
}

const handleToggleDiscordNotification = (event: unknown, enable: boolean) => {
  enable ? discordRelay.enable() : discordRelay.disable()
}

const handleCreateDefaultCharacterSheet = (event: unknown, game: Game) => {
  characterCollection.createCharacter(game)
}

const handleRenameCharacter = (event: unknown, id: EntityId, newName: string) => {
  characterCollection.renameCharacter(id, newName)
}

const handleChangeCharacterAttributes = (event: unknown, id: EntityId, newAttributes: Array<Attribute>) => {
  characterCollection.changeCharacterAttributes(id, newAttributes)
}

const handleOpenSession = (event: unknown, id: EntityId) => {
  session.start(id)
}

const handleCloseSession = (event: unknown) => {
  session.end()
}

const handleDiceTrayRoll = (event: unknown, diceFaceQty: number, diceQty: number, modifier: number) => {
  if (session.state.characterId !== null) {
    const currentCharacter = characterRepository.getById(session.state.characterId)
    if (currentCharacter) {
      diceTrayEngine.rollDices(currentCharacter, diceFaceQty, diceQty, modifier)
    }
  }
}

const handleAriaCheckAttribute = (event: unknown, attributeName: string, difficulty: number, modifier: number) => {
  if (session.state.characterId !== null) {
    const currentCharacter = characterRepository.getById(session.state.characterId)
    if (currentCharacter) {
      ariaEngine.checkAttribute(currentCharacter, attributeName, difficulty, modifier)
    }
  }
}

const handleAriaCheckAbility = (event: unknown, abilityName: string, modifier: number) => {
  if (session.state.characterId !== null) {
    const currentCharacter = characterRepository.getById(session.state.characterId)
    if (currentCharacter) {
      ariaEngine.checkAbility(currentCharacter, abilityName, modifier)
    }
  }
}

const handleRddCheckAttribute = (event: unknown, attributeName: string, abilityName: string, modifier: number) => {
  if (session.state.characterId !== null) {
    const currentCharacter = characterRepository.getById(session.state.characterId)
    if (currentCharacter) {
      rddEngine.checkAttribute(currentCharacter, attributeName, abilityName, modifier)
    }
  }
}

app.whenReady().then(() => {
  ipcMain.handle('getAppVersion', handleGetAppVersion)

  ipcMain.handle('toggleDiscordNotification', handleToggleDiscordNotification)

  ipcMain.handle('createDefaultCharacterSheet', handleCreateDefaultCharacterSheet)
  ipcMain.handle('renameCharacter', handleRenameCharacter)
  ipcMain.handle('changeCharacterAttributes', handleChangeCharacterAttributes)

  ipcMain.handle('openSession', handleOpenSession)
  ipcMain.handle('closeSession', handleCloseSession)

  ipcMain.handle('diceTrayRoll', handleDiceTrayRoll)

  ipcMain.handle('ariaCheckAttribute', handleAriaCheckAttribute)
  ipcMain.handle('ariaCheckAbility', handleAriaCheckAbility)

  ipcMain.handle('rddCheckAttribute', handleRddCheckAttribute)
})
