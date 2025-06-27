import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

// --- Interfaces ---

interface CreatePaymentIntentPayload {
  planId: number;
  amount: number;
}

interface VerifyPaypalPaymentPayload {
  orderID: string;
}

interface PaymentState {
  clientSecret: string | null;
  paypalVerificationResult: any | null; // can refine type if you want
  loading: boolean;
  error: string | null;
}

// --- Async Thunks ---

export const createPaymentIntent = createAsyncThunk<
  string, // return clientSecret
  CreatePaymentIntentPayload,
  { rejectValue: string }
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

export const verifyPaypalPayment = createAsyncThunk<
  any, // return the full verification result (you can type it more strictly)
  VerifyPaypalPaymentPayload,
  { rejectValue: string }
>(
  'payment/verifyPaypalPayment',
  async ({ orderID }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/owner/paypal/verify', { orderID });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'PayPal payment verification failed');
    }
  }
);

// --- Initial State ---

const initialState: PaymentState = {
  clientSecret: null,
  paypalVerificationResult: null,
  loading: false,
  error: null,
};

// --- Slice ---

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentState: (state) => {
      state.clientSecret = null;
      state.paypalVerificationResult = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Stripe payment intent
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
        state.error = action.payload || 'Failed to create payment intent';
      });

    // PayPal verification
    builder
      .addCase(verifyPaypalPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPaypalPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paypalVerificationResult = action.payload;
      })
      .addCase(verifyPaypalPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'PayPal verification failed';
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
