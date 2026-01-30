const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const PlanController = require('../controllers/planController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// GLOBAL PROTECTION: Only Admins enter here
router.use(protect);
router.use(restrictTo('admin'));

router.post('/create-teacher', AdminController.createTeacher);
router.get('/users', AdminController.getAllUsers); // Fetch list for the dashboard
router.patch('/edit-role', AdminController.editUserRole);
router.put('/edit-plan/:planId', AdminController.editPlan); 
router.get('/stats', AdminController.getDashboardStats);
router.patch('/rename-user', AdminController.renameUser);
router.delete('/delete-user/:userId', protect, restrictTo('admin'), AdminController.deleteUser);
module.exports = router;