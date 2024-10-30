import { EntityId, Game, CharacterSheet } from '../common/types'
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

  return {
    state,
    initialize,
    createCharacter
  }
}