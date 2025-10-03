import { readFileSync } from 'fs'
import { get } from 'lodash'

import { unreachable } from '../common/tools'
import { Game, Attribute, Ability, DiscordNotification, DiceAction } from '../common/types'
import { Character, create } from './character'
import { createDefaultAttributes as createAriaDefaultAttributes, createDefaultAbilities as createAriaDefaultAbilities } from '../aria/characterTemplate'
import { createDefaultAttributes as createRddDefaultAttributes, createDefaultAbilities as  createRddDefaultAbilities } from '../rdd/characterTemplate'
import { createDefaultAttributes as createBasicDefaultAttributes, createDefaultAbilities as  createBasicDefaultAbilities } from '../basic/characterTemplate'

export type CharacterService = {
  createFor: (game: Game) => Character
  tryCreateFromFile: (path: string) => Character | null
}

const isValidGame = (maybeGame: unknown): maybeGame is Game => {
  return typeof(maybeGame) === 'string' && (maybeGame === 'Aria' || maybeGame === 'Rêve de Dragon' || maybeGame === 'BaSIC')
}

const createDefaultAttributesFor = (game: Game): Array<Attribute> => {
  switch (game) {
    default: return unreachable(game)
    case 'Aria': return createAriaDefaultAttributes()
    case 'Rêve de Dragon': return createRddDefaultAttributes()
    case 'BaSIC': return createBasicDefaultAttributes()
  }
}

const createDefaultAbilitiesFor = (game: Game): Array<Ability> => {
  switch (game) {
    default: return unreachable(game)
    case 'Aria': return createAriaDefaultAbilities()
    case 'Rêve de Dragon': return createRddDefaultAbilities()
    case 'BaSIC': return createBasicDefaultAbilities()
  }
}

const createDefaultDiceActionsFor = (game: Game): Array<DiceAction> => {
  switch (game) {
    default: return unreachable(game)
    case 'Aria':
    case 'Rêve de Dragon':
    case 'BaSIC':
      return []
  }
}

const createDefaultDiscordConfiguration = (): DiscordNotification => ({ enable: false, level: 'Standard', channelId: '' })

export const createCharacterService = (): CharacterService => {

  const createFor = (game: Game): Character => {
    const defaultState = {
      name: 'Average Joe',
      tags: [game], 
      attributes: createDefaultAttributesFor(game),
      abilities: createDefaultAbilitiesFor(game),
      diceActions: createDefaultDiceActionsFor(game),
      discordNotification: createDefaultDiscordConfiguration()
    }

    return create(defaultState)
  }

  // TODO: need better validation..
  // use https://www.npmjs.com/package/@sinclair/typebox + https://www.npmjs.com/package/ajv ?
  const tryCreateFromFile = (path: string): Character | null => {
    const data = readFileSync(path, 'utf8')
    const maybeSheet = JSON.parse(data)

    const game = get(maybeSheet, 'game')
    if (isValidGame(game)) {
      const name = get(maybeSheet, 'name', 'Imported Joe')
    
      const attributes = createDefaultAttributesFor(game)
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

      const abilities = createDefaultAbilitiesFor(game)
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

      const diceActions = createDefaultDiceActionsFor(game)

      const discordNotification = createDefaultDiscordConfiguration()

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

      const state = {
        name,
        tags: [game], 
        attributes,
        abilities,
        diceActions,
        discordNotification,
      }

      return create(state)
    }

    return null
  }

  return {
    createFor,
    tryCreateFromFile,
  }
}