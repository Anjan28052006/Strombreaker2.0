const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const transactionService = require("../services/transaction.service");
const accountService = require("../services/account.service");
const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const ApiError = require("../utils/ApiError");

const prepare = asyncHandler(async (req, res) => {
  const result = await transactionService.prepareTransfer(req.user._id, req.body);
  return ApiResponse.success(res, "Transfer prepared. Explicit confirmation required.", result);
});

const confirm = asyncHandler(async (req, res) => {
  const result = await transactionService.confirmTransfer(req.user._id, req.body);
  return ApiResponse.success(res, "Transfer completed successfully", result);
});

const getMyTransactions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const type = req.query.type || null;

  const result = await accountService.getTransactionsForUser(req.user._id, { page, limit, type });
  return ApiResponse.success(res, "Transactions retrieved successfully", result);
});

const getById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.transactionId)
    .populate("senderAccountId", "accountNumber")
    .populate("recipientAccountId", "accountNumber");

  if (!transaction) {
    throw ApiError.notFound("Transaction not found", "TRANSACTION_NOT_FOUND");
  }

  // Verify ownership
  const account = await Account.findOne({ userId: req.user._id });
  if (
    req.user.role === "CUSTOMER" &&
    transaction.senderAccountId?._id?.toString() !== account?._id?.toString() &&
    transaction.recipientAccountId?._id?.toString() !== account?._id?.toString()
  ) {
    throw ApiError.forbidden("You are not authorized to view this transaction", "FORBIDDEN");
  }

  return ApiResponse.success(res, "Transaction details retrieved", transaction);
});

const cancel = asyncHandler(async (req, res) => {
  const result = await transactionService.cancelTransaction(req.user._id, req.params.transactionId);
  return ApiResponse.success(res, result.message, result);
});

const createDepositRequest = asyncHandler(async (req, res) => {
  const result = await transactionService.createOperationalRequest(req.user._id, "DEPOSIT", req.body);
  return ApiResponse.created(res, result.message, result);
});

const createWithdrawalRequest = asyncHandler(async (req, res) => {
  const result = await transactionService.createOperationalRequest(req.user._id, "WITHDRAWAL", req.body);
  return ApiResponse.created(res, result.message, result);
});

const getMyOperationalRequests = asyncHandler(async (req, res) => {
  const result = await transactionService.getOperationalRequestsForUser(req.user._id);
  return ApiResponse.success(res, "Operational requests retrieved", result);
});

module.exports = {
  prepare,
  confirm,
  getMyTransactions,
  getById,
  cancel,
  createDepositRequest,
  createWithdrawalRequest,
  getMyOperationalRequests,
};
