
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import diwaliRoutes from './routes/diwaliRoutes.js';
import vplRoutes from './routes/vplRoutes.js';
import cricketRoutes from './routes/cricketRoutes.js';
import villageImprovementRoutes from './routes/villageImprovementRoutes.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================
// LEGACY LOCAL UPLOADS
// Keep these routes for older image records.
// Do not delete old upload folders.
// ======================================

app.use(
  '/uploads/diwali',
  express.static(path.join(__dirname, 'uploads', 'diwali'))
);

app.use(
  '/uploads/vpl',
  express.static(path.join(__dirname, 'uploads', 'vpl'))
);

app.use(
  '/uploads/cricket',
  express.static(path.join(__dirname, 'uploads', 'cricket'))
);

// ======================================
// HOME AND HEALTH CHECK ROUTES
// ======================================

app.get('/', (req, res) => {
  res.send("Welcome to VADGAON HERO'S Backend API!");
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "VADGAON HERO'S backend is running."
  });
});

// ======================================
// APPLICATION ROUTES
// ======================================

app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/diwali', diwaliRoutes);
app.use('/api/vpl', vplRoutes);
app.use('/api/cricket', cricketRoutes);

// Village Improvement
app.use('/api/village-improvements', villageImprovementRoutes);

// ======================================
// GLOBAL ERROR HANDLER
// ======================================

app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  if (err instanceof Error && err.name === 'MulterError') {
    let message = err.message;

    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Uploaded file exceeds the allowed size limit.';
    }

    if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files uploaded.';
    }

    return res.status(400).json({
      success: false,
      message
    });
  }

  if (
    err.message?.includes('Only JPG') ||
    err.message?.includes('Only PNG') ||
    err.message?.includes('Only JPG, PNG')
  ) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error.'
  });
});

// ======================================
// DATABASE CONNECTION AND SERVER START
// ======================================

const PORT = process.env.PORT || 7000;

const MONGO_URI =
  process.env.MONGO_URI ||
  'mongodb://127.0.0.1:27017/vadgaon_heros';

try {
  await mongoose.connect(MONGO_URI);

  console.log('DB is connected Successfully');

  app.listen(PORT, () => {
    console.log(`Server is running on Port:${PORT}`);
  });

} catch (error) {
  console.error('MongoDB connection failed:', error.message);
  process.exit(1);
}
