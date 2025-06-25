// store/admin/planAdminSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/utils/axios'; // your axios instance

export interface Plan {
  id: number;
  name: string;
  max_properties: number;
  price: number;
  duration_days: number | null; // nullable duration in days
  created_at?: string;
  updated_at?: string;
}

interface PlanAdminState {
  plans: Plan[];
  loading: boolean;
  error: string | null;
  success: string | null;
  editingPlan: Plan | null;
}

const initialState: PlanAdminState = {
  plans: [],
  loading: false,
  error: null,
  success: null,
  editingPlan: null,
};

// Fetch all plans
export const fetchAllPlans = createAsyncThunk(
  'planAdmin/fetchAllPlans',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/admin/plans'); // updated endpoint for plans
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch plans');
    }
  }
);

// Update plan
export const updatePlan = createAsyncThunk(
  'planAdmin/updatePlan',
  async (
    plan: { id: number; name: string; max_properties: number; price: number; duration_days: number | null },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put(`/admin/plans/${plan.id}`, plan); // updated endpoint
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update plan');
    }
  }
);

const planAdminSlice = createSlice({
  name: 'planAdmin',
  initialState,
  reducers: {
    setEditingPlan(state, action: PayloadAction<Plan | null>) {
      state.editingPlan = action.payload;
    },
    clearMessages(state) {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPlans.fulfilled, (state, action: PayloadAction<Plan[]>) => {
        state.loading = false;
        state.plans = action.payload;
      })
      .addCase(fetchAllPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updatePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(updatePlan.fulfilled, (state, action: PayloadAction<Plan>) => {
        state.loading = false;
        state.success = 'Plan updated successfully';

        // Update plan in list
        const index = state.plans.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.plans[index] = action.payload;
        }
        state.editingPlan = null;
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setEditingPlan, clearMessages } = planAdminSlice.actions;
export default planAdminSlice.reducer;
