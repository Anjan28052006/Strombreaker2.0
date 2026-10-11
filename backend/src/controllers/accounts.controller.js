const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const accountService = require("../services/account.service");

const getMyAccount = asyncHandler(async (req, res) => {
  const account = await accountService.getAccountForUser(req.user._id);
  return ApiResponse.success(res, "Account retrieved successfully", account);
});

const getMyBalance = asyncHandler(async (req, res) => {
  const balance = await accountService.getBalance(req.user._id);
  return ApiResponse.success(res, "Balance retrieved successfully", balance);
});

const getMyTransactions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const type = req.query.type || null;

  const result = await accountService.getTransactionsForUser(req.user._id, { page, limit, type });
  return ApiResponse.success(res, "Transactions retrieved successfully", result);
});

module.exports = {
  getMyAccount,
  getMyBalance,
  getMyTransactions,
};
