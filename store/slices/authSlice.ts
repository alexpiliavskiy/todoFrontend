import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getMeService, loginService, registerService } from '@/services/authService';
import type { AuthState, LoginCredentials, RegisterCredentials } from '@/types';

const TOKEN_KEY = 'todo_auth_token';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const login = createAsyncThunk('auth/login', async (credentials: LoginCredentials, { rejectWithValue }) => {
  try {
    const result = await loginService(credentials);
    localStorage.setItem(TOKEN_KEY, result.token);
    return result;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (credentials: RegisterCredentials, { rejectWithValue }) => {
  try {
    const result = await registerService(credentials);
    localStorage.setItem(TOKEN_KEY, result.token);
    return result;
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : 'Registration failed');
  }
});

export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) throw new Error('No session');
    const user = await getMeService(token);
    return { token, user };
  } catch (err) {
    localStorage.removeItem(TOKEN_KEY);
    return rejectWithValue(err instanceof Error ? err.message : 'Session restore failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem(TOKEN_KEY);
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(register.pending, state => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload as string;
      })
      .addCase(restoreSession.pending, state => { state.loading = true; })
      .addCase(restoreSession.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
        state.isAuthenticated = true;
      })
      .addCase(restoreSession.rejected, state => { state.loading = false; });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
