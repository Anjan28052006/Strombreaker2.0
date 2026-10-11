const MoneyRequest = require("../models/MoneyRequest");
const Account = require("../models/Account");
const ApiError = require("../utils/ApiError");
const { MONEY_REQUEST_STATUS, LIMITS } = require("../config/constants");
const { generateReference } = require("../utils/generateReference");
const { maskAccountNumber } = require("./account.service");
const { prepareTransfer } = require("./transaction.service");
const { createNotification } = require("./notification.service");
const { logAudit } = require("./audit.service");

async function createMoneyRequest(userId, { recipientAccountNumber, amount, memo = "" }) {
  const requesterAccount = await Account.findOne({ userId });
  if (!requesterAccount) {
    throw ApiError.notFound("Requester bank account not found", "ACCOUNT_NOT_FOUND");
  }

  const recipientAccount = await Account.findOne({ accountNumber: recipientAccountNumber.trim() }).populate("userId");
  if (!recipientAccount) {
    throw ApiError.notFound("Recipient account not found", "RECIPIENT_NOT_FOUND");
  }

  if (requesterAccount._id.toString() === recipientAccount._id.toString()) {
    throw ApiError.badRequest("Cannot request money from yourself", "SELF_REQUEST_PROHIBITED");
  }

  const amountPaise = Math.round(amount * 100);
  if (amountPaise <= 0 || !Number.isInteger(amountPaise)) {
    throw ApiError.badRequest("Invalid amount", "INVALID_AMOUNT");
  }

  const reference = generateReference("REQ");
  const expiresAt = new Date(Date.now() + LIMITS.MONEY_REQUEST_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

  const request = await MoneyRequest.create({
    reference,
    requesterAccountId: requesterAccount._id,
    recipientAccountId: recipientAccount._id,
    amountPaise,
    memo: memo.trim(),
    status: MONEY_REQUEST_STATUS.PENDING,
    expiresAt,
  });

  await createNotification({
    recipientUserId: recipientAccount.userId._id,
    type: "MONEY_REQUEST",
    title: "Money Request Received",
    message: `${requesterAccount.userId} has requested ₹${(amountPaise / 100).toFixed(2)}: "${memo || 'No memo'}"`,
    resourceType: "MONEY_REQUEST",
    resourceId: request._id.toString(),
  });

  await logAudit({
    actorUserId: userId,
    action: "MONEY_REQUEST_CREATED",
    resourceType: "MONEY_REQUEST",
    resourceId: request._id.toString(),
    metadata: { reference, amountPaise },
  });

  return {
    requestId: request._id,
    reference: request.reference,
    amount: amountPaise / 100,
    amountPaise,
    memo: request.memo,
    recipientAccountNumber: maskAccountNumber(recipientAccount.accountNumber),
    status: request.status,
    expiresAt: request.expiresAt,
  };
}

async function getMoneyRequestsForUser(userId) {
  const account = await Account.findOne({ userId });
  if (!account) {
    throw ApiError.notFound("Account not found", "ACCOUNT_NOT_FOUND");
  }

  const requests = await MoneyRequest.find({
    $or: [{ requesterAccountId: account._id }, { recipientAccountId: account._id }],
  })
    .populate("requesterAccountId", "accountNumber")
    .populate("recipientAccountId", "accountNumber")
    .sort({ createdAt: -1 })
    .lean();

  return requests.map((req) => {
    const isRequester = req.requesterAccountId?._id?.toString() === account._id.toString();
    return {
      id: req._id,
      reference: req.reference,
      role: isRequester ? "REQUESTER" : "RECIPIENT",
      amount: req.amountPaise / 100,
      amountPaise: req.amountPaise,
      memo: req.memo,
      status: req.status,
      requesterAccountNumber: maskAccountNumber(req.requesterAccountId?.accountNumber),
      recipientAccountNumber: maskAccountNumber(req.recipientAccountId?.accountNumber),
      createdAt: req.createdAt,
      expiresAt: req.expiresAt,
    };
  });
}

async function respondToMoneyRequest(userId, requestId, { action }) {
  const request = await MoneyRequest.findById(requestId)
    .populate("requesterAccountId")
    .populate("recipientAccountId");

  if (!request) {
    throw ApiError.notFound("Money request not found", "REQUEST_NOT_FOUND");
  }

  // Only recipient can respond
  if (request.recipientAccountId?.userId?.toString() !== userId.toString()) {
    throw ApiError.forbidden("Only the intended recipient can respond to this request", "UNAUTHORIZED");
  }

  if (request.status !== MONEY_REQUEST_STATUS.PENDING) {
    throw ApiError.badRequest(`Request is already ${request.status}`, "INVALID_REQUEST_STATUS");
  }

  if (action === "REJECT") {
    request.status = MONEY_REQUEST_STATUS.REJECTED;
    await request.save();

    await logAudit({
      actorUserId: userId,
      action: "MONEY_REQUEST_REJECTED",
      resourceType: "MONEY_REQUEST",
      resourceId: request._id.toString(),
    });

    return {
      requestId: request._id,
      status: request.status,
      message: "Money request rejected",
    };
  }

  if (action === "ACCEPT") {
    // Accepting prepares a transfer — DOES NOT immediately debit!
    request.status = MONEY_REQUEST_STATUS.ACCEPTED;
    await request.save();

    const prepared = await prepareTransfer(userId, {
      recipientAccountNumber: request.requesterAccountId.accountNumber,
      amount: request.amountPaise / 100,
      memo: `Accepted request ${request.reference}: ${request.memo}`,
    });

    return {
      requestId: request._id,
      status: request.status,
      message: "Request accepted. Prepared transfer requires your explicit confirmation.",
      preparedTransfer: prepared,
    };
  }

  throw ApiError.badRequest("Invalid action: must be ACCEPT or REJECT", "INVALID_ACTION");
}

async function cancelMoneyRequest(userId, requestId) {
  const request = await MoneyRequest.findById(requestId).populate("requesterAccountId");
  if (!request) {
    throw ApiError.notFound("Money request not found", "REQUEST_NOT_FOUND");
  }

  if (request.requesterAccountId?.userId?.toString() !== userId.toString()) {
    throw ApiError.forbidden("Only the creator can cancel this request", "UNAUTHORIZED");
  }

  if (request.status !== MONEY_REQUEST_STATUS.PENDING) {
    throw ApiError.badRequest(`Cannot cancel request with status ${request.status}`, "CANNOT_CANCEL");
  }

  request.status = MONEY_REQUEST_STATUS.CANCELLED;
  await request.save();

  return {
    requestId: request._id,
    status: request.status,
    message: "Money request cancelled",
  };
}

module.exports = {
  createMoneyRequest,
  getMoneyRequestsForUser,
  respondToMoneyRequest,
  cancelMoneyRequest,
};
