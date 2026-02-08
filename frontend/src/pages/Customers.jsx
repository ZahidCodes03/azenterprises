import { useState, useEffect } from 'react';
import { FiSearch, FiUser, FiPhone, FiMail, FiMapPin, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getBookings, getBookingDocument } from '../services/api';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetchCustomers();
    }, [searchTerm]);

    const fetchCustomers = async () => {
        try {
            const response = await getBookings({ search: searchTerm });
            // Group by customer (email as unique identifier)
            const customerMap = {};
            response.data.forEach(booking => {
                if (!customerMap[booking.email]) {
                    customerMap[booking.email] = {
                        ...booking,
                        bookings: [booking]
                    };
                } else {
                    customerMap[booking.email].bookings.push(booking);
                }
            });
            setCustomers(Object.values(customerMap));
        } catch (error) {
            toast.error('Failed to fetch customers');
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewDocument = async (bookingId, docType) => {
        try {
            const response = await getBookingDocument(bookingId, docType);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            window.open(url, '_blank');
        } catch (error) {
            toast.error('Failed to load document');
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
                <p className="text-gray-600">View customer details and booking history</p>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-md">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search customers..."
                    className="input-field pl-12"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Customer List */}
                <div className="lg:col-span-1 space-y-4">
                    {isLoading ? (
                        <div className="bg-white rounded-xl p-8 text-center">
                            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                        </div>
                    ) : customers.length === 0 ? (
                        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
                            <FiUser className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No customers found</p>
                        </div>
                    ) : (
                        customers.map((customer) => (
                            <div
                                key={customer.email}
                                onClick={() => setSelectedCustomer(customer)}
                                className={`bg-white rounded-xl p-4 cursor-pointer border-2 transition-all ${selectedCustomer?.email === customer.email
                                        ? 'border-primary-500 shadow-lg'
                                        : 'border-transparent shadow-sm hover:shadow-md hover:border-gray-200'
                                    }`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                                        <FiUser className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{customer.name}</p>
                                        <p className="text-sm text-gray-500 truncate">{customer.email}</p>
                                        <p className="text-xs text-primary-600 mt-1">
                                            {customer.bookings.length} booking{customer.bookings.length > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Customer Details */}
                <div className="lg:col-span-2">
                    {selectedCustomer ? (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Customer Header */}
                            <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-500 text-white">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                                        <FiUser className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{selectedCustomer.name}</h2>
                                        <p className="text-white/80">{selectedCustomer.requirement}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <FiPhone className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-700">{selectedCustomer.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <FiMail className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-700">{selectedCustomer.email}</span>
                                    </div>
                                    <div className="flex items-start space-x-3 sm:col-span-2">
                                        <FiMapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">{selectedCustomer.address}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Documents */}
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => handleViewDocument(selectedCustomer.id, 'aadhar')}
                                        className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50 hover:text-primary-700 transition-all"
                                    >
                                        <FiDownload className="w-6 h-6 mx-auto mb-2" />
                                        <span className="text-sm font-medium">Aadhar Card</span>
                                    </button>
                                    <button
                                        onClick={() => handleViewDocument(selectedCustomer.id, 'electricity')}
                                        className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50 hover:text-primary-700 transition-all"
                                    >
                                        <FiDownload className="w-6 h-6 mx-auto mb-2" />
                                        <span className="text-sm font-medium">Electricity Bill</span>
                                    </button>
                                    <button
                                        onClick={() => handleViewDocument(selectedCustomer.id, 'passbook')}
                                        className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50 hover:text-primary-700 transition-all"
                                    >
                                        <FiDownload className="w-6 h-6 mx-auto mb-2" />
                                        <span className="text-sm font-medium">Bank Passbook</span>
                                    </button>
                                </div>
                            </div>

                            {/* Booking History */}
                            <div className="p-6">
                                <h3 className="font-semibold text-gray-900 mb-4">Booking History</h3>
                                <div className="space-y-3">
                                    {selectedCustomer.bookings.map((booking) => (
                                        <div key={booking.id} className="p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">{booking.requirement}</p>
                                                    <p className="text-sm text-gray-500">
                                                        Survey Date: {new Date(booking.preferred_date).toLocaleDateString('en-IN')}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                        booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                            <FiUser className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">Select a customer to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Customers;
