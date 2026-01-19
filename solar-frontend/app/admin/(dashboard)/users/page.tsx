'use client';

import { useEffect, useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { userAPI } from '@/lib/api';
import { User, Booking } from '@/types';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
    const [users, setUsers] = useState<(User & { bookings: Booking[] })[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<(User & { bookings: Booking[] })[]>([]);
    const [selectedUser, setSelectedUser] = useState<(User & { bookings: Booking[] }) | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm]);

    const fetchUsers = async () => {
        try {
            const response = await userAPI.getAll();
            setUsers(response.data.users);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter((u) =>
                u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.phone.includes(searchTerm)
            );
        }

        setFilteredUsers(filtered);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">User Management</h1>
                <p className="text-gray-600">View and manage customer information</p>
            </div>

            {/* Search */}
            <Card className="mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>
                    <div className="text-right flex items-center justify-end">
                        <span className="text-sm text-gray-600">
                            Showing {filteredUsers.length} of {users.length} users
                        </span>
                    </div>
                </div>
            </Card>

            {/* Users Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Name</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Contact</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Registered</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Bookings</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                        <p className="font-medium text-gray-900">{user.name}</p>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-900">{user.email}</p>
                                        <p className="text-sm text-gray-600">{user.phone}</p>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {formatDateTime(user.createdAt)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
                                            {user.bookings.length} booking{user.bookings.length !== 1 ? 's' : ''}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <button
                                            onClick={() => setSelectedUser(user)}
                                            className="text-primary-600 hover:text-primary-700 font-medium"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No users found
                        </div>
                    )}
                </div>
            </Card>

            {/* User Details Modal */}
            {selectedUser && (
                <Modal
                    isOpen={!!selectedUser}
                    onClose={() => setSelectedUser(null)}
                    title="User Details"
                    size="lg"
                >
                    <div className="space-y-6">
                        {/* User Info */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Name</p>
                                    <p className="font-medium">{selectedUser.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium">{selectedUser.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="font-medium">{selectedUser.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Registered</p>
                                    <p className="font-medium">{formatDateTime(selectedUser.createdAt)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Booking History */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Booking History</h3>
                            {selectedUser.bookings.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No bookings yet</p>
                            ) : (
                                <div className="space-y-3">
                                    {selectedUser.bookings.map((booking) => (
                                        <div key={booking.id} className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {booking.city}, {booking.state}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{booking.address}</p>
                                                </div>
                                                <StatusBadge status={booking.bookingStatus} />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Booking Date</p>
                                                    <p className="font-medium">{formatDateTime(booking.createdAt)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600">Roof Type</p>
                                                    <p className="font-medium">{booking.roofType}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
