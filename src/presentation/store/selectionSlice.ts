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

export const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    openSession: (state, action: PayloadAction<EntityId>) => {
      state.sessionId = action.payload
    },
    closeSession: (state) => {
      state.sessionId = null
      state.characterId = null
    },
    pickCharacter: (state, action: PayloadAction<EntityId>) => {
      state.characterId = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { openSession, closeSession, pickCharacter } = selectionSlice.actions

export default selectionSlice.reducer