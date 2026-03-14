import { pool } from './config/db.js';

const createFinalTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_notes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        note TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('company_notes table created successfully');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        action TEXT NOT NULL,
        entity_type TEXT NOT NULL,
        entity_id UUID,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('activities table created successfully');

    process.exit(0);
  } catch (err) {
    console.error('Error creating final tables', err);
    process.exit(1);
  }
};

createFinalTables();
