import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

interface SearchState {
  properties: any[];
  loading: boolean;
  error: string | null;
  filters: {
    types: string[];
    offers: string[];
    cities: string[];
    priceRanges: {
      label: string;
      min: number | null;
      max: number | null;
    }[];
  };
}

const initialState: SearchState = {
  properties: [],
  loading: false,
  error: null,
  filters: {
    types: [],
    offers: [],
    cities: [],
    priceRanges: [],
  },
};

export const fetchFilterOptions = createAsyncThunk(
  'search/fetchFilterOptions',
  async () => {
    const res = await axios.get('/property-options');
    return res.data;
  }
);

export const fetchProperties = createAsyncThunk(
  'search/fetchProperties',
  async (filters: any) => {
    const res = await axios.get('/search-properties', { params: filters });
    return res.data;
  }
);

const searchPropertySlice = createSlice({
  name: 'search',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Error fetching properties';
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action: PayloadAction<SearchState['filters']>) => {
        state.filters = action.payload;
      });
  },
});

export default searchPropertySlice.reducer;
