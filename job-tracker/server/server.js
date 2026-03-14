import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB, pool } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import personRoutes from './routes/personRoutes.js';
import personNotesRoutes from './routes/personNotesRoutes.js';
import followupRoutes from './routes/followupRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import companyNotesRoutes from './routes/companyNotesRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

process.on('exit', (code) => {
  console.log(`Process gracefully exiting with code: ${code}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://reachlist.netlify.app",
  "chrome-extension://midmealkaoamekongnjfifkbdnmepifh"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("CORS not allowed"));
    }
  },
  credentials: true
}));

app.use(express.json());

// Connect to Database
connectDB();

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.get('/api/init', async (req, res) => {
  try {
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    res.json({ status: 'Table created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Authentication routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/people', personRoutes);
app.use('/api/person-notes', personNotesRoutes);
app.use('/api/followups', followupRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/company-notes', companyNotesRoutes);
app.use('/api/activities', activityRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
