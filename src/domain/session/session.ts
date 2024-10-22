import { EntityId } from '../common/types'
import { CharacterSheet } from '../character/characterSheet'
import { Repository } from '../character/repository'
import { StateEmitter, createState } from '../events/stateEmitter'

export type SessionState = {
  character: CharacterSheet | null
}

type Session = {
  state: StateEmitter<SessionState>
  start: (characterId: EntityId) => void
  end: () => void
}

export const createSession = (repository: Repository<CharacterSheet>): Session => {
  const state = createState<SessionState>({ character: null }, 'Domain.Session')

  const start = (characterId: EntityId) => {
    const relevantCharacter = repository.getById(characterId)
    if (relevantCharacter) {
      state.update('character', relevantCharacter)
    }
  }

  const end = () => {
    if (state.character !== null) {
      state.update('character', null)
    }
  }

  return {
    state,
    start,
    end
  }
}