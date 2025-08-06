'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Database } from '@/lib/database.types';
import { createClient } from '@/supabase-clients/client';
import {
    AlertCircle,
    Ban,
    Building,
    Calendar,
    Check,
    CheckCircle,
    Clock,
    Clock as ClockIcon,
    Search,
    User,
    Users,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

type Booking = Database['public']['Tables']['bookings']['Row'];
type Room = Database['public']['Tables']['rooms']['Row'];
type User = Database['public']['Tables']['users']['Row'];

interface BookingWithRoom extends Booking {
    room: Room;
}

const AdminManageBookingsPage = () => {
    const [bookings, setBookings] = useState<BookingWithRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const [userFilter, setUserFilter] = useState('all');
    const [showActionDialog, setShowActionDialog] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<BookingWithRoom | null>(null);
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'cancel' | null>(null);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const statusOptions = [
        { value: 'all', label: 'All Statuses' },
        { value: 'pending', label: 'Pending' },
        { value: 'accepted', label: 'Accepted' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    useEffect(() => {
        fetchAllBookings();
    }, []);

    const fetchAllBookings = async () => {
        try {
            const supabase = createClient();

            // Fetch all bookings with room details
            const { data: bookingsData, error: bookingsError } = await supabase
                .from('bookings')
                .select(`
                    *,
                    room:rooms(*)
                `)
                .order('booking_date', { ascending: false })
                .order('time_from', { ascending: false });

            if (bookingsError) {
                console.error('Error fetching bookings:', bookingsError);
                setError('Failed to load bookings');
            } else {
                setBookings(bookingsData || []);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.room?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.room?.building?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.notes?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;

        const matchesDate = !dateFilter || booking.booking_date === dateFilter;

        return matchesSearch && matchesStatus && matchesDate;
    });

    const handleAction = (booking: BookingWithRoom, action: 'approve' | 'reject' | 'cancel') => {
        setSelectedBooking(booking);
        setActionType(action);
        setShowActionDialog(true);
    };

    const confirmAction = async () => {
        if (!selectedBooking || !actionType) return;

        setProcessing(true);
        try {
            const supabase = createClient();

            const { error } = await supabase
                .from('bookings')
                .update({ status: actionType === 'approve' ? 'accepted' : actionType === 'reject' ? 'rejected' : 'cancelled' })
                .eq('id', selectedBooking.id);

            if (error) {
                console.error('Error updating booking:', error);
                setError(`Failed to ${actionType} booking`);
            } else {
                // Update local state
                setBookings(prev =>
                    prev.map(booking =>
                        booking.id === selectedBooking.id
                            ? {
                                ...booking,
                                status: actionType === 'approve' ? 'accepted' : actionType === 'reject' ? 'rejected' : 'cancelled'
                            }
                            : booking
                    )
                );
                setShowActionDialog(false);
                setSelectedBooking(null);
                setActionType(null);
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An unexpected error occurred');
        } finally {
            setProcessing(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
            accepted: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            rejected: { color: 'bg-red-100 text-red-800', icon: X },
            cancelled: { color: 'bg-gray-100 text-gray-800', icon: X }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        const Icon = config.icon;

        return (
            <Badge className={`${config.color} flex items-center gap-1`}>
                <Icon className="w-3 h-3" />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
        );
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getActionButtons = (booking: BookingWithRoom) => {
        if (booking.status === 'pending') {
            return (
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        onClick={() => handleAction(booking, 'approve')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                    >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(booking, 'reject')}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                        <Ban className="w-4 h-4 mr-1" />
                        Reject
                    </Button>
                </div>
            );
        }
        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading all bookings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Admin: Manage All Bookings
                    </h1>
                    <p className="text-gray-600">
                        Review, approve, and manage all room booking requests
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex items-center">
                            <Clock className="h-8 w-8 text-yellow-500" />
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {bookings.filter(b => b.status === 'pending').length}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search rooms, users, or notes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <div>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Date Filter */}
                        <div>
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>


                    </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {filteredBookings.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No bookings found
                            </h3>
                            <p className="text-gray-600">
                                {bookings.length === 0
                                    ? "No bookings have been made yet."
                                    : "No bookings match your current filters."
                                }
                            </p>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    {/* Booking Info */}
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {booking.room?.name}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                    <div className="flex items-center gap-1">
                                                        <Building className="h-4 w-4" />
                                                        {booking.room?.building}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users className="h-4 w-4" />
                                                        Capacity: {booking.room?.capacity}
                                                    </div>

                                                </div>
                                            </div>
                                            {getStatusBadge(booking.status)}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-900">
                                                    {formatDate(booking.booking_date)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-gray-400" />
                                                <span className="text-gray-900">
                                                    {formatTime(booking.time_from)} - {formatTime(booking.time_to)}
                                                </span>
                                            </div>
                                        </div>

                                        {booking.notes && (
                                            <div className="mt-3 p-3 bg-gray-50 rounded-md">
                                                <p className="text-sm text-gray-700">
                                                    <span className="font-medium">Notes:</span> {booking.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 lg:flex-row">
                                        {getActionButtons(booking)}
                                        <Button
                                            variant="outline"
                                            onClick={() => window.location.href = `/room-schedules/${booking.room_id}`}
                                        >
                                            View Schedule
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Action Confirmation Dialog */}
            <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === 'approve' ? 'Approve' : actionType === 'reject' ? 'Reject' : 'Cancel'} Booking
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to {actionType} the booking for{' '}
                            <span className="font-semibold">
                                {selectedBooking?.room?.name}
                            </span>{' '}
                            on {selectedBooking && formatDate(selectedBooking.booking_date)}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowActionDialog(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmAction}
                            disabled={processing}
                            className={
                                actionType === 'approve'
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : actionType === 'reject'
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-gray-600 hover:bg-gray-700'
                            }
                        >
                            {processing ? 'Processing...' : actionType === 'approve' ? 'Approve' : actionType === 'reject' ? 'Reject' : 'Cancel'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminManageBookingsPage; 