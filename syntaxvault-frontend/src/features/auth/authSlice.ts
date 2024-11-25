// src/features/auth/authSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosInstance';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  user: string | null;
  loading: boolean;
  error: string | null;
}

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

const storedToken = localStorage.getItem('token');
const initialState: AuthState = {
  token: isTokenValid(storedToken) ? storedToken : null,
  user: isTokenValid(storedToken) 
    ? (jwtDecode<{ sub: string }>(storedToken!).sub || null)
    : null,
  loading: false,
  error: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { username: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post('/api/users/login', credentials);
      return response.data.token;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: { username: string; email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post('/api/users/register', userData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    // Handle login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.token = action.payload;
      const decodedToken = jwtDecode<{ sub: string }>(action.payload);
      state.user = decodedToken.sub || null;
      localStorage.setItem('token', action.payload);
      console.log('User logged in:', state.user);
    });
    builder.addCase(loginUser.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle registration
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
