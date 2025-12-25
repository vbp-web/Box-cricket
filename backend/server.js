import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import morganMiddleware from './middleware/logger.js';
import { logger } from './utils/logger.js';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars
dotenv.config();

// Force production mode on Render (Render sets RENDER environment variable)
if (process.env.RENDER || !process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
}

const app = express();

// Connect to database and auto-seed if needed
connectDB()
    .then(async () => {
        logger.info('Database connected successfully');

        // Auto-seed database if empty (only in production)
        if (process.env.NODE_ENV === 'production') {
            try {
                const { autoSeedIfEmpty } = await import('./utils/autoSeed.js');
                await autoSeedIfEmpty();
            } catch (error) {
                logger.error(`Auto-seed error: ${error.message}`);
            }
        }
    })
    .catch((error) => {
        logger.error(`Database connection failed: ${error.message}`);
        console.error('❌ Failed to connect to MongoDB. Please check MONGO_URI.');
    });

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    message: 'Too many requests from this IP, please try again later',
});

app.use('/api/', limiter);

// CORS - Allow all origins (frontend served from same domain in production)
app.use(cors({ credentials: true, origin: true }));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger
app.use(morganMiddleware);

// Import routes
import authRoutes from './routes/auth.js';
import turfRoutes from './routes/turf.js';
import slotRoutes from './routes/slot.js';
import bookingRoutes from './routes/booking.js';
import paymentRoutes from './routes/payment.js';
import adminRoutes from './routes/admin.js';

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/turfs', turfRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: "Shiva's Hub API is running",
        timestamp: new Date().toISOString(),
    });
});

// Serve static files from frontend build in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files
    app.use(express.static(path.join(__dirname, '../frontend/dist')));

    // Handle React routing - serve index.html for all non-API routes
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
    });
} else {
    // 404 handler for development
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Route not found',
        });
    });
}

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Listen on all network interfaces (0.0.0.0) to allow phone access
const server = app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Network access enabled - use your IP address to connect from phone`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error(`Unhandled Rejection: ${err.message}`);
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});

export default app;
