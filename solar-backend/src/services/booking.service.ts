import { prisma } from '../prisma';

export const createBooking = async (data: any) => {
  return prisma.booking.create({
    data
  });
};
