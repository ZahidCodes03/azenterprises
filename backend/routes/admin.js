const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const { sendOTPEmail } = require("../utils/email");
const { authenticateToken } = require("../middleware/auth");

/* ================================
   Generate 6-digit OTP
================================ */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/* ================================
   POST /api/admin/login
   Step 1: Email + Password → Send OTP
================================ */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // Find admin user
    const result = await pool.query(
      "SELECT * FROM admin_users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const admin = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Update last login
    await pool.query(
      "UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1",
      [admin.id]
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to process login" });
  }
});

/* ================================
   GET /api/admin/verify
   Verify JWT token
================================ */
router.get("/verify", authenticateToken, (req, res) => {
  res.json({
    valid: true,
    admin: req.user,
  });
});

/* ================================
   POST /api/admin/create
   Create admin user (ONLY ONCE)
================================ */
router.post("/create", async (req, res) => {
  try {
    const { email, password, setupKey } = req.body;

    // ✅ Setup Key Required
    if (!setupKey) {
      return res.status(400).json({
        error: "Setup key is required",
      });
    }

    // ✅ Check Setup Key from ENV (Render Variable)
    if (setupKey !== process.env.ADMIN_SETUP_KEY) {
      return res.status(403).json({
        error: "Invalid setup key",
      });
    }

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    // ✅ Prevent multiple admins (optional security)
    const existingAdmin = await pool.query(
      "SELECT id FROM admin_users LIMIT 1"
    );

    if (existingAdmin.rows.length > 0) {
      return res.status(409).json({
        error: "Admin already exists. Creation disabled.",
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert admin
    const result = await pool.query(
      "INSERT INTO admin_users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
      [email, passwordHash]
    );

    res.status(201).json({
      message: "Admin created successfully",
      admin: result.rows[0],
    });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ error: "Failed to create admin" });
  }
});

module.exports = router;
