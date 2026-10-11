class ApiResponse {
  constructor(statusCode, message = "Success", data = null) {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  static success(res, message = "Operation completed", data = null, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, message = "Resource created successfully", data = null) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }
}

module.exports = ApiResponse;
