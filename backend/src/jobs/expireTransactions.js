const Transaction = require("../models/Transaction");
const { TRANSACTION_STATUS } = require("../config/constants");

let intervalHandle = null;

async function checkAndExpireTransactions() {
  try {
    const now = new Date();
    const result = await Transaction.updateMany(
      {
        status: TRANSACTION_STATUS.PREPARED,
        confirmationExpiresAt: { $lt: now },
      },
      {
        $set: {
          status: TRANSACTION_STATUS.EXPIRED,
          confirmationTokenHash: null,
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`[Job] Expired ${result.modifiedCount} stale PREPARED transactions`);
    }
  } catch (error) {
    console.error("[Job Error] Failed to expire transactions:", error.message);
  }
}

function startExpireTransactionsJob(intervalMs = 60 * 1000) {
  if (intervalHandle) return;
  intervalHandle = setInterval(checkAndExpireTransactions, intervalMs);
  console.log("[Job] Transaction expiration job started");
}

function stopExpireTransactionsJob() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
}

module.exports = {
  checkAndExpireTransactions,
  startExpireTransactionsJob,
  stopExpireTransactionsJob,
};
