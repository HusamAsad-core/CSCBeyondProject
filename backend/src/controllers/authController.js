const AuthService = require('../services/authService');

class AuthController {
  static async register(req, res, next) {
    try {
      // 1. Get the data from the request
      const { name, email, password } = req.body;

      // 2. Call the service. 
      // If 'name' is missing, our updated AuthService logic handles it.
      const result = await AuthService.register(name, email, password);

      // 3. Send back the success response
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      // 4. Pass errors to your global error handler
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

  // Social login placeholders...
  static async googleLogin(req, res, next) {
    res.status(501).json({ message: "Google login not implemented yet" });
  }

  static async facebookLogin(req, res, next) {
    res.status(501).json({ message: "Facebook login not implemented yet" });
  }

  static async appleLogin(req, res, next) {
    res.status(501).json({ message: "Apple login not implemented yet" });
  }
}

module.exports = AuthController;