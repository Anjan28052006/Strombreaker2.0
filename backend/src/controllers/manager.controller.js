const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const managerService = require("../services/manager.service");

const getRegistrations = asyncHandler(async (req, res) => {
  const result = await managerService.listPendingRegistrations();
  return ApiResponse.success(res, "Pending registrations retrieved", result);
});

const decideRegistration = asyncHandler(async (req, res) => {
  const result = await managerService.decideRegistration(req.user._id, req.params.userId, req.body);
  return ApiResponse.success(res, result.message, result);
});

const getLoans = asyncHandler(async (req, res) => {
  const status = req.query.status || null;
  const result = await managerService.listLoans({ status });
  return ApiResponse.success(res, "Loan applications retrieved", result);
});

const decideLoan = asyncHandler(async (req, res) => {
  const result = await managerService.decideLoan(req.user._id, req.params.loanId, req.body);
  return ApiResponse.success(res, result.message, result);
});

const getUsers = asyncHandler(async (req, res) => {
  const role = req.query.role || null;
  const result = await managerService.listUsers({ role });
  return ApiResponse.success(res, "Users retrieved", result);
});

const getBankers = asyncHandler(async (req, res) => {
  const result = await managerService.listBankers();
  return ApiResponse.success(res, "Bankers retrieved", result);
});

const getSecurityEvents = asyncHandler(async (req, res) => {
  const result = await managerService.getSecurityEventsOverview();
  return ApiResponse.success(res, "Security events overview retrieved", result);
});

module.exports = {
  getRegistrations,
  decideRegistration,
  getLoans,
  decideLoan,
  getUsers,
  getBankers,
  getSecurityEvents,
};
