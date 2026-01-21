import { Request, Response } from "express";
import { BookingStatus, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import * as bookingService from "../services/booking.service";
import * as emailService from "../services/email.service";

// CREATE
export const createBooking = async (req: any, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Extract only valid Booking model fields
    const {
      name, email, phone, // Exclude these
      preferredDate,
      ...bookingData
    } = req.body;

    const booking = await bookingService.createBooking({
      ...bookingData,
      preferredDate: new Date(preferredDate), // Ensure Date object
      userId: userId
    });

    // Send Confirmation Email
    try {
      await emailService.sendBookingConfirmation({
        bookingId: booking.id,
        customerName: name,
        customerEmail: email,
        phone: phone,
        address: booking.address,
        city: booking.city,
        state: booking.state,
        electricityBill: booking.electricityBill,
        roofType: booking.roofType,
        preferredDate: booking.preferredDate.toISOString(),
      });

      // Also notify admin
      await emailService.sendAdminNewBookingNotification({
        bookingId: booking.id,
        customerName: name,
        customerEmail: email,
        phone: phone,
        address: booking.address,
        city: booking.city,
        state: booking.state,
        electricityBill: booking.electricityBill,
        roofType: booking.roofType,
        preferredDate: booking.preferredDate.toISOString(),
      });
    } catch (emailError) {
      console.error("Failed to send booking emails:", emailError);
      // Don't fail the request if email fails, just log it
    }

    res.status(201).json({ success: true, booking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

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
// UPDATE STATUS
export const updateBookingStatus = async (req: Request, res: Response) => {
  const { bookingStatus, technician } = req.body;

  try {
    // 1. Update Booking and include User to get email
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: {
        bookingStatus: bookingStatus as BookingStatus,
        technician
      },
      include: { user: true }
    });

    // 2. Prepare email data
    const emailData = {
      bookingId: booking.id,
      customerName: booking.user.name,
      customerEmail: booking.user.email, // Use user's email
      address: booking.address,
      city: booking.city,
      state: booking.state,
      electricityBill: booking.electricityBill,
      roofType: booking.roofType,
      preferredDate: booking.preferredDate.toISOString(),
      bookingStatus: booking.bookingStatus,
      technician: booking.technician || "Assigned Technician",
    };

    // 3. Send Email based on Status
    try {
      if (bookingStatus === BookingStatus.APPROVED) {
        await emailService.sendBookingApproved(emailData);
      } else if (bookingStatus === BookingStatus.INSTALLATION_SCHEDULED) {
        await emailService.sendInstallationScheduled(emailData);
      } else if (bookingStatus === BookingStatus.INSTALLED) {
        await emailService.sendInstallationCompleted(emailData);
      }
    } catch (emailError) {
      console.error("Failed to send status update email:", emailError);
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Failed to update booking status" });
  }
};

// STATS
export const getBookingStats = async (_req: Request, res: Response) => {
  const stats = await bookingService.getBookingStats();
  res.json({ success: true, stats });
};
