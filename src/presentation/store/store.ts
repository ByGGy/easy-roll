import { configureStore } from '@reduxjs/toolkit'

import { ipcMiddleware } from './ipcMiddleware'
import selectionReducer from './selectionSlice'
import characterCollectionReducer from './characterCollectionSlice'
import sessionCollectionReducer from './sessionCollectionSlice'
import rollHistoryReducer from './rollHistorySlice'

// TODO: use https://www.npmjs.com/package/redux-persist to keep the store state event when reloading the window ?
export const store = configureStore({
  reducer: {
    selection: selectionReducer,
    characterCollection: characterCollectionReducer,
    sessionCollection: sessionCollectionReducer,
    rollHistory: rollHistoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(ipcMiddleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch