import axios from "axios";

/* ============================================
   ✅ Backend Base URL Setup (Netlify + Local)
============================================ */

/*
  Netlify Environment Variable MUST be:

  VITE_BACKEND_URL = https://azenterprises-backend.onrender.com
*/

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// ✅ Debug (Remove later if you want)
console.log("🔥 Backend URL:", BACKEND_URL);

// Always attach /api because backend routes start with /api
const API_BASE_URL = `${BACKEND_URL}/api`;

console.log("🔥 API Base URL:", API_BASE_URL);

/* ============================================
   ✅ Axios Instance
============================================ */

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================================
   ✅ Attach Admin Token Automatically
============================================ */

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ============================================
   ✅ Auto Logout on Unauthorized Access
============================================ */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 ||
      error.response?.status === 403
    ) {
      console.warn("⚠️ Unauthorized! Logging out...");

      localStorage.removeItem("adminToken");

      if (
        window.location.pathname.startsWith("/admin") &&
        window.location.pathname !== "/admin/login"
      ) {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

/* ============================================
   ✅ Booking APIs
============================================ */

export const createBooking = (formData) =>
  api.post("/bookings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const getBookings = (params) =>
  api.get("/bookings", { params });

export const getBooking = (id) =>
  api.get(`/bookings/${id}`);

export const updateBookingStatus = (id, status) =>
  api.put(`/bookings/${id}/status`, { status });

export const getBookingDocument = (id, type) =>
  api.get(`/bookings/${id}/documents/${type}`, {
    responseType: "blob",
  });

/* ============================================
   ✅ Admin APIs
============================================ */

export const adminLogin = (email, password) =>
  api.post("/admin/login", { email, password });

export const verifyOTP = (email, otp) =>
  api.post("/admin/verify-otp", { email, otp });

export const verifyToken = () =>
  api.get("/admin/verify");

export const createAdmin = (email, password, setupKey) =>
  api.post("/admin/create", {
    email,
    password,
    setupKey,
  });

/* ============================================
   ✅ Invoice APIs
============================================ */

export const getInvoiceItems = () =>
  api.get("/invoices/items");

export const createInvoice = (data) =>
  api.post("/invoices", data);

export const getInvoices = () =>
  api.get("/invoices");

export const getInvoice = (id) =>
  api.get(`/invoices/${id}`);

export const getInvoicePDF = (id) =>
  api.get(`/invoices/${id}/pdf`, {
    responseType: "blob",
  });

export const generateInvoicePDF = (data) =>
  api.post("/invoices/generate-pdf", data, {
    responseType: "blob",
  });

export const getNextInvoiceNumber = () =>
  api.get("/invoices/next/number");

/* ============================================
   ✅ Contact API
============================================ */

export const submitContact = (data) =>
  api.post("/contact", data);

/* ============================================
   ✅ Export Axios Instance
============================================ */

export default api;
