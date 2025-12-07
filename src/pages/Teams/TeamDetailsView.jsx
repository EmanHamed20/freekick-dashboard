// pages/Teams/TeamDetailView.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useTeam, useJoinedTeam, useTeamBookings, useTeamTournaments } from "../../hooks/useTeams.js";
import { useContact } from "../../hooks/useContact.js";
import { showConfirm } from "../../components/showConfirm.jsx";
import { teamService } from "../../services/Teams/TeamService.js";
import { toast } from "react-toastify";
import ArrowIcon from "../../components/common/ArrowIcon.jsx";
import { ReusableDatePicker } from "../../components/common/ReusableDatePicker.jsx";
import {
    Calendar,
    Mail,
    MapPin,
    Phone,
    Trophy,
    Users,
    Shield,
    Clock,
    Award,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Activity,
    Star,
    Lock,
    Globe,
    Edit2,
    Save,
    X
} from "lucide-react";
import MainTable from "../../components/MainTable.jsx";

// ============================================================================
// PAGINATION COMPONENT
// ============================================================================
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getPageNumbers = () => {
        const pages = [];
        const showEllipsis = totalPages > 7;

        if (!showEllipsis) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
            return pages;
        }

        if (currentPage <= 4) {
            for (let i = 1; i <= 5; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        } else if (currentPage >= totalPages - 3) {
            pages.push(1);
            pages.push('...');
            for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push('...');
            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
            pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-5 h-5 text-primary-600" />
            </button>

            {getPageNumbers().map((page, idx) => (
                page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            currentPage === page
                                ? 'bg-primary-500 text-white'
                                : 'hover:bg-primary-50 text-gray-700'
                        }`}
                    >
                        {page}
                    </button>
                )
            ))}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight className="w-5 h-5 text-primary-600" />
            </button>
        </div>
    );
};

// ============================================================================
// EDIT MODAL COMPONENT
// ============================================================================
const EditModal = ({ isOpen, onClose, onSave, team }) => {
    const [isActive, setIsActive] = useState(team.is_active);
    const [points, setPoints] = useState(team.num_of_points);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsActive(team.is_active);
        setPoints(team.num_of_points);
    }, [team]);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await onSave({ is_active: isActive, num_of_points: points });
            onClose();
        } catch (error) {
            console.error('Failed to update team', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900">Edit Team Status</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Team Status
                        </label>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsActive(true)}
                                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                                    isActive
                                        ? 'bg-primary-500 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <CheckCircle className="w-5 h-5 inline-block mr-2" />
                                Active
                            </button>
                            <button
                                onClick={() => setIsActive(false)}
                                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                                    !isActive
                                        ? 'bg-gray-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <XCircle className="w-5 h-5 inline-block mr-2" />
                                Inactive
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Team Points
                        </label>
                        <input
                            type="number"
                            value={points}
                            onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Enter points"
                        />
                    </div>
                </div>

                <div className="p-6 bg-gray-50 flex gap-3 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// TEAM DETAIL VIEW
// ============================================================================
const TeamDetailView = ({ team: initialTeam, onBack, onRefresh }) => {
    const teamId = initialTeam?.id;
    const { team: fetchedTeam, isLoading: isFetchingDetails } = useTeam(teamId);
    const { joinedTeam, isLoading: isLoadingJoined } = useJoinedTeam(teamId);
    const { handleEmailClick, handleWhatsAppClick } = useContact();

    // State for edit modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Team bookings hook
    const [bookingFilters, setBookingFilters] = useState({
        start_time__date: new Date().toISOString().split('T')[0],
        status: 'all'
    });

    // Team tournaments hook
    const { bookings: teamBookings, isLoading: bookingsLoading } = useTeamBookings(teamId, bookingFilters);
    const { tournaments: teamTournaments, isLoading: tournamentsLoading } = useTeamTournaments(teamId);

    const team = fetchedTeam || initialTeam;

    // Booking filters
    const [bookingDate, setBookingDate] = useState(new Date());
    const [bookingStatus, setBookingStatus] = useState('all');

    // Tournament pagination
    const [currentTournamentPage, setCurrentTournamentPage] = useState(1);
    const tournamentsPerPage = 10;

    // Update booking filters when date or status changes
    useEffect(() => {
        const formattedDate = bookingDate.toISOString().split('T')[0];
        setBookingFilters({
            start_time__date: formattedDate,
            status: bookingStatus === 'all' ? undefined : bookingStatus
        });
    }, [bookingDate, bookingStatus]);
    const [tournamentSearch, setTournamentSearch] = useState('');
    const [tournamentFilters, setTournamentFilters] = useState({});
    const [tournamentSort, setTournamentSort] = useState({ key: 'start_date', direction: 'desc' });

    // Tournament columns configuration for MainTable
    const tournamentColumns = [
        {
            header: 'Tournament',
            accessor: 'name',
            sortable: true,
            sortKey: 'name',
            render: (tournament) => (
                <div>
                    <p className="text-sm font-semibold text-gray-900">{tournament.name}</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                        {tournament.subtitle || tournament.description || 'No description'}
                    </p>
                </div>
            )
        },
        {
            header: 'Status',
            accessor: 'status',
            sortable: true,
            sortKey: 'status',
            render: (tournament) => getTournamentStatusBadge(tournament.status)
        },
        {
            header: 'Date',
            accessor: 'start_date',
            sortable: true,
            sortKey: 'start_date',
            align: 'center',
            render: (tournament) => (
                <span className="text-sm text-gray-600">
                    {formatDate(tournament.start_date)}
                </span>
            )
        },
        {
            header: 'Format',
            accessor: 'format',
            sortable: true,
            sortKey: 'scoring_system',
            align: 'center',
            render: (tournament) => (
                <span className="text-sm text-gray-600 capitalize">
                    {tournament.scoring_system || tournament.format || 'N/A'}
                </span>
            )
        },
        {
            header: 'Result',
            accessor: 'result',
            sortable: true,
            sortKey: 'result',
            align: 'center',
            render: (tournament) => (
                <span className="text-sm font-medium text-gray-900">
                    {tournament.result || 'N/A'}
                </span>
            )
        },
        {
            header: 'Entry Fee',
            accessor: 'entry_fee',
            sortable: true,
            sortKey: 'entry_fee',
            align: 'right',
            render: (tournament) => (
                <span className="text-sm font-semibold text-primary-600">
                    {formatAmount(tournament.entry_fee || 0)}
                </span>
            )
        }
    ];


    // Filter and sort tournaments (client-side filtering for example)
    const filteredTournaments = useMemo(() => {
        let tournaments = teamTournaments?.results || [];

        // Apply search filter
        if (tournamentSearch) {
            tournaments = tournaments.filter(t =>
                t.name.toLowerCase().includes(tournamentSearch.toLowerCase()) ||
                (t.subtitle && t.subtitle.toLowerCase().includes(tournamentSearch.toLowerCase())) ||
                (t.description && t.description.toLowerCase().includes(tournamentSearch.toLowerCase()))
            );
        }

        // Apply status filter
        if (tournamentFilters.status) {
            tournaments = tournaments.filter(t =>
                t.status === tournamentFilters.status
            );
        }

        // Apply format filter
        if (tournamentFilters.scoring_system) {
            tournaments = tournaments.filter(t =>
                t.scoring_system === tournamentFilters.scoring_system
            );
        }

        // Apply sorting
        if (tournamentSort.key) {
            tournaments.sort((a, b) => {
                const aValue = a[tournamentSort.key];
                const bValue = b[tournamentSort.key];

                if (tournamentSort.key === 'start_date') {
                    const aDate = new Date(aValue || 0);
                    const bDate = new Date(bValue || 0);
                    return tournamentSort.direction === 'asc'
                        ? aDate - bDate
                        : bDate - aDate;
                }

                if (tournamentSort.key === 'entry_fee') {
                    const aNum = parseFloat(aValue) || 0;
                    const bNum = parseFloat(bValue) || 0;
                    return tournamentSort.direction === 'asc'
                        ? aNum - bNum
                        : bNum - aNum;
                }

                // String comparison for other fields
                const comparison = String(aValue || '').localeCompare(String(bValue || ''));
                return tournamentSort.direction === 'asc' ? comparison : -comparison;
            });
        }

        return tournaments;
    }, [teamTournaments, tournamentSearch, tournamentFilters, tournamentSort]);

    // Calculate paginated tournaments
    const paginatedTournaments = useMemo(() => {
        const startIndex = (currentTournamentPage - 1) * tournamentsPerPage;
        const endIndex = startIndex + tournamentsPerPage;
        return filteredTournaments.slice(startIndex, endIndex);
    }, [filteredTournaments, currentTournamentPage]);

    const totalTournamentPages = Math.ceil(filteredTournaments.length / tournamentsPerPage);

    // Handler functions
    const handleTournamentSearch = (searchTerm) => {
        setTournamentSearch(searchTerm);
        setCurrentTournamentPage(1); // Reset to first page on search
    };

    const handleTournamentFilterChange = (filters) => {
        setTournamentFilters(filters);
        setCurrentTournamentPage(1); // Reset to first page on filter
    };

    const handleTournamentSort = (sortKey, direction) => {
        setTournamentSort({ key: sortKey, direction });
    };

    const handleTournamentPageChange = (page) => {
        setCurrentTournamentPage(page);
    };

    if (!team && isFetchingDetails) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading team details...</p>
                </div>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">No team data available</p>
                    {onBack && (
                        <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg">
                            Go Back
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Filtered bookings - handled by API
    const filteredBookings = useMemo(() => {
        return teamBookings?.results || [];
    }, [teamBookings]);

    // Paginated tournaments



    const formatDate = (dateTime) => {
        if (!dateTime) return 'N/A';
        const date = new Date(dateTime);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateTime) => {
        if (!dateTime) return 'N/A';
        return new Date(dateTime).toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount) => {
        const num = parseFloat(amount);
        if (isNaN(num)) return 'AED 0';
        return `AED ${Math.abs(num).toLocaleString()}`;
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            confirmed: { color: 'bg-primary-100 text-primary-700', label: 'Confirmed' },
            pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
            cancelled: { color: 'bg-red-100 text-red-700', label: 'Cancelled' }
        };
        const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
                {config.label}
            </span>
        );
    };

    const getTournamentStatusBadge = (status) => {
        const statusColors = {
            won: 'bg-primary-100 text-primary-700',
            completed: 'bg-gray-100 text-gray-700',
            ongoing: 'bg-primary-300 text-white',
            upcoming: 'bg-secondary-600 text-white',
            qualify: 'bg-yellow-100 text-yellow-700',
            lost: 'bg-red-100 text-red-700',
            active: 'bg-primary-100 text-primary-700',
            inactive: 'bg-gray-100 text-gray-700'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
                {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </span>
        );
    };

    const handleCreatorEmail = () => {
        const email = team.team_leader?.email;
        const creatorName = team.team_leader?.name || 'Team Leader';
        const subject = `Team ${team.name} - ID: ${String(team.id).padStart(5, '0')}`;
        const body = `Dear ${creatorName},\n\nRegarding your team "${team.name}".\n\n`;
        handleEmailClick(email, subject, body);
    };

    const handleCreatorWhatsApp = () => {
        const phone = team.team_leader?.phone;
        const creatorName = team.team_leader?.name || 'Team Leader';
        const message = `Hello ${creatorName}! Regarding your team "${team.name}".`;
        handleWhatsAppClick(phone, message);
    };

    const handleUpdateTeam = async (updates) => {
        try {
            await teamService.updateTeam(team.id, updates);
            toast.success('Team updated successfully');
            if (onRefresh) onRefresh();
        } catch (error) {
            toast.error('Failed to update team: ' + error.message);
            throw error;
        }
    };

    return (
        <div className="min-h-screen xl:px-5  bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className=" mx-auto  py-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                        <ArrowIcon size={'lg'}/>
                        Back to Teams
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className=" mx-auto py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Left Sidebar - Team Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-6">
                            {/* Team Logo & Name */}
                            <div className="text-center mb-6">
                                {team.logo ? (
                                    <img src={team.logo} alt={team.name} className="w-20 h-20 rounded-full mx-auto mb-4 border-4 border-primary-100 object-cover" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center mx-auto mb-4">
                                        <Shield className="w-10 h-10 text-white" />
                                    </div>
                                )}
                                <h2 className="text-xl font-bold text-gray-900 mb-2">{team.name}</h2>
                                <p className="text-sm text-gray-500 mb-3">ID: TM{String(team.id).padStart(5, '0')}</p>

                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                        team.is_active ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                        {team.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                                        team.private ? 'bg-secondary-600 text-white' : 'bg-primary-100 text-primary-700'
                                    }`}>
                                        {team.private ? <Lock className="w-3 h-3" /> : <Globe className="w-3 h-3" />}
                                        {team.private ? 'Private' : 'Public'}
                                    </span>
                                </div>

                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Team
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Members</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{team.number_of_members || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Matches</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{team.num_of_matches || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Tournaments</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">{team.num_of_tournaments || 0}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm text-gray-600">Points</span>
                                    </div>
                                    <span className="text-sm font-semibold text-primary-600">{team.num_of_points || 0}</span>
                                </div>
                            </div>

                            {/* Team Leader */}
                            {team.team_leader && (
                                <div className="mb-6">
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Team Leader</h4>
                                    <div className="flex items-center gap-3 mb-3">
                                        {team.team_leader.image ? (
                                            <img src={team.team_leader.image} alt={team.team_leader.name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                                                {team.team_leader.name?.charAt(0)?.toUpperCase()}
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">{team.team_leader.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{team.team_leader.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {team.team_leader?.email && (
                                            <button
                                                onClick={handleCreatorEmail}
                                                className="w-full px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </button>
                                        )}
                                        {team.team_leader?.phone && (
                                            <button
                                                onClick={handleCreatorWhatsApp}
                                                className="w-full px-3 py-2 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                            >
                                                <Phone className="w-4 h-4" />
                                                WhatsApp
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Created Date */}
                            <div className="text-xs text-gray-500">
                                <Calendar className="w-3 h-3 inline-block mr-1" />
                                Created {formatDate(team.created_at)}
                            </div>
                        </div>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:col-span-2 xl:col-span-3 space-y-6">
                        {/* Bookings Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="p-3 px-5 w-full  flex flex-wrap justify-between items-center border-b border-gray-200">
                                <h3 className="text-lg w-48 font-bold text-gray-900 mb-4"> Bookings</h3>
                                <div className="order-3 w-full xl:w-fit  flex justify-center xl:order-2">
                                    <ReusableDatePicker
                                        selectedDate={bookingDate}
                                        onDateChange={setBookingDate}
                                        disabled={bookingsLoading}
                                    /></div>
                                <div className={'order-2 xl:order-3'}>
                                    <select
                                        value={bookingStatus}
                                        onChange={(e) => setBookingStatus(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="pending">Pending</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-6">
                                {bookingsLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
                                    </div>
                                ) : filteredBookings.length > 0 ? (
                                    <div className="space-y-3">
                                        {filteredBookings.map((booking) => (
                                            <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4 className="font-semibold text-gray-900">Booking #{booking.id}</h4>
                                                            {getStatusBadge(booking.status)}
                                                        </div>
                                                        <p className="text-sm text-gray-500">Match #{booking.match || 'N/A'}</p>
                                                    </div>
                                                    <p className="text-lg font-bold text-primary-600">{formatAmount(booking.total_price || 0)}</p>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <MapPin className="w-4 h-4" />
                                                        {booking.pitch?.translations?.name || 'N/A'}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Clock className="w-4 h-4" />
                                                        {formatDateTime(booking.start_time)}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Users className="w-4 h-4" />
                                                        {booking.max_players || 0} Players
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Award className="w-4 h-4" />
                                                        {booking.play_kind?.translations?.name || 'N/A'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No bookings found for {formatDate(bookingDate)}</p>
                                        <p className="text-sm text-gray-400 mt-1">Try selecting a different date or status</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tournaments Table */}
                        <div className="bg-white px-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="pt-5 lg:px-6 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900">Tournaments </h3>
                                <p className="text-sm text-gray-500 mt-1">Total : {filteredTournaments.length} tournaments</p>
                            </div>

                            {tournamentsLoading ? (
                                <div className="flex justify-center ">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
                                </div>
                            ) : filteredTournaments.length > 0 ? (
                                <MainTable
                                    columns={tournamentColumns}
                                    data={paginatedTournaments}
                                    currentPage={currentTournamentPage}
                                    itemsPerPage={tournamentsPerPage}
                                    totalItems={filteredTournaments.length}
                                    onPageChange={handleTournamentPageChange}
                                    showSearch ={false}
                                onSort={handleTournamentSort}
                                />
                            ) : (
                                <div className="text-center py-12">
                                    <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500">No tournaments found</p>
                                    <p className="text-sm text-gray-400 mt-1">This team hasn't participated in any tournaments yet</p>
                                </div>
                            )}
                        </div>
                        {/* Members Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                            <div className="p-6 flex justify-between items-center border-b border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900">Team Members</h3>
                                <p className="text-sm text-gray-500 mt-1">Total : {team.members?.length || 0} players</p>
                            </div>
                            <div className="p-6">
                                {team.members && team.members.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {team.members.map((member, idx) => (
                                            <div key={idx} className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 border border-gray-100">
                                                {member.user_info?.image ? (
                                                    <img
                                                        src={member.user_info.image}
                                                        alt={member.user_info.name}
                                                        className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md mb-3"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-xl border-3 border-white shadow-md mb-3">
                                                        {(member.user_info?.name || member.name)?.charAt(0)?.toUpperCase() || 'P'}
                                                    </div>
                                                )}
                                                <p className="text-sm font-bold text-gray-900 truncate w-full">
                                                    {member.user_info?.name || member.name}
                                                </p>
                                                <div className="mt-2">
                                                    {member.is_admin ? (
                                                        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700">Admin</span>
                                                    ) : (
                                                        <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">Player</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No team members yet</p>
                                        <p className="text-sm text-gray-400 mt-1">Team leader can invite players to join</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            <EditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleUpdateTeam}
                team={team}
            />
        </div>
    );
};

export default TeamDetailView;