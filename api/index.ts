// Express server entry point for Railway
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import authRoutes from '../backend/src/routes/auth.js';
import orderRoutes from '../backend/src/routes/orders.js';
import offerRoutes from '../backend/src/routes/offers.js';
import matchRoutes from '../backend/src/routes/matches.js';
import messageRoutes from '../backend/src/routes/messages.js';
import userRoutes from '../backend/src/routes/users.js';
import reviewRoutes from '../backend/src/routes/reviews.js';

// ES Module shim: recreate __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables first
dotenv.config();

const app = express();

// Health check - Define FIRST and completely independent
// This ensures health endpoint works even if DATABASE_URL is missing or routes fail
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
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://yarfetchh.vercel.app",
    "https://yaar-fetchv2-eight.vercel.app",
    "https://yaar-fetchv2-production.vercel.app",
    "https://yaarfetchv2-production.up.railway.app"
  ],
  credentials: true
}));

// Handle OPTIONS requests explicitly for Express 5.x compatibility
// Use a middleware approach instead of app.options('*')
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin;
    const allowedOrigins = [
      "http://localhost:5173",
      "https://yarfetchh.vercel.app",
      "https://yaar-fetchv2-eight.vercel.app",
      "https://yaar-fetchv2-production.vercel.app",
      "https://yaarfetchv2-production.up.railway.app"
    ];
    if (!origin || 
        process.env.NODE_ENV === 'development' || 
        allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Max-Age', '86400');
      return res.sendStatus(200);
    } else {
      return res.status(403).json({ error: 'CORS policy: Origin not allowed' });
    }
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../backend/uploads')));

// Routes - Remove /api prefix since this is a standalone server
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/orders', orderRoutes);
app.use('/offers', offerRoutes);
app.use('/matches', matchRoutes);
app.use('/messages', messageRoutes);
app.use('/reviews', reviewRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start the server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
