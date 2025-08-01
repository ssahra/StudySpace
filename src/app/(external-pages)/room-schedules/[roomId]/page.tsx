'use client';
import { Database } from '@/lib/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
    ArrowLeft,
    Calendar,
    ChevronLeft,
    ChevronRight,
    MapPin,
    Users
} from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

type Room = Database['public']['Tables']['rooms']['Row'];
type RoomSchedule = Database['public']['Tables']['room_schedules']['Row'];

const RoomSchedulePage = () => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    const roomId = params.roomId as string;
    const view = searchParams.get('view') || 'week';
    const dateParam = searchParams.get('date');
    const selectedDate = dateParam || new Date().toISOString().split('T')[0];

    const [room, setRoom] = useState<Room | null>(null);
    const [schedules, setSchedules] = useState<RoomSchedule[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentWeek, setCurrentWeek] = useState(new Date(selectedDate));

    useEffect(() => {
        const fetchRoomData = async () => {
            const supabase = createClientComponentClient<Database>();

            // Fetch room details
            const { data: roomData, error: roomError } = await supabase
                .from('rooms')
                .select('*')
                .eq('id', roomId)
                .single();

            if (roomError) {
                console.error('Error fetching room:', roomError);
                return;
            }

            setRoom(roomData);

            // Fetch schedules for the room
            const { data: schedulesData, error: schedulesError } = await supabase
                .from('room_schedules')
                .select('*')
                .eq('room_id', roomId)
                .order('time_from', { ascending: true });

            if (schedulesError) {
                console.error('Error fetching schedules:', schedulesError);
            } else {
                setSchedules(schedulesData || []);
            }

            setLoading(false);
        };

        if (roomId) {
            fetchRoomData();
        }
    }, [roomId]);

    const getCurrentStatus = () => {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const targetSchedules = schedules.filter(schedule => {
            return schedule.date === selectedDate;
        });

        for (const schedule of targetSchedules) {
            const [startHours, startMinutes] = schedule.time_from.split(':').map(Number);
            const [endHours, endMinutes] = schedule.time_to.split(':').map(Number);
            const startTime = startHours * 60 + startMinutes;
            const endTime = endHours * 60 + endMinutes;

            if (currentTime >= startTime && currentTime <= endTime) {
                return { status: 'Occupied', color: 'text-red-600', until: formatTime(schedule.time_to) };
            }
        }

        // Find next schedule
        const nextSchedule = targetSchedules.find(schedule => {
            const [startHours, startMinutes] = schedule.time_from.split(':').map(Number);
            const startTime = startHours * 60 + startMinutes;
            return startTime > currentTime;
        });

        if (nextSchedule) {
            return { status: 'Available', color: 'text-green-600', until: formatTime(nextSchedule.time_from) };
        }

        // Check if the selected date is today
        const isToday = selectedDate === new Date().toISOString().split('T')[0];

        if (isToday) {
            return { status: 'Available', color: 'text-green-600', until: 'All day' };
        } else {
            return { status: 'No schedules', color: 'text-gray-600', until: 'for this date' };
        }
    };

    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getWeekDays = (): Date[] => {
        const days: Date[] = [];
        const startOfWeek = new Date(currentWeek);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(day.getDate() + i);
            days.push(day);
        }
        return days;
    };

    const getTimeSlots = (): string[] => {
        const slots: string[] = [];
        for (let hour = 8; hour <= 18; hour++) {
            slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        return slots;
    };

    const getSchedulesForDay = (date: Date) => {
        const dateString = date.toISOString().split('T')[0];
        return schedules.filter(schedule => schedule.date === dateString);
    };

    const getEventColor = (eventType: string) => {
        const colors = {
            'lab': 'bg-green-500',
            'lecture': 'bg-blue-500',
            'meeting': 'bg-red-500',
            'seminar': 'bg-purple-500',
            'default': 'bg-gray-500'
        };
        return colors[eventType.toLowerCase() as keyof typeof colors] || colors.default;
    };

    const navigateWeek = (direction: 'prev' | 'next') => {
        const newWeek = new Date(currentWeek);
        newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7));
        setCurrentWeek(newWeek);
    };

    const goToToday = () => {
        setCurrentWeek(new Date());
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading room schedule...</p>
                </div>
            </div>
        );
    }

    if (!room) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Room not found</h2>
                    <p className="text-gray-600 mb-4">The room you're looking for doesn't exist.</p>
                    <button
                        onClick={() => router.back()}
                        className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mx-auto"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Go back</span>
                    </button>
                </div>
            </div>
        );
    }

    const currentStatus = getCurrentStatus();
    const weekDays = getWeekDays();
    const timeSlots = getTimeSlots();

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="w-full px-6 py-6">
                {/* Back Button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to all rooms</span>
                </button>

                {/* Room Information Header */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
                    <div className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>

                                </div>

                                <div className="flex items-center text-gray-600 mb-2">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span>{room.building}, Floor 1</span>
                                </div>

                                <div className="flex items-center text-gray-600 mb-3">
                                    <Users className="w-4 h-4 mr-1" />
                                    <span>Capacity: {room.capacity}</span>
                                </div>


                            </div>

                            {/* Current Status */}
                            <div className="text-right">
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <h3 className="text-sm font-medium text-gray-700 mb-1">Current Status</h3>
                                    <div className={`text-lg font-semibold ${currentStatus.color}`}>
                                        {currentStatus.status}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Until {currentStatus.until}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">

                        <button
                            onClick={() => router.push(`/room-schedules/${roomId}?view=week`)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${view === 'week'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Week
                        </button>
                    </div>
                </div>

                {/* Week Navigation */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigateWeek('prev')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-900">
                                Week of {weekDays[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                        </div>

                        <button
                            onClick={() => navigateWeek('next')}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={goToToday}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                        Today
                    </button>
                </div>

                {/* Schedule Grid */}
                <div className="bg-white rounded-sm border border-gray-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="w-20 p-4 text-left text-sm font-medium text-gray-700 bg-gray-50">Time</th>
                                    {weekDays.map((day, index) => (
                                        <th key={index} className="p-4 text-center text-sm font-medium text-gray-700 bg-gray-50 min-w-[120px]">
                                            <div>{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                            <div className="text-xs text-gray-500">{day.getDate()}</div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map((timeSlot, timeIndex) => (
                                    <tr key={timeIndex} className="border-b border-gray-100">
                                        <td className="p-4 text-sm text-gray-600 bg-gray-50 font-medium">
                                            {timeSlot}
                                        </td>
                                        {weekDays.map((day, dayIndex) => {
                                            const daySchedules = getSchedulesForDay(day);
                                            const relevantSchedules = daySchedules.filter(schedule => {
                                                const [startHour] = schedule.time_from.split(':').map(Number);
                                                const timeHour = parseInt(timeSlot.split(':')[0]);
                                                return startHour === timeHour;
                                            });

                                            return (
                                                <td key={dayIndex} className="p-2 relative min-h-[60px]">
                                                    {relevantSchedules.map((schedule, scheduleIndex) => {
                                                        const [startHours, startMinutes] = schedule.time_from.split(':').map(Number);
                                                        const [endHours, endMinutes] = schedule.time_to.split(':').map(Number);
                                                        const duration = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
                                                        const height = Math.max(duration / 60, 1) * 60; // 60px per hour

                                                        return (
                                                            <div
                                                                key={scheduleIndex}
                                                                className={`absolute left-1 right-1 rounded-lg p-2 text-white text-xs font-medium ${getEventColor('lecture')}`}
                                                                style={{
                                                                    top: `${(startMinutes / 60) * 60}px`,
                                                                    height: `${height}px`,
                                                                    zIndex: 10
                                                                }}
                                                            >
                                                                <div className="font-semibold">Physics Lab</div>
                                                                <div className="text-xs opacity-90">
                                                                    {formatTime(schedule.time_from)} - {formatTime(schedule.time_to)}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoomSchedulePage; 