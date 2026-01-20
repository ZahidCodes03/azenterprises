import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/db-test", async (_req, res) => {
  const count = await prisma.booking.count();
  res.json({ bookingsInDb: count });
});

export default router;
