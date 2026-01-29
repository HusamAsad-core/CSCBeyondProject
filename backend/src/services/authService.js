const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const UserDTO = require('../dtos/userDTO'); 
const promisePool = require('../config/db');

class AuthService {
  static async login(email, password) {
    const [users] = await promisePool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) throw new Error('User not found');

    const isMatch = await bcrypt.compare(String(password), user.password || user.password_hash);
    if (!isMatch) throw new Error('Invalid credentials');

    // Use username if available, fallback to name, then Student
    const displayName = user.username || user.name || "Student";

    const token = this.generateToken(user.id, user.role, displayName);

    return { 
      token, 
      user: { id: user.id, username: displayName, role: user.role } 
    };
  }
  
  static async register(name, email, password, confirmPassword) {
    // 1. Validate password match
    if (!password || !confirmPassword || password !== confirmPassword) {
      const error = new Error('Passwords do not match');
      error.statusCode = 400;
      throw error;
    }

    // 2. Check if user already exists
    const userExists = await UserModel.emailExists(email);
    if (userExists) {
      const error = new Error('Email already registered');
      error.statusCode = 400;
      throw error;
    }

    // 3. Prepare name and hash password
    const finalName = (name && name.trim().length > 0) ? name : email.split('@')[0]; 
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user in DB
    const user = await UserModel.create(finalName, email, hashedPassword);
    
    // 5. Generate token (including name for the frontend to use immediately)
    const token = this.generateToken(user.id, user.role, finalName); 

    return {
      user: new UserDTO(user),
      token,
    };
  }

  static generateToken(userId, role, name = "") {
    return jwt.sign(
      { id: userId, role: role, name: name },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
  }

  static async getUserById(userId) {
    const [users] = await promisePool.query('SELECT username, email FROM users WHERE id = ?', [userId]);
    return users[0]; 
  } 
}

module.exports = AuthService;