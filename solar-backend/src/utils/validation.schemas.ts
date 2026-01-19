import { z } from 'zod';

// Auth validation
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Booking validation
export const createBookingSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    electricityBill: z.number().positive('Electricity bill must be a positive number'),
    roofType: z.string().min(1, 'Roof type is required'),
    roofSize: z.number().positive('Roof size must be positive').optional(),
    systemSize: z.number().min(1).max(100).optional(), // System capacity in kW (1-100 kW)
    preferredDate: z.string().min(1, 'Preferred date is required'),
});

export const updateBookingStatusSchema = z.object({
    bookingStatus: z.enum([
        'PENDING',
        'APPROVED',
        'INSTALLATION_SCHEDULED',
        'INSTALLED',
        'CANCELLED',
    ]),
    technician: z.string().optional(),
});

export const addAdminNoteSchema = z.object({
    note: z.string().min(1, 'Note cannot be empty'),
});

// Calculator validation
export const calculatorSchema = z.object({
    monthlyBill: z.number().positive('Monthly bill must be positive'),
    state: z.string().min(2, 'State is required'),
    roofSize: z.number().positive('Roof size must be positive'),
});
