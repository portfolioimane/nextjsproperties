import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/axios';

// Plan type
export interface Plan {
  id: number;
  name: string;
  price: number;
  max_properties: number;
  duration_days: number | null;
  created_at?: string;
  updated_at?: string;
}

// Subscription type
export interface Subscription {
  id: number;
  user_id: number;
  plan_id: number;
  expires_at: string | null;
  plan: Plan;  // nested plan info
  created_at?: string;
  updated_at?: string;
}

interface SubscriptionState {
  data: Subscription | null;
  loading: boolean;
  error: string | null;
  success: string | null;

  propertyCount: number | null;
  checkingLimit: boolean;
  limitError: string | null;

  plans: Plan[];
  plansLoading: boolean;
  plansError: string | null;
}

const initialState: SubscriptionState = {
  data: null,
  loading: false,
  error: null,
  success: null,

  propertyCount: null,
  checkingLimit: false,
  limitError: null,

  plans: [],
  plansLoading: false,
  plansError: null,
};

// Fetch user's subscription with nested plan
export const fetchSubscription = createAsyncThunk(
  'subscription/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/owner/subscription');
      return res.data as Subscription;
      console.log('susbscription',res.data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch subscription');
    }
  }
);

// Subscribe to a plan by plan id AND paymentMethod (new signature)
export const subscribe = createAsyncThunk<
  Subscription,
  { planId: number; paymentMethod: 'stripe' | 'paypal' },
  { rejectValue: string }
>(
  'subscription/subscribe',
  async ({ planId, paymentMethod }, { rejectWithValue }) => {
    try {
      const res = await api.post('/owner/subscribe', { plan_id: planId, payment_method: paymentMethod });
      return res.data as Subscription;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Subscription failed');
    }
  }
);

// Cancel subscription (optional)
export const cancelSubscription = createAsyncThunk(
  'subscription/cancel',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/owner/cancel-subscription');
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to cancel subscription');
    }
  }
);

// Fetch property count
export const fetchPropertyCount = createAsyncThunk(
  'subscription/fetchPropertyCount',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/owner/properties/count');
      return res.data.count;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch property count');
    }
  }
);

// Check if user can add a property
export const checkPropertyLimit = createAsyncThunk<
  void,
  void,
  { state: { subscription: SubscriptionState }; rejectValue: string }
>(
  'subscription/checkPropertyLimit',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const subscription = state.subscription.data;
    const propertyCount = state.subscription.propertyCount;

    if (!subscription) {
      return rejectWithValue('No subscription found');
    }
    if (propertyCount === null) {
      return rejectWithValue('Property count not loaded');
    }
    if (propertyCount >= subscription.plan.max_properties) {
      return rejectWithValue('Property limit reached. Please upgrade your plan.');
    }
  }
);

// Fetch all plans
export const fetchPlans = createAsyncThunk(
  'subscription/fetchPlans',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/owner/plans');
      return res.data as Plan[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch plans');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionMessages(state) {
      state.error = null;
      state.success = null;
      state.limitError = null;
      state.plansError = null;
    },
    clearLimitError(state) {
      state.limitError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(fetchSubscription.fulfilled, (state, action: PayloadAction<Subscription>) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(subscribe.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(subscribe.fulfilled, (state, action: PayloadAction<Subscription>) => {
        state.loading = false;
        state.data = action.payload;
        state.success = 'Subscription successful';
      })
      .addCase(subscribe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(cancelSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(cancelSubscription.fulfilled, (state) => {
        state.loading = false;
        state.data = null;
        state.success = 'Subscription cancelled';
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchPropertyCount.pending, (state) => {
        state.checkingLimit = true;
        state.limitError = null;
      })
      .addCase(fetchPropertyCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.checkingLimit = false;
        state.propertyCount = action.payload;
      })
      .addCase(fetchPropertyCount.rejected, (state, action) => {
        state.checkingLimit = false;
        state.limitError = action.payload as string;
      })

      .addCase(checkPropertyLimit.pending, (state) => {
        state.limitError = null;
      })
      .addCase(checkPropertyLimit.fulfilled, (state) => {
        state.limitError = null;
      })
      .addCase(checkPropertyLimit.rejected, (state, action) => {
        state.limitError = action.payload as string;
      })

      .addCase(fetchPlans.pending, (state) => {
        state.plansLoading = true;
        state.plansError = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action: PayloadAction<Plan[]>) => {
        state.plansLoading = false;
        state.plans = action.payload;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.plansLoading = false;
        state.plansError = action.payload as string;
      });
  },
});

export const { clearSubscriptionMessages, clearLimitError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
