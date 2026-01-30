const db = require('../config/db');

class AdminService {
  // Edit User Role
  static async updateUserRole(targetUserId, newRole) {
    return await db.execute(
      'UPDATE users SET role = ? WHERE id = ?',
      [newRole, targetUserId]
    );
  }

  // Edit Existing Plan
  static async updatePlan(planId, planData) {
    const { name, course_limit, price, features, is_recommended } = planData;
    return await db.execute(
      `UPDATE pricing_plans 
       SET name = ?, course_limit = ?, price = ?, features = ?, is_recommended = ? 
       WHERE id = ?`,
      [name, course_limit, price, JSON.stringify(features), is_recommended, planId]
    );
  }
}

module.exports = AdminService;