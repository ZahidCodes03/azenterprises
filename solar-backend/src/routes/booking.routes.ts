import { Router } from "express";
import * as bookingController from "../controllers/booking.controller";
import { authMiddleware, adminMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/stats", bookingController.getBookingStats);
router.post("/", authMiddleware, bookingController.createBooking);
router.get("/", authMiddleware, adminMiddleware, bookingController.getAllBookings);
router.get("/:id", authMiddleware, bookingController.getBookingById);
router.put("/:id/status", authMiddleware, adminMiddleware, bookingController.updateBookingStatus);

export default router;
