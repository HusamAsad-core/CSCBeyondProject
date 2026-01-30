const bcrypt = require('bcryptjs');
const promisePool = require('../config/db');

class AdminController {
  // 1. Feature: Create Teacher (Already working, kept for consistency)
  static async createTeacher(req, res, next) {
    try {
      const { username, email, password } = req.body;

      const [existingUser] = await promisePool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ success: false, message: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await promisePool.query(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, 'instructor']
      );

      res.status(201).json({
        success: true,
        message: 'Teacher account created successfully',
        teacherId: result.insertId
      });
    } catch (error) {
      next(error);
    }
  }

  // 2. Feature: Edit User Role (Admin can promote/demote users)
  static async editUserRole(req, res, next) {
    try {
      const { userId, newRole } = req.body;
      const validRoles = ['student', 'instructor', 'admin'];

      if (!validRoles.includes(newRole)) {
        return res.status(400).json({ success: false, message: "Invalid role type" });
      }

      const [result] = await promisePool.query(
        'UPDATE users SET role = ? WHERE id = ?',
        [newRole, userId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      res.status(200).json({ success: true, message: `User role updated to ${newRole}` });
    } catch (error) {
      next(error);
    }
  }

  // 3. Feature: Edit Plan (Update existing pricing plans)
  static async editPlan(req, res, next) {
    try {
      const { planId } = req.params;
      const { name, course_limit, price, features, is_recommended } = req.body;

      const [result] = await promisePool.query(
        `UPDATE pricing_plans 
         SET name = ?, course_limit = ?, price = ?, features = ?, is_recommended = ? 
         WHERE id = ?`,
        [name, course_limit, price, JSON.stringify(features), is_recommended ? 1 : 0, planId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: "Plan not found" });
      }

      res.status(200).json({ success: true, message: "Pricing plan updated successfully" });
    } catch (error) {
      next(error);
    }
  }

// In AdminController.js -> getDashboardStats
static async getDashboardStats(req, res, next) {
  try {
    // Count only non-admins for the 'Total Users' stat
    const [[userCount]] = await promisePool.query(
      'SELECT COUNT(*) as total FROM users WHERE role != "admin"'
    );
    const [[teacherCount]] = await promisePool.query(
      'SELECT COUNT(*) as total FROM users WHERE role = "instructor"'
    );
    const [[planCount]] = await promisePool.query(
      'SELECT COUNT(*) as total FROM pricing_plans'
    );

    res.status(200).json({
      success: true,
      data: {
        totalUsers: userCount.total,
        totalTeachers: teacherCount.total,
        totalPlans: planCount.total
      }
    });
  } catch (error) {
    next(error);
  }
}

// In AdminController.js
static async deletePlan(req, res, next) {
  try {
    const { planId } = req.params;
    const { password } = req.body; // Password for verification

    // 1. Verify Admin Password
    const [admin] = await promisePool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);
    const isMatch = await bcrypt.compare(password, admin[0].password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect admin password." });
    }

    // 2. Delete the plan
    const [result] = await promisePool.query('DELETE FROM pricing_plans WHERE id = ?', [planId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Plan not found." });
    }

    res.status(200).json({ success: true, message: "Plan deleted successfully." });
  } catch (error) {
    next(error);
  }
}

static async editPlan(req, res, next) {
  try {
    const { planId } = req.params;
    const { name, course_limit, price, features, is_recommended } = req.body;

    // Convert features array back to JSON string for MySQL
    const [result] = await promisePool.query(
      'UPDATE pricing_plans SET name = ?, course_limit = ?, price = ?, features = ?, is_recommended = ? WHERE id = ?',
      [name, course_limit, price, JSON.stringify(features), is_recommended ? 1 : 0, planId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Plan not found." });
    }

    res.status(200).json({ success: true, message: "Plan updated successfully." });
  } catch (error) {
    next(error);
  }
}

static async renameUser(req, res, next) {
  try {
    const { userId, newUsername } = req.body;
    await promisePool.query('UPDATE users SET username = ? WHERE id = ?', [newUsername, userId]);
    res.status(200).json({ success: true, message: "Username updated successfully" });
  } catch (error) {
    next(error);
  }
}

  // In AdminController.js -> getAllUsers
static async getAllUsers(req, res, next) {
  try {
    // We filter out anyone with the role 'admin'
    const [users] = await promisePool.query(
      'SELECT id, username, email, role FROM users WHERE role != "admin"'
    );
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

static async deleteUser(req, res, next) {
  try {
    const { userId } = req.params;

    // Prevent Admin from deleting themselves (Safety Check)
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ success: false, message: "You cannot delete your own admin account." });
    }

    const [result] = await promisePool.query('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    next(error);
  }
}
}
module.exports = AdminController;