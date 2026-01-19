import { Request, Response } from 'express';
import * as bookingService from '../services/booking.service';
import { BookingStatus } from '@prisma/client';

export const createBooking = async (req: Request, res: Response): Promise<void> => {
    try {
        const booking = await bookingService.createBooking(req.body);

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to create booking',
        });
    }
};

export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status, search } = req.query;

        const bookings = await bookingService.getAllBookings({
            status: status as BookingStatus | undefined,
            search: search as string | undefined,
        });

        res.json({
            success: true,
            bookings,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch bookings',
        });
    }
};

export const getBookingById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const booking = await bookingService.getBookingById(id);

        res.json({
            success: true,
            booking,
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            error: error.message || 'Booking not found',
        });
    }
};

export const updateBookingStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { bookingStatus, technician } = req.body;

        const booking = await bookingService.updateBookingStatus(id, bookingStatus, technician);

        res.json({
            success: true,
            message: 'Booking status updated successfully',
            booking,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to update booking',
        });
    }
};

export const addAdminNote = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { note } = req.body;

        const adminNote = await bookingService.addAdminNote(id, note);

        res.json({
            success: true,
            message: 'Admin note added successfully',
            adminNote,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to add note',
        });
    }
};

export const getBookingStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const stats = await bookingService.getBookingStats();

        res.json({
            success: true,
            stats,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to fetch stats',
        });
    }
};
