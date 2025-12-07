import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularVenues } from '../../features/dashboard/analyticsSlice';
import stadiumIcon from '../../assets/stadiumIcon.svg'
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
    '#475569',
    '#06B6D4', // darker cyan
    '#777777', // light slate
    '#4ADE80'  // green
];

const PopularVenues = () => {
    const dispatch = useDispatch();
    const [centerContent, setCenterContent] = useState({
        type: 'image', // 'text' or 'image'
        // value: 'Popular Venues',
        imageUrl: stadiumIcon // Add your image URL here when using image
    });

    const { popularVenues, loading } = useSelector((state) => ({
        popularVenues: state.analytics.popularVenues?.results || [],
        loading: state.analytics.loading.popularVenues
    }));

    useEffect(() => {
            dispatch(fetchPopularVenues({
                // city: selectedCity,
                ordering: '-number_of_booking',
                is_active: true,
                page_limit: 5
            }));

    }, [ dispatch]);


    // Calculate data for the chart
    const venuesWithData = popularVenues?.map((venue, index) => {
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
            value: percentage,
            sports: venue.venue_play_type?.map(sport => sport.translations?.name).join(', ') || ''
        };
    }) || [];

    // Normalize percentages
    const totalPercentage = venuesWithData.reduce((sum, venue) => sum + venue.value, 0);
    const normalizedVenues = venuesWithData.map(venue => ({
        ...venue,
        percentage: Math.round((venue.value / totalPercentage) * 100),
        value: Math.round((venue.value / totalPercentage) * 100)
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
                <h2 className="xl:text-lg   font-bold text-gray-800">Booking per Venues</h2>

                {/* Control buttons for center content */}
                <div className="flex items-center gap-2">


                    {/* City Dropdown */}

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
                </div>
            )}

            {/* Chart and Legend */}
            {!loading && normalizedVenues.length > 0 && (
                <div className="flex flex-col items-center">
                    {/* Donut Chart with Center Content */}
                    <div id="venue-donut-chart" className="relative w-44 h-44 mb-8  xl:w-56 xl:h-56 ">
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

                        {/* Center Content - Text or Image */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-sm">
                                {centerContent.type === 'image' && centerContent.imageUrl ? (
                                    <div className="w-20 h-20 rounded-full  0">
                                        <img
                                            src={stadiumIcon}
                                            alt="Venue Chart Center"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="px-2">
                                        <div className="text-lg font-bold text-gray-800 leading-tight">
                                            {centerContent.value}
                                        </div>

                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Legend with Venue Details */}
                    <div className="w-full space-y-4 lg:px-8">
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

                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-semibold" style={{ color: venue.color }}>
                                        {venue.percentage}%
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