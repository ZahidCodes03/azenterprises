import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import authRoutes from './routes/auth.routes';
import bookingRoutes from './routes/booking.routes';
import calculatorRoutes from './routes/calculator.routes';
import userRoutes from './routes/user.routes';
import { apiLimiter } from './middleware/rateLimiter.middleware';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
    })
);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting (apply to all routes)
app.use(apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
    });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error',
    });
});

// Start server
app.listen(PORT, () => {
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║                                                       ║');
    console.log('║       🌞 A Z Enterprises Solar Platform API 🌞       ║');
    console.log('║                                                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📧 Email: ${process.env.EMAIL_USER || 'Not configured'}`);
    console.log('');
    console.log('Available routes:');
    console.log('  POST   /api/auth/login');
    console.log('  POST   /api/auth/logout');
    console.log('  GET    /api/auth/profile');
    console.log('  POST   /api/bookings');
    console.log('  GET    /api/bookings');
    console.log('  GET    /api/bookings/stats');
    console.log('  GET    /api/bookings/:id');
    console.log('  PATCH  /api/bookings/:id/status');
    console.log('  POST   /api/bookings/:id/notes');
    console.log('  POST   /api/calculator/estimate');
    console.log('  GET    /api/users');
    console.log('  GET    /api/users/:id');
    console.log('');
});

export default app;
