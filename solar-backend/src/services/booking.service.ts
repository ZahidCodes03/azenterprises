import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Get all bookings
export const getAllBookings = async () => {
  return prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
  });
};

// ✅ Get booking by ID
export const getBookingById = async (id: string) => {
  return prisma.booking.findUnique({
    where: { id },
  });
};

// ✅ Update booking status
export const updateBookingStatus = async (
  id: string,
  status: string
) => {
  return prisma.booking.update({
    where: { id },
    data: { status },
  });
};

// ✅ Add admin note
export const addAdminNote = async (
  id: string,
  adminNote: string
) => {
  return prisma.booking.update({
    where: { id },
    data: { adminNote },
  });
};

// ✅ Booking statistics
export const getBookingStats = async () => {
  const totalBookings = await prisma.booking.count();
  const pending = await prisma.booking.count({ where: { status: "PENDING" } });
  const completed = await prisma.booking.count({ where: { status: "COMPLETED" } });

  return {
    totalBookings,
    pending,
    completed,
  };
};
