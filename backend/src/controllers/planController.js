const PlanModel = require('../models/planModel');
const PlanDTO = require('../dtos/planDTO');
const bcrypt = require('bcryptjs');
const promisePool = require('../config/db'); // DOUBLE CHECK THIS PATH

class PlanController {
  static async getAllPlans(req, res) {
    try {
      const rows = await PlanModel.findAll();
      const plans = rows.map(row => new PlanDTO(row));
      res.status(200).json({ success: true, data: plans });
    } catch (error) {
      res.status(500).json({ success: false, message: "Error fetching plans", error: error.message });
    }
  }

  static async createPlan(req, res) {
    if (!PlanDTO.isValid(req.body)) {
      return res.status(400).json({ success: false, message: "Invalid plan data." });
    }
    try {
      const { name, course_limit, price, features, is_recommended } = req.body;
      const existing = await PlanModel.findByName(name);
      if (existing) return res.status(400).json({ success: false, message: "Plan already exists." });

      await PlanModel.create({
        name,
        course_limit: parseInt(course_limit),
        price: parseFloat(price),
        features: JSON.stringify(features || []),
        is_recommended: is_recommended ? 1 : 0
      });
      res.status(201).json({ success: true, message: "Plan created successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Database error", error: error.message });
    }
  }

  static async updatePlan(req, res) {
    const { id } = req.params; 
    const { name, course_limit, price, features, is_recommended } = req.body;

    try {
      await PlanModel.update(id, {
        name,
        course_limit: parseInt(course_limit),
        price: parseFloat(price),
        features: JSON.stringify(features || []),
        is_recommended: is_recommended ? 1 : 0
      });

      res.status(200).json({ success: true, message: "Plan updated successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Update failed", error: error.message });
    }
  }

static async deletePlan(req, res) {
  try {
    // This MUST match the name in your route :planId
    const id = req.params.planId; 
    
    // Ensure you are targeting the correct table name: pricing_plans
    const [result] = await promisePool.query(
      'DELETE FROM pricing_plans WHERE id = ?', 
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Plan not found in database." });
    }

    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
}

module.exports = PlanController;