import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface UIOptionsState {
  isTorchOverlayEnabled: boolean
  lastQuickRollExpression: string
}

const initialState: UIOptionsState = {
  isTorchOverlayEnabled: false,
  lastQuickRollExpression: '3d8<12'
}

export const uiOptionsSlice = createSlice({
  name: 'uiOptions',
  initialState,
  reducers: {
    toggleTorchOverlay: (state) => {
      state.isTorchOverlayEnabled = !state.isTorchOverlayEnabled
    },
    rememberExpression: (state, action: PayloadAction<string>) => {
      state.lastQuickRollExpression = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { toggleTorchOverlay, rememberExpression } = uiOptionsSlice.actions

export default uiOptionsSlice.reducer