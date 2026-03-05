const pool = require('../config/db');

// ─── GET /api/user/profile ────────────────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT userid, name, email, image, created_at FROM users WHERE userid = ?',
      [req.user.userid]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user: rows[0] });
  } catch (err) {
    console.error('getProfile error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ─── PUT /api/user/profile ────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  const { name, profile_photo } = req.body;

  if (!name && !profile_photo) {
    return res.status(400).json({ error: 'Nothing to update.' });
  }

  try {
    const fields = [];
    const values = [];

    if (name) {
      fields.push('name = ?');
      values.push(name.trim());
    }
    if (profile_photo !== undefined) {
      fields.push('image = ?');
      values.push(profile_photo);
    }

    values.push(req.user.userid);
    await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE userid = ?`,
      values
    );

    // Return updated user
    const [rows] = await pool.query(
      'SELECT userid, name, email, image FROM users WHERE userid = ?',
      [req.user.userid]
    );

    res.json({ message: 'Profile updated successfully.', user: rows[0] });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ─── DELETE /api/user/profile ─────────────────────────────────────────────────
const deleteAccount = async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE userid = ?', [req.user.userid]);
    res.json({ message: 'Account deleted successfully.' });
  } catch (err) {
    console.error('deleteAccount error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { getProfile, updateProfile, deleteAccount };
