const express = require('express');
const router = express.Router();
const PlanController = require('../controllers/planController');
const { protect, restrictTo } = require('../middleware/authMiddleware'); 

router.get('/', PlanController.getAllPlans);

router.post('/create', protect, restrictTo('admin'), PlanController.createPlan); 
router.delete('/delete-plan/:planId', protect, restrictTo('admin'), PlanController.deletePlan); 

module.exports = router;