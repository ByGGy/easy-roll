import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { CharacterSheet } from '../../domain/common/types'

export interface CharacterCollectionState {
  characters: Array<CharacterSheet>
}

const initialState: CharacterCollectionState = {
  characters: [],
}

export const characterCollectionSlice = createSlice({
  name: 'characterCollection',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<Array<CharacterSheet>>) => {
      state.characters = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { update } = characterCollectionSlice.actions

export default characterCollectionSlice.reducer