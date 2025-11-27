// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/authService.js';

// Async thunks
export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ phone, password }, { rejectWithValue, dispatch }) => {
        console.log('🔄 loginUser thunk started:', { phone: phone.substring(0, 5) + '***' });
        try {
            // Step 1: Get tokens
            console.log('📡 Step 1: Calling authService.login...');
            const tokenResponse = await authService.login(phone, password);
            console.log('✅ Token response received:', tokenResponse);

            if (!tokenResponse.data?.token) {
                throw new Error('No token in response');
            }

            // Store tokens
            localStorage.setItem('authToken', tokenResponse.data.token.access);
            localStorage.setItem('refreshToken', tokenResponse.data.token.refresh);
            console.log('💾 Tokens stored in localStorage');

            // Step 2: Get user data
            console.log('📡 Step 2: Calling authService.getCurrentUser...');
            const userResponse = await authService.getCurrentUser();
            console.log('✅ User data received:', userResponse);

            return {
                tokens: tokenResponse.data.token,
                user: userResponse.data
            };
        } catch (error) {
            console.error('❌ Login error:', error);
            console.error('❌ Error response:', error.response?.data);
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await authService.getCurrentUser();
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to get user data');
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/checkAuth',
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem('authToken');

        console.log('🔍 checkAuth: Checking token existence', {
            hasToken: !!token,
            tokenLength: token?.length
        });

        if (!token) {
            console.log('❌ checkAuth: No token found, rejecting');
            // ❌ OLD: throw new Error('No token found');
            // ✅ NEW: Use rejectWithValue instead
            return rejectWithValue('No token found');
        }

        try {
            console.log('🔐 checkAuth: Token found, verifying with API...');
            const userResponse = await authService.getCurrentUser();
            console.log('✅ checkAuth: Token is valid, user data received');
            return userResponse.data;
        } catch (error) {
            console.error('❌ checkAuth: Token verification failed', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            // ❌ OLD: throw error;
            // ✅ NEW: Use rejectWithValue instead
            return rejectWithValue(error.response?.data || 'Token verification failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await authService.logout();
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            return null;
        } catch (error) {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
            return rejectWithValue(error.response?.data || 'Logout failed');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('authToken'),
        refreshToken: localStorage.getItem('refreshToken'),
        isAuthenticated: false, // Start as false until we verify
        isLoading: false, // Start loading to check auth status
        error: null
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.isLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Check Auth - This runs when app starts
            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.tokens.access;
                state.refreshToken = action.payload.tokens.refresh;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.error = action.payload;
            })
            // Get Current User
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.user = action.payload;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.token = null;
                state.refreshToken = null;
                state.isAuthenticated = false;
                state.isLoading = false;
                state.error = null;
            });
    }
});

export const { clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;