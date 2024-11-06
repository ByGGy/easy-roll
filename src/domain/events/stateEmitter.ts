import { EntityId } from '../common/types'
import { messageBus } from './messageBus'

export type StateEmitter<T> = Readonly<T> & {
  update: <K extends keyof T>(p: K, value: T[K]) => void
}

export const createState = <T>(initialState: T, id: EntityId, eventPrefix: string): StateEmitter<T> => {
  const state: T = {...initialState}

  const emitter: StateEmitter<T> = {
    ...initialState,
    update: <K extends keyof T>(p: K, value: T[K]) => {
      if (state[p] !== value) {
        const previousState = {...state}
        state[p] = value
        Object.assign(emitter, state)
        messageBus.emit(eventPrefix + '.update', id, previousState, state)
      }
    }
  }

  return emitter
}