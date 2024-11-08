import { randomUUID } from 'crypto'
import { EntityId, EntityWithState, Game } from '../common/types'
import { createState } from '../events/stateEmitter'

export type SessionState = {
  game: Game
  name: string
  description: string
  characterIds: Array<EntityId>
  creationDate: string
}

export type SessionData = EntityWithState<SessionState>

export type Session = SessionData & {
  rename: (newName: string) => void
  changeCharacters : (newCharacterIds: Array<EntityId>) => void
}

const createModel = (id: EntityId, state: SessionState): Session => {
  const emitterState = createState<SessionState>({...state}, id, 'Domain.Session')
  
  const rename = (newName: string) => {
    emitterState.update('name', newName)
  }

  const changeCharacters = (newCharacterIds: Array<EntityId>) => {
    emitterState.update('characterIds', newCharacterIds)
  }

  return {
    id,
    state: emitterState,
    rename,
    changeCharacters,
  }
}

export const rehydrate = (data: SessionData): Session => {
  return createModel(data.id, data.state)
}

export const create = (initialState: SessionState): Session => {
  return createModel(randomUUID(), initialState)
}