const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/select-plan', protect, UserController.updateUserPlan);
router.post('/select-course', protect, UserController.selectCourse);

module.exports = router;