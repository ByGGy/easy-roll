import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { CharacterSheet } from '../../domain/common/types'

export interface SessionState {
  character: CharacterSheet | null
}

const initialState: SessionState = {
  character: null,
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<CharacterSheet>) => {
      state.character = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { update } = sessionSlice.actions

export default sessionSlice.reducer