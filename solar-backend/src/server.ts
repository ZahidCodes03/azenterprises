import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import authRoutes from "./routes/auth.routes";
import bookingRoutes from "./routes/booking.routes";
import calculatorRoutes from "./routes/calculator.routes";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
app.set("trust proxy", 1);

const PORT = process.env.PORT || 5000;

// ✅ FIXED helmet
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

// ✅ FIXED cors
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://azenterprises.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  exposedHeaders: ["set-cookie"]
}));

// ✅ REQUIRED for preflight
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

// Root health
app.get("/", (_req, res) => {
  res.send("Backend is running 🚀");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/calculator", calculatorRoutes);
app.use("/api/users", userRoutes);

// API health
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
