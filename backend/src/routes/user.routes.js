const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { getProfile, updateProfile, deleteAccount } = require('../controllers/userController');

const router = Router();

// All user routes require a valid JWT
router.use(verifyToken);

// GET    /api/user/profile
router.get('/profile', getProfile);

// PUT    /api/user/profile
router.put('/profile', updateProfile);

// DELETE /api/user/profile
router.delete('/profile', deleteAccount);

module.exports = router;
