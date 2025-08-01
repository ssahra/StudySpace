'use client';
import { Database } from '@/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Calendar, ChevronDown, Clock, Filter, MapPin, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

type Room = Database['public']['Tables']['rooms']['Row'];
type RoomSchedule = Database['public']['Tables']['room_schedules']['Row'];

const RoomSchedulesPage = () => {
    const router = useRouter();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [schedules, setSchedules] = useState<RoomSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBuilding, setSelectedBuilding] = useState('all');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showFilters, setShowFilters] = useState(false);

    const buildings = ['all', 'Science Building', 'Arts Building', 'Main Building', 'Copland', 'Cavendish'];

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

    const getRoomSchedules = (roomId: string, date?: string) => {
        const targetDate = date || new Date().toISOString().split('T')[0];
        return schedules.filter(schedule =>
            schedule.room_id === roomId &&
            schedule.date === targetDate
        );
    };

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (room.building || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBuilding = selectedBuilding === 'all' || room.building === selectedBuilding;
        const matchesDate = selectedDate === new Date().toISOString().split('T')[0] ||
            getRoomSchedules(room.id, selectedDate).length > 0;
        return matchesSearch && matchesBuilding && matchesDate;
    });

    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getScheduleStatus = (schedule: RoomSchedule) => {
        const now = new Date();
        const [hours, minutes] = schedule.time_from.split(':').map(Number);
        const scheduleStart = new Date();
        scheduleStart.setHours(hours, minutes, 0, 0);

        const [endHours, endMinutes] = schedule.time_to.split(':').map(Number);
        const scheduleEnd = new Date();
        scheduleEnd.setHours(endHours, endMinutes, 0, 0);

        if (now < scheduleStart) {
            return { status: 'upcoming', color: 'text-blue-600 bg-blue-50' };
        } else if (now >= scheduleStart && now <= scheduleEnd) {
            return { status: 'ongoing', color: 'text-red-600 bg-red-50' };
        } else {
            return { status: 'completed', color: 'text-gray-600 bg-gray-50' };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading schedules...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full px-6 py-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Room Schedules</h1>
                    <p className="text-gray-600">View schedules for all rooms</p>
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

                                <div className="flex-1">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Results Summary */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        {filteredRooms.length} rooms found
                    </h2>
                </div>

                {/* Room Schedules */}
                <div className="space-y-6">
                    {filteredRooms.map((room) => {
                        const roomSchedules = getRoomSchedules(room.id, selectedDate);

                        return (
                            <div key={room.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                                <div className="p-6">
                                    {/* Room Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                                {room.name}
                                            </h3>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {room.building} • {room.type} • Capacity: {room.capacity}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Schedules */}
                                    <div className="space-y-3">
                                        {roomSchedules.length > 0 ? (
                                            roomSchedules.map((schedule, index) => {
                                                const status = getScheduleStatus(schedule);
                                                return (
                                                    <div key={index} className={`p-3 rounded-lg border ${status.color}`}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-3">
                                                                <Clock className="w-4 h-4" />
                                                                <span className="font-medium">
                                                                    {formatTime(schedule.time_from)} - {formatTime(schedule.time_to)}
                                                                </span>
                                                            </div>
                                                            <span className="text-sm font-medium capitalize">
                                                                {status.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">
                                                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                <p>No schedules found for this room on {selectedDate}</p>
                                            </div>
                                        )}

                                        {/* Navigation Button */}
                                        <button
                                            onClick={() => router.push(`/room-schedules/${room.id}`)}
                                            className="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                        >
                                            View Detailed Schedule
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {filteredRooms.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No rooms found</h3>
                        <p className="text-gray-600 mb-4">
                            Try adjusting your search or filters to find room schedules.
                        </p>
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedBuilding('all');
                            }}
                            className="text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoomSchedulesPage; 