import { Router } from "express";
import * as bookingController from "../controllers/booking.controller";

const router = Router();

router.get("/", bookingController.getAllBookings);
router.get("/:id", bookingController.getBookingById);
router.put("/:id/status", bookingController.updateBookingStatus);
router.get("/stats/all", bookingController.getBookingStats);

export default router;
