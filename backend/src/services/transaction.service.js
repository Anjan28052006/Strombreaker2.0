const mongoose = require("mongoose");
const Account = require("../models/Account");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const OperationalRequest = require("../models/OperationalRequest");
const ApiError = require("../utils/ApiError");
const { TRANSACTION_STATUS, ACCOUNT_STATUS, USER_STATUS, LIMITS } = require("../config/constants");
const {
  generateTransactionReference,
  generateConfirmationToken,
  hashToken,
  generateReference,
} = require("../utils/generateReference");
const { maskAccountNumber } = require("./account.service");
const { checkIdempotency, setIdempotency } = require("../security/idempotency");
const { logAudit } = require("./audit.service");
const { createNotification } = require("./notification.service");

async function prepareTransfer(userId, { recipientAccountNumber, amount, memo = "", idempotencyKey = null }) {
  // 1. Validate sender
  const senderAccount = await Account.findOne({ userId });
  if (!senderAccount) {
    throw ApiError.notFound("Sender bank account not found", "SENDER_ACCOUNT_NOT_FOUND");
  }

  if (senderAccount.status !== ACCOUNT_STATUS.ACTIVE) {
    throw ApiError.forbidden(`Sender account is ${senderAccount.status}. Transfers are disabled.`, "ACCOUNT_RESTRICTED");
  }

  // 2. Validate amount in integer paise
  const amountPaise = Math.round(amount * 100);
  if (amountPaise <= 0 || !Number.isInteger(amountPaise)) {
    throw ApiError.badRequest("Invalid transfer amount", "INVALID_AMOUNT");
  }

  if (amountPaise > LIMITS.MAX_TRANSFER_AMOUNT_PAISE) {
    throw ApiError.badRequest(
      `Amount exceeds maximum allowed limit of ₹${LIMITS.MAX_TRANSFER_AMOUNT_PAISE / 100}`,
      "LIMIT_EXCEEDED"
    );
  }

  if (senderAccount.balancePaise < amountPaise) {
    throw ApiError.badRequest("Insufficient account balance for this transfer", "INSUFFICIENT_FUNDS");
  }

  // 3. Validate recipient
  const recipientAccount = await Account.findOne({ accountNumber: recipientAccountNumber.trim() }).populate("userId");
  if (!recipientAccount) {
    throw ApiError.notFound("Recipient account number does not exist", "RECIPIENT_NOT_FOUND");
  }

  if (recipientAccount._id.toString() === senderAccount._id.toString()) {
    throw ApiError.badRequest("Cannot transfer money to the same account", "SELF_TRANSFER_PROHIBITED");
  }

  if (recipientAccount.status !== ACCOUNT_STATUS.ACTIVE) {
    throw ApiError.badRequest("Recipient account is not active and cannot receive funds", "RECIPIENT_INACTIVE");
  }

  // 4. Create PREPARED transaction (no money moved!)
  const rawToken = generateConfirmationToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + LIMITS.TRANSFER_CONFIRMATION_EXPIRES_MINUTES * 60 * 1000);
  const reference = generateTransactionReference();

  const transaction = await Transaction.create({
    reference,
    senderAccountId: senderAccount._id,
    recipientAccountId: recipientAccount._id,
    amountPaise,
    memo: memo.trim().slice(0, 250),
    status: TRANSACTION_STATUS.PREPARED,
    idempotencyKey,
    confirmationTokenHash: tokenHash,
    confirmationExpiresAt: expiresAt,
  });

  await logAudit({
    actorUserId: userId,
    action: "TRANSFER_PREPARED",
    resourceType: "TRANSACTION",
    resourceId: transaction._id.toString(),
    metadata: { reference, amountPaise },
  });

  return {
    transactionId: transaction._id,
    reference: transaction.reference,
    recipientDisplayName: recipientAccount.userId?.fullName || "Verified Bank Customer",
    maskedRecipientAccountNumber: maskAccountNumber(recipientAccount.accountNumber),
    recipientAccountNumber: recipientAccount.accountNumber,
    amount: amount,
    amountPaise,
    currency: "INR",
    memo: transaction.memo,
    expiresAt,
    confirmationToken: rawToken,
    requiresConfirmation: true,
  };
}

