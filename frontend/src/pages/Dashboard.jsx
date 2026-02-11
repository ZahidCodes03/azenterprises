import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiCalendar,
  FiUsers,
  FiFileText,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from 'react-icons/fi';
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

          // Pending Bookings
          pendingBookings: bookings.filter(
            (b) => b.status?.toLowerCase() === 'pending'
          ).length,

          // Approved = Confirmed
          confirmedBookings: bookings.filter(
            (b) => b.status?.toLowerCase() === 'confirmed'
          ).length,

          // Completed Bookings
          completedBookings: bookings.filter(
            (b) => b.status?.toLowerCase() === 'completed'
          ).length,

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
      bgLight: 'bg-blue-50',
      color: 'text-blue-600',
    },
    {
      title: 'Pending',
      value: stats.pendingBookings,
      icon: FiClock,
      bgLight: 'bg-yellow-50',
      color: 'text-yellow-600',
    },
    {
      title: 'Confirmed',
      value: stats.confirmedBookings,
      icon: FiCheckCircle,
      bgLight: 'bg-green-50',
      color: 'text-green-600',
    },
    {
      title: 'Completed',
      value: stats.completedBookings,
      icon: FiTrendingUp,
      bgLight: 'bg-primary-50',
      color: 'text-primary-600',
    },
  ];

  // Badge Colors
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };

    return styles[status?.toLowerCase()] || styles.pending;
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
        <p className="text-gray-600">
          Welcome back! Here's your business overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>

              <div
                className={`w-14 h-14 rounded-xl ${card.bgLight} flex items-center justify-center`}
              >
                <card.icon className={`w-7 h-7 ${card.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Recent Bookings</h2>

        {recentBookings.length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Requirement</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b text-sm">
                  <td className="py-3">
                    <p className="font-medium">{booking.name}</p>
                    <p className="text-xs text-gray-500">{booking.phone}</p>
                  </td>

                  <td className="py-3">{booking.requirement}</td>

                  <td className="py-3">
                    {new Date(booking.preferred_date).toLocaleDateString()}
                  </td>

                  <td className="py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusBadge(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center py-6">No bookings yet</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
