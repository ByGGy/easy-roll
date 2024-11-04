import { readFileSync } from 'fs'
import { get } from 'lodash'

import { CharacterCollection } from './characterCollection'
import { Game, Attribute, Ability } from '../common/types'

export type ImportService = {
  tryFromFile: (path: string) => void
}

const isValidGame = (maybeGame: unknown): maybeGame is Game => {
  return typeof(maybeGame) === 'string' && (maybeGame === 'Aria' || maybeGame === 'Rêve de Dragon')
}

export const createImportService = (characterCollection: CharacterCollection): ImportService => {

  // TODO: need better validation..
  // use https://www.npmjs.com/package/@sinclair/typebox + https://www.npmjs.com/package/ajv ?
  const tryFromFile = (path: string) => {
    const data = readFileSync(path, 'utf8')
    const maybeSheet = JSON.parse(data)

    const game = get(maybeSheet, 'game')
    if (isValidGame(game)) {
      const newSheet = characterCollection.createCharacter(game)
      if (newSheet !== null) {
        const name = get(maybeSheet, 'name', 'Imported Joe')
        characterCollection.renameCharacter(newSheet.id, name)
      
        const newAttributes = [...newSheet.attributes]
        const maybeAttributes = get(maybeSheet, 'attributes', [])
        maybeAttributes.forEach((maybeAttribute: Record<string, unknown>) => {
          const name = get(maybeAttribute, 'name')
          const value = get(maybeAttribute, 'value')
  
          if (name && value) {
            const aIndex = newAttributes.findIndex(a => a.name === name)
            if (aIndex !== -1) {
              newAttributes.splice(aIndex, 1)
            }
            newAttributes.push({ name, value } as Attribute)
          }
        })
        characterCollection.changeCharacterAttributes(newSheet.id, newAttributes)
  
        const newAbilities = [...newSheet.abilities]
        const maybeAbilities = get(maybeSheet, 'abilities', [])
        maybeAbilities.forEach((maybeAbility: Record<string, unknown>) => {
          const name = get(maybeAbility, 'name')
          const value = get(maybeAbility, 'value')
  
          if (name && value) {
            const aIndex = newAbilities.findIndex(a => a.name === name)
            if (aIndex !== -1) {
              newAbilities.splice(aIndex, 1)
            }
            newAbilities.push({ name, value } as Ability)
          }
        })
        characterCollection.changeCharacterAbilities(newSheet.id, newAbilities)
  
        // from v0.3.0 CharacterSheet shape..
        const maybeDiscordConfiguration = get(maybeSheet, 'discordConfiguration')
        if (maybeDiscordConfiguration) {
          const channelId = get(maybeDiscordConfiguration, 'channelId', '')
          characterCollection.changeCharacterDiscordNotification(newSheet.id, true, 'Standard', channelId)
        }
  
        const maybeDiscordNotification = get(maybeSheet, 'discordNotification')
        if (maybeDiscordNotification) {
          const enable = get(maybeDiscordNotification, 'enable', true)
          const level = get(maybeDiscordNotification, 'level', 'Standard')
          const channelId = get(maybeDiscordNotification, 'channelId', '')
          characterCollection.changeCharacterDiscordNotification(newSheet.id, enable, level, channelId)
        }
      }
    }
  }

  return {
    tryFromFile,
  }
}