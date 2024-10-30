import { EntityId } from '../common/types'
import { StateEmitter, createState } from '../events/stateEmitter'

export type SessionState = {
  characterId: EntityId | null
}

type Session = {
  state: StateEmitter<SessionState>
  start: (characterId: EntityId) => void
  end: () => void
}

export const createSession = (): Session => {
  const state = createState<SessionState>({ characterId: null }, 'Domain.Session')

  const start = (characterId: EntityId) => {
    state.update('characterId', characterId)
  }

  const end = () => {
    state.update('characterId', null)
  }

  return {
    state,
    start,
    end
  }
}