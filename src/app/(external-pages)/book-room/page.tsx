'use client';
import { Database } from '@/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
    Calendar,
    CheckCircle,
    ChevronDown,
    Clock,
    Filter,
    MapPin,
    Search,
    Users
} from 'lucide-react';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

type Room = Database['public']['Tables']['rooms']['Row'];
type RoomSchedule = Database['public']['Tables']['room_schedules']['Row'];

const BookRoomPage = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [schedules, setSchedules] = useState<RoomSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedTime, setSelectedTime] = useState('09:00');
    const [selectedDuration, setSelectedDuration] = useState('60');
    const [showFilters, setShowFilters] = useState(false);

    const buildings = ['all', 'Science Building', 'Arts Building', 'Main Building', 'Copland', 'Cavendish'];
    const timeSlots = [
        '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
    ];
    const durations = ['30', '60', '90', '120', '180'];

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClientComponentClient<Database>();

            // Fetch rooms
            const { data: roomsData, error: roomsError } = await supabase
                .from('rooms')
                .select('*');

            if (roomsError) {
                console.error('Error fetching rooms:', roomsError);
            } else {
                setRooms(roomsData || []);
            }

            // Fetch schedules
            const { data: schedulesData, error: schedulesError } = await supabase
                .from('room_schedules')
                .select('*')
                .order('time_from', { ascending: true });

            if (schedulesError) {
                console.error('Error fetching schedules:', schedulesError);
            } else {
                setSchedules(schedulesData || []);
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (room.building || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBuilding = selectedBuilding === 'all' || room.building === selectedBuilding;
        return matchesSearch && matchesBuilding;
    });

    const isRoomAvailable = (roomId: string, date: string, startTime: string, duration: number) => {
        const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
        const endMinutes = startMinutes + duration;

        const conflictingSchedules = schedules.filter(schedule => {
            const scheduleStartMinutes = parseInt(schedule.time_from.split(':')[0]) * 60 + parseInt(schedule.time_from.split(':')[1]);
            const scheduleEndMinutes = parseInt(schedule.time_to.split(':')[0]) * 60 + parseInt(schedule.time_to.split(':')[1]);

            return schedule.room_id === roomId &&
                schedule.date === date &&
                scheduleStartMinutes < endMinutes &&
                scheduleEndMinutes > startMinutes;
        });

        return conflictingSchedules.length === 0;
    };

    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getEndTime = (startTime: string, duration: number) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + duration;
        const endHours = Math.floor(totalMinutes / 60);
        const endMinutes = totalMinutes % 60;
        return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading available rooms...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full px-6 py-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Room</h1>
                    <p className="text-gray-600">Find and book available rooms for your study sessions</p>
                </div>

                {/* Booking Form */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
                    <div className="p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                                <select
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    {timeSlots.map(time => (
                                        <option key={time} value={time}>
                                            {formatTime(time)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                                <select
                                    value={selectedDuration}
                                    onChange={(e) => setSelectedDuration(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    {durations.map(duration => (
                                        <option key={duration} value={duration}>
                                            {duration} minutes
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center space-x-2 text-blue-700 mb-3">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    Booking: {formatTime(selectedTime)} - {getEndTime(selectedTime, parseInt(selectedDuration))}
                                    ({selectedDuration} minutes)
                                </span>
                            </div>
                            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                                Confirm Booking
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="mb-6 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search rooms or buildings..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <Filter className="w-5 h-5 text-gray-600" />
                            <span className="text-gray-700">Filters</span>
                            <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Building</label>
                                    <select
                                        value={selectedBuilding}
                                        onChange={(e) => setSelectedBuilding(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        {buildings.map(building => (
                                            <option key={building} value={building}>
                                                {building === 'all' ? 'All Buildings' : building}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Summary */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        Available Rooms
                    </h2>
                </div>

                {/* Available Rooms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRooms
                        .filter(room => isRoomAvailable(room.id, selectedDate, selectedTime, parseInt(selectedDuration)))
                        .map((room) => (
                            <div key={room.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    {/* Room Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {room.name}
                                            </h3>
                                            <div className="flex items-center text-sm text-gray-600 mb-2">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {room.building}, Type: {room.type}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Users className="w-4 h-4 mr-1" />
                                                Capacity: {room.capacity}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1 text-green-600">
                                            <CheckCircle className="w-5 h-5" />
                                            <span className="text-sm font-medium">Available</span>
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                        <div className="flex items-center space-x-2 text-sm text-gray-700">
                                            <Clock className="w-4 h-4" />
                                            <span>
                                                {formatTime(selectedTime)} - {getEndTime(selectedTime, parseInt(selectedDuration))}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Book Button */}
                                    <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                                        Book This Room
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>

                {/* Empty State */}
                {filteredRooms.filter(room => isRoomAvailable(room.id, selectedDate, selectedTime, parseInt(selectedDuration))).length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms available</h3>
                        <p className="text-gray-600 mb-4">
                            No rooms are available for the selected time and date. Try adjusting your booking details.
                        </p>
                        <button
                            onClick={() => {
                                setSelectedDate(new Date().toISOString().split('T')[0]);
                                setSelectedTime('09:00');
                                setSelectedDuration('60');
                            }}
                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Reset filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookRoomPage; 