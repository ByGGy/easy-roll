import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { EntityId } from '../../domain/common/types'

export interface SelectionState {
  sessionId: EntityId | null
  characterId: EntityId | null
}

const initialState: SelectionState = {
  sessionId: null,
  characterId: null
}

type OpenPayload = {
  sessionId: EntityId
  characterId?: EntityId
}

export const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    openSession: (state, action: PayloadAction<OpenPayload>) => {
      state.sessionId = action.payload.sessionId
      state.characterId = action.payload.characterId ?? null
    },
    closeSession: (state) => {
      state.sessionId = null
      state.characterId = null
    },
    pickCharacter: (state, action: PayloadAction<EntityId>) => {
      state.characterId = action.payload
    },
    forgetCharacter: (state, action: PayloadAction<EntityId>) => {
      if (state.characterId === action.payload) {
        state.characterId = null
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { openSession, closeSession, pickCharacter, forgetCharacter } = selectionSlice.actions

export default selectionSlice.reducer