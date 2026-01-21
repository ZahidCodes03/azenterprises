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
    include: {
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// GET BY ID
export const getBookingById = async (id: string) => {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
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

  const pendingBookings = await prisma.booking.count({
    where: { bookingStatus: BookingStatus.PENDING },
  });

  const approvedBookings = await prisma.booking.count({
    where: { bookingStatus: BookingStatus.APPROVED },
  });

  const scheduledBookings = await prisma.booking.count({
    where: { bookingStatus: BookingStatus.INSTALLATION_SCHEDULED },
  });

  const installedBookings = await prisma.booking.count({
    where: { bookingStatus: BookingStatus.INSTALLED },
  });

  // Calculate estimated revenue from installed systems (assuming avg system size or bill)
  // Since we don't have a direct revenue field, we can sum systemSize * Approx Rate (e.g. 50000/kW)
  // Or just use 0 for now if no logic exists.
  // Let's try to sum systemSize for INSTALLED bookings.
  const installedSystems = await prisma.booking.findMany({
    where: { bookingStatus: BookingStatus.INSTALLED },
    select: { systemSize: true }
  });

  const estimatedRevenue = installedSystems.reduce((acc, curr) => {
    return acc + ((curr.systemSize || 0) * 50000); // Approx ~50k INR/kW
  }, 0);

  return {
    totalBookings,
    pendingBookings,
    approvedBookings,
    scheduledBookings,
    installedBookings,
    estimatedRevenue,
    // stats object removed as we return flattening keys
  };
};
