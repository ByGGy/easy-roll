import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

import { RollResult } from '../../domain/common/types'

export interface RollHistoryState {
  rolls: Array<RollResult>
}

const initialState: RollHistoryState = {
  rolls: [],
}

export const rollHistorySlice = createSlice({
  name: 'rollHistory',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<RollResult>) => {
      state.rolls.unshift(action.payload)
    }
  },
})

// Action creators are generated for each case reducer function
export const { add } = rollHistorySlice.actions

export default rollHistorySlice.reducer