import React, { useEffect, useState } from "react";
import axios from "axios";
import { deleteBooking } from "../services/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // ✅ Fetch all bookings
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${BACKEND_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBookings(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Delete booking
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      await deleteBooking(id);
      alert("Booking Deleted Successfully ✅");
      fetchBookings();
    } catch (error) {
      alert("Failed to delete booking ❌");
      console.log(error);
    }
  };

  // ✅ Update Booking Status
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${BACKEND_URL}/api/bookings/${id}/status`,
        { status: newStatus.toLowerCase() },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Status updated to ${newStatus} ✅`);
      fetchBookings();
    } catch (error) {
      console.error("❌ Status update failed:", error.response?.data || error);
      alert("Failed to update status ❌");
    }
  };

  // ✅ View Document Function
  const handleViewDocument = async (bookingId, docType) => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(
        `${BACKEND_URL}/api/bookings/${bookingId}/documents/${docType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Open Cloudinary URL in new tab
      window.open(res.data.url, "_blank");
    } catch (error) {
      console.error("❌ Failed to load document:", error);
      alert("Failed to load document ❌");
    }
  };

  if (loading) {
    return <h2 className="text-center mt-10">Loading bookings...</h2>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">📌 All Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Requirement</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Documents</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="p-2 border">{b.name}</td>
                  <td className="p-2 border">{b.phone}</td>
                  <td className="p-2 border">{b.requirement}</td>

                  {/* ✅ Status Dropdown */}
                  <td className="p-2 border">
                    <select
                      value={b.status?.toLowerCase()}
                      onChange={(e) =>
                        handleStatusUpdate(b.id, e.target.value)
                      }
                      className="border px-2 py-1 rounded"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>

                  {/* ✅ Documents Buttons */}
                  <td className="p-2 border text-center space-x-2">
                    <button
                      onClick={() => handleViewDocument(b.id, "aadhar")}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Aadhar
                    </button>

                    <button
                      onClick={() =>
                        handleViewDocument(b.id, "electricityBill")
                      }
                      className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Bill
                    </button>

                    <button
                      onClick={() =>
                        handleViewDocument(b.id, "bankPassbook")
                      }
                      className="bg-purple-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Passbook
                    </button>
                  </td>

                  {/* ✅ Delete Button */}
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
