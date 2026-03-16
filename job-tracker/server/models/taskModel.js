import { pool } from '../config/db.js';

// Create tasks table (run this once or add to your migration)
// CREATE TABLE IF NOT EXISTS tasks (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
//   title TEXT NOT NULL,
//   due_date DATE,
//   priority VARCHAR(10) DEFAULT 'Medium' CHECK (priority IN ('High','Medium','Low')),
//   category VARCHAR(20) DEFAULT 'Personal' CHECK (category IN ('Prep','Apply','Research','Personal')),
//   company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
//   completed BOOLEAN DEFAULT FALSE,
//   completed_at TIMESTAMPTZ,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );

export const createTask = async (userId, { title, due_date, priority, category, company_id }) => {
  const result = await pool.query(
    `INSERT INTO tasks (user_id, title, due_date, priority, category, company_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, title, due_date || null, priority || 'Medium', category || 'Personal', company_id || null]
  );
  return result.rows[0];
};

export const getUserTasks = async (userId) => {
  const result = await pool.query(
    `SELECT t.*, c.name as company_name
     FROM tasks t
     LEFT JOIN companies c ON t.company_id = c.id
     WHERE t.user_id = $1
     ORDER BY t.completed ASC, t.due_date ASC NULLS LAST, t.created_at DESC`,
    [userId]
  );
  return result.rows;
};

export const completeTask = async (taskId, userId) => {
  const result = await pool.query(
    `UPDATE tasks
     SET completed = TRUE, completed_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [taskId, userId]
  );
  return result.rows[0] || null;
};

export const deleteTask = async (taskId, userId) => {
  const result = await pool.query(
    `DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *`,
    [taskId, userId]
  );
  return result.rows[0] || null;
};

export const getUpcomingTasks = async (userId, limit = 5) => {
  const result = await pool.query(
    `SELECT t.*, c.name as company_name
     FROM tasks t
     LEFT JOIN companies c ON t.company_id = c.id
     WHERE t.user_id = $1 AND t.completed = FALSE
     ORDER BY t.due_date ASC NULLS LAST, t.priority DESC
     LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
};
