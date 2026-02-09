import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

/* Layout Components */
import Header from "./components/Header";
import Footer from "./components/Footer";


/* Public Pages */
import Home from "../pages/Home";
import Booking from "../pages/Booking";

/* Admin Pages */
import AdminLogin from "../pages/AdminLogin";
import AdminLayout from "../pages/AdminLayout";
import Dashboard from "../pages/Dashboard";
import AdminBookings from "../pages/AdminBookings";
import Customers from "../pages/Customers";
import Invoices from "../pages/Invoices";

/* Public Layout Wrapper */
const PublicLayout = ({ children }) => (
  <>
    <Header />
    {children}
    <Footer />
  </>
);

function App() {
  console.log("VITE_API_URL =", import.meta.env.VITE_API_URL);

  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
          },
        }}
      />

      <Routes>
        {/* =======================
            Public Routes
        ======================= */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path="/booking"
          element={
            <PublicLayout>
              <Booking />
            </PublicLayout>
          }
        />

        {/* =======================
            Admin Routes
        ======================= */}
        <Route path="/admin/login" element={<AdminLogin />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />

          {/* ✅ Admin Bookings Page */}
          <Route path="bookings" element={<AdminBookings />} />

          <Route path="customers" element={<Customers />} />
          <Route path="invoices" element={<Invoices />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
