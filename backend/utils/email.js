const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Verify transporter configuration
transporter.verify((error, success) => {
    if (error) {
        console.log('❌ Email configuration error:', error.message);
    } else {
        console.log('✅ Email server is ready');
    }
});

// Send booking confirmation email
const sendBookingConfirmation = async (booking) => {
    const mailOptions = {
        from: `"A Z ENTERPRISES" <${process.env.SMTP_USER}>`,
        to: booking.email,
        subject: 'Booking Confirmation - A Z ENTERPRISES Solar Installation',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .details table { width: 100%; }
          .details td { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .highlight { color: #16a34a; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>A Z ENTERPRISES</h1>
            <p>Authorized Solar Distributors / Installation</p>
          </div>
          <div class="content">
            <h2>Thank You for Your Booking!</h2>
            <p>Dear <strong>${booking.name}</strong>,</p>
            <p>We have received your solar installation site survey booking. Our team will contact you shortly to confirm the appointment.</p>
            
            <div class="details">
              <h3>Booking Details</h3>
              <table>
                <tr>
                  <td><strong>Name:</strong></td>
                  <td>${booking.name}</td>
                </tr>
                <tr>
                  <td><strong>Phone:</strong></td>
                  <td>${booking.phone}</td>
                </tr>
                <tr>
                  <td><strong>Address:</strong></td>
                  <td>${booking.address}</td>
                </tr>
                <tr>
                  <td><strong>Solar Requirement:</strong></td>
                  <td class="highlight">${booking.requirement}</td>
                </tr>
                <tr>
                  <td><strong>Preferred Date:</strong></td>
                  <td>${new Date(booking.preferred_date).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                <tr>
                  <td><strong>Status:</strong></td>
                  <td><span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px;">Pending</span></td>
                </tr>
              </table>
            </div>
            
            <p><strong>What's Next?</strong></p>
            <ul>
              <li>Our team will review your documents</li>
              <li>You will receive a confirmation call within 24 hours</li>
              <li>Site survey will be scheduled as per your convenience</li>
            </ul>
            
            <p>For any queries, contact us at:</p>
            <p>📞 <strong>7006031785 / 6006780785</strong></p>
          </div>
          <div class="footer">
            <p>A Z ENTERPRISES</p>
            <p>BY-PASS ROAD, HANDWARA – 193221</p>
            <p>GSTIN: 01ACMFA6519J1ZF</p>
          </div>
        </div>
      </body>
      </html>
    `
    };

    return transporter.sendMail(mailOptions);
};

// Send status update email
const sendStatusUpdate = async (booking, newStatus) => {
    const statusMessages = {
        confirmed: {
            subject: '✅ Booking Confirmed - A Z ENTERPRISES',
            message: 'Your site survey booking has been confirmed! Our team will visit on the scheduled date.',
            color: '#16a34a'
        },
        completed: {
            subject: '🎉 Service Completed - A Z ENTERPRISES',
            message: 'Your solar installation has been completed successfully. Thank you for choosing us!',
            color: '#2563eb'
        },
        cancelled: {
            subject: '❌ Booking Cancelled - A Z ENTERPRISES',
            message: 'Your booking has been cancelled. If you have any questions, please contact us.',
            color: '#dc2626'
        }
    };

    const statusInfo = statusMessages[newStatus];
    if (!statusInfo) return;

    const mailOptions = {
        from: `"A Z ENTERPRISES" <${process.env.SMTP_USER}>`,
        to: booking.email,
        subject: statusInfo.subject,
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
          .status-box { background: ${statusInfo.color}; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>A Z ENTERPRISES</h1>
            <p>Authorized Solar Distributors / Installation</p>
          </div>
          <div class="content">
            <h2>Booking Status Update</h2>
            <p>Dear <strong>${booking.name}</strong>,</p>
            
            <div class="status-box">
              <h3 style="margin: 0;">Status: ${newStatus.toUpperCase()}</h3>
              <p style="margin: 10px 0 0 0;">${statusInfo.message}</p>
            </div>
            
            <p>For any queries, contact us at:</p>
            <p>📞 <strong>7006031785 / 6006780785</strong></p>
          </div>
          <div class="footer">
            <p>A Z ENTERPRISES</p>
            <p>BY-PASS ROAD, HANDWARA – 193221</p>
          </div>
        </div>
      </body>
      </html>
    `
    };

    return transporter.sendMail(mailOptions);
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    const mailOptions = {
        from: `"A Z ENTERPRISES Admin" <${process.env.SMTP_USER}>`,
        to: email,
        subject: 'Your OTP for Admin Login - A Z ENTERPRISES',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #16a34a, #22c55e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; text-align: center; }
          .otp-box { background: #16a34a; color: white; font-size: 32px; font-weight: bold; padding: 20px 40px; border-radius: 10px; display: inline-block; letter-spacing: 8px; margin: 20px 0; }
          .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>A Z ENTERPRISES</h1>
            <p>Admin Panel</p>
          </div>
          <div class="content">
            <h2>Your One-Time Password</h2>
            <p>Use the following OTP to complete your login:</p>
            <div class="otp-box">${otp}</div>
            <p>This OTP is valid for <strong>10 minutes</strong>.</p>
            <p style="color: #dc2626;">⚠️ Do not share this OTP with anyone.</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
    };

    return transporter.sendMail(mailOptions);
};

module.exports = {
    sendBookingConfirmation,
    sendStatusUpdate,
    sendOTPEmail
};
