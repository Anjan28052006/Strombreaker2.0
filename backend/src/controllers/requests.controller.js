const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const moneyRequestService = require("../services/moneyRequest.service");

const create = asyncHandler(async (req, res) => {
  const result = await moneyRequestService.createMoneyRequest(req.user._id, req.body);
  return ApiResponse.created(res, "Money request created successfully", result);
});

const getMyRequests = asyncHandler(async (req, res) => {
  const result = await moneyRequestService.getMoneyRequestsForUser(req.user._id);
  return ApiResponse.success(res, "Money requests retrieved successfully", result);
});

const getById = asyncHandler(async (req, res) => {
  const requests = await moneyRequestService.getMoneyRequestsForUser(req.user._id);
  const found = requests.find((r) => r.id.toString() === req.params.requestId);
  if (!found) {
    return res.status(404).json({ success: false, message: "Money request not found" });
  }
  return ApiResponse.success(res, "Money request details retrieved", found);
});

const respond = asyncHandler(async (req, res) => {
  const result = await moneyRequestService.respondToMoneyRequest(req.user._id, req.params.requestId, req.body);
  return ApiResponse.success(res, result.message, result);
});

const cancel = asyncHandler(async (req, res) => {
  const result = await moneyRequestService.cancelMoneyRequest(req.user._id, req.params.requestId);
  return ApiResponse.success(res, result.message, result);
});

module.exports = {
  create,
  getMyRequests,
  getById,
  respond,
  cancel,
};
