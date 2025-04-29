import { configureStore } from '@reduxjs/toolkit'
import propertiesReducer from './propertiesSlice'
import authReducer from './authSlice';
export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
    auth: authReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
