const db = require('../config/db');
const PlanDTO = require('../dtos/planDTO');

class PlanController {
  // Get all plans for the Pricing Page
  static async getAllPlans(req, res) {
    try {
      const [rows] = await db.execute('SELECT * FROM pricing_plans');
      const plans = rows.map(row => new PlanDTO(row));
      res.status(200).json(plans);
    } catch (error) {
      res.status(500).json({ message: "Error fetching plans", error });
    }
  }

  // Admin: Create a new plan
  static async createPlan(req, res) {
    const { title, course_limit, price, features, is_recommended } = req.body;

    if (!PlanDTO.isValid(req.body)) {
      return res.status(400).json({ message: "Invalid plan data or price out of range ($5-$50)" });
    }

    try {
      await db.execute(
        `INSERT INTO pricing_plans (title, course_limit, price, features, is_recommended) 
         VALUES (?, ?, ?, ?, ?)`,
        [title, course_limit, price, JSON.stringify(features), is_recommended ? 1 : 0]
      );
      res.status(201).json({ message: "Plan created successfully" });
    } catch (error) {
      res.status(500).json({ message: "Database error", error });
    }
  }
}

module.exports = PlanController;