const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/select-plan', protect, UserController.updateUserPlan);
router.post('/select-course', protect, UserController.selectCourse);
router.patch('/complete-course', protect, UserController.completeCourse);

module.exports = router;