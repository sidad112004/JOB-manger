import { pool } from '../config/db.js';

export const createFollowup = async (personId, followupDate) => {
  const result = await pool.query(
    'INSERT INTO followups (person_id, followup_date) VALUES ($1, $2) RETURNING *',
    [personId, followupDate]
  );
  return result.rows[0];
};

export const getFollowupsByPerson = async (personId) => {
  const result = await pool.query(
    'SELECT * FROM followups WHERE person_id = $1 ORDER BY followup_date ASC',
    [personId]
  );
  return result.rows;
};

export const markFollowupComplete = async (followupId) => {
  const result = await pool.query(
    'UPDATE followups SET completed = true WHERE id = $1 RETURNING *',
    [followupId]
  );
  return result.rows[0];
};

export const getUpcomingFollowups = async (userId) => {
  const result = await pool.query(
    `SELECT 
      f.id, f.followup_date, f.completed,
      p.id as person_id, p.name as person_name,
      c.id as company_id, c.name as company_name
     FROM followups f
     JOIN people p ON f.person_id = p.id
     JOIN companies c ON p.company_id = c.id
     WHERE c.user_id = $1 
       AND f.completed = false
       AND f.followup_date >= CURRENT_DATE
     ORDER BY f.followup_date ASC`,
    [userId]
  );
  return result.rows;
};
