const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const authService = require("../services/auth.service");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return ApiResponse.created(res, result.message, result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return ApiResponse.success(res, "Login successful", result);
});

const getMe = asyncHandler(async (req, res) => {
  const result = await authService.getMe(req.user);
  return ApiResponse.success(res, "Profile retrieved successfully", result);
});

module.exports = {
  register,
  login,
  getMe,
};
