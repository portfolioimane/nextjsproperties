import { configureStore } from '@reduxjs/toolkit'
import propertiesReducer from './frontend/propertiesSlice'
import propertiesadminReducer from './admin/propertiesSlice'
import planAdminReducer from './admin/planAdminSlice'

import propertiesownerReducer from './owner/ownerPropertiesSlice'
import ownerContactCRMReducer from './owner/ownerContactCRMSlice'
import subscriptionReducer from './owner/subscriptionSlice'

import ownersReducer from './admin/ownersSlice';
import authReducer from './authSlice';
import contactOwnerReducer from './frontend/contactOwnerSlice';

// store/index.ts or store/store.ts



export const store = configureStore({
  reducer: {
    properties: propertiesReducer,
    auth: authReducer,
    propertiesadmin: propertiesadminReducer,
    planAdmin: planAdminReducer,
    owners: ownersReducer,
    propertiesowner: propertiesownerReducer,
    ownerContactCRM: ownerContactCRMReducer,
    subscription: subscriptionReducer,
    contactOwner: contactOwnerReducer,



  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
