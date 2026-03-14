import { pool } from '../config/db.js';

export const searchAll = async (userId, query) => {
  const searchTerm = `%${query}%`;
  
  // Search companies (by name)
  const companiesRes = await pool.query(
    `SELECT id, name, website, 'company' as type 
     FROM companies 
     WHERE user_id = $1 AND name ILIKE $2`,
    [userId, searchTerm]
  );

  // Search jobs (by role or company name)
  const jobsRes = await pool.query(
    `SELECT j.id, j.role, j.status, c.name as company_name, 'job' as type 
     FROM jobs j
     JOIN companies c ON j.company_id = c.id
     WHERE j.user_id = $1 AND (j.role ILIKE $2 OR c.name ILIKE $2)`,
    [userId, searchTerm]
  );

  // Search people (by name or role)
  const peopleRes = await pool.query(
    `SELECT p.id, p.name, p.role, c.name as company_name, 'person' as type 
     FROM people p
     JOIN companies c ON p.company_id = c.id
     WHERE p.user_id = $1 AND (p.name ILIKE $2 OR p.role ILIKE $2)`,
    [userId, searchTerm]
  );

  return {
    companies: companiesRes.rows,
    jobs: jobsRes.rows,
    people: peopleRes.rows
  };
};
