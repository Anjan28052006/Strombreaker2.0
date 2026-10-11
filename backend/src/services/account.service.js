const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const ApiError = require("../utils/ApiError");

function maskAccountNumber(accNum) {
  if (!accNum || accNum.length < 8) return accNum;
  return accNum.slice(0, 4) + "••••" + accNum.slice(-4);
}

async function getAccountForUser(userId) {
  const account = await Account.findOne({ userId });
  if (!account) {
    throw ApiError.notFound("No bank account found for this user", "ACCOUNT_NOT_FOUND");
  }

  return {
    id: account._id,
    accountNumber: account.accountNumber,
    maskedAccountNumber: maskAccountNumber(account.accountNumber),
    accountType: account.accountType,
    balancePaise: account.balancePaise,
    balanceRupees: account.balancePaise / 100,
    currency: account.currency,
    status: account.status,
    createdAt: account.createdAt,
  };
}

async function getBalance(userId) {
  const account = await Account.findOne({ userId });
  if (!account) {
    throw ApiError.notFound("No bank account found for this user", "ACCOUNT_NOT_FOUND");
  }

  return {
    accountNumber: maskAccountNumber(account.accountNumber),
    balancePaise: account.balancePaise,
    balanceRupees: account.balancePaise / 100,
    currency: account.currency,
    status: account.status,
  };
}

async function getTransactionsForUser(userId, { page = 1, limit = 20, type = null } = {}) {
  const account = await Account.findOne({ userId });
  if (!account) {
    throw ApiError.notFound("No bank account found for this user", "ACCOUNT_NOT_FOUND");
  }

  const query = {
    $or: [{ senderAccountId: account._id }, { recipientAccountId: account._id }],
  };

  if (type === "INCOMING") {
    query.$or = [{ recipientAccountId: account._id }];
  } else if (type === "OUTGOING") {
    query.$or = [{ senderAccountId: account._id }];
  }

  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    Transaction.find(query)
      .populate("senderAccountId", "accountNumber")
      .populate("recipientAccountId", "accountNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Transaction.countDocuments(query),
  ]);

  const formattedTransactions = transactions.map((tx) => {
    const isOutgoing = tx.senderAccountId?._id?.toString() === account._id.toString();
    const counterpartyAccount = isOutgoing
      ? tx.recipientAccountId?.accountNumber
      : tx.senderAccountId?.accountNumber;

    return {
      id: tx._id,
      reference: tx.reference,
      type: isOutgoing ? "OUTGOING" : "INCOMING",
      amountPaise: tx.amountPaise,
      amountRupees: tx.amountPaise / 100,
      memo: tx.memo,
      status: tx.status,
      counterpartyAccountNumber: maskAccountNumber(counterpartyAccount),
      counterpartyRawAccountNumber: counterpartyAccount,
      createdAt: tx.createdAt,
      confirmedAt: tx.confirmedAt,
    };
  });

  return {
    transactions: formattedTransactions,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

module.exports = {
  maskAccountNumber,
  getAccountForUser,
  getBalance,
  getTransactionsForUser,
};
