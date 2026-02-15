const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// ✅ Import Routes
const adminRoutes = require("./routes/admin");
const bookingsRoutes = require("./routes/bookings");
const invoicesRoutes = require("./routes/invoices"); // ✅ Correct
const contactRoutes = require("./routes/contact");

const app = express();
const PORT = process.env.PORT || 5000;

/* ==========================================
   ✅ Middleware
========================================== */

// CORS Allowed Origins
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://azenterprise.netlify.app",
    ],
    credentials: true,
  })
);

// Allow Preflight Requests
app.options("*", cors());

// JSON Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Upload Folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ==========================================
   ✅ API Routes
========================================== */

app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingsRoutes);

// ✅ Invoice Route (Must Match Frontend)
app.use("/api/invoices", invoicesRoutes);
app.use("/api/contact", contactRoutes);

/* ==========================================
   ✅ Health Check
========================================== */

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

/* ==========================================
   ✅ Error Handler
========================================== */

app.use((err, req, res, next) => {
  console.error("Backend Error:", err);

  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ error: "File size too large. Maximum 5MB allowed." });
  }

  if (err.message && err.message.includes("Invalid file type")) {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({ error: "Internal server error" });
});

/* ==========================================
   ✅ Start Server
========================================== */

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║ 🌞 A Z ENTERPRISES Backend Running Successfully 🌞        ║
╠════════════════════════════════════════════════════════════╣
║ PORT: ${PORT}
║ API:  http://localhost:${PORT}/api
║ Invoice API: http://localhost:${PORT}/api/invoices
╚════════════════════════════════════════════════════════════╝
`);
});

module.exports = app;
