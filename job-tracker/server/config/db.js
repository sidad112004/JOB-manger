import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const connectDB = async () => {
  try {
    await pool.query('SELECT 1');
    console.log('PostgreSQL Connected');
  } catch (err) {
    console.log(err);
    console.error('Database connection error:', err.message);
  }
};

export { pool, connectDB };
