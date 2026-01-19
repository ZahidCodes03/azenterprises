'use client';

import { useEffect, useState } from 'react';
import { Calendar, Users, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { bookingAPI } from '@/lib/api';
import { Booking, BookingStats } from '@/types';
import StatsCard from '@/components/admin/StatsCard';
import StatusBadge from '@/components/admin/StatusBadge';
import Card from '@/components/ui/Card';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<BookingStats | null>(null);
    const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, bookingsRes] = await Promise.all([
                bookingAPI.getStats(),
                bookingAPI.getAll(),
            ]);
            setStats(statsRes.data.stats);
            setRecentBookings(bookingsRes.data.bookings.slice(0, 5));
        } catch (error: any) {
            toast.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Overview of your solar installation business</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatsCard
                    title="Total Bookings"
                    value={stats?.totalBookings || 0}
                    icon={Calendar}
                    color="primary"
                />
                <StatsCard
                    title="Pending"
                    value={stats?.pendingBookings || 0}
                    icon={Clock}
                    color="orange"
                />
                <StatsCard
                    title="Installed"
                    value={stats?.installedBookings || 0}
                    icon={CheckCircle}
                    color="green"
                />
                <StatsCard
                    title="Revenue"
                    value={formatCurrency(stats?.estimatedRevenue || 0)}
                    icon={DollarSign}
                    color="purple"
                    trend="+12% this month"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Bookings */}
                <Card>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Bookings</h2>
                    <div className="space-y-4">
                        {recentBookings.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No bookings yet</p>
                        ) : (
                            recentBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{booking.user.name}</h3>
                                        <p className="text-sm text-gray-600">{booking.city}, {booking.state}</p>
                                        <p className="text-xs text-gray-500 mt-1">{formatDateTime(booking.createdAt)}</p>
                                    </div>
                                    <StatusBadge status={booking.bookingStatus} />
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Status Distribution */}
                <Card>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Status Distribution</h2>
                    <div className="space-y-4">
                        {[
                            { label: 'Pending', count: stats?.pendingBookings || 0, color: 'bg-yellow-500' },
                            { label: 'Approved', count: stats?.approvedBookings || 0, color: 'bg-blue-500' },
                            { label: 'Scheduled', count: stats?.scheduledBookings || 0, color: 'bg-purple-500' },
                            { label: 'Installed', count: stats?.installedBookings || 0, color: 'bg-green-500' },
                        ].map((item) => {
                            const total = stats?.totalBookings || 1;
                            const percentage = Math.round((item.count / total) * 100);
                            return (
                                <div key={item.label}>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                        <span className="text-sm text-gray-600">{item.count} ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`${item.color} h-2 rounded-full transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
}
