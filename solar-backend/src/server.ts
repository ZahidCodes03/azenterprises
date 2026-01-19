import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

// 🔹 Route imports (ONLY ONCE)
import authRoutes from "./routes/auth.routes";
import bookingRoutes from "./routes/booking.routes";
import calculatorRoutes from "./routes/calculator.routes";
import userRoutes from "./routes/user.routes";

// Load environment variables
dotenv.config();

// Create app FIRST
const app = express();
const PORT = process.env.PORT || 5000;

// 🔒 Security middleware
app.use(helmet());

// 🔥 CORS (CRITICAL)
app.use(cors({
  origin: ["https://azenterprises.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Handle preflight
app.options("*", cors());

// Body & cookies
app.use(express.json());
app.use(cookieParser());

// 🔽 ROUTES (AFTER middleware)
app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/calculator", calculatorRoutes);
app.use("/api/users", userRoutes);

// Health check (optional but useful)
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
