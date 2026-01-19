'use client';

import { useEffect, useState } from 'react';
import { Search, Eye, Edit } from 'lucide-react';
import { bookingAPI } from '@/lib/api';
import { Booking } from '@/types';
import StatusBadge from '@/components/admin/StatusBadge';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [newStatus, setNewStatus] = useState('');
    const [newTechnician, setNewTechnician] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        filterBookings();
    }, [bookings, searchTerm, statusFilter]);

    const fetchBookings = async () => {
        try {
            const response = await bookingAPI.getAll();
            setBookings(response.data.bookings);
        } catch (error) {
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const filterBookings = () => {
        let filtered = bookings;

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter((b) => b.bookingStatus === statusFilter);
        }

        if (searchTerm) {
            filtered = filtered.filter((b) =>
                b.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.city.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredBookings(filtered);
    };

    const handleUpdateStatus = async () => {
        if (!selectedBooking || !newStatus) return;

        try {
            await bookingAPI.updateStatus(selectedBooking.id, {
                bookingStatus: newStatus,
                ...(newTechnician && { technician: newTechnician }),
            });
            toast.success('Booking status updated successfully');
            fetchBookings();
            setSelectedBooking(null);
        } catch (error) {
            toast.error('Failed to update booking status');
        }
    };

    const handleAddNote = async () => {
        if (!selectedBooking || !note) return;

        try {
            await bookingAPI.addNote(selectedBooking.id, note);
            toast.success('Note added successfully');
            setNote('');
            fetchBookings();
        } catch (error) {
            toast.error('Failed to add note');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Booking Management</h1>
                <p className="text-gray-600">Manage and track all solar installation bookings</p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <div className="grid md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                        <option value="ALL">All Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="INSTALLATION_SCHEDULED">Scheduled</option>
                        <option value="INSTALLED">Installed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>

                    <div className="text-right">
                        <span className="text-sm text-gray-600">
                            Showing {filteredBookings.length} of {bookings.length} bookings
                        </span>
                    </div>
                </div>
            </Card>

            {/* Bookings Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Customer</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Location</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Bill</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Date</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                                <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4">
                                        <div>
                                            <p className="font-medium text-gray-900">{booking.user.name}</p>
                                            <p className="text-sm text-gray-600">{booking.user.email}</p>
                                            <p className="text-sm text-gray-600">{booking.user.phone}</p>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <p className="text-gray-900">{booking.city}</p>
                                        <p className="text-sm text-gray-600">{booking.state}</p>
                                    </td>
                                    <td className="py-4 px-4 text-gray-900">
                                        {formatCurrency(booking.electricityBill)}
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {formatDateTime(booking.createdAt)}
                                    </td>
                                    <td className="py-4 px-4">
                                        <StatusBadge status={booking.bookingStatus} />
                                    </td>
                                    <td className="py-4 px-4">
                                        <button
                                            onClick={() => {
                                                setSelectedBooking(booking);
                                                setNewStatus(booking.bookingStatus);
                                                setNewTechnician(booking.technician || '');
                                            }}
                                            className="text-primary-600 hover:text-primary-700 font-medium"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredBookings.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No bookings found
                        </div>
                    )}
                </div>
            </Card>

            {/* Booking Details Modal */}
            {selectedBooking && (
                <Modal
                    isOpen={!!selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    title="Booking Details"
                    size="lg"
                >
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Name</p>
                                    <p className="font-medium">{selectedBooking.user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Email</p>
                                    <p className="font-medium">{selectedBooking.user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Phone</p>
                                    <p className="font-medium">{selectedBooking.user.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Booking ID</p>
                                    <p className="font-medium text-primary-600">{selectedBooking.id}</p>
                                </div>
                            </div>
                        </div>

                        {/* Installation Details */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Installation Details</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Address</p>
                                    <p className="font-medium">{selectedBooking.address}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">City, State</p>
                                    <p className="font-medium">{selectedBooking.city}, {selectedBooking.state}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Monthly Bill</p>
                                    <p className="font-medium">{formatCurrency(selectedBooking.electricityBill)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Roof Type</p>
                                    <p className="font-medium">{selectedBooking.roofType}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Preferred Date</p>
                                    <p className="font-medium">{formatDateTime(selectedBooking.preferredDate)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Update Status */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Update Status</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Booking Status
                                    </label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    >
                                        <option value="PENDING">Pending</option>
                                        <option value="APPROVED">Approved</option>
                                        <option value="INSTALLATION_SCHEDULED">Installation Scheduled</option>
                                        <option value="INSTALLED">Installed</option>
                                        <option value="CANCELLED">Cancelled</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assign  Technician (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={newTechnician}
                                        onChange={(e) => setNewTechnician(e.target.value)}
                                        placeholder="Technician name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                    />
                                </div>
                            </div>
                            <Button onClick={handleUpdateStatus} className="mt-4">
                                Update Status
                            </Button>
                        </div>

                        {/* Admin Notes */}
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-3">Admin Notes</h3>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add a note..."
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                            />
                            <Button onClick={handleAddNote} variant="outline" className="mt-2">
                                Add Note
                            </Button>

                            {selectedBooking.adminNotes && selectedBooking.adminNotes.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    {selectedBooking.adminNotes.map((adminNote) => (
                                        <div key={adminNote.id} className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-sm text-gray-700">{adminNote.note}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formatDateTime(adminNote.createdAt)}
                                            </p>
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
