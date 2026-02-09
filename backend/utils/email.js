const axios = require("axios");
require("dotenv").config();

/* =========================================
   ✅ Brevo Email API Sender (No SMTP Needed)
========================================= */

const sendEmailBrevo = async ({ to, subject, html }) => {
  try {
    console.log("📩 Sending email via Brevo API to:", to);

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "A Z ENTERPRISES",
          email: process.env.FROM_EMAIL,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent successfully via Brevo API!");
    return response.data;
  } catch (error) {
    console.error("❌ Brevo API Email Failed:", error.response?.data || error.message);
    return null;
  }
};

/* =========================================
   ✅ OTP Email
========================================= */
const sendOTPEmail = async (email, otp) => {
  return sendEmailBrevo({
    to: email,
    subject: "Your OTP for Admin Login - A Z ENTERPRISES",
    html: `
      <h2>Your Admin OTP Code</h2>
      <p>Use this OTP to login:</p>
      <h1 style="color:green;">${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });
};

/* =========================================
   ✅ Booking Confirmation Email
========================================= */
const sendBookingConfirmation = async (booking) => {
  return sendEmailBrevo({
    to: booking.email,
    subject: "Booking Confirmation - A Z ENTERPRISES",
    html: `
      <h2>Thank you for your booking, ${booking.name}!</h2>
      <p>Your booking request has been received.</p>
      <p><b>Requirement:</b> ${booking.requirement}</p>
    `,
  });
};

/* =========================================
   ✅ Status Update Email
========================================= */
const sendStatusUpdate = async (booking, newStatus) => {
  return sendEmailBrevo({
    to: booking.email,
    subject: `Booking Status Updated: ${newStatus}`,
    html: `
      <h2>Status Update</h2>
      <p>Hello ${booking.name},</p>
      <p>Your booking status is now: <b>${newStatus}</b></p>
    `,
  });
};

module.exports = {
  sendOTPEmail,
  sendBookingConfirmation,
  sendStatusUpdate,
};
