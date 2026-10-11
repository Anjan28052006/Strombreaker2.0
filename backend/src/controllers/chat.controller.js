const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const chatService = require("../services/chat.service");

const sendMessage = asyncHandler(async (req, res) => {
  const result = await chatService.processChatMessage(req.user, req.body);
  return ApiResponse.success(res, "Message processed", result);
});

module.exports = {
  sendMessage,
};
