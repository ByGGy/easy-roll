import { createSlice } from '@reduxjs/toolkit'

export interface UIOptionsState {
  isTorchOverlayEnabled: boolean
}

const initialState: UIOptionsState = {
  isTorchOverlayEnabled: false,
}

export const uiOptionsSlice = createSlice({
  name: 'uiOptions',
  initialState,
  reducers: {
    toggleTorchOverlay: (state) => {
      state.isTorchOverlayEnabled = !state.isTorchOverlayEnabled
    },
  },
})

// Action creators are generated for each case reducer function
export const { toggleTorchOverlay } = uiOptionsSlice.actions

export default uiOptionsSlice.reducer