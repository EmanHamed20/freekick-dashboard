// src/services/authService.js
import api from './api.js';

export const authService = {
    login: async (phone, password) => {
        console.log('📞 Making login API call to /auth/jwt/create/');
        console.log('📤 Request payload:', { phone: phone.substring(0, 5) + '***', password: '***' });

        try {
            const response = await api.post('/auth/jwt/create/', {
                phone: phone,
                password: password
            });
            console.log('✅ Login API response:', response);
            return response.data;
        } catch (error) {
            console.error('❌ Login API error:', error);
            console.error('❌ Error details:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            throw error;
        }
    },

    getCurrentUser: async () => {
        console.log('👤 Making getCurrentUser API call to /auth/users/me/');
        try {
            const response = await api.get('/auth/users/me/');
            console.log('✅ User API response:', response);
            return response.data;
        } catch (error) {
            console.error('❌ GetCurrentUser API error:', error);
            throw error;
        }
    },


    logout: async () => {
        const response = await api.post('/auth/logout/');
        return response.data;
    },

    refreshToken: async (refreshToken) => {
        const response = await api.post('/auth/jwt/refresh/', {
            refresh: refreshToken
        });
        return response.data;
    }
};