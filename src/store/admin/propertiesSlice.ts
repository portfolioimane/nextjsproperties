import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

// Define the Photo type first:
export interface Photo {
  id: number;
  photo_url: string;
}

// Then update Property type:
export interface Property {
  id: number;
  title: string;
  description: string;
  price: string;
  image: string;
  area: number;
  rooms: number;
  bathrooms: number;
  owner_name: string;
  owner_phone: string;
  owner_email?: string;
  featured: boolean;
  photo_gallery: Photo[]; // no "?" mark
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
export const fetchProperties = createAsyncThunk('properties/fetchAll', async () => {
  const response = await axios.get('/admin/properties');
    console.log(response.data);
    console.log('propertyid', response.data);

  return response.data;
});

export const fetchPropertyById = createAsyncThunk('properties/fetchById', async (id: number) => {
   console.log('fetching','');
  const response = await axios.get(`/admin/properties/${id}`);
  return response.data;
});

export const addProperty = createAsyncThunk('properties/add', async (formData: FormData, { dispatch }) => {
  await axios.post('/admin/properties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  dispatch(fetchProperties());
});

export const updateProperty = createAsyncThunk(
  'properties/update',
  async ({ id, formData }: { id: number; formData: FormData }, { dispatch }) => {
    await axios.post(`/admin/properties/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      params: { _method: 'PUT' },
    });
    dispatch(fetchProperties());
  }
);

export const deleteProperty = createAsyncThunk('properties/delete', async (id: number, { dispatch }) => {
  await axios.delete(`/admin/properties/${id}`);
  dispatch(fetchProperties());
});

export const toggleFeatured = createAsyncThunk('properties/toggleFeatured', async (id: number, { dispatch }) => {
  await axios.put(`/admin/properties/${id}/toggle-featured`);
  dispatch(fetchProperties());
});

const propertiesSlice = createSlice({
  name: 'properties',
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
        state.error = action.error.message || 'Failed to fetch properties';
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

export const { clearCurrent } = propertiesSlice.actions;
export default propertiesSlice.reducer;
