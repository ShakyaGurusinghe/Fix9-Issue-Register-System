const pool = require('../config/db');

// ─── GET /api/issues ──────────────────────────────────────────────────────────
const getIssues = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT i.id, i.title, i.description, i.status, i.priority,
              i.project_id, p.name AS project_name, i.created_at
       FROM issues i
       LEFT JOIN projects p ON p.id = i.project_id
       WHERE i.userid = ?
       ORDER BY i.created_at DESC`,
      [req.user.userid]
    );
    res.json(rows);
  } catch (err) {
    console.error('getIssues error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ─── GET /api/issues/:id ──────────────────────────────────────────────────────
const getIssue = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT i.id, i.title, i.description, i.status, i.priority,
              i.project_id, p.name AS project_name, i.created_at
       FROM issues i
       LEFT JOIN projects p ON p.id = i.project_id
       WHERE i.id = ? AND i.userid = ?`,
      [req.params.id, req.user.userid]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Issue not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('getIssue error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ─── POST /api/issues ─────────────────────────────────────────────────────────
const createIssue = async (req, res) => {
  const { title, description, project_id, priority, status } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Issue title is required.' });
  }
  if (!project_id) {
    return res.status(400).json({ error: 'Project is required.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO issues (userid, project_id, title, description, priority, status) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.userid, project_id, title.trim(), description || '', priority || 'Medium', status || 'Open']
    );

    const [rows] = await pool.query(
      `SELECT i.id, i.title, i.description, i.status, i.priority,
              i.project_id, p.name AS project_name, i.created_at
       FROM issues i LEFT JOIN projects p ON p.id = i.project_id
       WHERE i.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ message: 'Issue created successfully.', issue: rows[0] });
  } catch (err) {
    console.error('createIssue error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ─── PUT /api/issues/:id ──────────────────────────────────────────────────────
const updateIssue = async (req, res) => {
  const { title, description, project_id, priority, status } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Issue title is required.' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM issues WHERE id = ? AND userid = ?',
      [req.params.id, req.user.userid]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Issue not found.' });
    }

    await pool.query(
      'UPDATE issues SET title = ?, description = ?, project_id = ?, priority = ?, status = ? WHERE id = ? AND userid = ?',
      [title.trim(), description || '', project_id || null, priority || 'Medium', status || 'Open', req.params.id, req.user.userid]
    );

    const [rows] = await pool.query(
      `SELECT i.id, i.title, i.description, i.status, i.priority,
              i.project_id, p.name AS project_name, i.created_at
       FROM issues i LEFT JOIN projects p ON p.id = i.project_id
       WHERE i.id = ?`,
      [req.params.id]
    );

    res.json({ message: 'Issue updated successfully.', issue: rows[0] });
  } catch (err) {
    console.error('updateIssue error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ─── DELETE /api/issues/:id ───────────────────────────────────────────────────
const deleteIssue = async (req, res) => {
  try {
    const [existing] = await pool.query(
      'SELECT id FROM issues WHERE id = ? AND userid = ?',
      [req.params.id, req.user.userid]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Issue not found.' });
    }
    await pool.query('DELETE FROM issues WHERE id = ? AND userid = ?', [req.params.id, req.user.userid]);
    res.json({ message: 'Issue deleted successfully.' });
  } catch (err) {
    console.error('deleteIssue error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { getIssues, getIssue, createIssue, updateIssue, deleteIssue };
