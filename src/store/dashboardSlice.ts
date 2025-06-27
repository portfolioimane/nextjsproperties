import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

// ADMIN: fetch count of all owners
export const fetchOwners = createAsyncThunk('dashboard/fetchOwners', async () => {
  const res = await axios.get('/admin/dashboard/owners');
  return res.data.count; // expecting { count: number }
});

// ADMIN: fetch count of all properties
export const fetchAllProperties = createAsyncThunk('dashboard/fetchAllProperties', async () => {
  const res = await axios.get('/admin/dashboard/properties');
  return res.data.count;
});


// ADMIN: fetch counts of subscriptions (paid/free)
export const fetchSubscriptions = createAsyncThunk('dashboard/fetchSubscriptions', async () => {
  const res = await axios.get('/admin/dashboard/subscriptions');
  return res.data; // expecting { paid: number, free: number }
});

// OWNER: fetch count of my properties
export const fetchMyProperties = createAsyncThunk('dashboard/fetchMyProperties', async () => {
  const res = await axios.get('/owner/dashboard/my-properties');
  return res.data.count;
});

// OWNER: fetch count of my contacts
export const fetchMyContacts = createAsyncThunk('dashboard/fetchMyContacts', async () => {
  const res = await axios.get('/owner/dashboard/my-contacts');
  return res.data.count;
});


const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    ownersCount: 0,
    allPropertiesCount: 0,
    myPropertiesCount: 0,
    myContactsCount: 0,
    subscriptions: { paid: 0, free: 0 },
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchOwners
      .addCase(fetchOwners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwners.fulfilled, (state, action) => {
        state.ownersCount = action.payload;
        state.loading = false;
      })
      .addCase(fetchOwners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error fetching owners';
      })

      // fetchAllProperties
      .addCase(fetchAllProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProperties.fulfilled, (state, action) => {
        state.allPropertiesCount = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error fetching properties';
      })

      // fetchMyProperties
      .addCase(fetchMyProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProperties.fulfilled, (state, action) => {
        state.myPropertiesCount = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error fetching my properties';
      })

      // fetchMyContacts
      .addCase(fetchMyContacts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyContacts.fulfilled, (state, action) => {
        state.myContactsCount = action.payload;
        state.loading = false;
      })
      .addCase(fetchMyContacts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error fetching my contacts';
      })

      // fetchSubscriptions
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.subscriptions = action.payload;
        state.loading = false;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error fetching subscriptions';
      });
  },
});

export default dashboardSlice.reducer;
