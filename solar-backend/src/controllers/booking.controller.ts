import { PrismaClient, BookingStatus } from "@prisma/client";

const prisma = new PrismaClient();

// CREATE
export const createBooking = async (data: any) => {
  return prisma.booking.create({
    data,
  });
};

// GET ALL (with filters)
export const getAllBookings = async ({
  status,
  search,
}: {
  status?: BookingStatus;
  search?: string;
}) => {
  return prisma.booking.findMany({
    where: {
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { phone: { contains: search } },
        ],
      }),
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
      status: bookingStatus,
      technician,
    },
  });
};

// ADD ADMIN NOTE
export const addAdminNote = async (id: string, note: string) => {
  return prisma.booking.update({
    where: { id },
    data: {
      adminNote: note,
    },
  });
};

// STATS
export const getBookingStats = async () => {
  
  const pending = await prisma.booking.count({ where: { status: "PENDING" } });
  const completed = await prisma.booking.count({ where: { status: "COMPLETED" } });

  return {
    totalBookings,
    pending,
    completed,
  };
};
