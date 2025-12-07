// Vercel serverless function entry point
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
    "https://yaar-fetchv2-eight.vercel.app", // <--- Added this specific deployment URL
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

// Load routes - use createRequire to import CommonJS modules from ES module
// Wrap in try-catch to handle missing DATABASE_URL or Prisma errors
if (process.env.DATABASE_URL) {
  try {
    // Use createRequire for CommonJS compatibility
    // This allows importing CommonJS modules (backend routes) from ES module context
    const require = createRequire(import.meta.url);
    
    // Import routes - Vercel compiles TypeScript automatically
    // These will be compiled to CommonJS by backend's tsconfig
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
    
    console.log('API routes loaded successfully');
  } catch (error: any) {
    console.error('Error loading routes:', error?.message || error);
    console.error('Stack:', error?.stack);
    console.error('This is OK if Prisma client is not generated. Ensure build command runs: cd backend && npx prisma generate');
    // Health endpoint will still work
  }
} else {
  console.warn('DATABASE_URL not set - API routes disabled. Health check still works.');
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Export for Vercel serverless
export default app;
