const path = require('path');
const bcrypt = require('bcryptjs');
const promisePool = require('../config/db');

class AdminController {
  static async createTeacher(req, res, next) {
    try {
      const { username, email, password } = req.body;

      const [existingUser] = await promisePool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await promisePool.query(
        'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, 'instructor']
      );

      res.status(201).json({
        success: true,
        message: 'Teacher created successfully',
        teacherId: result.insertId
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AdminController;