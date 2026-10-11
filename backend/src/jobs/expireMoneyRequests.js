const MoneyRequest = require("../models/MoneyRequest");
const { MONEY_REQUEST_STATUS } = require("../config/constants");

let intervalHandle = null;

async function checkAndExpireMoneyRequests() {
  try {
    const now = new Date();
    const result = await MoneyRequest.updateMany(
      {
        status: MONEY_REQUEST_STATUS.PENDING,
        expiresAt: { $lt: now },
      },
      {
        $set: {
          status: MONEY_REQUEST_STATUS.EXPIRED,
        },
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`[Job] Expired ${result.modifiedCount} stale PENDING money requests`);
    }
  } catch (error) {
    console.error("[Job Error] Failed to expire money requests:", error.message);
  }
}

function startExpireMoneyRequestsJob(intervalMs = 60 * 1000) {
  if (intervalHandle) return;
  intervalHandle = setInterval(checkAndExpireMoneyRequests, intervalMs);
  console.log("[Job] Money request expiration job started");
}

function stopExpireMoneyRequestsJob() {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
  }
}

module.exports = {
  checkAndExpireMoneyRequests,
  startExpireMoneyRequestsJob,
  stopExpireMoneyRequestsJob,
};
