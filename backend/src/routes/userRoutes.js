const express = require('express');
const router = express.Router();

const UserController = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.put('/update-plan', protect, UserController.updateUserPlan);

router.post('/select-course', protect, UserController.selectCourse);

router.get('/my-enrollments', protect, UserController.getMyEnrollments);

router.post('/complete-course', protect, UserController.completeCourse);

router.get("/instructors", UserController.getInstructors);


module.exports = router;
