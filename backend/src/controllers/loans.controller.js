const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const loanService = require("../services/loan.service");

const createDraft = asyncHandler(async (req, res) => {
  const result = await loanService.createLoanDraft(req.user._id, req.body);
  return ApiResponse.created(res, "Loan draft created successfully", result);
});

const updateDraft = asyncHandler(async (req, res) => {
  const result = await loanService.updateLoanDraft(req.user._id, req.params.loanId, req.body);
  return ApiResponse.success(res, "Loan draft updated successfully", result);
});

const getMyLoans = asyncHandler(async (req, res) => {
  const result = await loanService.getLoansForUser(req.user._id);
  return ApiResponse.success(res, "Loan applications retrieved successfully", result);
});

const getById = asyncHandler(async (req, res) => {
  const result = await loanService.getLoanById(req.user._id, req.params.loanId, req.user.role);
  return ApiResponse.success(res, "Loan details retrieved", result);
});

const submit = asyncHandler(async (req, res) => {
  const result = await loanService.submitLoanApplication(req.user._id, req.params.loanId);
  return ApiResponse.success(res, result.message, result);
});

module.exports = {
  createDraft,
  updateDraft,
  getMyLoans,
  getById,
  submit,
};
