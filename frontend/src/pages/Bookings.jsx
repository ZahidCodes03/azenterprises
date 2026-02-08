import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiEye, FiTrash2, FiCheck, FiX, FiClock, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getBookings, updateBookingStatus, getBookingDocument } from '../services/api';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, [statusFilter, searchTerm]);

    const fetchBookings = async () => {
        try {
            const response = await getBookings({ status: statusFilter, search: searchTerm });
            setBookings(response.data);
        } catch (error) {
            toast.error('Failed to fetch bookings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateBookingStatus(id, status);
            toast.success(status === 'rejected' ? 'Booking rejected and deleted' : `Status updated to ${status}`);
            fetchBookings();
            setShowModal(false);
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleViewDocument = async (bookingId, docType) => {
        try {
            const response = await getBookingDocument(bookingId, docType);

            // Create blob with correct type
            const file = new Blob([response.data], { type: response.headers['content-type'] });
            const fileURL = URL.createObjectURL(file);

            // Open in new tab
            const newWindow = window.open(fileURL, '_blank');

            // Fallback for popup blockers
            if (!newWindow) {
                const link = document.createElement('a');
                link.href = fileURL;
                link.target = '_blank';
                link.download = `document-${bookingId}-${docType}.${response.headers['content-type'].split('/')[1]}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error) {
            console.error('Error viewing document:', error);
            toast.error('Failed to load document. Please check console.');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            confirmed: 'bg-green-100 text-green-800 border-green-200',
            completed: 'bg-blue-100 text-blue-800 border-blue-200',
            cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
        };
        return styles[status] || styles.pending;
    };

    const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
                <p className="text-gray-600">View and manage all site survey bookings</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name, phone, or email..."
                        className="input-field pl-12"
                    />
                </div>
                <div className="relative">
                    <FiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="input-field pl-12 pr-8 appearance-none min-w-[180px]"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading bookings...</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <FiClock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No bookings found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr className="text-left text-sm text-gray-500">
                                    <th className="px-6 py-4 font-medium">Customer</th>
                                    <th className="px-6 py-4 font-medium">Contact</th>
                                    <th className="px-6 py-4 font-medium">Requirement</th>
                                    <th className="px-6 py-4 font-medium">Survey Date</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-medium text-gray-900">{booking.name}</p>
                                            <p className="text-sm text-gray-500 truncate max-w-[200px]">{booking.address}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">{booking.phone}</p>
                                            <p className="text-sm text-gray-500">{booking.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                                                {booking.requirement}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(booking.preferred_date).toLocaleDateString('en-IN', {
                                                weekday: 'short',
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize border ${getStatusBadge(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => { setSelectedBooking(booking); setShowModal(true); }}
                                                    className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                                    title="View Details"
                                                >
                                                    <FiEye className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Booking Detail Modal */}
            {showModal && selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Customer Info */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-gray-500">Full Name</label>
                                    <p className="font-medium text-gray-900">{selectedBooking.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Phone</label>
                                    <p className="font-medium text-gray-900">{selectedBooking.phone}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Email</label>
                                    <p className="font-medium text-gray-900">{selectedBooking.email}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Requirement</label>
                                    <p className="font-medium text-primary-600">{selectedBooking.requirement}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="text-sm text-gray-500">Address</label>
                                    <p className="font-medium text-gray-900">{selectedBooking.address}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Preferred Date</label>
                                    <p className="font-medium text-gray-900">
                                        {new Date(selectedBooking.preferred_date).toLocaleDateString('en-IN', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-500">Current Status</label>
                                    <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadge(selectedBooking.status)}`}>
                                        {selectedBooking.status}
                                    </p>
                                </div>
                            </div>

                            {/* Documents */}
                            <div>
                                <label className="text-sm text-gray-500 block mb-3">Uploaded Documents</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => handleViewDocument(selectedBooking.id, 'aadhar')}
                                        className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50 hover:text-primary-700 transition-all"
                                    >
                                        <FiDownload className="w-6 h-6 mx-auto mb-2" />
                                        <span className="text-sm font-medium">Aadhar Card</span>
                                    </button>
                                    <button
                                        onClick={() => handleViewDocument(selectedBooking.id, 'electricity')}
                                        className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50 hover:text-primary-700 transition-all"
                                    >
                                        <FiDownload className="w-6 h-6 mx-auto mb-2" />
                                        <span className="text-sm font-medium">Electricity Bill</span>
                                    </button>
                                    <button
                                        onClick={() => handleViewDocument(selectedBooking.id, 'passbook')}
                                        className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50 hover:text-primary-700 transition-all"
                                    >
                                        <FiDownload className="w-6 h-6 mx-auto mb-2" />
                                        <span className="text-sm font-medium">Bank Passbook</span>
                                    </button>
                                </div>
                            </div>

                            {/* Status Update */}
                            <div>
                                <label className="text-sm text-gray-500 block mb-3">Update Status</label>
                                <div className="flex flex-wrap gap-2">
                                    {statusOptions.map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(selectedBooking.id, status)}
                                            disabled={selectedBooking.status === status}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${status === 'rejected'
                                                ? 'bg-red-100 text-red-700 hover:bg-red-200 border border-red-200'
                                                : status === 'confirmed'
                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200'
                                                    : status === 'completed'
                                                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                                                } disabled:opacity-50 disabled:cursor-not-allowed capitalize`}
                                        >
                                            {status === 'rejected' && <FiTrash2 className="w-4 h-4 inline mr-1" />}
                                            {status === 'confirmed' && <FiCheck className="w-4 h-4 inline mr-1" />}
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                {selectedBooking.status !== 'rejected' && (
                                    <p className="text-xs text-red-500 mt-2">
                                        ⚠️ Setting status to "Rejected" will permanently delete this booking
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;
