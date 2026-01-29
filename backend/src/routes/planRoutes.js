const express = require('express');
const router = express.Router();
const PlanController = require('../controllers/planController');
// const { isAdmin } = require('../middleware/authMiddleware'); // You'll need this later

router.get('/', PlanController.getAllPlans);
router.post('/', PlanController.createPlan); // Add isAdmin middleware here later

module.exports = router;