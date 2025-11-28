// hooks/useBookings.js
import { useState, useEffect } from 'react';
import { bookingService } from '../services/bookings/bookingService';

/**
 * Custom hook to fetch and manage bookings
 *
 * @param {Object} filters - Filter parameters for the API
 * @param {Object} options - Additional options
 * @returns {Object} - { bookings, isLoading, error, refetch }
 */
export const useBookings = (filters = {}, options = {}) => {
    const [bookings, setBookings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const {
        autoFetch = true,
        onSuccess,
        onError
    } = options;

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
                if (value !== null && value !== undefined && value !== '' && value !== 'all') {
                    acc[key] = value;
                }
                return acc;
            }, {});

            const response = await bookingService.getAll(cleanFilters);

            // Extract data from API response wrapper
            const data = response.data || response;
            setBookings(data);

            if (onSuccess) {
                onSuccess(data);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch bookings';
            setError(errorMessage);

            if (onError) {
                onError(errorMessage);
            }

            console.error('Error fetching bookings:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch) {
            fetchBookings();
        }
    }, [JSON.stringify(filters)]);

    return {
        bookings,
        isLoading,
        error,
        refetch: fetchBookings
    };
};

/**
 * Hook to fetch a single booking by ID
 */
export const useBooking = (id, options = {}) => {
    const [booking, setBooking] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const { autoFetch = true } = options;

    const fetchBooking = async () => {
        if (!id) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await bookingService.getById(id);

            // Extract the actual booking data from the API response wrapper
            // API returns: { status: true, data: { id: 37, ... }, code: 200 }
            const bookingData = response.data || response;

            console.log('useBooking - API Response:', response);
            console.log('useBooking - Extracted Data:', bookingData);

            setBooking(bookingData);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch booking';
            setError(errorMessage);
            console.error('Error fetching booking:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (autoFetch && id) {
            fetchBooking();
        }
    }, [id, autoFetch]);

    return {
        booking,
        isLoading,
        error,
        refetch: fetchBooking
    };
};

/**
 * Hook to fetch booking analytics
 */
export const useBookingAnalytics = () => {
    const [analytics, setAnalytics] = useState({
        cardAnalytics: null,
        revenueTrend: null,
        topEmirates: null,
        weeklyAnalytics: null
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAnalytics = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [cardData, revenueData, emiratesData, weeklyData] = await Promise.all([
                bookingService.getCardAnalytics(),
                bookingService.getRevenueTrend(),
                bookingService.getTopEmirates(),
                bookingService.getWeeklyBookingAnalytics()
            ]);

            setAnalytics({
                cardAnalytics: cardData.data || cardData,
                revenueTrend: revenueData.data || revenueData,
                topEmirates: emiratesData.data || emiratesData,
                weeklyAnalytics: weeklyData.data || weeklyData
            });
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch analytics';
            setError(errorMessage);
            console.error('Error fetching analytics:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    return {
        analytics,
        isLoading,
        error,
        refetch: fetchAnalytics
    };
};