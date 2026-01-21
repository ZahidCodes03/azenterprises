import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth API
export const authAPI = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
    logout: () => api.post('/auth/logout'),
    getProfile: () => api.get('/auth/profile'),
};

// Booking API
export const bookingAPI = {
    create: (data: any) => api.post('/bookings', data),
    getAll: (params?: { status?: string; search?: string }) =>
        api.get('/bookings', { params }),
    getById: (id: string) => api.get(`/bookings/${id}`),
    updateStatus: (id: string, data: { bookingStatus: string; technician?: string }) =>
        api.patch(`/bookings/${id}/status`, data),
    addNote: (id: string, note: string) => api.post(`/bookings/${id}/notes`, { note }),
    getStats: () => api.get('/bookings/stats'),
};


// User API
export const userAPI = {
    getAll: () => api.get('/users'),
    getById: (id: string) => api.get(`/users/${id}`),
};

export default api;
