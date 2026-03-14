import { pool } from '../config/db.js';

export const logActivity = async (userId, action, entityType, entityId = null) => {
  try {
    const result = await pool.query(
      `INSERT INTO activities (user_id, action, entity_type, entity_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, action, entityType, entityId]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error logging activity', err);
    // Silent fail for activity logging so it doesn't break main flow
  }
};

export const getRecentActivities = async (userId, limit = 10) => {
  const result = await pool.query(
    `SELECT * FROM activities 
     WHERE user_id = $1 
     ORDER BY created_at DESC 
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
};
