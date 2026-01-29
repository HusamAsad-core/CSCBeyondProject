//Exception Handler

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Server Error';

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = errorHandler;