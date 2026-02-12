const express = require("express");
const router = express.Router();
const multer = require("multer");
const twilio = require("twilio");

const pool = require("../config/database");
const { sendBookingConfirmation, sendStatusUpdate } = require("../utils/email");
const { authenticateToken } = require("../middleware/auth");
const { storage } = require("../config/cloudinary");

/* =========================================
   ✅ Twilio Client Setup (WhatsApp Only)
========================================= */
let client = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  console.log("✅ Twilio Client Ready for WhatsApp");
} else {
  console.log("⚠️ Twilio not configured. WhatsApp will not work.");
}

/* =========================================
   ✅ WhatsApp Sandbox Setup
========================================= */
const WHATSAPP_FROM = "whatsapp:+14155238886"; // Twilio Sandbox Number
const WHATSAPP_TO = `whatsapp:${process.env.ADMIN_PHONE}`; // Admin WhatsApp

/* =========================================
   ✅ Multer Upload Config
========================================= */
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* =========================================
   ✅ POST: Create New Booking
========================================= */
router.post(
  "/",
  upload.fields([
    { name: "aadhar", maxCount: 1 },
    { name: "electricityBill", maxCount: 1 },
    { name: "bankPassbook", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, phone, email, address, requirement, preferredDate } =
        req.body;

      /* ✅ Validate required fields */
      if (
        !name ||
        !phone ||
        !email ||
        !address ||
        !requirement ||
        !preferredDate
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }

      /* ✅ Validate documents */
      if (
        !req.files?.aadhar ||
        !req.files?.electricityBill ||
        !req.files?.bankPassbook
      ) {
        return res.status(400).json({
          error:
            "All documents are required (Aadhar, Electricity Bill, Bank Passbook)",
        });
      }

      /* ✅ Cloudinary File URLs */
      const aadharFile = req.files.aadhar[0].path;
      const electricityBillFile = req.files.electricityBill[0].path;
      const bankPassbookFile = req.files.bankPassbook[0].path;

      /* ✅ Insert Booking into Database */
      const result = await pool.query(
        `INSERT INTO bookings 
        (name, phone, email, address, requirement, preferred_date,
         aadhar_file, electricity_bill_file, bank_passbook_file, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         RETURNING *`,
        [
          name,
          phone,
          email,
          address,
          requirement,
          preferredDate,
          aadharFile,
          electricityBillFile,
          bankPassbookFile,
          "pending",
        ]
      );

      const booking = result.rows[0];

      console.log("✅ Booking Saved Successfully");

      /* ✅ Send Confirmation Email */
      await sendBookingConfirmation(booking);

      /* =========================================
         ✅ Send WhatsApp Notification to Admin
      ========================================= */
      if (client && process.env.ADMIN_PHONE) {
        try {
          await client.messages.create({
            body: `📌 New Booking Received!\n\n👤 Name: ${booking.name}\n📞 Phone: ${booking.phone}\n📧 Email: ${booking.email}\n⚡ Requirement: ${booking.requirement}\n📅 Date: ${booking.preferred_date}\n\nStatus: ${booking.status}\n\n✅ Please check Admin Panel.`,
            from: WHATSAPP_FROM,
            to: WHATSAPP_TO,
          });

          console.log("✅ WhatsApp Alert Sent to Admin Successfully");
        } catch (waError) {
          console.log("❌ WhatsApp Failed:", waError.message);
        }
      } else {
        console.log("⚠️ WhatsApp Skipped (Missing Admin Phone or Client)");
      }

      /* ✅ Response */
      res.status(201).json({
        message: "Booking submitted successfully!",
        booking,
      });
    } catch (error) {
      console.error("❌ Booking error:", error);
      res.status(500).json({ error: "Failed to submit booking" });
    }
  }
);

/* =========================================
   ✅ GET: All Bookings (Admin)
========================================= */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bookings ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Get bookings error:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

/* =========================================
   ✅ PUT: Update Booking Status
========================================= */
router.put("/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const status = req.body.status?.toLowerCase();

    console.log("✅ Status update:", id, status);

    const result = await pool.query(
      `UPDATE bookings 
       SET status=$1, updated_at=CURRENT_TIMESTAMP
       WHERE id=$2
       RETURNING *`,
      [status, id]
    );

    const updatedBooking = result.rows[0];

    await sendStatusUpdate(updatedBooking, status);

    res.json({
      message: "Booking status updated successfully ✅",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("❌ Update status error:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

/* =========================================
   ✅ DELETE: Delete Booking
========================================= */
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM bookings WHERE id=$1", [id]);

    res.json({ message: "Booking deleted successfully ✅" });
  } catch (error) {
    console.error("❌ Delete booking error:", error);
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

module.exports = router;
