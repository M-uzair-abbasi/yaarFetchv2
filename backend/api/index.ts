import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables first
dotenv.config();

const app = express();

// Import routes
import authRoutes from '../src/routes/auth';
import orderRoutes from '../src/routes/orders';
import offerRoutes from '../src/routes/offers';
import matchRoutes from '../src/routes/matches';
import messageRoutes from '../src/routes/messages';
import userRoutes from '../src/routes/users';
import reviewRoutes from '../src/routes/reviews';

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
// Note: For production, consider using cloud storage (S3, Cloudinary) instead
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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

