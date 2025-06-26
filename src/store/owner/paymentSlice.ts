import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

// Define interfaces first
interface CreatePaymentIntentPayload {
  planId: number;
  amount: number;
}

interface PaymentState {
  clientSecret: string | null;
  loading: boolean;
  error: string | null;
}

// Then async thunk using the interfaces
export const createPaymentIntent = createAsyncThunk<
  string, // return type: clientSecret string
  CreatePaymentIntentPayload, // argument type
  { rejectValue: string } // thunkAPI type
>(
  'payment/createPaymentIntent',
  async ({ planId, amount }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/owner/create-payment-intent', { planId, amount });
      return res.data.clientSecret;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Payment intent creation failed');
    }
  }
);

// Initial state typed with interface
const initialState: PaymentState = {
  clientSecret: null,
  loading: false,
  error: null,
};

// Then createSlice using the initialState and extraReducers
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.clientSecret = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentIntent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.loading = false;
        state.clientSecret = action.payload;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
