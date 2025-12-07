import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from '../src/routes/auth';
import orderRoutes from '../src/routes/orders';
import offerRoutes from '../src/routes/offers';
import matchRoutes from '../src/routes/matches';
import messageRoutes from '../src/routes/messages';
import userRoutes from '../src/routes/users';
import reviewRoutes from '../src/routes/reviews';

dotenv.config();

const app = express();

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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running', timestamp: new Date().toISOString() });
});

// Export for Vercel serverless
export default app;

