import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/db-test', async (_req, res) => {
  try {
    const totalBookings = await prisma.booking.count();
    console.log('Total bookings:', totalBookings);

    res.json({ totalBookings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'DB error' });
  }
});

export default router;
