const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const UserDTO = require('../dtos/userDTO'); 
const promisePool = require('../config/db');

class AuthService {
  // Existing login method...
  static async login(email, password) {
    const [users] = await promisePool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];
    if (!user) throw new Error('User not found');

    const token = jwt.sign(
      { id: user.id, role: user.role }, 
      process.env.JWT_SECRET || 'your_secret_key', 
      { expiresIn: '1d' }
    );

    return { 
      token, 
      user: { id: user.id, name: user.name, role: user.role } 
    };
  }
  
  // UPDATED REGISTER METHOD
  static async register(name, email, password) {
    const userExists = await UserModel.emailExists(email);
    if (userExists) {
      const error = new Error('Email already registered');
      error.statusCode = 400;
      throw error;
    }

    // --- LOGIC FOR OPTIONAL NAME ---
    // If name is null, undefined, or an empty string, use the email prefix
    const finalName = (name && name.trim().length > 0) 
      ? name 
      : email.split('@')[0]; 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Use finalName instead of name
    const user = await UserModel.create(finalName, email, hashedPassword);

    const token = this.generateToken(user.id, user.role); 

    return {
      user: new UserDTO(user),
      token,
    };
  }

  static generateToken(userId, role) {
    return jwt.sign(
      { id: userId, role: role },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: process.env.JWT_EXPIRE || '24h' }
    );
  }
}

module.exports = AuthService;