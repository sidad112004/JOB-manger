import { pool } from '../config/db.js';

export const addCompanyNote = async (companyId, note) => {
  const result = await pool.query(
    'INSERT INTO company_notes (company_id, note) VALUES ($1, $2) RETURNING *',
    [companyId, note]
  );
  return result.rows[0];
};

export const getCompanyNotes = async (companyId) => {
  const result = await pool.query(
    'SELECT * FROM company_notes WHERE company_id = $1 ORDER BY created_at DESC',
    [companyId]
  );
  return result.rows;
};

export const deleteCompanyNote = async (noteId) => {
  const result = await pool.query(
    'DELETE FROM company_notes WHERE id = $1 RETURNING *',
    [noteId]
  );
  return result.rows[0];
};
