const express = require("express");
const router = express.Router();
const pool = require("../config/database");

// ✅ Import Contact Email Sender
const { sendContactNotification } = require("../utils/email");

/* ============================================
   ✅ POST /api/contact - Submit Contact Form
============================================ */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // ✅ Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, email, and message are required",
      });
    }

    // ✅ Save in Database
    await pool.query(
      `INSERT INTO contact_submissions (name, email, phone, message)
       VALUES ($1, $2, $3, $4)`,
      [name, email, phone || "", message]
    );

    // ✅ Send Email Notification to Admin
    await sendContactNotification({
      name,
      email,
      phone,
      message,
    });

    // ✅ Response
    res.status(201).json({
      success: true,
      message: "Message sent successfully! We will contact you soon.",
    });
  } catch (error) {
    console.error("❌ Contact form error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
  }
});

module.exports = router;
