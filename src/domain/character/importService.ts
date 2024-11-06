import { readFileSync } from 'fs'
import { get } from 'lodash'

import { unreachable } from '../common/tools'
import { Game, Attribute, Ability, DiscordNotification } from '../common/types'
import { CharacterState } from './character'
import { createDefault as createAriaDefaultCharacter } from '../aria/characterTemplate'
import { createDefault as createRddDefaultCharacter } from '../rdd/characterTemplate'

export type ImportService = {
  tryFromFile: (path: string) => CharacterState | null
}

const isValidGame = (maybeGame: unknown): maybeGame is Game => {
  return typeof(maybeGame) === 'string' && (maybeGame === 'Aria' || maybeGame === 'Rêve de Dragon')
}

const createStateFor = (game: Game): CharacterState => {
  switch (game) {
    default: return unreachable(game)
    case 'Aria': return createAriaDefaultCharacter()
    case 'Rêve de Dragon': return createRddDefaultCharacter()
  }
}

export const createImportService = (): ImportService => {

  // TODO: need better validation..
  // use https://www.npmjs.com/package/@sinclair/typebox + https://www.npmjs.com/package/ajv ?
  const tryFromFile = (path: string): CharacterState | null => {
    const data = readFileSync(path, 'utf8')
    const maybeSheet = JSON.parse(data)

    const game = get(maybeSheet, 'game')
    if (isValidGame(game)) {
      const initialState = createStateFor(game)

      const name = get(maybeSheet, 'name', 'Imported Joe')
    
      const attributes = [...initialState.attributes]
      const maybeAttributes = get(maybeSheet, 'attributes', [])
      maybeAttributes.forEach((maybeAttribute: Record<string, unknown>) => {
        const name = get(maybeAttribute, 'name')
        const value = get(maybeAttribute, 'value')

        if (name && value) {
          const aIndex = attributes.findIndex(a => a.name === name)
          if (aIndex !== -1) {
            attributes.splice(aIndex, 1)
          }
          attributes.push({ name, value } as Attribute)
        }
      })

      const abilities = [...initialState.abilities]
      const maybeAbilities = get(maybeSheet, 'abilities', [])
      maybeAbilities.forEach((maybeAbility: Record<string, unknown>) => {
        const name = get(maybeAbility, 'name')
        const value = get(maybeAbility, 'value')

        if (name && value) {
          const aIndex = abilities.findIndex(a => a.name === name)
          if (aIndex !== -1) {
            abilities.splice(aIndex, 1)
          }
          abilities.push({ name, value } as Ability)
        }
      })

      const discordNotification: DiscordNotification = { enable: true, level: 'Standard', channelId: '' }

      // from v0.3.0 CharacterSheet shape..
      const maybeDiscordConfiguration = get(maybeSheet, 'discordConfiguration')
      if (maybeDiscordConfiguration) {
        discordNotification.channelId = get(maybeDiscordConfiguration, 'channelId', '')
      }

      const maybeDiscordNotification = get(maybeSheet, 'discordNotification')
      if (maybeDiscordNotification) {
        discordNotification.enable = get(maybeDiscordNotification, 'enable', true)
        discordNotification.level = get(maybeDiscordNotification, 'level', 'Standard')
        discordNotification.channelId = get(maybeDiscordNotification, 'channelId', '')
      }

      return {
        name,
        game, 
        attributes,
        abilities,
        discordNotification,
      }
    }

    return null
  }

  return {
    tryFromFile,
  }
}