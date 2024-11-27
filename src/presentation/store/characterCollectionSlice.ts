import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { CharacterState, CharacterData } from '../../domain/character/character'
import { EntityId } from '../../domain/common/types'

export interface CharacterCollectionState {
  characters: Array<CharacterData>
}

const initialState: CharacterCollectionState = {
  characters: [],
}

type StateUpdate<T> = {
  id: EntityId
  previous: T
  current: T
}

export const characterCollectionSlice = createSlice({
  name: 'characterCollection',
  initialState,
  reducers: {
    updateCollection: (state, action: PayloadAction<Array<CharacterData>>) => {
      state.characters = action.payload
    },
    updateCharacter: (state, action: PayloadAction<StateUpdate<CharacterState>>) => {
      const targetIndex = state.characters.findIndex(c => c.id === action.payload.id)
      if (targetIndex !== -1) {
        state.characters[targetIndex] = { id: action.payload.id, state: action.payload.current }
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { updateCollection, updateCharacter } = characterCollectionSlice.actions

export default characterCollectionSlice.reducer