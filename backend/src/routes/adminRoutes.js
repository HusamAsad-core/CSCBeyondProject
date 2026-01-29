const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware'); // Import your security

router.post('/create-teacher', protect, restrictTo('admin'), AdminController.createTeacher);

module.exports = router;