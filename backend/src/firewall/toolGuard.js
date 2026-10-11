const { USER_STATUS } = require("../config/constants");
const ApiError = require("../utils/ApiError");

const PERMITTED_TOOLS = [
  "get_balance",
  "get_transaction_history",
  "get_transaction_status",
  "resolve_recipient",
  "prepare_transfer",
  "execute_confirmed_transfer",
  "create_money_request",
  "submit_deposit_request",
  "submit_withdrawal_request",
  "prepare_loan_application",
  "submit_loan_application",
  "get_notifications",
];

const READ_ONLY_TOOLS = [
  "get_balance",
  "get_transaction_history",
  "get_transaction_status",
  "resolve_recipient",
  "get_notifications",
];

function canExecuteTool({ toolName, user, firewallVerdict, toolArgs = {} }) {
  // 1. Tool name check
  if (!PERMITTED_TOOLS.includes(toolName)) {
    return {
      allowed: false,
      reason: `Unauthorized tool invocation: '${toolName}' is not in approved tool registry.`,
    };
  }

  // 2. Firewall check
  if (firewallVerdict === "BLOCK") {
    return {
      allowed: false,
      reason: "Action blocked by AI Firewall policy.",
    };
  }

  // 3. User account status check
  if (user.accountStatus === USER_STATUS.BLOCKED || user.accountStatus === USER_STATUS.REJECTED) {
    return {
      allowed: false,
      reason: "Account is blocked or rejected. Tool execution is prohibited.",
    };
  }

  // 4. Frozen account check: can only do read-only operations
  if (user.accountStatus === USER_STATUS.FROZEN && !READ_ONLY_TOOLS.includes(toolName)) {
    return {
      allowed: false,
      reason: "Account is frozen. Financial transactions and requests are disabled.",
    };
  }

  // 5. Pending account check
  if (user.accountStatus === USER_STATUS.PENDING && !READ_ONLY_TOOLS.includes(toolName)) {
    return {
      allowed: false,
      reason: "Account is pending manager approval. Financial actions are not yet enabled.",
    };
  }

  // 6. Direct execution check: transfer execution requires confirmed token
  if (toolName === "execute_confirmed_transfer") {
    if (!toolArgs.transactionId || !toolArgs.confirmationToken) {
      return {
        allowed: false,
        reason: "execute_confirmed_transfer requires explicit transactionId and confirmationToken issued by backend.",
      };
    }
  }

  return {
    allowed: true,
    reason: null,
  };
}

module.exports = {
  PERMITTED_TOOLS,
  READ_ONLY_TOOLS,
  canExecuteTool,
};