async function confirmTransfer(userId, { transactionId, confirmationToken, idempotencyKey = null }) {
  // Idempotency check
  if (idempotencyKey) {
    const cached = checkIdempotency(idempotencyKey);
    if (cached) {
      return cached;
    }
  }

  // 1. Find prepared transaction with token hash
  const transaction = await Transaction.findById(transactionId).select("+confirmationTokenHash");
  if (!transaction) {
    throw ApiError.notFound("Transaction not found", "TRANSACTION_NOT_FOUND");
  }

  if (transaction.status === TRANSACTION_STATUS.COMPLETED) {
    throw ApiError.conflict("This transaction has already been completed", "TRANSACTION_ALREADY_COMPLETED");
  }

  if (transaction.status !== TRANSACTION_STATUS.PREPARED) {
    throw ApiError.badRequest(
      `Cannot confirm transaction in status '${transaction.status}'`,
      "INVALID_TRANSACTION_STATUS"
    );
  }

  // 2. Verify ownership
  const senderAccount = await Account.findById(transaction.senderAccountId);
  if (!senderAccount || senderAccount.userId.toString() !== userId.toString()) {
    throw ApiError.forbidden("You are not authorized to confirm this transaction", "UNAUTHORIZED_TRANSACTION");
  }

  // 3. Verify token and expiry
  const tokenHash = hashToken(confirmationToken);
  if (transaction.confirmationTokenHash !== tokenHash) {
    throw ApiError.unauthorized("Invalid confirmation token", "INVALID_CONFIRMATION_TOKEN");
  }

  if (new Date() > transaction.confirmationExpiresAt) {
    transaction.status = TRANSACTION_STATUS.EXPIRED;
    await transaction.save();
    throw ApiError.badRequest("Confirmation token has expired. Please prepare a new transfer.", "CONFIRMATION_EXPIRED");
  }

  // 4. Verify balances and accounts
  const recipientAccount = await Account.findById(transaction.recipientAccountId);
  if (!recipientAccount) {
    throw ApiError.notFound("Recipient account no longer exists", "RECIPIENT_NOT_FOUND");
  }

  if (senderAccount.status !== ACCOUNT_STATUS.ACTIVE || recipientAccount.status !== ACCOUNT_STATUS.ACTIVE) {
    throw ApiError.forbidden("One or both accounts are restricted. Transfer aborted.", "ACCOUNTS_RESTRICTED");
  }

  const amountPaise = transaction.amountPaise;

  // 5. Atomic debit and credit execution
  // Check if MongoDB deployment supports multi-document transactions (Replica Set)
  let isReplicaSet = false;
  try {
    const admin = new mongoose.mongo.Admin(mongoose.connection.db);
    const serverStatus = await admin.serverStatus();
    isReplicaSet = !!serverStatus.repl;
  } catch (_) {
    isReplicaSet = false;
  }

  if (isReplicaSet) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const updatedSender = await Account.findOneAndUpdate(
        { _id: senderAccount._id, balancePaise: { $gte: amountPaise } },
        { $inc: { balancePaise: -amountPaise } },
        { session, new: true }
      );

      if (!updatedSender) {
        throw new Error("Insufficient funds during atomic execution");
      }

      await Account.findByIdAndUpdate(
        recipientAccount._id,
        { $inc: { balancePaise: amountPaise } },
        { session }
      );

      transaction.status = TRANSACTION_STATUS.COMPLETED;
      transaction.confirmedAt = new Date();
      transaction.confirmationTokenHash = undefined;
      await transaction.save({ session });

      await session.commitTransaction();
    } catch (txErr) {
      await session.abortTransaction();
      throw ApiError.badRequest(txErr.message || "Transfer execution failed", "TRANSFER_FAILED");
    } finally {
      session.endSession();
    }
  } else {
    // Standalone MongoDB atomic conditional update:
    // Guarantees sender cannot be debited below 0 or concurrently double-debited
    const debitedSender = await Account.findOneAndUpdate(
      { _id: senderAccount._id, balancePaise: { $gte: amountPaise } },
      { $inc: { balancePaise: -amountPaise } },
      { new: true }
    );

    if (!debitedSender) {
      throw ApiError.badRequest("Insufficient funds at execution time", "INSUFFICIENT_FUNDS");
    }

    try {
      await Account.findByIdAndUpdate(recipientAccount._id, {
        $inc: { balancePaise: amountPaise },
      });

      transaction.status = TRANSACTION_STATUS.COMPLETED;
      transaction.confirmedAt = new Date();
      transaction.confirmationTokenHash = undefined;
      await transaction.save();
    } catch (creditErr) {
      // Revert sender balance on failure to preserve financial integrity
      await Account.findByIdAndUpdate(senderAccount._id, {
        $inc: { balancePaise: amountPaise },
      });
      transaction.status = TRANSACTION_STATUS.FAILED;
      await transaction.save();
      throw ApiError.internal("Credit failure; debit successfully reversed", "ATOMIC_CREDIT_FAILED");
    }
  }

  // 6. Notifications and Audit Logging
  await Promise.all([
    createNotification({
      recipientUserId: senderAccount.userId,
      type: "TRANSFER_COMPLETED",
      title: "Transfer Sent",
      message: `You transferred ₹${(amountPaise / 100).toFixed(2)} to ${maskAccountNumber(recipientAccount.accountNumber)}.`,
      resourceType: "TRANSACTION",
      resourceId: transaction._id.toString(),
    }),
    createNotification({
      recipientUserId: recipientAccount.userId,
      type: "TRANSFER_COMPLETED",
      title: "Funds Received",
      message: `You received ₹${(amountPaise / 100).toFixed(2)} from ${maskAccountNumber(senderAccount.accountNumber)}.`,
      resourceType: "TRANSACTION",
      resourceId: transaction._id.toString(),
    }),
    logAudit({
      actorUserId: userId,
      action: "TRANSFER_CONFIRMED",
      resourceType: "TRANSACTION",
      resourceId: transaction._id.toString(),
      metadata: {
        reference: transaction.reference,
        amountPaise,
        senderAccountId: senderAccount._id,
        recipientAccountId: recipientAccount._id,
      },
    }),
  ]);

  const result = {
    transactionId: transaction._id,
    reference: transaction.reference,
    status: transaction.status,
    amount: amountPaise / 100,
    amountPaise,
    currency: "INR",
    recipientAccountNumber: maskAccountNumber(recipientAccount.accountNumber),
    senderAccountNumber: maskAccountNumber(senderAccount.accountNumber),
    confirmedAt: transaction.confirmedAt,
    memo: transaction.memo,
  };

  if (idempotencyKey) {
    setIdempotency(idempotencyKey, result);
  }

  return result;
}

