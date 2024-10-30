import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { EntityId } from '../../domain/common/types'

export interface SessionState {
  characterId: EntityId | null
}

const initialState: SessionState = {
  characterId: null,
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<EntityId>) => {
      state.characterId = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { update } = sessionSlice.actions

export default sessionSlice.reducer