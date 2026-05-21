import { configureStore } from '@reduxjs/toolkit'

import { ipcMiddleware } from './ipcMiddleware'
import { hmrMiddleware, recoverState } from './hmrMiddleware'

import selectionReducer from './selectionSlice'
import characterCollectionReducer from './characterCollectionSlice'
import sessionCollectionReducer from './sessionCollectionSlice'
import rollHistoryReducer from './rollHistorySlice'
import uiOptionsReducer from './uiOptionsSlice'

// TODO: use https://www.npmjs.com/package/redux-persist to keep the store state event when reloading the window ?
export const store = configureStore({
  reducer: {
    selection: selectionReducer,
    characterCollection: characterCollectionReducer,
    sessionCollection: sessionCollectionReducer,
    rollHistory: rollHistoryReducer,
    uiOptions: uiOptionsReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware().concat(ipcMiddleware)

    if (import.meta.env.DEV) {
      middleware.push(hmrMiddleware)
    }

    return middleware
  },
    
  preloadedState: recoverState()
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch