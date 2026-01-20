import { PrismaClient, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE
export const createBooking = async (data: any) => {
  return prisma.booking.create({ data });
};

// GET ALL (NO SEARCH – SAFE VERSION)
export const getAllBookings = async ({
  bookingStatus,
}: {
  bookingStatus?: BookingStatus;
}) => {
  return prisma.booking.findMany({
    where: {
      ...(bookingStatus && { bookingStatus }),
    },
    orderBy: { createdAt: "desc" },
  });
};

// GET BY ID
export const getBookingById = async (id: string) => {
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) throw new Error("Booking not found");
  return booking;
};

// UPDATE STATUS
export const updateBookingStatus = async (
  id: string,
  bookingStatus: BookingStatus,
  technician?: string
) => {
  return prisma.booking.update({
    where: { id },
    data: {
      bookingStatus,
      technician,
    },
  });
};

// BOOKING STATS
export const getBookingStats = async () => {
  const totalBookings = await prisma.booking.count();

  const pending = await prisma.booking.count({
    where: { bookingStatus: BookingStatus.PENDING },
  });

  const completed = await prisma.booking.count({
  where: { bookingStatus: BookingStatus.INSTALLED },
});


  return {
    totalBookings,
    pending,
    completed,
  };
};
