// src/hooks/useAuth.js
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    loginUser,
    logoutUser,
    clearError,
    getCurrentUser
} from '../features/auth/authSlice.js';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, token, isAuthenticated, isLoading, error } = useSelector(
        (state) => state.auth
    );

    const cleanPhoneNumber = (phone) => {
        let cleanPhone = phone.replace(/[^\d+]/g, '');
        if (!cleanPhone.startsWith('+')) {
            cleanPhone = `+${cleanPhone}`;
        }
        return cleanPhone;
    };

    const login = (phone, password) => {
        const cleanPhone = cleanPhoneNumber(phone);
        dispatch(loginUser({ phone: cleanPhone, password }));
    };

    const logout = () => {
        dispatch(logoutUser());
    };

    const resetError = () => {
        dispatch(clearError());
    };

    const fetchUser = () => {
        dispatch(getCurrentUser());
    };

    // Cleanup error on unmount
    useEffect(() => {
        return () => {
            if (error) {
                resetError();
            }
        };
    }, [error]);

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        resetError,
        fetchUser
    };
};