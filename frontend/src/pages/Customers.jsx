import { useState, useEffect } from "react";
import {
  FiSearch,
  FiUser,
  FiPhone,
  FiMail,
  FiMapPin,
  FiDownload,
} from "react-icons/fi";
import toast from "react-hot-toast";

import {
  getBookings,
  getBookingDocument,
  updateBookingStatus,
} from "../services/api";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, [searchTerm]);

  // ✅ Fetch Customers + Group by Email
  const fetchCustomers = async () => {
    try {
      const response = await getBookings({ search: searchTerm });

      const customerMap = {};

      response.data.forEach((booking) => {
        if (!customerMap[booking.email]) {
          customerMap[booking.email] = {
            ...booking,
            bookings: [booking],
          };
        } else {
          customerMap[booking.email].bookings.push(booking);
        }
      });

      setCustomers(Object.values(customerMap));
    } catch (error) {
      toast.error("Failed to fetch customers");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ View Uploaded Documents
  const handleViewDocument = async (bookingId, docType) => {
    try {
      const response = await getBookingDocument(bookingId, docType);
      window.open(response.data.url, "_blank");
    } catch (error) {
      toast.error("Failed to load document");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Customer Management
        </h1>
        <p className="text-gray-600">
          View customer details, bookings, documents and update booking status
        </p>
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
                className={`bg-white rounded-xl p-4 cursor-pointer border-2 transition-all ${
                  selectedCustomer?.email === customer.email
                    ? "border-primary-500 shadow-lg"
                    : "border-transparent shadow-sm hover:shadow-md hover:border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <FiUser className="w-6 h-6" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {customer.name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {customer.email}
                    </p>
                    <p className="text-xs text-primary-600 mt-1">
                      {customer.bookings.length} booking
                      {customer.bookings.length > 1 ? "s" : ""}
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
              {/* Customer Info */}
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Customer Details
                </h2>

                <div className="space-y-3 text-sm">
                  <p className="flex items-center gap-2 text-gray-700">
                    <FiUser className="text-primary-600" />
                    <span className="font-medium">Name:</span>{" "}
                    {selectedCustomer.name}
                  </p>

                  <p className="flex items-center gap-2 text-gray-700">
                    <FiMail className="text-primary-600" />
                    <span className="font-medium">Email:</span>{" "}
                    {selectedCustomer.email}
                  </p>

                  <p className="flex items-center gap-2 text-gray-700">
                    <FiPhone className="text-primary-600" />
                    <span className="font-medium">Phone:</span>{" "}
                    {selectedCustomer.phone}
                  </p>

                  <p className="flex items-center gap-2 text-gray-700">
                    <FiMapPin className="text-primary-600" />
                    <span className="font-medium">Address:</span>{" "}
                    {selectedCustomer.address}
                  </p>

                  <p className="text-gray-700">
                    <span className="font-medium">Package:</span>{" "}
                    {selectedCustomer.requirement}
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Uploaded Documents
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() =>
                      handleViewDocument(selectedCustomer.id, "aadhar")
                    }
                    className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50"
                  >
                    <FiDownload className="w-6 h-6 mx-auto mb-2" />
                    Aadhar
                  </button>

                  <button
                    onClick={() =>
                      handleViewDocument(
                        selectedCustomer.id,
                        "electricityBill"
                      )
                    }
                    className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50"
                  >
                    <FiDownload className="w-6 h-6 mx-auto mb-2" />
                    Bill
                  </button>

                  <button
                    onClick={() =>
                      handleViewDocument(selectedCustomer.id, "bankPassbook")
                    }
                    className="p-4 bg-gray-50 rounded-xl text-center hover:bg-primary-50"
                  >
                    <FiDownload className="w-6 h-6 mx-auto mb-2" />
                    Passbook
                  </button>
                </div>
              </div>

              {/* ✅ Booking History + Status Update Per Booking */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Booking History (Update Status Per Booking)
                </h3>

                <div className="space-y-4">
                  {selectedCustomer.bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-xl border bg-gray-50 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-800">
                            Requirement: {b.requirement}
                          </p>
                          <p className="text-sm text-gray-500">
                            Date:{" "}
                            {new Date(b.preferred_date).toLocaleDateString()}
                          </p>
                        </div>

                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-100 text-primary-700">
                          {b.status}
                        </span>
                      </div>

                      {/* Status Dropdown */}
                      <select
                        value={b.status}
                        onChange={(e) => {
                          const updatedBookings =
                            selectedCustomer.bookings.map((booking) =>
                              booking.id === b.id
                                ? { ...booking, status: e.target.value }
                                : booking
                            );

                          setSelectedCustomer({
                            ...selectedCustomer,
                            bookings: updatedBookings,
                          });
                        }}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Completed">Completed</option>
                      </select>

                      {/* Save Button */}
                      <button
                        onClick={async () => {
                          try {
                            await updateBookingStatus(b.id, b.status);

                            toast.success("Booking Status Updated ✅");

                            fetchCustomers();
                          } catch (err) {
                            toast.error("Failed to update booking ❌");
                          }
                        }}
                        className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
                      >
                        Save This Booking Status
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-12 text-center">
              <FiUser className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">
                Select a customer to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
