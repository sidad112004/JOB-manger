import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Check if email already exists
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Store user in database
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    );

    // 4. Return success message
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // 3. Generate JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 4. Return token
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }
    if (new_password.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // Fetch current hashed password
    const result = await pool.query('SELECT password FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Verify current password
    const isMatch = await bcrypt.compare(current_password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash and save new password
    const hashed = await bcrypt.hash(new_password, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, userId]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error changing password' });
  }
};


export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete all user data in correct order (foreign keys)
    await pool.query('DELETE FROM followups      WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM person_notes   WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM company_notes  WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM activities     WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM jobs           WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM people         WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM companies      WHERE user_id = $1', [userId]);
    await pool.query('DELETE FROM users          WHERE id      = $1', [userId]);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting account' });
  }
};
