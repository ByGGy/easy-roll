import { EntityId, Game, Attribute, Ability, CharacterSheet, NotificationLevel } from '../common/types'
import { unreachable } from '../common/tools'
import { Repository } from '../../persistence/character/repository'
import { StateEmitter, createState } from '../events/stateEmitter'
import { createDefault as createAriaDefaultCharacter } from '../aria/characterTemplate'
import { createDefault as createRddDefaultCharacter } from '../rdd/characterTemplate'

export type CharacterCollectionState = {
  characters: Array<CharacterSheet>
}

export type CharacterCollection = {
  state: StateEmitter<CharacterCollectionState>
  initialize: () => void
  createCharacter: (game: Game) => CharacterSheet | null
  renameCharacter: (id: EntityId, newName: string) => void
  changeCharacterAttributes: (id: EntityId, newAttributes: Array<Attribute>) => void
  changeCharacterAbilities: (id: EntityId, newAbilities: Array<Ability>) => void
  changeCharacterDiscordNotification: (id: EntityId, enable: boolean, level: NotificationLevel, channelId: string) => void
  toggleCharacterDiscordNotification: (id: EntityId, enable: boolean) => void
}

export const createCharacterCollection = (repository: Repository<CharacterSheet>): CharacterCollection=> {
  const state = createState<CharacterCollectionState>({ characters: [] }, 'Domain.CharacterCollection')

  const initialize = () => {
    const charactersFromStorage = repository.getAll()
    state.update('characters', [...charactersFromStorage])
  }

  const createCharacter = (game: Game) => {
    let newCharacterSheet = null
    switch (game) {
      default:
        unreachable(game)
        break

      case 'Aria':
        newCharacterSheet = createAriaDefaultCharacter()
        break

      case 'Rêve de Dragon':
        newCharacterSheet = createRddDefaultCharacter()
        break
    }

    if (newCharacterSheet !== null) {
      repository.insert(newCharacterSheet)
      state.update('characters', [...state.characters, newCharacterSheet])
    }

    return newCharacterSheet
  }

  // TODO: refactor to editCharacter(id, prop, value) to avoid code duplication ?
  const renameCharacter = (id: EntityId, newName: string) => {
    const targetCharacter = state.characters.find(c => c.id === id)
    if (targetCharacter) {
      // TODO: find a solution to mutate object instead ?
      const updatedCharacter = {...targetCharacter}
      updatedCharacter.name = newName
      repository.update(updatedCharacter)
      // TODO: updating the whole collection state and publishing event with the whole previous & current state
      // only for a character rename ? Eeekk....
      state.update('characters', [...state.characters.filter(c => c.id !== id), updatedCharacter])
    }
  }

  const changeCharacterAttributes = (id: EntityId, newAttributes: Array<Attribute>) => {
    const targetCharacter = state.characters.find(c => c.id === id)
    if (targetCharacter) {
      // TODO: find a solution to mutate object instead ?
      const updatedCharacter = {...targetCharacter}
      updatedCharacter.attributes = newAttributes
      repository.update(updatedCharacter)
      state.update('characters', [...state.characters.filter(c => c.id !== id), updatedCharacter])
    }
  }

  const changeCharacterAbilities = (id: EntityId, newAbilities: Array<Ability>) => {
    const targetCharacter = state.characters.find(c => c.id === id)
    if (targetCharacter) {
      // TODO: find a solution to mutate object instead ?
      const updatedCharacter = {...targetCharacter}
      updatedCharacter.abilities = newAbilities
      repository.update(updatedCharacter)
      state.update('characters', [...state.characters.filter(c => c.id !== id), updatedCharacter])
    }
  }

  const changeCharacterDiscordNotification = (id: EntityId, enable: boolean, level: NotificationLevel, channelId: string) => {
    const targetCharacter = state.characters.find(c => c.id === id)
    if (targetCharacter) {
      // TODO: find a solution to mutate object instead ?
      const updatedCharacter = {...targetCharacter}
      updatedCharacter.discordNotification = {
        enable,
        level,
        channelId
      }
      repository.update(updatedCharacter)
      state.update('characters', [...state.characters.filter(c => c.id !== id), updatedCharacter])
    }
  }

  const toggleCharacterDiscordNotification = (id: EntityId, enable: boolean) => {
    const targetCharacter = state.characters.find(c => c.id === id)
    if (targetCharacter) {
      changeCharacterDiscordNotification(targetCharacter.id, enable, targetCharacter.discordNotification.level, targetCharacter.discordNotification.channelId)
    }
  }

  return {
    state,
    initialize,
    createCharacter,
    renameCharacter,
    changeCharacterAttributes,
    changeCharacterAbilities,
    changeCharacterDiscordNotification,
    toggleCharacterDiscordNotification
  }
}