const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// The route now requires a token
router.post('/select-plan', protect, UserController.updateUserPlan);

module.exports = router;