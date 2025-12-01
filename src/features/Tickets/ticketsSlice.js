// FILE: src/store/slices/ticketsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ticketsService from '../../services/Tickets/ticketservice.js';

// Async thunks
export const fetchTickets = createAsyncThunk(
    'tickets/fetchAll',
    async (params, { rejectWithValue }) => {
        try {
            const response = await ticketsService.getAllTickets(params);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const fetchTicketById = createAsyncThunk(
    'tickets/fetchById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await ticketsService.getTicketById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const createTicket = createAsyncThunk(
    'tickets/create',
    async (ticketData, { rejectWithValue }) => {
        try {
            const response = await ticketsService.createTicket(ticketData);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const updateTicket = createAsyncThunk(
    'tickets/update',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await ticketsService.updateTicket(id, data);
            return response;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const deleteTicket = createAsyncThunk(
    'tickets/delete',
    async (id, { rejectWithValue }) => {
        try {
            await ticketsService.deleteTicket(id);
            return id;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const trackClick = createAsyncThunk(
    'tickets/trackClick',
    async (id, { rejectWithValue }) => {
        try {
            const response = await ticketsService.trackTicketClick(id);
            return { id, data: response };
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const initialState = {
    tickets: [],
    currentTicket: null,
    pagination: {
        count: 0,
        next: null,
        previous: null,
    },
    loading: false,
    error: null,
    success: false,
};

const ticketsSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        clearCurrentTicket: (state) => {
            state.currentTicket = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all tickets
            .addCase(fetchTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = action.payload.results || action.payload;
                state.pagination = {
                    count: action.payload.count || 0,
                    next: action.payload.next || null,
                    previous: action.payload.previous || null,
                };
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch tickets';
            })

            // Fetch ticket by ID
            .addCase(fetchTicketById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTicketById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentTicket = action.payload;
            })
            .addCase(fetchTicketById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch ticket';
            })

            // Create ticket
            .addCase(createTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets.unshift(action.payload);
                state.success = true;
                state.pagination.count += 1;
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to create ticket';
                state.success = false;
            })

            // Update ticket
            .addCase(updateTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(updateTicket.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tickets.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.tickets[index] = action.payload;
                }
                state.success = true;
            })
            .addCase(updateTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to update ticket';
                state.success = false;
            })

            // Delete ticket
            .addCase(deleteTicket.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(deleteTicket.fulfilled, (state, action) => {
                state.loading = false;
                state.tickets = state.tickets.filter(t => t.id !== action.payload);
                state.success = true;
                state.pagination.count -= 1;
            })
            .addCase(deleteTicket.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to delete ticket';
                state.success = false;
            })

            // Track click
            .addCase(trackClick.fulfilled, (state, action) => {
                const index = state.tickets.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.tickets[index].number_of_clicks = action.payload.data.number_of_clicks;
                }
            });
    },
});

export const { clearError, clearSuccess, clearCurrentTicket } = ticketsSlice.actions;
export default ticketsSlice.reducer;