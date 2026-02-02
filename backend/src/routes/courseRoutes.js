const express = require('express');
const router = express.Router();
const CourseController = require('../controllers/courseController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// ✅ PUBLIC first
router.get('/public', CourseController.getPublicCourses);
router.get('/public/:id', CourseController.getPublicCourseById);

// ✅ Protected after
router.get('/', protect, restrictTo('instructor', 'admin'), CourseController.getDashboardCourses);
router.get('/:id', protect, restrictTo('instructor', 'admin'), CourseController.getCourse);

router.post('/create', protect, restrictTo('instructor', 'admin'), CourseController.createCourse);
router.put('/:id', protect, restrictTo('instructor', 'admin'), CourseController.updateCourse);

router.put('/:id/instructor', protect, restrictTo('admin'), CourseController.updateCourseInstructor);
router.delete('/:id', protect, restrictTo('instructor', 'admin'), CourseController.deleteCourse);

module.exports = router;
