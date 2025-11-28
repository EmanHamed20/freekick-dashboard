// src/services/authService.js
import api from './api.js';

export const authService = {
    login: async (phone, password) => {
        try {
            const response = await api.post('/auth/jwt/create/', {
                phone,
                password
            });
            return response.data;
        } catch (error) {
            // Handle the specific API error structure
            const errorMessage = error.response?.data?.message
                || error.response?.data?.details?.[0]?.message
                || error.response?.data?.detail
                || 'Login failed. Please try again.';

            throw new Error(errorMessage);
        }
    },

    getCurrentUser: async () => {
        try {
            const response = await api.get('/auth/users/me/');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message
                || error.response?.data?.details?.[0]?.message
                || error.response?.data?.detail
                || 'Failed to fetch user data.';

            throw new Error(errorMessage);
        }
    },

    logout: async () => {
        // Token clearing happens in Redux action
        return Promise.resolve({ success: true });
    },

    refreshToken: async (refreshToken) => {
        try {
            const response = await api.post('/auth/jwt/refresh/', {
                refresh: refreshToken
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message
                || error.response?.data?.details?.[0]?.message
                || error.response?.data?.detail
                || 'Token refresh failed.';

            throw new Error(errorMessage);
        }
    }
};