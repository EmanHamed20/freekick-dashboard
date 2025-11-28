// features/bookings/bookingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bookingService } from '../../services/bookings/bookingService.js';

export const getBookings = createAsyncThunk(
    'bookings/getAll',
    async (filters) => {
        const response = await bookingService.getAll(filters);
        // Extract data from API response wrapper
        // API returns: { status: true, data: [...], code: 200 }
        return response.data || response;
    }
);

export const getBookingById = createAsyncThunk(
    'bookings/getById',
    async (id) => {
        const response = await bookingService.getById(id);
        // Extract data from API response wrapper
        return response.data || response;
    }
);

const bookingSlice = createSlice({
    name: 'bookings',
    initialState: {
        items: [],
        selectedBooking: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        clearSelectedBooking: (state) => {
            state.selectedBooking = null;
        },
        setSelectedBooking: (state, action) => {
            state.selectedBooking = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get all bookings
            .addCase(getBookings.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getBookings.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(getBookings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Get booking by ID
            .addCase(getBookingById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getBookingById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedBooking = action.payload;
            })
            .addCase(getBookingById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export const { clearSelectedBooking, setSelectedBooking } = bookingSlice.actions;
export default bookingSlice.reducer;