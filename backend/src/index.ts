import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Relative imports
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/orders.js';
import offerRoutes from './routes/offers.js';
import matchRoutes from './routes/matches.js';
import messageRoutes from './routes/messages.js';
import userRoutes from './routes/users.js';
import reviewRoutes from './routes/reviews.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();

// 1. CORS - The only security guard we need
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://yarfetchh.vercel.app",
    "https://yaar-fetchv2-eight.vercel.app",
    "https://yaar-fetchv2-production.vercel.app",
    "https://yaarfetchv2-production.up.railway.app"
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// 2. Logging - To debug if requests reach the server
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Origin:', req.headers.origin);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 3. Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: process.env.DATABASE_URL ? 'connected' : 'missing' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);

// 4. Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
