const express = require('express');
const router = express.Router();
const pool = require('../config/database');

// POST /api/contact - Submit contact form
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        await pool.query(
            'INSERT INTO contact_submissions (name, email, phone, message) VALUES ($1, $2, $3, $4)',
            [name, email, phone, message]
        );

        res.status(201).json({ message: 'Thank you for your message! We will get back to you soon.' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Failed to submit message' });
    }
});

module.exports = router;
