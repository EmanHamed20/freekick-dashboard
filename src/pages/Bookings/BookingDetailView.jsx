import { useState } from 'react';
import {
    ArrowLeft, Calendar, CheckCircle, Clock, CreditCard,
    Mail, MapPin, Phone, Printer, Send, Users, MoreVertical,
    Shield, Globe, Trophy, Bell
} from "lucide-react";
import { bookingService } from "../../services/bookings/bookingService.js";
import { useBooking } from "../../hooks/useBookings.js";

const BookingDetailView = ({ booking: initialBooking, onBack, onRefresh }) => {
    const bookingId = initialBooking?.id;
    const { booking: fetchedBooking, isLoading: isFetchingDetails, error: fetchError } = useBooking(bookingId);

    const booking = fetchedBooking || initialBooking;
    const [isActionLoading, setIsActionLoading] = useState(false);

    if (!booking && isFetchingDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading booking details...</p>
                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">No booking data available</p>
                    {onBack && (
                        <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg">
                            Go Back
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'N/A';
        const date = new Date(dateTime);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateTime) => {
        if (!dateTime) return 'N/A';
        const date = new Date(dateTime);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateTime) => {
        if (!dateTime) return 'N/A';
        const date = new Date(dateTime);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                setIsActionLoading(true);
                await bookingService.cancelBooking(booking.id);
                if (onRefresh) onRefresh();
                if (onBack) onBack();
            } catch (err) {
                alert('Failed to cancel booking: ' + err.message);
            } finally {
                setIsActionLoading(false);
            }
        }
    };

    const totalAmount = parseFloat(booking.total_price || 0);
    const addonsTotal = booking.booking_addons?.reduce((sum, addon) => {
        return sum + (parseFloat(addon.addon_info?.price || 0) * addon.quantity);
    }, 0) || 0;
    const pitchTotal = totalAmount - addonsTotal;

    const getStatusColor = (status) => {
        const statusStr = String(status || 'pending').toLowerCase();
        const colors = {
            pending: 'bg-yellow-100 text-yellow-700',
            confirmed: 'bg-primary-100 text-primary-700',
            completed: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700'
        };
        return colors[statusStr] || colors.pending;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">
                        {booking.user_info?.name || 'Customer'}
                    </h1>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back to Bookings</span>
                    </button>

                    <div className="flex bg-primary-50 p-5 items-center justify-between">
                        <div>

                            <div className="flex items-center justify-between ">
                                <div>
                                    <div className="flex items-center gap-3 ">
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Booking ID: {booking.id ? `#${String(booking.id).padStart(7, '0')}` : 'N/A'}
                                        </h2>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                            {booking.status || 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>Date of creation: {formatDate(booking.created_at)}</span>
                                <span>Last update: {formatDate(booking.updated_at)}</span>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-white  transition-colors flex items-center gap-2 font-medium">
                            <Printer size={18} />
                            Print receipt
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Profile */}
                    <div className="space-y-6">
                        {/* Customer Profile Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-semibold text-gray-900">Profile</h3>
                                <button className="text-gray-400 hover:text-gray-600">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="flex flex-col items-center text-center mb-6">
                                {booking.user_info?.image ? (
                                    <div className="relative mb-4">
                                        <img
                                            src={booking.user_info.image}
                                            alt={booking.user_info.name}
                                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-primary-500 text-white p-1 rounded-full">
                                            <CheckCircle size={14} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mb-4">
                                        <Users size={32} className="text-primary-600" />
                                    </div>
                                )}

                                <h4 className="font-semibold text-gray-900 text-lg mb-1">
                                    {booking.user_info?.name || 'Unknown Customer'}
                                </h4>

                                {booking.split_payment && (
                                    <span className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 px-3 py-1 rounded-full font-medium">
                                        <Shield size={12} />
                                        Premium Member
                                    </span>
                                )}

                                {booking.venue_info?.rate && (
                                    <div className="flex items-center gap-1 mt-2 text-yellow-500">
                                        <span className="font-semibold">{booking.venue_info.rate.toLocaleString()}</span>
                                        <Trophy size={14} />
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Mail size={16} />
                                    <span className="truncate">{booking.user_info?.email || booking.venue_info?.owner_info?.email || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <Phone size={16} />
                                    <span>{booking.user_info?.phone || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <MapPin size={16} />
                                    <span>{booking.venue_info?.translations?.address || booking.venue_info?.city || 'Not provided'}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Customer type:</span>
                                    <span className="text-primary-600 font-medium">
                                        {booking.split_payment ? 'Split Payment' : 'Individual'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Booking type:</span>
                                    <span className="text-primary-600 font-medium">Online</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Payment method:</span>
                                    <span className="text-primary-600 font-medium">Card</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mt-6">
                                <button className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                                    Mail
                                </button>
                                <button className="px-4 py-2 text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
                                    WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Booking Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Booking Info Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">


                            {/* Date and Time */}
                            <div className="bg-primary-50 rounded-lg p-4 mb-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="text-primary-600" size={20} />
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Date</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {booking.start_time ? formatDate(booking.start_time) : 'Not set'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Clock className="text-primary-600" size={20} />
                                        <div>
                                            <p className="text-xs text-gray-600 mb-1">Time</p>
                                            <p className="text-sm font-semibold text-gray-900">
                                                {booking.start_time && booking.end_time
                                                    ? `From ${formatTime(booking.start_time)} To ${formatTime(booking.end_time)}`
                                                    : 'Not set'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Venue Image */}
                            <div className="mb-6">
                                <img
                                    src={booking.pitch?.image || booking.venue_info?.images?.[0]?.image || 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800'}
                                    alt="Venue"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                            </div>

                            {/* Venue Details */}
                            <div className="space-y-4 mb-6">
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                                        {booking.pitch?.translations?.name || booking.venue_info?.translations?.name || 'Venue Name'}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                        <MapPin size={16} />
                                        <span>{booking.venue_info?.translations?.address || booking.venue_info?.city || 'Location'}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">
                                            <Globe size={14} />
                                            {booking.play_kind?.translations?.name || 'Sport'}
                                        </span>
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-700">
                                            {booking.play_kind?.translations?.name || 'Football'}, {booking.venue_info?.venue_type === 'indoor' ? 'Indoor' : 'Outdoor'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Phone size={16} />
                                    <span>{booking.venue_info?.phone_number || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Mail size={16} />
                                    <span>{booking.venue_info?.owner_info?.email || 'Not provided'}</span>
                                </div>
                            </div>

                            {/* Players */}
                            {booking.users && booking.users.length > 0 && (
                                <div className="border-t border-gray-100 pt-6">
                                    <h4 className="font-semibold text-gray-900 mb-3">Players</h4>
                                    <div className="flex items-center gap-2">
                                        {booking.users.slice(0, 5).map((user, idx) => (
                                            <div key={idx} className="relative group">
                                                {user.image ? (
                                                    <img
                                                        src={user.image}
                                                        alt={user.name}
                                                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-semibold border-2 border-white shadow-sm">
                                                        {user.name?.charAt(0) || 'U'}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        {booking.users.length > 5 && (
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold border-2 border-white shadow-sm">
                                                +{booking.users.length - 5}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Customer Note */}
                            {booking.notes && (
                                <div className="border-t border-gray-100 pt-6 mt-6">
                                    <h4 className="font-semibold text-gray-900 mb-2">Customer Note / Request</h4>
                                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
                                        {booking.notes}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>

                            <div className="space-y-3 mb-4">
                                {/* Pitch Booking */}
                                <div className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {booking.pitch?.translations?.name || 'Pitch Booking'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {booking.venue_info?.translations?.name || 'Venue'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">{pitchTotal.toFixed(0)} AED</p>
                                    </div>
                                </div>

                                {/* Addons */}
                                {booking.booking_addons?.map((addon, idx) => (
                                    <div key={idx} className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {addon.addon_info?.addon?.translations?.name || 'Add-on'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Qty: {addon.quantity} × {addon.addon_info?.price} AED
                                            </p>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            {(parseFloat(addon.addon_info?.price || 0) * addon.quantity).toFixed(0)} AED
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-4 space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-medium text-gray-900">{totalAmount.toFixed(0)} AED</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">TAX:</span>
                                    <span className="font-medium text-gray-900">0 AED</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Discount:</span>
                                    <span className="font-medium text-red-600">-0 AED</span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-secondary-600 to-secondary-600/90 rounded-lg p-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-white font-medium">Total Amount:</span>
                                    <span className="text-white text-2xl font-bold">AED {totalAmount.toFixed(0)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <button
                                    onClick={handleCancel}
                                    disabled={isActionLoading}
                                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button className="px-4 py-2 border border-primary-500 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                                    <Send size={16} />
                                    Send invoice to owner
                                </button>
                                <button className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-600/90 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                                    <Bell size={16} />
                                    Send booking reminder
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailView;