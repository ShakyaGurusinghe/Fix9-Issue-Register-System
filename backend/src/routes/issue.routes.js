const { Router } = require('express');
const { verifyToken } = require('../middleware/auth');
const { getIssues, getIssue, createIssue, updateIssue, deleteIssue } = require('../controllers/issueController');

const router = Router();

router.use(verifyToken);

router.get('/',     getIssues);
router.get('/:id',  getIssue);
router.post('/',    createIssue);
router.put('/:id',  updateIssue);
router.delete('/:id', deleteIssue);

module.exports = router;
