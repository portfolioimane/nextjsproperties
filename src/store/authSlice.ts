import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  // Add more fields as needed
}

interface AuthState {
  user: User | null;
  authChecked: boolean;
}

const initialState: AuthState = {
  user: null,
  authChecked: false,
};

// --- Thunks ---
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/login', credentials);
      return response.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (
    userData: {
      name: string;
      email: string;
      password: string;
      password_confirmation: string;
      role: 'owner' | 'customer';
      phone?: string;
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await axios.post('/register', userData);

    console.log('Register response:', response.data);
return response.data.user;  // Make sure `user` exists here
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/user');
    console.log(response.data.user);
    console.log(response.data.user.role);
    return response.data.user;
  } catch (err: any) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await axios.post('/logout');
});

// Optional: Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, password, token }: { email: string; password: string; token: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/password/reset', {
        email,
        password,
        password_confirmation: password,
        token,
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Optional: Send reset link
export const sendPasswordResetLink = createAsyncThunk(
  'auth/sendPasswordResetLink',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post('/password/email', { email });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Optional: Update user
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (userData: any, { rejectWithValue }) => {
    try {
      const res = await axios.post('/user', userData);
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(register.fulfilled, () => {})
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authChecked = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.user = null;
        state.authChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export default authSlice.reducer;