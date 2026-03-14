import { pool } from '../config/db.js';

export const getDashboardStats = async (userId) => {
  const result = await pool.query(
    `SELECT 
      (SELECT COUNT(*) FROM companies WHERE user_id = $1) as total_companies,
      (SELECT COUNT(*) FROM jobs WHERE user_id = $1) as total_jobs,
      (SELECT COUNT(*) FROM jobs WHERE user_id = $1 AND status = 'Interview') as interviews,
      (SELECT COUNT(*) FROM jobs WHERE user_id = $1 AND status = 'Offer') as offers,
      (SELECT COUNT(*) FROM jobs WHERE user_id = $1 AND status = 'Rejected') as rejections`,
    [userId]
  );
  return result.rows[0];
};

export const getJobActivity = async (userId) => {
  const result = await pool.query(
    `SELECT applied_date as date, COUNT(*) as count 
     FROM jobs 
     WHERE user_id = $1 AND applied_date IS NOT NULL
     GROUP BY applied_date 
     ORDER BY applied_date ASC`,
    [userId]
  );
  return result.rows;
};
