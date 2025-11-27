import { configureStore } from '@reduxjs/toolkit';
import bookingsReducer from '../features/bookings/bookingSlice.js';
import authReducer from '../features/auth/authSlice.js'

export const store = configureStore({
    reducer: {
        bookings: bookingsReducer,
        auth: authReducer,


    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});