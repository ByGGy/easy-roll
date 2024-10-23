import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface DiscordState {
  isEnabled: boolean
}

const initialState: DiscordState = {
  isEnabled: false,
}

export const discordSlice = createSlice({
  name: 'discord',
  initialState,
  reducers: {
    update: (state, action: PayloadAction<boolean>) => {
      state.isEnabled = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { update } = discordSlice.actions

export default discordSlice.reducer