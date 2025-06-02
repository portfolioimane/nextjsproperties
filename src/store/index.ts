import { configureStore } from '@reduxjs/toolkit'
import propertiesReducer from './propertiesSlice'
import propertiesadminReducer from './admin/propertiesSlice'
import propertiesownerReducer from './owner/ownerPropertiesSlice'
import ownersReducer from './admin/ownersSlice';
import authReducer from './authSlice';
export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
    auth: authReducer,
    propertiesadmin: propertiesadminReducer,
    owners: ownersReducer,
    propertiesowner: propertiesownerReducer,


  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
