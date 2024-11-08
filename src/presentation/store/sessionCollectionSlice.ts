import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { SessionState, SessionData } from '../../domain/session/session'
import { EntityId } from '../../domain/common/types'

export interface SessionCollectionState {
  sessions: Array<SessionData>
}

const initialState: SessionCollectionState = {
  sessions: [],
}

type StateUpdate<T> = {
  id: EntityId,
  previous: T,
  current: T
}

export const sessionCollectionSlice = createSlice({
  name: 'sessionCollection',
  initialState,
  reducers: {
    updateCollection: (state, action: PayloadAction<Array<SessionData>>) => {
      state.sessions = action.payload
    },
    updateSession: (state, action: PayloadAction<StateUpdate<SessionState>>) => {
      const targetIndex = state.sessions.findIndex(c => c.id === action.payload.id)
      if (targetIndex !== -1) {
        state.sessions[targetIndex] = { id: action.payload.id, state: action.payload.current }
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { updateCollection, updateSession } = sessionCollectionSlice.actions

export default sessionCollectionSlice.reducer