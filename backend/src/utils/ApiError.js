class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", code = "INTERNAL_ERROR", details = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message = "Invalid request payload", code = "BAD_REQUEST", details = []) {
    return new ApiError(400, message, code, details);
  }

  static unauthorized(message = "Authentication required", code = "UNAUTHORIZED") {
    return new ApiError(401, message, code);
  }

  static forbidden(message = "Access forbidden", code = "FORBIDDEN") {
    return new ApiError(403, message, code);
  }

  static notFound(message = "Resource not found", code = "NOT_FOUND") {
    return new ApiError(404, message, code);
  }

  static conflict(message = "Resource state conflict", code = "CONFLICT") {
    return new ApiError(409, message, code);
  }

  static unprocessable(message = "Unprocessable entity", code = "VALIDATION_ERROR", details = []) {
    return new ApiError(422, message, code, details);
  }

  static internal(message = "Internal server error", code = "INTERNAL_ERROR") {
    return new ApiError(500, message, code);
  }
}

module.exports = ApiError;
