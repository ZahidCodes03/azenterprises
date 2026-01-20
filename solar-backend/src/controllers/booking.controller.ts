import { Request, Response } from "express";
import { BookingStatus } from "@prisma/client";
import * as bookingService from "../services/booking.service";

// GET ALL
export const getAllBookings = async (req: Request, res: Response) => {
  const { bookingStatus } = req.query;

  const bookings = await bookingService.getAllBookings({
    bookingStatus: bookingStatus as BookingStatus,
  });

  res.json({ success: true, bookings });
};

// GET BY ID
export const getBookingById = async (req: Request, res: Response) => {
  const booking = await bookingService.getBookingById(req.params.id);
  res.json({ success: true, booking });
};

// UPDATE STATUS
export const updateBookingStatus = async (req: Request, res: Response) => {
  const { bookingStatus, technician } = req.body;

  const booking = await bookingService.updateBookingStatus(
    req.params.id,
    bookingStatus,
    technician
  );

  res.json({ success: true, booking });
};

// STATS
export const getBookingStats = async (_req: Request, res: Response) => {
  const stats = await bookingService.getBookingStats();
  res.json(stats);
};
