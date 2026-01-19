import { Router } from 'express';
import * as bookingController from '../controllers/booking.controller';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
    createBookingSchema,
    updateBookingStatusSchema,
    addAdminNoteSchema,
} from '../utils/validation.schemas';
import { bookingLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// Public routes
router.post(
    '/',
    bookingLimiter,
    validate(createBookingSchema),
    bookingController.createBooking
);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, bookingController.getAllBookings);
router.get('/stats', authMiddleware, adminMiddleware, bookingController.getBookingStats);
router.get('/:id', authMiddleware, adminMiddleware, bookingController.getBookingById);
router.patch(
    '/:id/status',
    authMiddleware,
    adminMiddleware,
    validate(updateBookingStatusSchema),
    bookingController.updateBookingStatus
);
router.post(
    '/:id/notes',
    authMiddleware,
    adminMiddleware,
    validate(addAdminNoteSchema),
    bookingController.addAdminNote
);

export default router;
