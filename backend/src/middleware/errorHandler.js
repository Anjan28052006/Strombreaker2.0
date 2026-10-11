const ApiError = require("../utils/ApiError");

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "An unexpected internal server error occurred";
  let code = err.code || "INTERNAL_ERROR";
  let details = err.details || [];

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = "Database validation failed";
    details = Object.values(err.errors).map((e) => ({
      path: e.path,
      message: e.message,
    }));
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 409;
    code = "DUPLICATE_RESOURCE";
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `A resource with this ${field} already exists`;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    code = "AUTH_TOKEN_INVALID";
    message = "Invalid authentication token";
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    code = "AUTH_TOKEN_EXPIRED";
    message = "Authentication token has expired";
  }

  // Never expose stack trace or raw sensitive internal error messages in response
  res.status(statusCode).json({
    success: false,
    message,
    error: {
      code,
      details,
    },
  });
}

module.exports = errorHandler;
