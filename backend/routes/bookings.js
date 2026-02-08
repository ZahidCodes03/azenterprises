const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { cloudinary } = require('../config/cloudinary');
const pool = require('../config/database');
const { sendBookingConfirmation, sendStatusUpdate } = require('../utils/email');
const { authenticateToken } = require('../middleware/auth');

const { storage } = require('../config/cloudinary');

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/bookings - Create new booking
router.post('/', upload.fields([
    { name: 'aadhar', maxCount: 1 },
    { name: 'electricityBill', maxCount: 1 },
    { name: 'bankPassbook', maxCount: 1 }
]), async (req, res) => {
    try {
        const { name, phone, email, address, requirement, preferredDate } = req.body;

        // Validate required fields
        if (!name || !phone || !email || !address || !requirement || !preferredDate) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Validate files
        if (!req.files || !req.files.aadhar || !req.files.electricityBill || !req.files.bankPassbook) {
            return res.status(400).json({ error: 'All documents are required (Aadhar, Electricity Bill, Bank Passbook)' });
        }

        // Get file paths (Cloudinary returns path in file object)
        const aadharFile = req.files.aadhar[0].path;
        const electricityBillFile = req.files.electricityBill[0].path;
        const bankPassbookFile = req.files.bankPassbook[0].path;

        // Insert booking into database
        const result = await pool.query(
            `INSERT INTO bookings (name, phone, email, address, requirement, preferred_date, aadhar_file, electricity_bill_file, bank_passbook_file)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
            [name, phone, email, address, requirement, preferredDate, aadharFile, electricityBillFile, bankPassbookFile]
        );

        const booking = result.rows[0];

        // Send confirmation email
        try {
            await sendBookingConfirmation(booking);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Continue even if email fails
        }

        res.status(201).json({
            message: 'Booking submitted successfully! You will receive a confirmation email shortly.',
            booking: {
                id: booking.id,
                name: booking.name,
                requirement: booking.requirement,
                preferredDate: booking.preferred_date,
                status: booking.status
            }
        });
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ error: 'Failed to submit booking' });
    }
});

// GET /api/bookings - Get all bookings (Admin only)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { status, search } = req.query;

        let query = 'SELECT * FROM bookings';
        const params = [];
        const conditions = [];

        if (status && status !== 'all') {
            params.push(status);
            conditions.push(`status = $${params.length}`);
        }

        if (search) {
            params.push(`%${search}%`);
            conditions.push(`(name ILIKE $${params.length} OR phone ILIKE $${params.length} OR email ILIKE $${params.length})`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        console.error('Get bookings error:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// GET /api/bookings/:id - Get single booking (Admin only)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get booking error:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});

// PUT /api/bookings/:id/status - Update booking status (Admin only)
router.put('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        // Get booking before update
        const bookingResult = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
        if (bookingResult.rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const booking = bookingResult.rows[0];

        // If status is 'rejected', delete the booking and associated files
        if (status === 'rejected') {
            // Delete files
            const uploadDir = path.join(__dirname, '../uploads');
            const filesToDelete = [booking.aadhar_file, booking.electricity_bill_file, booking.bank_passbook_file];

            filesToDelete.forEach(file => {
                if (file) {
                    // Check if it's a local file
                    const filePath = path.join(uploadDir, file);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                    // TODO: Add Cloudinary deletion logic if needed using cloudinary.uploader.destroy
                    // For now, we just leave the file in Cloudinary or rely on local check
                }
            });

            // Delete booking from database
            await pool.query('DELETE FROM bookings WHERE id = $1', [id]);

            return res.json({ message: 'Booking rejected and deleted successfully' });
        }

        // Update status
        const result = await pool.query(
            'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
            [status, id]
        );

        const updatedBooking = result.rows[0];

        // Send status update email (except for rejected)
        try {
            await sendStatusUpdate(updatedBooking, status);
        } catch (emailError) {
            console.error('Status email failed:', emailError);
        }

        res.json({
            message: `Booking status updated to ${status}`,
            booking: updatedBooking
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// GET /api/bookings/:id/documents/:type - Get document file (Admin only)
router.get('/:id/documents/:type', authenticateToken, async (req, res) => {
    try {
        const { id, type } = req.params;

        const result = await pool.query('SELECT * FROM bookings WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            console.log('Booking not found');
            return res.status(404).json({ error: 'Booking not found' });
        }

        const booking = result.rows[0];
        let filename;

        switch (type) {
            case 'aadhar':
                filename = booking.aadhar_file;
                break;
            case 'electricity':
                filename = booking.electricity_bill_file;
                break;
            case 'passbook':
                filename = booking.bank_passbook_file;
                break;
            default:
                console.log('Invalid document type requested');
                return res.status(400).json({ error: 'Invalid document type' });
        }

        if (!filename) {
            console.log('Filename is null in database');
            return res.status(404).json({ error: 'Document not found' });
        }

        const filePath = path.join(__dirname, '../uploads', filename);
        console.log(`Looking for file at: ${filePath}`);

        if (!fs.existsSync(filePath)) {
            console.log('File does not exist on disk');
            return res.status(404).json({ error: 'Document file not found' });
        }

        console.log('File found, sending...');
        res.sendFile(filePath);
    } catch (error) {
        console.error('Get document error:', error);
        res.status(500).json({ error: 'Failed to fetch document' });
    }
});

module.exports = router;
