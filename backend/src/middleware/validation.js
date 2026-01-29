//Validates request body before reaching controller
//Middleware acts like Filters, like its firstly validates, then checkerrors, and then passes to controller
const { body, validationResult } = require('express-validator');

// ✅ Already exists - login validation
const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const registerValidation = [
  // body('name') // Frontend sends "name"
  //   .trim()
  //   .notEmpty()
  //   .withMessage('Name is required')
  //   .isLength({ min: 2, max: 255 })
  //   .withMessage('Name must be between 2 and 255 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('confirmPassword')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

module.exports = {
  loginValidation,
  registerValidation,  // ✨ Export this
  handleValidationErrors,
};