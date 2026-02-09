import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend URL
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch all bookings
  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${BACKEND_URL}/api/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ Backend returns array directly, not { bookings: [] }
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
                <th className="p-2 border">Date</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td className="p-2 border">{b.name}</td>
                  <td className="p-2 border">{b.phone}</td>

                  {/* ✅ Correct field name */}
                  <td className="p-2 border">{b.requirement}</td>

                  <td className="p-2 border">{b.status}</td>

                  <td className="p-2 border">
                    {new Date(b.created_at).toLocaleDateString("en-IN")}
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
