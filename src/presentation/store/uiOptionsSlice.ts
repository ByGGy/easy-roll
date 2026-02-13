import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ParserResult } from '../../domain/dicetray/calculator/input/parser'

export interface UIOptionsState {
  isTorchOverlayEnabled: boolean
  lastQuickRollExpression: string
  expressionValidations: Record<string, ParserResult>
}

const initialState: UIOptionsState = {
  isTorchOverlayEnabled: false,
  lastQuickRollExpression: '3d8<12',
  expressionValidations: {},
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
    },
    receiveValidations: (state, action: PayloadAction<Record<string, ParserResult>>) => {
      // TODO: to infinity and beyond! (validations are never removed atm...)
      const oldIds = Object.keys(state.expressionValidations)
      const newIds = Object.keys(action.payload)
      const dedupedIds = new Set([...oldIds, ...newIds])
      state.expressionValidations = Array.from(dedupedIds).reduce((acc, id) => {
        acc[id] = action.payload[id] ?? state.expressionValidations[id]
        return acc
      }, {} as Record<string, ParserResult>)
    }
  },
})

// Action creators are generated for each case reducer function
export const { toggleTorchOverlay, rememberExpression, receiveValidations } = uiOptionsSlice.actions

export default uiOptionsSlice.reducer