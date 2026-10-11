const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const bankerService = require("../services/banker.service");

const getCustomers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const search = req.query.search || "";

  const result = await bankerService.listCustomers({ page, limit, search });
  return ApiResponse.success(res, "Customers retrieved successfully", result);
});

const getCustomerByAccount = asyncHandler(async (req, res) => {
  const result = await bankerService.getCustomerByAccountNumber(req.params.accountNumber);
  return ApiResponse.success(res, "Customer details retrieved", result);
});

const getSecurityEvents = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const riskLevel = req.query.riskLevel || null;

  const result = await bankerService.getSecurityEvents({ page, limit, riskLevel });
  return ApiResponse.success(res, "Security events retrieved", result);
});

const getCustomerSecurityEvents = asyncHandler(async (req, res) => {
  const result = await bankerService.getCustomerSecurityEvents(req.params.customerId);
  return ApiResponse.success(res, "Customer security events retrieved", result);
});

const issueWarning = asyncHandler(async (req, res) => {
  const result = await bankerService.issueCustomerWarning(req.user._id, req.params.customerId, req.body);
  return ApiResponse.success(res, result.message, result);
});

const getOperationalRequests = asyncHandler(async (req, res) => {
  const status = req.query.status || null;
  const result = await bankerService.listOperationalRequests({ status });
  return ApiResponse.success(res, "Operational requests retrieved", result);
});

const decideOperationalRequest = asyncHandler(async (req, res) => {
  const result = await bankerService.decideOperationalRequest(req.user._id, req.params.requestId, req.body);
  return ApiResponse.success(res, result.message, result);
});

const setRestriction = asyncHandler(async (req, res) => {
  const result = await bankerService.setCustomerRestriction(req.user._id, req.params.customerId, req.body);
  return ApiResponse.success(res, result.message, result);
});

module.exports = {
  getCustomers,
  getCustomerByAccount,
  getSecurityEvents,
  getCustomerSecurityEvents,
  issueWarning,
  getOperationalRequests,
  decideOperationalRequest,
  setRestriction,
};
