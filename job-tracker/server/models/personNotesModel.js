import { pool } from '../config/db.js';

export const addNote = async (personId, note) => {
  const result = await pool.query(
    'INSERT INTO person_notes (person_id, note) VALUES ($1, $2) RETURNING *',
    [personId, note]
  );
  return result.rows[0];
};

export const getPersonNotes = async (personId) => {
  const result = await pool.query(
    'SELECT * FROM person_notes WHERE person_id = $1 ORDER BY created_at ASC',
    [personId]
  );
  return result.rows;
};

export const deleteNote = async (noteId) => {
  const result = await pool.query(
    'DELETE FROM person_notes WHERE id = $1 RETURNING *',
    [noteId]
  );
  return result.rows[0];
};
