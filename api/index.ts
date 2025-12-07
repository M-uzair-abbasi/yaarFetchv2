// Vercel serverless function entry point
// This file must be at root/api/ for Vercel to detect it properly
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
dotenv.config();

const app = express();

// Import routes - adjust paths for root-level api folder
import authRoutes from '../backend/src/routes/auth';
import orderRoutes from '../backend/src/routes/orders';
import offerRoutes from '../backend/src/routes/offers';
import matchRoutes from '../backend/src/routes/matches';
import messageRoutes from '../backend/src/routes/messages';
import userRoutes from '../backend/src/routes/users';
import reviewRoutes from '../backend/src/routes/reviews';

// CORS configuration - must allow specific origins when using credentials
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://yar-fetch-campus-deliver.vercel.app',
  'https://yar-fetch-campus-deliver-hbx79wqt2-uzairs-projects-31761ca9.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all origins for easier testing
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, only allow specific origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
}));

// Explicitly handle OPTIONS requests (CORS preflight)
app.options('*', (req, res) => {
  const origin = req.headers.origin;
  
  // Check if origin is allowed
  if (!origin || 
      process.env.NODE_ENV === 'development' || 
      allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '86400'); // 24 hours
    res.sendStatus(200);
  } else {
    res.status(403).json({ error: 'CORS policy: Origin not allowed' });
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
// Note: For production, consider using cloud storage (S3, Cloudinary) instead
app.use('/uploads', express.static(path.join(__dirname, '../backend/uploads')));

// Routes - Remove /api prefix since Vercel routing already handles it
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/offers', offerRoutes);
app.use('/matches', matchRoutes);
app.use('/messages', messageRoutes);
app.use('/reviews', reviewRoutes);

// Health check - Simple endpoint that doesn't require database
app.get('/health', (req, res) => {
  try {
    res.json({ 
      status: 'ok', 
      message: 'Server is running', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Error handling middleware - must be after all routes
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Export for Vercel serverless
export default app;
