import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

import { createRepository } from './domain/character/repository'
import { createSession } from './domain/session/session'
import { createRelay } from './domain/discord/relay'

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const characterRepository = createRepository()
const discordRelay = createRelay(characterRepository)
const session = createSession(characterRepository)

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    backgroundColor: '#002b47',
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
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  
  const characters = characterRepository.getAll()
  session.start(characters[0].id)
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

const handleGetCurrentCharacter = () => {
  return JSON.stringify(session.getCurrentCharacter())
}

const handleCheckAttribute = (event: unknown, attributeName: string, difficulty: number, modifier: number) => {
  const currentCharacter = session.getCurrentCharacter()
  if (currentCharacter !== null) {
    return currentCharacter.checkAttribute(attributeName, difficulty, modifier)
  }
}

const handleCheckAbility = (event: unknown, abilityName: string, modifier: number) => {
  const currentCharacter = session.getCurrentCharacter()
  if (currentCharacter !== null) {
    return currentCharacter.checkAbility(abilityName, modifier)
  }
}

app.whenReady().then(() => {
  ipcMain.handle('getCurrentCharacter', handleGetCurrentCharacter)
  ipcMain.handle('checkAttribute', handleCheckAttribute)
  ipcMain.handle('checkAbility', handleCheckAbility)
})
