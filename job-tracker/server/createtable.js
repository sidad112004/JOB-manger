import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const createTables = async () => {
    try {
        console.log("Creating database tables...");

        await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

        /* USERS */
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        /* COMPANIES */
        await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        website TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        /* JOB APPLICATIONS */
        await pool.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        role TEXT NOT NULL,
        job_link TEXT,
        location TEXT,
        applied_date DATE,
        status TEXT DEFAULT 'Planning',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        /* PEOPLE (EMPLOYEES / REFERRALS) */
        await pool.query(`
      CREATE TABLE IF NOT EXISTS people (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        role TEXT,
        linkedin_url TEXT,
        email TEXT,
        phone TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        /* PERSON NOTES */
        await pool.query(`
      CREATE TABLE IF NOT EXISTS person_notes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        person_id UUID REFERENCES people(id) ON DELETE CASCADE,
        note TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        /* FOLLOW UPS */
        await pool.query(`
      CREATE TABLE IF NOT EXISTS followups (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        person_id UUID REFERENCES people(id) ON DELETE CASCADE,
        followup_date DATE NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        /* COMPANY NOTES */
        await pool.query(`
      CREATE TABLE IF NOT EXISTS company_notes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
        note TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        /* ACTIVITY LOG */
        await pool.query(`
      CREATE TABLE IF NOT EXISTS activities (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        action TEXT NOT NULL,
        entity_type TEXT,
        entity_id UUID,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        console.log("All tables created successfully.");

        process.exit();
    } catch (err) {
        console.error("Error creating tables:", err);
        process.exit(1);
    }
};

createTables();