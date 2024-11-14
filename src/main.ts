import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'

import { EntityId, Game, Attribute, Ability, NotificationLevel } from './domain/common/types'
import { isNotNull } from './domain/common/tools'
import { createRepository } from './persistence/common/repository'
import { rehydrate as rehydrateCharacter } from './domain/character/character'
import { createCharacterService } from './domain/character/characterService'
import { rehydrate as rehydrateSession, create as createSession } from './domain/session/session'
import { engine as diceTrayEngine } from './domain/dicetray/engine'
import { engine as ariaEngine } from './domain/aria/engine'
import { engine as rddEngine } from './domain/rdd/engine'
import { createRelay as createDiscordRelay } from './domain/discord/relay'
import { createRelay as createFrontRelay } from './domain/front/relay'

// TODO: support streamdeck integration ?

// TODO: use some unit testing lib instead of this..
// import { runTest } from './domain/dicetray/roll'
// runTest()

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const characterRepository = createRepository('Character', rehydrateCharacter)
const sessionRepository = createRepository('Session', rehydrateSession)
const characterService = createCharacterService()
const discordRelay = createDiscordRelay(characterRepository)
let frontRelay

const createWindow = () => {
  // Create the browser window.
  // TODO: store and apply window last position & size ? cf https://github.com/electron/electron/issues/526
  const mainWindow = new BrowserWindow({
    width: 1800,
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
    characterRepository.pulse()
    sessionRepository.pulse()
  })
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
});

app.on('before-quit', () => {
  //
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

const handleCreateSession = (event: unknown, game: Game) => {
  const initialState = {
    game,
    name: 'New Session',
    description: 'Wubba Lubba Dub Dub',
    characterIds: [],
    creationDate: new Date().toISOString(),
  }

  sessionRepository.insert(createSession(initialState))
}

const handleRenameSession = (event: unknown, id: EntityId, newName: string) => {
  const targetSession = sessionRepository.getById(id)
  if (targetSession) {
    targetSession.rename(newName)
  }
}

const handleCreateCharacterForSession = (event: unknown, id: EntityId) => {
  const targetSession = sessionRepository.getById(id)
  if (targetSession) {
    const newCharacter = characterService.createFor(targetSession.state.game)
    characterRepository.insert(newCharacter)
    targetSession.changeCharacters([...targetSession.state.characterIds, newCharacter.id])
  }
}

const handleTryImportCharacterForSession = (event: unknown, id: EntityId) => {
  const targetSession = sessionRepository.getById(id)
  if (targetSession) {
    const pathToLookAt = path.join(app.getPath('userData'), 'characters')
    const filesToImport = dialog.showOpenDialogSync({
      defaultPath: pathToLookAt,
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'JSON Character File', extensions: ['json'] },
      ]
    })
  
    if (filesToImport) {
      const newCharacters = filesToImport.map(characterService.tryCreateFromFile).filter(isNotNull)
      newCharacters.forEach(characterRepository.insert)
      targetSession.changeCharacters([...targetSession.state.characterIds, ...newCharacters.map(c => c.id)])
    }
  }
}

const handleAddCharacterToSession = (event: unknown, id: EntityId, characterId: EntityId) => {
  const targetSession = sessionRepository.getById(id)
  if (targetSession) {
    const targetCharacter = characterRepository.getById(characterId)
    if (targetCharacter) {
      targetSession.changeCharacters([...targetSession.state.characterIds, targetCharacter.id])
    }
  }
}

const handleRenameCharacter = (event: unknown, id: EntityId, newName: string) => {
  const targetCharacter = characterRepository.getById(id)
  if (targetCharacter) {
    targetCharacter.rename(newName)
  }
}

const handleChangeCharacterAttributes = (event: unknown, id: EntityId, newAttributes: Array<Attribute>) => {
  const targetCharacter = characterRepository.getById(id)
  if (targetCharacter) {
    targetCharacter.changeAttributes(newAttributes)
  }
}

const handleChangeCharacterAbilities = (event: unknown, id: EntityId, newAbilities: Array<Ability>) => {
  const targetCharacter = characterRepository.getById(id)
  if (targetCharacter) {
    targetCharacter.changeAbilities(newAbilities)
  }
}

const handleChangeCharacterDiscordNotification = (event: unknown, id: EntityId, enable: boolean, level: NotificationLevel, channelId: string) => {
  const targetCharacter = characterRepository.getById(id)
  if (targetCharacter) {
    targetCharacter.changeDiscordConfiguration({ enable, level, channelId})
  }
}

const handleToggleCharacterDiscordNotification = (event: unknown, id: EntityId) => {
  const targetCharacter = characterRepository.getById(id)
  if (targetCharacter) {
    const newConfiguration = {...targetCharacter.state.discordNotification, enable: !targetCharacter.state.discordNotification.enable}
    targetCharacter.changeDiscordConfiguration(newConfiguration)
  }
}

const handleDiceTrayRoll = (event: unknown, characterId: EntityId, diceFaceQty: number, diceQty: number, modifier: number) => {
  const currentCharacter = characterRepository.getById(characterId)
  if (currentCharacter) {
    diceTrayEngine.rollDices(currentCharacter, diceFaceQty, diceQty, modifier)
  }
}

const handleAriaCheckAttribute = (event: unknown, characterId: EntityId, attributeName: string, difficulty: number, modifier: number) => {
  const currentCharacter = characterRepository.getById(characterId)
  if (currentCharacter) {
    ariaEngine.checkAttribute(currentCharacter, attributeName, difficulty, modifier)
  }
}

const handleAriaCheckAbility = (event: unknown, characterId: EntityId, abilityName: string, modifier: number) => {
  const currentCharacter = characterRepository.getById(characterId)
  if (currentCharacter) {
    ariaEngine.checkAbility(currentCharacter, abilityName, modifier)
  }
}

const handleRddCheckAttribute = (event: unknown, characterId: EntityId, attributeName: string, abilityName: string, modifier: number) => {
  const currentCharacter = characterRepository.getById(characterId)
  if (currentCharacter) {
    rddEngine.checkAttribute(currentCharacter, attributeName, abilityName, modifier)
  }
}

app.whenReady().then(() => {
  // TODO: should put all those subscriptions, handlers and domain initialization in separate files
  ipcMain.handle('getAppVersion', handleGetAppVersion)

  ipcMain.handle('createSession', handleCreateSession)
  ipcMain.handle('renameSession', handleRenameSession)
  ipcMain.handle('createCharacterForSession', handleCreateCharacterForSession)
  ipcMain.handle('tryImportCharacterForSession', handleTryImportCharacterForSession)
  ipcMain.handle('addCharacterToSession', handleAddCharacterToSession)

  ipcMain.handle('renameCharacter', handleRenameCharacter)
  ipcMain.handle('changeCharacterAttributes', handleChangeCharacterAttributes)
  ipcMain.handle('changeCharacterAbilities', handleChangeCharacterAbilities)
  ipcMain.handle('changeCharacterDiscordNotification', handleChangeCharacterDiscordNotification)
  ipcMain.handle('toggleCharacterDiscordNotification', handleToggleCharacterDiscordNotification)

  ipcMain.handle('diceTrayRoll', handleDiceTrayRoll)

  ipcMain.handle('ariaCheckAttribute', handleAriaCheckAttribute)
  ipcMain.handle('ariaCheckAbility', handleAriaCheckAbility)

  ipcMain.handle('rddCheckAttribute', handleRddCheckAttribute)
})
