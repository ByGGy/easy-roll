import { configureStore } from '@reduxjs/toolkit'

import { ipcMiddleware } from './ipcMiddleware'
import characterCollectionReducer from './characterCollectionSlice'
import sessionReducer from './sessionSlice'
import rollHistoryReducer from './rollHistorySlice'

// TODO: use https://www.npmjs.com/package/redux-persist to keep the store state event when reloading the window ?
export const store = configureStore({
  reducer: {
    characterCollection: characterCollectionReducer,
    session: sessionReducer,
    rollHistory: rollHistoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ipcMiddleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch