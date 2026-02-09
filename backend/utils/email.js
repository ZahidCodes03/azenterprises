const nodemailer = require("nodemailer");
require("dotenv").config();

/* =========================================
   ✅ SMTP Transporter (With Timeouts)
========================================= */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),

  // ✅ If you use port 465 → secure must be true
  secure: process.env.SMTP_PORT == "465",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  // ✅ Prevent infinite hanging
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

/* =========================================
   ❌ REMOVE transporter.verify() ON RENDER
   It causes connection timeout logs
========================================= */
// transporter.verify(...);  ❌ DELETE THIS COMPLETELY

/* =========================================
   ✅ Safe SendMail Wrapper
========================================= */
const safeSendMail = async (mailOptions) => {
  try {
    console.log("📩 Sending email to:", mailOptions.to);

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    throw error;
  }
};

/* =========================================
   ✅ Booking Confirmation Email
========================================= */
const sendBookingConfirmation = async (booking) => {
  const mailOptions = {
    from: `"A Z ENTERPRISES" <${process.env.SMTP_USER}>`,
    to: booking.email,
    subject: "Booking Confirmation - A Z ENTERPRISES",
    html: `
      <h2>Thank you for your booking, ${booking.name}!</h2>
      <p>Your booking request has been received.</p>
      <p><b>Requirement:</b> ${booking.requirement}</p>
      <p><b>Preferred Date:</b> ${booking.preferred_date}</p>
      <p>We will contact you soon.</p>
    `,
  };

  return safeSendMail(mailOptions);
};

/* =========================================
   ✅ Status Update Email
========================================= */
const sendStatusUpdate = async (booking, newStatus) => {
  const mailOptions = {
    from: `"A Z ENTERPRISES" <${process.env.SMTP_USER}>`,
    to: booking.email,
    subject: `Booking Status Updated: ${newStatus}`,
    html: `
      <h2>Status Update</h2>
      <p>Hello ${booking.name},</p>
      <p>Your booking status is now: <b>${newStatus}</b></p>
    `,
  };

  return safeSendMail(mailOptions);
};

/* =========================================
   ✅ OTP Email
========================================= */
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"A Z ENTERPRISES Admin" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your OTP for Admin Login - A Z ENTERPRISES",
    html: `
      <h2>Your Admin OTP Code</h2>
      <p>Use this OTP to login:</p>
      <h1 style="color:green;">${otp}</h1>
      <p>This OTP is valid for 10 minutes.</p>
      <p style="color:red;">Do not share it with anyone.</p>
    `,
  };

  return safeSendMail(mailOptions);
};

module.exports = {
  sendBookingConfirmation,
  sendStatusUpdate,
  sendOTPEmail,
};
