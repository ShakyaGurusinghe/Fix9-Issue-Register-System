const { Router } = require('express');
const { body } = require('express-validator');
const { signup, signin } = require('../controllers/authController');

const router = Router();

// POST /api/auth/signup
router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required.'),
  body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
], signup);

// POST /api/auth/signin
router.post('/signin', [
  body('email').isEmail().withMessage('Valid email is required.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
], signin);

module.exports = router;
