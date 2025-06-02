import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

// Owner interface
export interface Owner {
  id: number;
  name: string;
  email: string;
  phone?: string;
}

interface OwnersState {
  list: Owner[];
  loading: boolean;
  error: string | null;
}

const initialState: OwnersState = {
  list: [],
  loading: false,
  error: null,
};

// Fetch all owners
export const fetchOwners = createAsyncThunk('owners/fetchAll', async () => {
  const response = await axios.get('/admin/owners');
  return response.data; // assume Owner[]
});

// Add new owner
export const addOwner = createAsyncThunk('owners/add', async (ownerData: Omit<Owner, 'id'>, { dispatch }) => {
  await axios.post('/admin/owners', ownerData);
  dispatch(fetchOwners());
});

// Update owner by id
export const updateOwner = createAsyncThunk(
  'owners/update',
  async ({ id, ownerData }: { id: number; ownerData: Partial<Omit<Owner, 'id'>> }, { dispatch }) => {
    await axios.put(`/admin/owners/${id}`, ownerData);
    dispatch(fetchOwners());
  }
);

const ownersSlice = createSlice({
  name: 'owners',
  initialState,
  reducers: {
    // Optionally add reducers here if you want
  },
  extraReducers: (builder) => {
    builder
      // fetchOwners
      .addCase(fetchOwners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwners.fulfilled, (state, action: PayloadAction<Owner[]>) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchOwners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch owners';
      })

      // addOwner
      .addCase(addOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOwner.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add owner';
      })

      // updateOwner
      .addCase(updateOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOwner.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update owner';
      });
  },
});

export default ownersSlice.reducer;
