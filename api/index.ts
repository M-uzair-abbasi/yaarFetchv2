// Vercel serverless function entry point
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
dotenv.config();

const app = express();

// Health check - Define FIRST before importing routes (routes import Prisma)
// This ensures health endpoint works even if DATABASE_URL is missing
app.get('/health', (req, res) => {
  try {
    res.json({ 
      status: 'ok', 
      message: 'Server is running', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: process.env.DATABASE_URL ? 'configured' : 'not configured'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      message: 'Server error', 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://yar-fetch-campus-deliver.vercel.app',
  'https://yar-fetch-campus-deliver-hbx79wqt2-uzairs-projects-31761ca9.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

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
app.use('/uploads', express.static(path.join(__dirname, '../backend/uploads')));

// Import routes AFTER health check - wrap in try-catch to handle missing DATABASE_URL
let routesLoaded = false;
try {
  if (process.env.DATABASE_URL) {
    const authRoutes = require('../backend/src/routes/auth').default;
    const orderRoutes = require('../backend/src/routes/orders').default;
    const offerRoutes = require('../backend/src/routes/offers').default;
    const matchRoutes = require('../backend/src/routes/matches').default;
    const messageRoutes = require('../backend/src/routes/messages').default;
    const userRoutes = require('../backend/src/routes/users').default;
    const reviewRoutes = require('../backend/src/routes/reviews').default;

    app.use('/auth', authRoutes);
    app.use('/users', userRoutes);
    app.use('/orders', orderRoutes);
    app.use('/offers', offerRoutes);
    app.use('/matches', matchRoutes);
    app.use('/messages', messageRoutes);
    app.use('/reviews', reviewRoutes);
    routesLoaded = true;
  } else {
    console.warn('DATABASE_URL not set - API routes disabled. Health check still works.');
  }
} catch (error) {
  console.error('Error loading routes (likely missing DATABASE_URL or Prisma not generated):', error);
  // Health endpoint will still work
}

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
