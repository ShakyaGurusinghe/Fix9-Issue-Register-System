const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { getProjects, getProject, createProject, updateProject, deleteProject } = require('../controllers/projectController');

const router = Router();

// All project routes require a valid JWT
router.use(verifyToken);

// GET    /api/projects
router.get('/', getProjects);

// GET    /api/projects/:id
router.get('/:id', getProject);

// POST   /api/projects
router.post('/', createProject);

// PUT    /api/projects/:id
router.put('/:id', updateProject);

// DELETE /api/projects/:id
router.delete('/:id', deleteProject);

module.exports = router;
