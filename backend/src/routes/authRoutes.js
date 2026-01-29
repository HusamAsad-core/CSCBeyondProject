//Request Mapping, maps each endoint to corresponding controller method
const AuthController = require('../controllers/authController');
console.log('AuthController Object:', AuthController); 
console.log('Register Method:', AuthController.register);
const express = require('express');
const router = express.Router();
const {
  loginValidation,
  registerValidation, 
  handleValidationErrors,
} = require('../middleware/validation');

router.post(
  '/login',
  loginValidation,
  handleValidationErrors,
  AuthController.login
);

router.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  AuthController.register
);

// ✨ ADD THESE - Social login stubs
//router.get('/me', protect, AuthController.getMe);
router.post('/google', AuthController.googleLogin);
router.post('/facebook', AuthController.facebookLogin);
router.post('/apple', AuthController.appleLogin);

console.log('AuthController Object:', AuthController); 
console.log('Register Method:', AuthController.register);

module.exports = router;