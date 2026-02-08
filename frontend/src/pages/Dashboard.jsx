import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiUsers, FiFileText, FiTrendingUp, FiClock, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { getBookings, getInvoices } from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalBookings: 0,
        pendingBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        totalInvoices: 0,
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsRes, invoicesRes] = await Promise.all([
                    getBookings(),
                    getInvoices(),
                ]);

                const bookings = bookingsRes.data;
                const invoices = invoicesRes.data;

                setStats({
                    totalBookings: bookings.length,
                    pendingBookings: bookings.filter(b => b.status === 'pending').length,
                    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
                    completedBookings: bookings.filter(b => b.status === 'completed').length,
                    totalInvoices: invoices.length,
                });

                setRecentBookings(bookings.slice(0, 5));
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        {
            title: 'Total Bookings',
            value: stats.totalBookings,
            icon: FiCalendar,
            color: 'bg-blue-500',
            bgLight: 'bg-blue-50',
        },
        {
            title: 'Pending',
            value: stats.pendingBookings,
            icon: FiClock,
            color: 'bg-yellow-500',
            bgLight: 'bg-yellow-50',
        },
        {
            title: 'Confirmed',
            value: stats.confirmedBookings,
            icon: FiCheckCircle,
            color: 'bg-green-500',
            bgLight: 'bg-green-50',
        },
        {
            title: 'Completed',
            value: stats.completedBookings,
            icon: FiTrendingUp,
            color: 'bg-primary-600',
            bgLight: 'bg-primary-50',
        },
    ];

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-gray-100 text-gray-800',
        };
        return styles[status] || styles.pending;
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-48"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's your business overview.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                                <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                            </div>
                            <div className={`w-14 h-14 rounded-xl ${card.bgLight} flex items-center justify-center`}>
                                <card.icon className={`w-7 h-7 ${card.color.replace('bg-', 'text-')}`} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions & Recent Bookings */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            to="/admin/bookings"
                            className="flex items-center p-4 rounded-xl bg-primary-50 text-primary-700 hover:bg-primary-100 transition-all"
                        >
                            <FiCalendar className="w-5 h-5 mr-3" />
                            <span className="font-medium">View All Bookings</span>
                        </Link>
                        <Link
                            to="/admin/invoices"
                            className="flex items-center p-4 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all"
                        >
                            <FiFileText className="w-5 h-5 mr-3" />
                            <span className="font-medium">Create Invoice</span>
                        </Link>
                        <Link
                            to="/admin/customers"
                            className="flex items-center p-4 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all"
                        >
                            <FiUsers className="w-5 h-5 mr-3" />
                            <span className="font-medium">View Customers</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Bookings */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                        <Link to="/admin/bookings" className="text-sm text-primary-600 hover:text-primary-700">
                            View All
                        </Link>
                    </div>

                    {recentBookings.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                                        <th className="pb-3 font-medium">Customer</th>
                                        <th className="pb-3 font-medium">Requirement</th>
                                        <th className="pb-3 font-medium">Date</th>
                                        <th className="pb-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentBookings.map((booking) => (
                                        <tr key={booking.id} className="text-sm">
                                            <td className="py-3">
                                                <p className="font-medium text-gray-900">{booking.name}</p>
                                                <p className="text-gray-500 text-xs">{booking.phone}</p>
                                            </td>
                                            <td className="py-3 text-gray-600">{booking.requirement}</td>
                                            <td className="py-3 text-gray-600">
                                                {new Date(booking.preferred_date).toLocaleDateString('en-IN')}
                                            </td>
                                            <td className="py-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FiAlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No bookings yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
