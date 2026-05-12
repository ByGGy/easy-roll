import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'

import { EntityId, Game, Attribute, Ability, NotificationLevel, DiceAction, CharacterRollRequest } from './domain/common/types'
import { isNotNull, unreachable } from './domain/common/tools'
import { createMigrationService } from './persistence/migrationService'
import { createRepository } from './persistence/common/repository'
import { rehydrate as rehydrateCharacter } from './domain/character/character'
import { createCharacterService } from './domain/character/characterService'
import { rehydrate as rehydrateSession, create as createSession } from './domain/session/session'
import { engine as diceTrayEngine } from './domain/dicetray/engine'
import { engine as ariaEngine } from './domain/aria/engine'
import { engine as rddEngine } from './domain/rdd/engine'
import { engine as basicEngine } from './domain/basic/engine'
import { engine as deadlandsEngine } from './domain/deadlands/engine'
import { createRelay as createDiscordRelay } from './domain/discord/relay'
import { createRelay as createFrontRelay } from './domain/front/relay'

// TODO: support streamdeck integration ?
// TODO: provide LLM integration for MJs ? (e.g. location description, portrait generation)
// TODO: provide LLM integration for "solo play" ?

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const migrationService = createMigrationService()
migrationService.maybeUpdateData()

const characterRepository = createRepository('Character', rehydrateCharacter)
const sessionRepository = createRepository('Session', rehydrateSession)
const characterService = createCharacterService()
const discordRelay = createDiscordRelay(characterRepository)
let frontRelay

const createWindow = () => {
  // Create the browser window.
  // TODO: store and apply window last position & size ? cf https://github.com/electron/electron/issues/526
  const mainWindow = new BrowserWindow({
    width: 1350,
    height: 980,
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

const handleRemoveCharacterFromSession = (event: unknown, id: EntityId, characterId: EntityId) => {
  const targetSession = sessionRepository.getById(id)
  if (targetSession) {
    const targetCharacter = characterRepository.getById(characterId)
    if (targetCharacter) {
      targetSession.changeCharacters(targetSession.state.characterIds.filter(id => id !== targetCharacter.id))
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

const handleChangeCharacterDiceActions = (event: unknown, id: EntityId, newDiceActions: Array<DiceAction>) => {
  const targetCharacter = characterRepository.getById(id)
  if (targetCharacter) {
    targetCharacter.changeDiceActions(newDiceActions)
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

const handleEvaluateCharacterSuccessRatio = (event: unknown, request: CharacterRollRequest) => {
  const currentCharacter = characterRepository.getById(request.characterId)
  if (currentCharacter) {
    switch (request.kind) {
      case 'ariaCheckAttribute':
        ariaEngine.evaluateCheckAttributeRatio(currentCharacter, request)
        break

      case 'ariaCheckAbility':
        ariaEngine.evaluateCheckAbilityRatio(currentCharacter, request)
        break

      case 'rddCheckAttribute':
        rddEngine.evaluateCheckAttributeRatio(currentCharacter, request)
        break

      case 'basicCheckAttribute':
        basicEngine.evaluateCheckAttributeRatio(currentCharacter, request)
        break
      
      case 'basicCheckAbility':
        basicEngine.evaluateCheckAbilityRatio(currentCharacter, request)
        break

      case 'deadlandsCheckAttribute':
        deadlandsEngine.evaluateCheckAttributeRatio(currentCharacter, request)
        break

      case 'deadlandsCheckAbility':
        deadlandsEngine.evaluateCheckAbilityRatio(currentCharacter, request)
        break

      default:
        console.log(JSON.stringify(request))
        break
    }
  }
}

const handleCheckCharacter = (event: unknown, request: CharacterRollRequest) => {
  const currentCharacter = characterRepository.getById(request.characterId)
  if (currentCharacter) {
    switch (request.kind) {
      case 'ariaCheckAttribute':
        ariaEngine.checkAttribute(currentCharacter, request)
        break

      case 'ariaCheckAbility':
        ariaEngine.checkAbility(currentCharacter, request)
        break

      case 'rddCheckAttribute':
        rddEngine.checkAttribute(currentCharacter, request)
        break

      case 'basicCheckAttribute':
        basicEngine.checkAttribute(currentCharacter, request)
        break

      case 'basicCheckAbility':
        basicEngine.checkAbility(currentCharacter, request)
        break

      case 'deadlandsCheckAttribute':
        deadlandsEngine.checkAttribute(currentCharacter, request)
        break

      case 'deadlandsCheckAbility':
        deadlandsEngine.checkAbility(currentCharacter, request)
        break        

      case 'diceAction':
        diceTrayEngine.checkAction(currentCharacter, request)
        break

      case 'diceTray':
        diceTrayEngine.checkCustomRoll(currentCharacter, request)
        break

      default:
        unreachable(request)
        break
    }
  }
}

const handleDiceTrayValidate = (event: unknown, expressions: Array<string>) => {
  diceTrayEngine.validate(expressions)
}

app.whenReady().then(() => {
  // TODO: should put all those subscriptions, handlers and domain initialization in separate files
  ipcMain.handle('getAppVersion', handleGetAppVersion)

  ipcMain.handle('createSession', handleCreateSession)
  ipcMain.handle('renameSession', handleRenameSession)
  ipcMain.handle('createCharacterForSession', handleCreateCharacterForSession)
  ipcMain.handle('tryImportCharacterForSession', handleTryImportCharacterForSession)
  ipcMain.handle('addCharacterToSession', handleAddCharacterToSession)
  ipcMain.handle('removeCharacterFromSession', handleRemoveCharacterFromSession)

  ipcMain.handle('renameCharacter', handleRenameCharacter)
  ipcMain.handle('changeCharacterAttributes', handleChangeCharacterAttributes)
  ipcMain.handle('changeCharacterAbilities', handleChangeCharacterAbilities)
  ipcMain.handle('changeCharacterDiceActions', handleChangeCharacterDiceActions)
  ipcMain.handle('changeCharacterDiscordNotification', handleChangeCharacterDiscordNotification)
  ipcMain.handle('toggleCharacterDiscordNotification', handleToggleCharacterDiscordNotification)

  ipcMain.handle('evaluateCharacterSuccessRatio', handleEvaluateCharacterSuccessRatio)
  ipcMain.handle('checkCharacter', handleCheckCharacter)

  ipcMain.handle('diceTrayValidate', handleDiceTrayValidate)
})
