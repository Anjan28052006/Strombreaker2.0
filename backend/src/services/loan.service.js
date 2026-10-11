const LoanApplication = require("../models/LoanApplication");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { LOAN_STATUS, ROLES } = require("../config/constants");
const { generateReference } = require("../utils/generateReference");
const { createNotification } = require("./notification.service");
const { logAudit } = require("./audit.service");

async function createLoanDraft(userId, { loanType = "PERSONAL", requestedAmount, purpose = "", annualIncome = 0, employmentStatus = "", tenureMonths = 12, notes = "" }) {
  const requestedAmountPaise = Math.round(requestedAmount * 100);
  if (requestedAmountPaise < 100000) {
    throw ApiError.badRequest("Minimum loan application amount is ₹1,000", "INVALID_LOAN_AMOUNT");
  }

  const reference = generateReference("LN");

  const loan = await LoanApplication.create({
    reference,
    applicantUserId: userId,
    loanType,
    requestedAmountPaise,
    applicationDetails: {
      purpose: purpose.trim(),
      annualIncomePaise: Math.round(annualIncome * 100),
      employmentStatus: employmentStatus.trim(),
      tenureMonths,
      notes: notes.trim(),
    },
    status: LOAN_STATUS.DRAFT,
  });

  await logAudit({
    actorUserId: userId,
    action: "LOAN_DRAFT_CREATED",
    resourceType: "LOAN",
    resourceId: loan._id.toString(),
    metadata: { reference, requestedAmountPaise },
  });

  return {
    loanId: loan._id,
    reference: loan.reference,
    loanType: loan.loanType,
    requestedAmount: requestedAmountPaise / 100,
    requestedAmountPaise,
    status: loan.status,
    applicationDetails: loan.applicationDetails,
    createdAt: loan.createdAt,
  };
}

async function updateLoanDraft(userId, loanId, updates) {
  const loan = await LoanApplication.findOne({ _id: loanId, applicantUserId: userId });
  if (!loan) {
    throw ApiError.notFound("Loan application draft not found", "LOAN_NOT_FOUND");
  }

  if (loan.status !== LOAN_STATUS.DRAFT && loan.status !== LOAN_STATUS.NEEDS_INFORMATION) {
    throw ApiError.badRequest(`Cannot edit application in status ${loan.status}`, "CANNOT_EDIT_LOAN");
  }

  if (updates.requestedAmount) {
    loan.requestedAmountPaise = Math.round(updates.requestedAmount * 100);
  }
  if (updates.loanType) loan.loanType = updates.loanType;
  if (updates.purpose !== undefined) loan.applicationDetails.purpose = updates.purpose;
  if (updates.annualIncome !== undefined) loan.applicationDetails.annualIncomePaise = Math.round(updates.annualIncome * 100);
  if (updates.employmentStatus !== undefined) loan.applicationDetails.employmentStatus = updates.employmentStatus;
  if (updates.tenureMonths !== undefined) loan.applicationDetails.tenureMonths = updates.tenureMonths;
  if (updates.notes !== undefined) loan.applicationDetails.notes = updates.notes;

  await loan.save();

  return {
    loanId: loan._id,
    reference: loan.reference,
    status: loan.status,
    requestedAmount: loan.requestedAmountPaise / 100,
    applicationDetails: loan.applicationDetails,
  };
}

async function getLoansForUser(userId) {
  const loans = await LoanApplication.find({ applicantUserId: userId }).sort({ createdAt: -1 }).lean();
  return loans.map((loan) => ({
    id: loan._id,
    reference: loan.reference,
    loanType: loan.loanType,
    requestedAmount: loan.requestedAmountPaise / 100,
    requestedAmountPaise: loan.requestedAmountPaise,
    status: loan.status,
    applicationDetails: loan.applicationDetails,
    reviewedAt: loan.reviewedAt,
    decisionReason: loan.decisionReason,
    createdAt: loan.createdAt,
  }));
}

async function getLoanById(userId, loanId, userRole = "CUSTOMER") {
  const query = { _id: loanId };
  if (userRole === ROLES.CUSTOMER) {
    query.applicantUserId = userId;
  }

  const loan = await LoanApplication.findOne(query).populate("applicantUserId", "fullName email");
  if (!loan) {
    throw ApiError.notFound("Loan application not found", "LOAN_NOT_FOUND");
  }

  return {
    id: loan._id,
    reference: loan.reference,
    applicant: loan.applicantUserId,
    loanType: loan.loanType,
    requestedAmount: loan.requestedAmountPaise / 100,
    requestedAmountPaise: loan.requestedAmountPaise,
    status: loan.status,
    applicationDetails: loan.applicationDetails,
    reviewedAt: loan.reviewedAt,
    decisionReason: loan.decisionReason,
    createdAt: loan.createdAt,
  };
}

async function submitLoanApplication(userId, loanId) {
  const loan = await LoanApplication.findOne({ _id: loanId, applicantUserId: userId });
  if (!loan) {
    throw ApiError.notFound("Loan application draft not found", "LOAN_NOT_FOUND");
  }

  if (loan.status !== LOAN_STATUS.DRAFT && loan.status !== LOAN_STATUS.NEEDS_INFORMATION) {
    throw ApiError.badRequest(`Cannot submit application in status '${loan.status}'`, "CANNOT_SUBMIT_LOAN");
  }

  loan.status = LOAN_STATUS.PENDING;
  await loan.save();

  // Notify user
  await createNotification({
    recipientUserId: userId,
    type: "LOAN_UPDATE",
    title: "Loan Application Submitted",
    message: `Your application for ₹${(loan.requestedAmountPaise / 100).toFixed(2)} (${loan.loanType}) has been submitted for review.`,
    resourceType: "LOAN",
    resourceId: loan._id.toString(),
  });

  await logAudit({
    actorUserId: userId,
    action: "LOAN_SUBMITTED",
    resourceType: "LOAN",
    resourceId: loan._id.toString(),
    metadata: { reference: loan.reference },
  });

  return {
    loanId: loan._id,
    reference: loan.reference,
    status: loan.status,
    message: "Loan application submitted successfully. It will be reviewed by bank management.",
  };
}

module.exports = {
  createLoanDraft,
  updateLoanDraft,
  getLoansForUser,
  getLoanById,
  submitLoanApplication,
};
