const PlanModel = require('../models/planModel');
const PlanDTO = require('../dtos/planDTO');

class PlanController {
  // Get all plans for the Pricing Page
  static async getAllPlans(req, res) {
    try {
      const rows = await PlanModel.findAll();
      // Map rows through DTO for consistent frontend formatting
      const plans = rows.map(row => new PlanDTO(row));
      res.status(200).json({ success: true, data: plans });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching plans", error: error.message });
    }
  }

  // Admin: Create a new plan
  static async createPlan(req, res) {
    const { name, course_limit, price, features, is_recommended } = req.body;

    // Validate using your DTO logic
    if (!PlanDTO.isValid(req.body)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid plan data. Ensure price is between $5 and $50." 
      });
    }

    try {
      // Check if a plan with this name already exists
      const existing = await PlanModel.findByName(name);
      if (existing) {
        return res.status(400).json({ success: false, message: "A plan with this name already exists." });
      }

      await PlanModel.create({
        name,
        course_limit,
        price,
        features: JSON.stringify(features || []), // Store array as JSON string in MySQL
        is_recommended: is_recommended ? 1 : 0
      });

      res.status(201).json({ success: true, message: "Plan created successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Database error", error: error.message });
    }
  }
}

module.exports = PlanController;