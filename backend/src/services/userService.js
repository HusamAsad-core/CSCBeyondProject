const db = require('../config/db'); // kept as db.execute
const bcrypt = require('bcryptjs');

class UserService {
  static async createTeacher(teacherData) {
    const hashedPassword = await bcrypt.hash(teacherData.password, 10);
    const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
    return await db.execute(query, [
      teacherData.name,
      teacherData.email,
      hashedPassword,
      teacherData.role
    ]);
  }

  static async selectPlan(userId, planId) {
    const [rows] = await db.execute(
      'SELECT course_limit FROM pricing_plans WHERE id = ?',
      [planId]
    );

    if (!rows || rows.length === 0) throw new Error("Plan not found");

    const limit = rows[0].course_limit;

    return await db.execute(
      'UPDATE users SET plan_id = ?, course_credits = ? WHERE id = ?',
      [planId, limit, userId]
    );
  }

  static async enrollInCourse(userId, course_id) {
    const [stats] = await db.execute(
      `SELECT 
          u.course_credits as total_allowed, 
          (SELECT COUNT(*) FROM user_courses WHERE user_id = u.id) as currently_used
       FROM users u 
       WHERE u.id = ?`,
      [userId]
    );

    if (stats.length === 0) throw new Error("User not found");

    const { total_allowed, currently_used } = stats[0];

    if (currently_used >= total_allowed) {
      throw new Error(
        `You have used all ${total_allowed} course slots in your plan. Please upgrade for more.`
      );
    }

    try {
      await db.execute(
        'INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)',
        [userId, course_id]
      );

      return {
        remaining: total_allowed - (currently_used + 1),
        total: total_allowed
      };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error("You are already enrolled in this course.");
      }
      throw error;
    }
  }

  static async finishCourse(userId, courseId) {
    const [enrollment] = await db.execute(
      'SELECT id, status FROM user_courses WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (enrollment.length === 0) throw new Error("You are not enrolled in this course.");
    if (enrollment[0].status === 'Completed') throw new Error("Course is already marked as completed.");

    return await db.execute(
      'UPDATE user_courses SET status = "Completed" WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );
  }

  // ✅ FIXED: single correct method
  static async getMyEnrollments(userId) {
    const [rows] = await db.execute(
      `SELECT course_id, status
       FROM user_courses
       WHERE user_id = ?
       ORDER BY selected_at DESC`,
      [userId]
    );

    return rows; // [{course_id: 26, status:'Enrolled'}, ...]
  }
}

module.exports = UserService;
