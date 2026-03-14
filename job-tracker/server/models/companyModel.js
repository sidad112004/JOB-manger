import { pool } from '../config/db.js';

export const createCompany = async (userId, name, website, notes) => {
  const result = await pool.query(
    'INSERT INTO companies (user_id, name, website, notes) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, name, website, notes]
  );
  return result.rows[0];
};

export const getUserCompanies = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM companies WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
};

export const getCompanyById = async (companyId, userId) => {
  const result = await pool.query(
    'SELECT * FROM companies WHERE id = $1 AND user_id = $2',
    [companyId, userId]
  );
  return result.rows[0];
};

export const deleteCompany = async (companyId, userId) => {
  const result = await pool.query(
    'DELETE FROM companies WHERE id = $1 AND user_id = $2 RETURNING *',
    [companyId, userId]
  );
  return result.rows[0];
};
