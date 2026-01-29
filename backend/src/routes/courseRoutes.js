const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/courseController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public can see courses
router.get('/', CourseController.getAllCourses);
router.get('/:id', CourseController.getCourse);

// LOCK THE DOOR: Only Instructors or Admins can create courses
router.post('/create', protect, restrictTo('instructor', 'admin'), CourseController.createCourse);

module.exports = router;