const express = require("express");
const router = express.Router();
const multer = require("multer");
const twilio = require("twilio");

const pool = require("../config/database");
const { sendBookingConfirmation, sendStatusUpdate } = require("../utils/email");
const { authenticateToken } = require("../middleware/auth");
const { storage } = require("../config/cloudinary");

/* =========================================
   ✅ Safe Twilio Client Setup
========================================= */
let client = null;

if (
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN
) {
  client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
} else {
  console.log("⚠️ Twilio not configured. SMS will be skipped.");
}

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

      /* ✅ Send Confirmation Email */
      await sendBookingConfirmation(booking);

      console.log("TWILIO_PHONE:", process.env.TWILIO_PHONE);
console.log("ADMIN_PHONE:", process.env.ADMIN_PHONE);
console.log("TWILIO CLIENT:", client ? "READY" : "NOT READY");


      /* =========================================
         ✅ Send SMS Notification to Admin (Safe)
      ========================================= */
      if (client && process.env.TWILIO_PHONE && process.env.ADMIN_PHONE) {
        try {
          await client.messages.create({
            body: `📌 New Booking Received!\n\n👤 Name: ${booking.name}\n📞 Phone: ${booking.phone}\n⚡ Requirement: ${booking.requirement}\n📅 Date: ${booking.preferred_date}\n\nStatus: ${booking.status}`,
            from: process.env.TWILIO_PHONE,
            to: process.env.ADMIN_PHONE,
          });

          console.log("✅ SMS sent to Admin successfully");
        } catch (smsError) {
          console.log("⚠️ SMS failed but booking saved:", smsError.message);
        }
      } else {
        console.log("⚠️ SMS skipped (Twilio env missing)");
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

    /* ✅ Auto-delete if rejected */
    if (status === "rejected") {
      const bookingResult = await pool.query(
        "SELECT * FROM bookings WHERE id=$1",
        [id]
      );

      const bookingData = bookingResult.rows[0];

      if (!bookingData) {
        return res.status(404).json({ error: "Booking not found" });
      }

      await pool.query("DELETE FROM bookings WHERE id=$1", [id]);

      await sendStatusUpdate(bookingData, status);

      return res.json({
        message: "Booking rejected and deleted successfully ✅",
      });
    }

    /* ✅ Normal Status Update */
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
   ✅ DELETE: Delete Booking Manually
========================================= */
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🗑 Delete request received for booking:", id);

    const bookingResult = await pool.query(
      "SELECT * FROM bookings WHERE id=$1",
      [id]
    );

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    await pool.query("DELETE FROM bookings WHERE id=$1", [id]);

    res.json({ message: "Booking deleted successfully ✅" });
  } catch (error) {
    console.error("❌ Delete booking error:", error);
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

/* =========================================
   ✅ GET: Booking Document URL
========================================= */
router.get("/:id/documents/:docType", authenticateToken, async (req, res) => {
  try {
    const { id, docType } = req.params;

    const allowedDocs = {
      aadhar: "aadhar_file",
      electricityBill: "electricity_bill_file",
      bankPassbook: "bank_passbook_file",
    };

    if (!allowedDocs[docType]) {
      return res.status(400).json({ error: "Invalid document type" });
    }

    const result = await pool.query("SELECT * FROM bookings WHERE id=$1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = result.rows[0];
    const fileUrl = booking[allowedDocs[docType]];

    if (!fileUrl) {
      return res.status(404).json({ error: "Document not found" });
    }

    return res.json({ url: fileUrl });
  } catch (error) {
    console.error("❌ Document fetch error:", error);
    res.status(500).json({ error: "Failed to fetch document" });
  }
});

module.exports = router;
