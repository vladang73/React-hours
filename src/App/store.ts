import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './reducers'

const persistConfig = {
  key: 'state',
  version: 1,
  storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
const useDevTools = process.env.NODE_ENV === 'production' ? false : true

export const store = configureStore({
  reducer: persistedReducer,
  devTools: useDevTools,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
})
