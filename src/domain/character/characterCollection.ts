import { EntityId, Game, Attribute, Ability, CharacterSheet } from '../common/types'
import { Repository } from '../../persistence/character/repository'
import { StateEmitter, createState } from '../events/stateEmitter'
import { createDefault as createAriaDefaultCharacter } from '../aria/characterTemplate'
import { createDefault as createRddDefaultCharacter } from '../rdd/characterTemplate'

export type CharacterCollectionState = {
  characters: Array<CharacterSheet>
}

type CharacterCollection = {
  state: StateEmitter<CharacterCollectionState>
  initialize: () => void
  createCharacter: (game: Game) => void
  renameCharacter: (id: EntityId, newName: string) => void
  changeCharacterAttributes: (id: EntityId, newAttributes: Array<Attribute>) => void
  changeCharacterAbilities: (id: EntityId, newAbilities: Array<Ability>) => void
}

export const createCharacterCollection = (repository: Repository<CharacterSheet>): CharacterCollection=> {
  const state = createState<CharacterCollectionState>({ characters: [] }, 'Domain.CharacterCollection')

  const initialize = () => {
    const charactersFromStorage = repository.getAll()
    state.update('characters', [...charactersFromStorage])
  }

  const createCharacter = (game: Game) => {
    let newCharacterSheet
    switch (game) {
      case 'Aria':
        newCharacterSheet = createAriaDefaultCharacter()
        break

      case 'Rêve de Dragon':
        newCharacterSheet = createRddDefaultCharacter()
        break
    }

    repository.insert(newCharacterSheet)
    state.update('characters', [...state.characters, newCharacterSheet])
  }

  const renameCharacter = (id: EntityId, newName: string) => {
    const targetCharacter = state.characters.find(c => c.id === id)
    if (targetCharacter) {
      // TODO: find a solution to mutate object instead ?
      const updatedCharacter = {...targetCharacter}
      updatedCharacter.name = newName
      repository.update(updatedCharacter)
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

  return {
    state,
    initialize,
    createCharacter,
    renameCharacter,
    changeCharacterAttributes,
    changeCharacterAbilities
  }
}