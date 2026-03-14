import { pool } from './config/db.js';

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS people (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          role TEXT,
          linkedin_url TEXT,
          email TEXT,
          phone TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS person_notes (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          person_id UUID REFERENCES people(id) ON DELETE CASCADE,
          note TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS followups (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          person_id UUID REFERENCES people(id) ON DELETE CASCADE,
          followup_date DATE NOT NULL,
          completed BOOLEAN DEFAULT false
      );
    `);
    console.log('People, person_notes, and followups tables created successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error creating tables:', err.message);
    process.exit(1);
  }
};

createTables();
