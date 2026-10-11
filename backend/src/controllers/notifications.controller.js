const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const notificationService = require("../services/notification.service");

const getNotifications = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;

  const result = await notificationService.getUserNotifications(req.user._id, { page, limit });
  return ApiResponse.success(res, "Notifications retrieved successfully", result);
});

const markAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markNotificationAsRead(req.user._id, req.params.notificationId);
  return ApiResponse.success(res, "Notification marked as read", result);
});

const markAllAsRead = asyncHandler(async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user._id);
  return ApiResponse.success(res, "All notifications marked as read", result);
});

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
