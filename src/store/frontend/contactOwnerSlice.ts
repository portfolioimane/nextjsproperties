import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

// contactOwnerSlice.ts
export interface ContactFormData {
  client_name: string;
  email: string;
  phone_whatsapp?: string;
  message?: string; // added message field
  project_type?: string;
  lead_source?: string;
  stage?: 'lead' | 'nurture' | 'conversion' | 'closed' | 'follow_up';
  last_contact?: string;
  next_step?: string;
  notes?: string;
  competitor?: string;
  property_id: number;
}

interface ContactOwnerState {
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  message: string | null;
}

const initialState: ContactOwnerState = {
  status: 'idle',
  error: null,
  message: null,
};

export const submitContactOwner = createAsyncThunk(
  'contactOwner/submitContactOwner',
  async (data: ContactFormData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/contact-owner', data);
      return response.data; // expecting { status: 'success', message: '...' }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Submission failed');
    }
  }
);

const contactOwnerSlice = createSlice({
  name: 'contactOwner',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitContactOwner.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.message = null;
      })
      .addCase(submitContactOwner.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload.message || 'Submitted successfully.';
      })
      .addCase(submitContactOwner.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.message = null;
      });
  },
});

export default contactOwnerSlice.reducer;
