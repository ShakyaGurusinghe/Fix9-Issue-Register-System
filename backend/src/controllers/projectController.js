const pool = require('../config/db');

// ─── GET /api/projects ────────────────────────────────────────────────────────
const getProjects = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, description, image, created_at FROM projects WHERE userid = ? ORDER BY created_at DESC',
      [req.user.userid]
    );
    res.json(rows);
  } catch (err) {
    console.error('getProjects error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ─── GET /api/projects/:id ────────────────────────────────────────────────────
const getProject = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, description, image, created_at FROM projects WHERE id = ? AND userid = ?',
      [req.params.id, req.user.userid]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('getProject error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ─── POST /api/projects ───────────────────────────────────────────────────────
const createProject = async (req, res) => {
  const { name, description, image } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Project name is required.' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO projects (userid, name, description, image) VALUES (?, ?, ?, ?)',
      [req.user.userid, name.trim(), description || '', image || null]
    );

    const [rows] = await pool.query(
      'SELECT id, name, description, image, created_at FROM projects WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ message: 'Project created successfully.', project: rows[0] });
  } catch (err) {
    console.error('createProject error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ─── PUT /api/projects/:id ────────────────────────────────────────────────────
const updateProject = async (req, res) => {
  const { name, description, image } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Project name is required.' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT id FROM projects WHERE id = ? AND userid = ?',
      [req.params.id, req.user.userid]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    await pool.query(
      'UPDATE projects SET name = ?, description = ?, image = ? WHERE id = ? AND userid = ?',
      [name.trim(), description || '', image !== undefined ? image : null, req.params.id, req.user.userid]
    );

    const [rows] = await pool.query(
      'SELECT id, name, description, image, created_at FROM projects WHERE id = ?',
      [req.params.id]
    );

    res.json({ message: 'Project updated successfully.', project: rows[0] });
  } catch (err) {
    console.error('updateProject error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// ─── DELETE /api/projects/:id ─────────────────────────────────────────────────
const deleteProject = async (req, res) => {
  try {
    const [existing] = await pool.query(
      'SELECT id FROM projects WHERE id = ? AND userid = ?',
      [req.params.id, req.user.userid]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    await pool.query('DELETE FROM projects WHERE id = ? AND userid = ?', [req.params.id, req.user.userid]);
    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    console.error('deleteProject error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject };
