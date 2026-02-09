const nodemailer = require("nodemailer");
require("dotenv").config();

/* =========================================
   ✅ SMTP Transporter (Brevo + Render Safe)
========================================= */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp-relay.brevo.com",

  port: Number(process.env.SMTP_PORT) || 587,

  // ✅ Brevo uses secure = false for port 587
  secure: false,

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  // ✅ Prevent hanging forever on Render
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

/* =========================================
   ✅ Safe SendMail Wrapper
========================================= */
const safeSendMail = async (mailOptions) => {
  try {
    console.log("📩 Sending email to:", mailOptions.to);

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!");
    return info;
  } catch (error) {
    console.error("❌ Email send failed:", error.message);

    // ✅ Do not crash server
    return null;
  }
};

/* =========================================
   ✅ Booking Confirmation Email
========================================= */
const sendBookingConfirmation = async (booking) => {
  return safeSendMail({
    from: `"A Z ENTERPRISES" <${process.env.FROM_EMAIL}>`,
    to: booking.email,
    subject: "Booking Confirmation - A Z ENTERPRISES",
    html: `
      <h2>Thank you for your booking, ${booking.name}!</h2>
      <p>Your booking request has been received.</p>
      <p><b>Requirement:</b> ${booking.requirement}</p>
      <p><b>Preferred Date:</b> ${booking.preferred_date}</p>
      <p>We will contact you soon.</p>
    `,
  });
};

/* =========================================
   ✅ Status Update Email
========================================= */
const sendStatusUpdate = async (booking, newStatus) => {
  return safeSendMail({
    from: `"A Z ENTERPRISES" <${process.env.FROM_EMAIL}>`,
    to: booking.email,
    subject: `Booking Status Updated: ${newStatus}`,
    html: `
      <h2>Status Update</h2>
      <p>Hello ${booking.name},</p>
      <p>Your booking status is now: <b>${newStatus}</b></p>
    `,
  });
};

/* =========================================
   ✅ OTP Email
========================================= */
const sendOTPEmail = async (email, otp) => {
  return safeSendMail({
    from: `"A Z ENTERPRISES Admin" <${process.env.FROM_EMAIL}>`,
    to: email,
    subject: "Your OTP for Admin Login - A Z ENTERPRISES",
    html: `
      <h2>Your Admin OTP Code</h2>
      <p>Use this OTP to login:</p>
      <h1 style="color:green;">${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
      <p style="color:red;">Do not share it with anyone.</p>
    `,
  });
};

module.exports = {
  sendBookingConfirmation,
  sendStatusUpdate,
  sendOTPEmail,
};
