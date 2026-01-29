const AuthService = require('../services/authService');

class AuthController {
  static async register(req, res, next) {
    try {
      // FIX: We must extract confirmPassword from the request body!
      const { name, email, password, confirmPassword } = req.body;

      // FIX: Pass confirmPassword to the service
      const result = await AuthService.register(name, email, password, confirmPassword);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req, res, next) {
    try {
      // req.user.id must be set by your authentication middleware
      const user = await AuthService.getUserById(req.user.id); 
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      res.status(200).json({
        success: true,
        data: user 
      });
    } catch (error) {
      next(error);
    }
  }

  // Social login placeholders
  static async googleLogin(req, res, next) { res.status(501).json({ message: "Not implemented" }); }
  static async facebookLogin(req, res, next) { res.status(501).json({ message: "Not implemented" }); }
  static async appleLogin(req, res, next) { res.status(501).json({ message: "Not implemented" }); }
}

module.exports = AuthController;