async function cancelTransaction(userId, transactionId) {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction) {
    throw ApiError.notFound("Transaction not found", "TRANSACTION_NOT_FOUND");
  }

  const account = await Account.findById(transaction.senderAccountId);
  if (!account || account.userId.toString() !== userId.toString()) {
    throw ApiError.forbidden("Not authorized to cancel this transaction", "UNAUTHORIZED_CANCELLATION");
  }

  if (transaction.status !== TRANSACTION_STATUS.PREPARED) {
    throw ApiError.badRequest(
      `Cannot cancel transaction with status '${transaction.status}'. Only PREPARED transactions can be cancelled.`,
      "CANNOT_CANCEL"
    );
  }

  transaction.status = TRANSACTION_STATUS.CANCELLED;
  transaction.confirmationTokenHash = undefined;
  await transaction.save();

  await logAudit({
    actorUserId: userId,
    action: "TRANSFER_CANCELLED",
    resourceType: "TRANSACTION",
    resourceId: transaction._id.toString(),
  });

  return {
    transactionId: transaction._id,
    reference: transaction.reference,
    status: transaction.status,
    message: "Transaction cancelled successfully",
  };
}

async function createOperationalRequest(userId, type, { amount, notes = "" }) {
  const account = await Account.findOne({ userId });
  if (!account) {
    throw ApiError.notFound("Account not found", "ACCOUNT_NOT_FOUND");
  }

  const amountPaise = Math.round(amount * 100);
  if (amountPaise <= 0 || !Number.isInteger(amountPaise)) {
    throw ApiError.badRequest("Invalid amount", "INVALID_AMOUNT");
  }

  if (type === "WITHDRAWAL" && account.balancePaise < amountPaise) {
    throw ApiError.badRequest("Insufficient balance for withdrawal request", "INSUFFICIENT_FUNDS");
  }

  const reference = generateReference(type === "DEPOSIT" ? "DEP" : "WTH");

  const opRequest = await OperationalRequest.create({
    reference,
    userId,
    accountId: account._id,
    type,
    amountPaise,
    notes: notes.trim(),
  });

  await logAudit({
    actorUserId: userId,
    action: `OPERATIONAL_REQUEST_${type}`,
    resourceType: "OPERATIONAL_REQUEST",
    resourceId: opRequest._id.toString(),
    metadata: { reference, amountPaise },
  });

  return {
    requestId: opRequest._id,
    reference: opRequest.reference,
    type: opRequest.type,
    amount: amountPaise / 100,
    amountPaise,
    status: opRequest.status,
    notes: opRequest.notes,
    createdAt: opRequest.createdAt,
    message: `${type === "DEPOSIT" ? "Deposit" : "Withdrawal"} request submitted for banker review. Balance will update once approved.`,
  };
}

async function getOperationalRequestsForUser(userId) {
  const requests = await OperationalRequest.find({ userId }).sort({ createdAt: -1 }).lean();
  return requests.map((req) => ({
    id: req._id,
    reference: req.reference,
    type: req.type,
    amount: req.amountPaise / 100,
    amountPaise: req.amountPaise,
    status: req.status,
    notes: req.notes,
    createdAt: req.createdAt,
    decisionReason: req.decisionReason,
    reviewedAt: req.reviewedAt,
  }));
}

module.exports = {
  prepareTransfer,
  confirmTransfer,
  cancelTransaction,
  createOperationalRequest,
  getOperationalRequestsForUser,
};
