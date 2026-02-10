import React, { useEffect, useState } from "react";
import axios from "axios";
import { deleteBooking } from "../services/api";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend URL
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

  // Load bookings on page open
  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ Delete booking function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      await deleteBooking(id);
      alert("Booking Deleted Successfully ✅");
      fetchBookings(); // Refresh list
    } catch (error) {
      alert("Failed to delete booking ❌");
      console.log(error);
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
            {/* ✅ Table Header */}
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Customer</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Requirement</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>

            {/* ✅ Table Body */}
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="p-2 border">{b.name}</td>
                  <td className="p-2 border">{b.phone}</td>
                  <td className="p-2 border">{b.requirement}</td>
                  <td className="p-2 border">{b.status}</td>

                  <td className="p-2 border">
                    {new Date(b.created_at).toLocaleDateString("en-IN")}
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
