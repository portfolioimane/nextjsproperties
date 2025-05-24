import { configureStore } from '@reduxjs/toolkit'
import propertiesReducer from './propertiesSlice'
import propertiesadminReducer from './admin/propertiesSlice'

import authReducer from './authSlice';
export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
    auth: authReducer,
    propertiesadmin: propertiesadminReducer,

  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
