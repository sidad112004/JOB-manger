import { pool } from '../config/db.js';

export const createPerson = async (companyId, userId, name, role, linkedinUrl, email, phone) => {
  const result = await pool.query(
    `INSERT INTO people (company_id, user_id, name, role, linkedin_url, email, phone) 
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [companyId, userId, name, role, linkedinUrl, email, phone]
  );
  return result.rows[0];
};

export const getCompanyPeople = async (companyId, userId) => {
  const result = await pool.query(
    'SELECT * FROM people WHERE company_id = $1 AND user_id = $2 ORDER BY created_at DESC',
    [companyId, userId]
  );
  return result.rows;
};

export const deletePerson = async (personId, userId) => {
  const result = await pool.query(
    'DELETE FROM people WHERE id = $1 AND user_id = $2 RETURNING *',
    [personId, userId]
  );
  return result.rows[0];
};

export const getPersonById = async (personId, userId) => {
  const result = await pool.query(
    'SELECT * FROM people WHERE id = $1 AND user_id = $2',
    [personId, userId]
  );
  return result.rows[0];
};
