import prisma from '../config/database';
import { BookingStatus } from '@prisma/client';
import * as emailService from './email.service';

export const createBooking = async (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    electricityBill: number;
    roofType: string;
    roofSize?: number;
    preferredDate: string;
}) => {
    // Find or create user
    let user = await prisma.user.findUnique({
        where: { email: data.email },
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                role: 'USER',
            },
        });
    }

    // Create booking
    const booking = await prisma.booking.create({
        data: {
            userId: user.id,
            address: data.address,
            city: data.city,
            state: data.state,
            electricityBill: data.electricityBill,
            roofType: data.roofType,
            roofSize: data.roofSize,
            preferredDate: new Date(data.preferredDate),
            bookingStatus: 'PENDING',
        },
        include: {
            user: true,
        },
    });

    // Send confirmation email to customer
    await emailService.sendBookingConfirmation({
        bookingId: booking.id,
        customerName: user.name,
        customerEmail: user.email,
        phone: user.phone,
        address: booking.address,
        city: booking.city,
        state: booking.state,
        electricityBill: booking.electricityBill,
        roofType: booking.roofType,
        preferredDate: booking.preferredDate.toISOString(),
    });

    // Send notification to admin
    await emailService.sendAdminNewBookingNotification({
        bookingId: booking.id,
        customerName: user.name,
        customerEmail: user.email,
        phone: user.phone,
        address: booking.address,
        city: booking.city,
        state: booking.state,
        electricityBill: booking.electricityBill,
        roofType: booking.roofType,
        preferredDate: booking.preferredDate.toISOString(),
    });

    return booking;
};

export const getAllBookings = async (filters?: {
    status?: BookingStatus;
    search?: string;
}) => {
    const where: any = {};

    if (filters?.status) {
        where.bookingStatus = filters.status;
    }

    if (filters?.search) {
        where.OR = [
            { user: { name: { contains: filters.search, mode: 'insensitive' } } },
            { user: { email: { contains: filters.search, mode: 'insensitive' } } },
            { city: { contains: filters.search, mode: 'insensitive' } },
            { state: { contains: filters.search, mode: 'insensitive' } },
        ];
    }

    const bookings = await prisma.booking.findMany({
        where,
        include: {
            user: true,
            adminNotes: {
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return bookings;
};

export const getBookingById = async (bookingId: string) => {
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            user: true,
            adminNotes: {
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });

    if (!booking) {
        throw new Error('Booking not found');
    }

    return booking;
};

export const updateBookingStatus = async (
    bookingId: string,
    status: BookingStatus,
    technician?: string
) => {
    const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
            bookingStatus: status,
            ...(technician && { technician }),
        },
        include: {
            user: true,
        },
    });

    // Send status update email
    const emailData = {
        bookingId: booking.id,
        customerName: booking.user.name,
        customerEmail: booking.user.email,
        address: booking.address,
        city: booking.city,
        state: booking.state,
        electricityBill: booking.electricityBill,
        roofType: booking.roofType,
        preferredDate: booking.preferredDate.toISOString(),
    };

    switch (status) {
        case 'APPROVED':
            await emailService.sendBookingApproved(emailData);
            break;
        case 'INSTALLATION_SCHEDULED':
            await emailService.sendInstallationScheduled(emailData);
            break;
        case 'INSTALLED':
            await emailService.sendInstallationCompleted(emailData);
            break;
    }

    return booking;
};

export const addAdminNote = async (bookingId: string, note: string) => {
    const adminNote = await prisma.adminNote.create({
        data: {
            bookingId,
            note,
        },
    });

    return adminNote;
};

export const getBookingStats = async () => {
    const totalBookings = await prisma.booking.count();
    const pendingBookings = await prisma.booking.count({
        where: { bookingStatus: 'PENDING' },
    });
    const approvedBookings = await prisma.booking.count({
        where: { bookingStatus: 'APPROVED' },
    });
    const scheduledBookings = await prisma.booking.count({
        where: { bookingStatus: 'INSTALLATION_SCHEDULED' },
    });
    const installedBookings = await prisma.booking.count({
        where: { bookingStatus: 'INSTALLED' },
    });

    // Calculate estimated revenue (assuming average cost of ₹3,00,000 per installation)
    const estimatedRevenue = installedBookings * 300000;

    return {
        totalBookings,
        pendingBookings,
        approvedBookings,
        scheduledBookings,
        installedBookings,
        estimatedRevenue,
    };
};
