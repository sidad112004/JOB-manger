import { pool } from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const createTables = async () => {
  try {
    console.log('Connecting to database...');
    
    // Create company_notes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_notes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        note TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('company_notes table created successfully');

    // Create activities table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id UUID,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('activities table created successfully');

  } catch (err) {
    console.error('Error creating polish tables:', err);
  } finally {
    pool.end();
  }
};

createTables();
