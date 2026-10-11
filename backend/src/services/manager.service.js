const User = require("../models/User");
const Account = require("../models/Account");
const LoanApplication = require("../models/LoanApplication");
const SecurityEvent = require("../models/SecurityEvent");
const ApiError = require("../utils/ApiError");
const { ROLES, USER_STATUS, ACCOUNT_STATUS, LOAN_STATUS } = require("../config/constants");
const { generateAccountNumber } = require("../utils/generateReference");
const { createNotification } = require("./notification.service");
const { logAudit } = require("./audit.service");

async function listPendingRegistrations() {
  return await User.find({ role: ROLES.CUSTOMER, accountStatus: USER_STATUS.PENDING })
    .sort({ createdAt: -1 })
    .lean();
}

async function decideRegistration(managerUserId, userId, { decision, decisionReason = "" }) {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound("User not found", "USER_NOT_FOUND");
  }

  if (user.accountStatus !== USER_STATUS.PENDING) {
    throw ApiError.badRequest(`Registration is already ${user.accountStatus}`, "ALREADY_DECIDED");
  }

  if (decision === "APPROVE") {
    user.accountStatus = USER_STATUS.ACTIVE;
    await user.save();

    // Idempotently create bank account if it does not exist yet
    let account = await Account.findOne({ userId: user._id });
    if (!account) {
      let accountNumber = generateAccountNumber();
      // Ensure unique account number
      while (await Account.findOne({ accountNumber })) {
        accountNumber = generateAccountNumber();
      }

      account = await Account.create({
        accountNumber,
        userId: user._id,
        accountType: "SAVINGS",
        balancePaise: 1000000, // Welcome starting bonus of ₹10,000 for demonstration/testing
        currency: "INR",
        status: ACCOUNT_STATUS.ACTIVE,
      });
    }

    await createNotification({
      recipientUserId: user._id,
      type: "REGISTRATION_DECISION",
      title: "Account Approved",
      message: `Congratulations! Your Bankism account has been approved. Your Account Number is ${account.accountNumber}.`,
      resourceType: "ACCOUNT",
      resourceId: account._id.toString(),
    });

    await logAudit({
      actorUserId: managerUserId,
      action: "REGISTRATION_APPROVED",
      resourceType: "USER",
      resourceId: user._id.toString(),
      metadata: { accountNumber: account.accountNumber, decisionReason },
    });

    return {
      userId: user._id,
      accountStatus: user.accountStatus,
      accountNumber: account.accountNumber,
      message: "Customer registration approved and bank account activated.",
    };
  } else if (decision === "REJECT") {
    user.accountStatus = USER_STATUS.REJECTED;
    await user.save();

    await createNotification({
      recipientUserId: user._id,
      type: "REGISTRATION_DECISION",
      title: "Registration Update",
      message: `Your registration request was not approved. Reason: ${decisionReason || 'Identity verification requirements not met.'}`,
      resourceType: "USER",
      resourceId: user._id.toString(),
    });

    await logAudit({
      actorUserId: managerUserId,
      action: "REGISTRATION_REJECTED",
      resourceType: "USER",
      resourceId: user._id.toString(),
      metadata: { decisionReason },
    });

    return {
      userId: user._id,
      accountStatus: user.accountStatus,
      message: "Registration application rejected.",
    };
  } else {
    throw ApiError.badRequest("Decision must be APPROVE or REJECT", "INVALID_DECISION");
  }
}

async function listLoans({ status = null } = {}) {
  const query = {};
  if (status) query.status = status;

  return await LoanApplication.find(query)
    .populate("applicantUserId", "fullName email accountStatus")
    .sort({ createdAt: -1 })
    .lean();
}

async function decideLoan(managerUserId, loanId, { decision, decisionReason = "" }) {
  const loan = await LoanApplication.findById(loanId);
  if (!loan) {
    throw ApiError.notFound("Loan application not found", "LOAN_NOT_FOUND");
  }

  if (loan.status !== LOAN_STATUS.PENDING && loan.status !== LOAN_STATUS.UNDER_REVIEW) {
    throw ApiError.badRequest(`Loan application is already in status '${loan.status}'`, "ALREADY_DECIDED");
  }

  if (decision === "APPROVE") {
    loan.status = LOAN_STATUS.APPROVED;
    loan.reviewedBy = managerUserId;
    loan.reviewedAt = new Date();
    loan.decisionReason = decisionReason;
    await loan.save();

    // Disburse loan funds to customer's account
    const account = await Account.findOne({ userId: loan.applicantUserId });
    if (account) {
      account.balancePaise += loan.requestedAmountPaise;
      await account.save();
    }

    await createNotification({
      recipientUserId: loan.applicantUserId,
      type: "LOAN_UPDATE",
      title: "Loan Approved & Disbursed",
      message: `Your loan of ₹${(loan.requestedAmountPaise / 100).toFixed(2)} (${loan.loanType}) has been approved and credited to your account!`,
      resourceType: "LOAN",
      resourceId: loan._id.toString(),
    });

    await logAudit({
      actorUserId: managerUserId,
      action: "LOAN_APPROVED",
      resourceType: "LOAN",
      resourceId: loan._id.toString(),
      metadata: { amountPaise: loan.requestedAmountPaise, decisionReason },
    });

    return {
      loanId: loan._id,
      status: loan.status,
      disbursedAmount: loan.requestedAmountPaise / 100,
      message: "Loan application approved and funds disbursed.",
    };
  } else if (decision === "REJECT") {
    loan.status = LOAN_STATUS.REJECTED;
    loan.reviewedBy = managerUserId;
    loan.reviewedAt = new Date();
    loan.decisionReason = decisionReason;
    await loan.save();

    await createNotification({
      recipientUserId: loan.applicantUserId,
      type: "LOAN_UPDATE",
      title: "Loan Application Declined",
      message: `Your loan application for ₹${(loan.requestedAmountPaise / 100).toFixed(2)} was declined. Reason: ${decisionReason || 'Credit policy assessment'}`,
      resourceType: "LOAN",
      resourceId: loan._id.toString(),
    });

    await logAudit({
      actorUserId: managerUserId,
      action: "LOAN_REJECTED",
      resourceType: "LOAN",
      resourceId: loan._id.toString(),
      metadata: { decisionReason },
    });

    return {
      loanId: loan._id,
      status: loan.status,
      message: "Loan application rejected.",
    };
  } else {
    throw ApiError.badRequest("Decision must be APPROVE or REJECT", "INVALID_DECISION");
  }
}

async function listUsers({ role = null } = {}) {
  const query = {};
  if (role) query.role = role;

  return await User.find(query).sort({ createdAt: -1 }).lean();
}

async function listBankers() {
  return await User.find({ role: ROLES.BANKER }).sort({ createdAt: -1 }).lean();
}

async function getSecurityEventsOverview() {
  const [events, highRiskCount, totalCount] = await Promise.all([
    SecurityEvent.find().populate("userId", "fullName email").sort({ createdAt: -1 }).limit(50).lean(),
    SecurityEvent.countDocuments({ riskLevel: { $in: ["HIGH", "CRITICAL"] } }),
    SecurityEvent.countDocuments(),
  ]);

  return {
    events,
    stats: {
      totalCount,
      highRiskCount,
    },
  };
}

module.exports = {
  listPendingRegistrations,
  decideRegistration,
  listLoans,
  decideLoan,
  listUsers,
  listBankers,
  getSecurityEventsOverview,
};
