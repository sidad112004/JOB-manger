import { pool } from '../config/db.js';

export const createJob = async (companyId, userId, role, jobLink, location, appliedDate, status, notes) => {
  const result = await pool.query(
    `INSERT INTO jobs (company_id, user_id, role, job_link, location, applied_date, status, notes) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [companyId, userId, role, jobLink, location, appliedDate, status, notes]
  );
  return result.rows[0];
};

export const getCompanyJobs = async (companyId, userId) => {
  const result = await pool.query(
    'SELECT * FROM jobs WHERE company_id = $1 AND user_id = $2 ORDER BY created_at DESC',
    [companyId, userId]
  );
  return result.rows;
};

export const updateJobStatus = async (jobId, userId, status) => {
  const result = await pool.query(
    'UPDATE jobs SET status = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
    [status, jobId, userId]
  );
  return result.rows[0];
};

export const deleteJob = async (jobId, userId) => {
  const result = await pool.query(
    'DELETE FROM jobs WHERE id = $1 AND user_id = $2 RETURNING *',
    [jobId, userId]
  );
  return result.rows[0];
};

export const getJobById = async (jobId, userId) => {
  const result = await pool.query(
    'SELECT * FROM jobs WHERE id = $1 AND user_id = $2',
    [jobId, userId]
  );
  return result.rows[0];
};
