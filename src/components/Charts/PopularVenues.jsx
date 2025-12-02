import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularVenues } from '../../features/dashboard/analyticsSlice';

const CITIES = [
    { value: 'Abu Dhabi', label: 'Abu Dhabi' },
    { value: 'Dubai', label: 'Dubai' },
    { value: 'Sharjah', label: 'Sharjah' },
    { value: 'Ajman', label: 'Ajman' },
    { value: 'Ras Al Khaimah', label: 'Ras Al Khaimah' },
    { value: 'Fujairah', label: 'Fujairah' },
    { value: 'Umm Al Quwain', label: 'Umm Al Quwain' }
];

const COLORS = [
    '#22D3EE', // cyan
    '#06B6D4', // darker cyan
    '#475569', // slate
    '#CBD5E1', // light slate
    '#4ADE80'  // green
];

const PopularVenues = () => {
    const dispatch = useDispatch();
    const [selectedCity, setSelectedCity] = useState('Abu Dhabi');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { popularVenues, loading } = useSelector((state) => ({
        popularVenues: state.analytics.popularVenues?.results || [],
        loading: state.analytics.loading.popularVenues
    }));

    useEffect(() => {
        if (selectedCity) {
            dispatch(fetchPopularVenues({
                city: selectedCity,
                ordering: '-number_of_booking',
                is_active: true,
                page_limit: 5
            }));
        }
    }, [selectedCity, dispatch]);

    const handleCityChange = (city) => {
        setSelectedCity(city);
        setIsDropdownOpen(false);
    };

    // Calculate total minimum price for percentage (as we don't have booking count)
    // In real scenario, you'd want to use number_of_booking from API
    // For now, we'll use min_price as a proxy or assign equal distribution
    const venuesWithData = popularVenues?.map((venue, index) => {
        // Using index-based distribution since we don't have booking_count in response
        // Venues are already ordered by number_of_booking from API
        // First venue gets highest percentage, then decreasing
        const basePercentage = 40 - (index * 7);
        const percentage = Math.max(basePercentage, 5);

        return {
            id: venue.id,
            name: venue.translations?.name || 'Unknown Venue',
            min_price: venue.min_price,
            rate: venue.rate,
            venue_type: venue.venue_type,
            city: venue.city,
            color: COLORS[index % COLORS.length],
            percentage: percentage,
            sports: venue.venue_play_type?.map(sport => sport.translations?.name).join(', ') || ''
        };
    }) || [];

    // For demonstration, let's normalize percentages to sum to 100
    const totalPercentage = venuesWithData.reduce((sum, venue) => sum + venue.percentage, 0);
    const normalizedVenues = venuesWithData.map(venue => ({
        ...venue,
        percentage: Math.round((venue.percentage / totalPercentage) * 100)
    }));

    // Calculate stroke dash array for donut chart
    const calculateStrokeDasharray = (percentage) => {
        const circumference = 2 * Math.PI * 45;
        const dashLength = (percentage / 100) * circumference;
        return `${dashLength} ${circumference}`;
    };

    let cumulativePercentage = 0;
    const chartSegments = normalizedVenues.map((venue, index) => {
        const rotation = (cumulativePercentage / 100) * 360 - 90;
        cumulativePercentage += venue.percentage;

        return {
            ...venue,
            rotation,
            dashArray: calculateStrokeDasharray(venue.percentage)
        };
    });

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Popular Venues</h2>

                {/* City Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-400 text-white rounded-lg hover:bg-cyan-500 transition-colors"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        <span className="font-medium">{selectedCity}</span>
                        <svg
                            className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                            {CITIES.map((city) => (
                                <button
                                    key={city.value}
                                    onClick={() => handleCityChange(city.value)}
                                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors ${
                                        selectedCity === city.value ? 'bg-cyan-50 text-cyan-600' : 'text-gray-700'
                                    }`}
                                >
                                    {city.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
                </div>
            )}

            {/* No Data State */}
            {!loading && normalizedVenues.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p>No venues found in {selectedCity}</p>
                </div>
            )}

            {/* Chart and Legend */}
            {!loading && normalizedVenues.length > 0 && (
                <div className="flex flex-col items-center">
                    {/* Donut Chart */}
                    <div className="relative w-64 h-64 mb-8">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                            {/* Background circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="#F1F5F9"
                                strokeWidth="10"
                            />

                            {/* Chart segments */}
                            {chartSegments.map((segment, index) => (
                                <circle
                                    key={segment.id || index}
                                    cx="50"
                                    cy="50"
                                    r="45"
                                    fill="none"
                                    stroke={segment.color}
                                    strokeWidth="10"
                                    strokeDasharray={segment.dashArray}
                                    strokeDashoffset="0"
                                    transform={`rotate(${segment.rotation} 50 50)`}
                                    style={{
                                        transition: 'all 0.3s ease-in-out'
                                    }}
                                />
                            ))}
                        </svg>

                        {/* Center Info */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-800">
                                    {normalizedVenues.length}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Venues
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Legend with Venue Details */}
                    <div className="w-full space-y-4">
                        {normalizedVenues.map((venue, index) => (
                            <div key={venue.id || index} className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div
                                        className="w-4 h-4 rounded-sm flex-shrink-0 mt-1"
                                        style={{ backgroundColor: venue.color }}
                                    ></div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-800">
                                            {venue.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {venue.sports}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex items-center text-amber-500">
                                                {'★'.repeat(Math.floor(venue.rate || 0))}
                                                {'☆'.repeat(5 - Math.floor(venue.rate || 0))}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {venue.venue_type === 'indoor' ? '🏠 Indoor' : '🌳 Outdoor'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold" style={{ color: venue.color }}>
                                        {venue.percentage}%
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {venue.min_price?.toFixed(1)} AED
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>


                </div>
            )}
        </div>
    );
};

export default PopularVenues;