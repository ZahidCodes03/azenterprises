import axios from "axios";

/* ============================================
   ✅ Backend Base URL Setup
============================================ */

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const API_BASE_URL = `${BACKEND_URL}/api`;

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
    if (error.response?.status === 401 || error.response?.status === 403) {
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

// Create Booking (with documents upload)
export const createBooking = (formData) =>
  api.post("/bookings", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Get All Bookings (Admin)
export const getBookings = (params) =>
  api.get("/bookings", { params });

// ✅ Update Booking Status (Pending → Approved etc.)
export const updateBookingStatus = (id, status) =>
  api.put(`/bookings/${id}/status`, { status });

// ✅ Delete Booking
export const deleteBooking = (id) =>
  api.delete(`/bookings/${id}`);


/* ============================================
   ✅ Booking Document API
   Backend returns { url: "cloudinary-link" }
============================================ */

const documentTypeMap = {
  aadhar: "aadhar",
  electricityBill: "electricityBill",
  bankPassbook: "bankPassbook",
};

// View Document
export const getBookingDocument = (id, type) => {
  const correctType = documentTypeMap[type];

  if (!correctType) {
    throw new Error("Invalid document type: " + type);
  }

  return api.get(`/bookings/${id}/documents/${correctType}`);
};

/* ============================================
   ✅ Admin APIs
============================================ */

export const adminLogin = (email, password) =>
  api.post("/admin/login", { email, password });

export const verifyOTP = (email, otp) =>
  api.post("/admin/verify-otp", { email, otp });

export const verifyToken = () =>
  api.get("/admin/verify");

/* ============================================
   ✅ Contact API
============================================ */

export const submitContact = (data) =>
  api.post("/contact", data);

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
   ✅ Export Axios Instance
============================================ */

export default api;
