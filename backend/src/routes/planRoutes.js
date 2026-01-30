const express = require('express');
const router = express.Router();
const PlanController = require('../controllers/planController');
// Import your protection middlewares
const { protect, restrictTo } = require('../middleware/authMiddleware'); 

// Public: Anyone can see the plans
router.get('/', PlanController.getAllPlans);

// Protected: Only logged-in Admins can create plans
router.post('/create', protect, restrictTo('admin'), PlanController.createPlan); 

module.exports = router;