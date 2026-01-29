const db = require('../config/db');

class UserModel {
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, username, email, role, created_at FROM users WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async create(name, email, hashedPassword) {
    const role = 'student';
    const query = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
    const [result] = await db.execute(query, [name, email, hashedPassword, role]);
    
    return {
        id: result.insertId,
        username: name,
        email: email,
        role: role
    };
  }

  static async emailExists(email) {
    const query = 'SELECT COUNT(*) as count FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0].count > 0;
  }
}

module.exports = UserModel;