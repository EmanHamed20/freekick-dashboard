// FILE: src/hooks/useTickets.js

import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchTickets,
    fetchTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
    trackClick,
    clearError,
    clearSuccess,
    clearCurrentTicket
} from '../features/Tickets/ticketsSlice.js';

export const useTickets = () => {
    const dispatch = useDispatch();
    const { tickets, currentTicket, pagination, loading, error, success } = useSelector(
        (state) => state.tickets
    );

    const [filters, setFilters] = useState({
        page: 1,
        page_limit: 10,
        search: '',
        ordering: '',
    });

    // Fetch tickets based on filters
    const loadTickets = useCallback((customFilters = {}) => {
        const params = { ...filters, ...customFilters };
        setFilters(params);
        dispatch(fetchTickets(params));
    }, [dispatch, filters]);

    // Initial load
    useEffect(() => {
        loadTickets();
    }, []);

    // Get ticket by ID
    const getTicket = useCallback((id) => {
        dispatch(fetchTicketById(id));
    }, [dispatch]);

    const addTicket = useCallback(async (ticketData) => {
        try {
            const result = await dispatch(createTicket(ticketData)).unwrap();
            // Only reload tickets if creation was successful
            loadTickets({ page: 1 });
            return { success: true, data: result };
        } catch (error) {
            console.error('Failed to create ticket:', error);
            return { success: false, error: error.message || 'Failed to create ticket' };
        }
    }, [dispatch, loadTickets]);

    // Update existing ticket
    const editTicket = useCallback(async (id, data) => {
        const result = await dispatch(updateTicket({ id, data }));
        return result;
    }, [dispatch]);

    // Delete ticket
    const removeTicket = useCallback(async (id) => {
        const result = await dispatch(deleteTicket(id));
        return result;
    }, [dispatch]);

    // Track click on ticket
    const recordClick = useCallback((id) => {
        dispatch(trackClick(id));
    }, [dispatch]);

    // Handle search
    const handleSearch = useCallback((searchTerm) => {
        loadTickets({ search: searchTerm, page: 1 });
    }, [loadTickets]);

    // Handle filter change
    const handleFilterChange = useCallback((newFilters) => {
        loadTickets({ ...newFilters, page: 1 });
    }, [loadTickets]);

    // Handle page change
    const handlePageChange = useCallback((page) => {
        loadTickets({ page });
    }, [loadTickets]);

    const handleSort = useCallback((key, order) => {
        console.log('Sorting - Key:', key, 'Order:', order); // Debug log


        // Validate the key exists
        if (!key) {
            console.error('Sort key is empty');
            return;
        }

        const ordering = order === 'asc' ? key : `-${key}`;
        console.log('Sending ordering to API:', ordering); // Debug log

        loadTickets({ ordering, page: 1 });
    }, [loadTickets]);
    // Clear functions
    const resetError = useCallback(() => {
        dispatch(clearError());
    }, [dispatch]);

    const resetSuccess = useCallback(() => {
        dispatch(clearSuccess());
    }, [dispatch]);

    const resetCurrentTicket = useCallback(() => {
        dispatch(clearCurrentTicket());
    }, [dispatch]);

    return {
        // State
        tickets,
        currentTicket,
        pagination,
        loading,
        error,
        success,
        filters,

        // Actions
        loadTickets,
        getTicket,
        addTicket,
        editTicket,
        removeTicket,
        recordClick,

        // Handlers
        handleSearch,
        handleFilterChange,
        handlePageChange,
        handleSort,

        // Clear functions
        resetError,
        resetSuccess,
        resetCurrentTicket,
    };
};