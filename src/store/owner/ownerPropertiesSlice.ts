import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

// Define the Photo type first:
export interface Photo {
  id: number;
  photo_url: string;
}

export interface Owner {
  name: string;
  email: string;
  phone: string;
}

// Updated Property type including city, type, offer_type
export interface Property {
  id: number;
  title: string;
  description: string;
  price: number; 
  image: string;
  address: string;  
  city: string;          // added city
  type: string;          // e.g. apartment, villa
  offer_type: string;    // e.g. rent, sale
  area: number;
  rooms: number;
  bathrooms: number;
  owner_id: number;   
  featured: boolean;
  photo_gallery: Photo[];
  owner: Owner;
}

interface PropertiesState {
  list: Property[];
  current: Property | null;
  loading: boolean;
  error: string | null;
}

const initialState: PropertiesState = {
  list: [],
  current: null,
  loading: false,
  error: null,
};

// Async thunks for API actions
export const fetchProperties = createAsyncThunk('ownerproperties/fetchAll', async () => {
  const response = await axios.get('/owner/ownerproperties');
  return response.data;
});

export const fetchPropertyById = createAsyncThunk('ownerproperties/fetchById', async (id: number) => {
  const response = await axios.get(`/owner/ownerproperties/${id}`);
  return response.data;
});

export const addProperty = createAsyncThunk('ownerproperties/add', async (formData: FormData, { dispatch }) => {
  await axios.post('/owner/ownerproperties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  dispatch(fetchProperties());
});

export const updateProperty = createAsyncThunk(
  'ownerproperties/update',
  async ({ id, formData }: { id: number; formData: FormData }, { dispatch }) => {
    await axios.post(`/owner/ownerproperties/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { _method: 'PUT' },
    });
    dispatch(fetchProperties());
  }
);

export const deleteProperty = createAsyncThunk('ownerproperties/delete', async (id: number, { dispatch }) => {
  await axios.delete(`/owner/ownerproperties/${id}`);
  dispatch(fetchProperties());
});

export const toggleFeatured = createAsyncThunk('ownerproperties/toggleFeatured', async (id: number, { dispatch }) => {
  await axios.put(`/owner/ownerproperties/${id}/toggle-featured`);
  dispatch(fetchProperties());
});

const ownerpropertiesSlice = createSlice({
  name: 'ownerproperties',
  initialState,
  reducers: {
    clearCurrent(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action: PayloadAction<Property[]>) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch ownerproperties';
      })
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action: PayloadAction<Property>) => {
        state.current = action.payload;
        state.loading = false;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch the property';
      });
  },
});

export const { clearCurrent } = ownerpropertiesSlice.actions;
export default ownerpropertiesSlice.reducer;
