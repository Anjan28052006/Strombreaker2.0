const User = require("../models/User");
const Account = require("../models/Account");
const SecurityEvent = require("../models/SecurityEvent");
const OperationalRequest = require("../models/OperationalRequest");
const ApiError = require("../utils/ApiError");
const { ROLES, USER_STATUS, ACCOUNT_STATUS, OPERATIONAL_REQUEST_STATUS } = require("../config/constants");
const { createNotification } = require("./notification.service");
const { logAudit } = require("./audit.service");

async function listCustomers({ page = 1, limit = 20, search = "" } = {}) {
  const query = { role: ROLES.CUSTOMER };
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(query),
  ]);

  const userIds = users.map((u) => u._id);
  const accounts = await Account.find({ userId: { $in: userIds } }).lean();
  const accountMap = new Map(accounts.map((a) => [a.userId.toString(), a]));

  const formatted = users.map((u) => {
    const acc = accountMap.get(u._id.toString());
    return {
      id: u._id,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      accountStatus: u.accountStatus,
      maliciousAttemptCount: u.maliciousAttemptCount,
      warningCount: u.warningCount,
      accountNumber: acc?.accountNumber || null,
      balancePaise: acc?.balancePaise || 0,
      balanceRupees: (acc?.balancePaise || 0) / 100,
      accountType: acc?.accountType || "SAVINGS",
      createdAt: u.createdAt,
    };
  });

  return {
    customers: formatted,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

async function getCustomerByAccountNumber(accountNumber) {
  const account = await Account.findOne({ accountNumber: accountNumber.trim() }).populate("userId");
  if (!account) {
    throw ApiError.notFound("Account number not found", "ACCOUNT_NOT_FOUND");
  }

  const user = account.userId;
  return {
    customerId: user._id,
    fullName: user.fullName,
    email: user.email,
    accountStatus: user.accountStatus,
    maliciousAttemptCount: user.maliciousAttemptCount,
    warningCount: user.warningCount,
    account: {
      accountNumber: account.accountNumber,
      balancePaise: account.balancePaise,
      balanceRupees: account.balancePaise / 100,
      currency: account.currency,
      status: account.status,
      accountType: account.accountType,
    },
  };
}

async function getSecurityEvents({ page = 1, limit = 20, riskLevel = null } = {}) {
  const query = {};
  if (riskLevel) query.riskLevel = riskLevel;

  const skip = (page - 1) * limit;
  const [events, total] = await Promise.all([
    SecurityEvent.find(query)
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    SecurityEvent.countDocuments(query),
  ]);

  return {
    events,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

async function getCustomerSecurityEvents(customerId) {
  return await SecurityEvent.find({ userId: customerId }).sort({ createdAt: -1 }).lean();
}

async function issueCustomerWarning(bankerUserId, customerId, { reason }) {
  const customer = await User.findById(customerId);
  if (!customer) {
    throw ApiError.notFound("Customer not found", "CUSTOMER_NOT_FOUND");
  }

  customer.warningCount += 1;
  await customer.save();

  await createNotification({
    recipientUserId: customer._id,
    type: "BANKER_WARNING",
    title: "Official Bank Warning",
    message: `A formal warning has been issued to your account: ${reason}`,
    resourceType: "USER",
    resourceId: customer._id.toString(),
  });

  await logAudit({
    actorUserId: bankerUserId,
    action: "BANKER_WARNING_ISSUED",
    resourceType: "USER",
    resourceId: customer._id.toString(),
    metadata: { reason, warningCount: customer.warningCount },
  });

  return {
    customerId: customer._id,
    warningCount: customer.warningCount,
    message: "Warning successfully issued to customer.",
  };
}

async function listOperationalRequests({ status = null } = {}) {
  const query = {};
  if (status) query.status = status;

  return await OperationalRequest.find(query)
    .populate("userId", "fullName email")
    .populate("accountId", "accountNumber balancePaise")
    .sort({ createdAt: -1 })
    .lean();
}

async function decideOperationalRequest(bankerUserId, requestId, { decision, decisionReason = "" }) {
  const opRequest = await OperationalRequest.findById(requestId);
  if (!opRequest) {
    throw ApiError.notFound("Operational request not found", "REQUEST_NOT_FOUND");
  }

  if (opRequest.status !== OPERATIONAL_REQUEST_STATUS.PENDING) {
    throw ApiError.badRequest(`Request is already ${opRequest.status}`, "ALREADY_DECIDED");
  }

  const account = await Account.findById(opRequest.accountId);
  if (!account) {
    throw ApiError.notFound("Associated bank account not found", "ACCOUNT_NOT_FOUND");
  }

  if (decision === "APPROVE") {
    opRequest.status = OPERATIONAL_REQUEST_STATUS.APPROVED;
    opRequest.reviewedBy = bankerUserId;
    opRequest.reviewedAt = new Date();
    opRequest.decisionReason = decisionReason;

    // Execute atomic balance modification
    if (opRequest.type === "DEPOSIT") {
      account.balancePaise += opRequest.amountPaise;
      await account.save();
    } else if (opRequest.type === "WITHDRAWAL") {
      if (account.balancePaise < opRequest.amountPaise) {
        throw ApiError.badRequest("Cannot approve: customer has insufficient funds", "INSUFFICIENT_FUNDS");
      }
      account.balancePaise -= opRequest.amountPaise;
      await account.save();
    }

    await opRequest.save();

    await createNotification({
      recipientUserId: opRequest.userId,
      type: opRequest.type === "DEPOSIT" ? "DEPOSIT_UPDATE" : "WITHDRAWAL_UPDATE",
      title: `${opRequest.type} Approved`,
      message: `Your ${opRequest.type.toLowerCase()} request for ₹${(opRequest.amountPaise / 100).toFixed(2)} was approved. Updated balance: ₹${(account.balancePaise / 100).toFixed(2)}.`,
      resourceType: "ACCOUNT",
      resourceId: account._id.toString(),
    });

    await logAudit({
      actorUserId: bankerUserId,
      action: `OPERATIONAL_REQUEST_APPROVED_${opRequest.type}`,
      resourceType: "OPERATIONAL_REQUEST",
      resourceId: opRequest._id.toString(),
      metadata: { amountPaise: opRequest.amountPaise, updatedBalancePaise: account.balancePaise },
    });
  } else if (decision === "REJECT") {
    opRequest.status = OPERATIONAL_REQUEST_STATUS.REJECTED;
    opRequest.reviewedBy = bankerUserId;
    opRequest.reviewedAt = new Date();
    opRequest.decisionReason = decisionReason;
    await opRequest.save();

    await createNotification({
      recipientUserId: opRequest.userId,
      type: opRequest.type === "DEPOSIT" ? "DEPOSIT_UPDATE" : "WITHDRAWAL_UPDATE",
      title: `${opRequest.type} Rejected`,
      message: `Your ${opRequest.type.toLowerCase()} request for ₹${(opRequest.amountPaise / 100).toFixed(2)} was rejected. Reason: ${decisionReason || 'Policy check'}`,
      resourceType: "ACCOUNT",
      resourceId: account._id.toString(),
    });

    await logAudit({
      actorUserId: bankerUserId,
      action: `OPERATIONAL_REQUEST_REJECTED_${opRequest.type}`,
      resourceType: "OPERATIONAL_REQUEST",
      resourceId: opRequest._id.toString(),
      metadata: { reason: decisionReason },
    });
  } else {
    throw ApiError.badRequest("Decision must be APPROVE or REJECT", "INVALID_DECISION");
  }

  return {
    requestId: opRequest._id,
    status: opRequest.status,
    decisionReason: opRequest.decisionReason,
    message: `Operational request ${opRequest.status.toLowerCase()} successfully.`,
  };
}

async function setCustomerRestriction(bankerUserId, customerId, { restriction, reason = "" }) {
  if (!Object.values(USER_STATUS).includes(restriction)) {
    throw ApiError.badRequest("Invalid restriction status", "INVALID_STATUS");
  }

  const customer = await User.findById(customerId);
  if (!customer) {
    throw ApiError.notFound("Customer not found", "CUSTOMER_NOT_FOUND");
  }

  customer.accountStatus = restriction;
  await customer.save();

  // Also adjust Account model status
  const account = await Account.findOne({ userId: customerId });
  if (account) {
    if (restriction === USER_STATUS.FROZEN) {
      account.status = ACCOUNT_STATUS.FROZEN;
    } else if (restriction === USER_STATUS.ACTIVE) {
      account.status = ACCOUNT_STATUS.ACTIVE;
    } else if (restriction === USER_STATUS.BLOCKED) {
      account.status = ACCOUNT_STATUS.FROZEN;
    }
    await account.save();
  }

  await createNotification({
    recipientUserId: customer._id,
    type: "ACCOUNT_RESTRICTION",
    title: "Account Status Changed",
    message: `Your account status has been updated to ${restriction}. Reason: ${reason || 'Bank operational review'}.`,
    resourceType: "USER",
    resourceId: customer._id.toString(),
  });

  await logAudit({
    actorUserId: bankerUserId,
    action: "CUSTOMER_RESTRICTION_SET",
    resourceType: "USER",
    resourceId: customer._id.toString(),
    metadata: { restriction, reason },
  });

  return {
    customerId: customer._id,
    accountStatus: customer.accountStatus,
    message: `Customer account status updated to ${restriction}.`,
  };
}

module.exports = {
  listCustomers,
  getCustomerByAccountNumber,
  getSecurityEvents,
  getCustomerSecurityEvents,
  issueCustomerWarning,
  listOperationalRequests,
  decideOperationalRequest,
  setCustomerRestriction,
};
