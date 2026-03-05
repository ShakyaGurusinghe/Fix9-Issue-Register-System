const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { name, email, password } = req.body;

  try {
    // Check duplicate email
    const [existing] = await pool.query(
      'SELECT userid FROM users WHERE email = ?', [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const user = {
      userid: result.insertId,
      name,
      email,
      image: null,
    };

    res.status(201).json({ message: 'Account created successfully.', user });
  } catch (err) {
    console.error('signup error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ─── POST /api/auth/signin ────────────────────────────────────────────────────
const signin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?', [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const payload = { userid: user.userid, name: user.name, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });

    res.json({
      token,
      user: {
        userid: user.userid,
        name:   user.name,
        email:  user.email,
        image:  user.image,
      },
    });
  } catch (err) {
    console.error('signin error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { signup, signin };
