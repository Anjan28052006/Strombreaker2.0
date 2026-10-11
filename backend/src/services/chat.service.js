const { GoogleGenerativeAI } = require("@google/generative-ai");
const { LLM_API_KEY, LLM_MODEL } = require("../config/env");
const { checkFirewall } = require("./firewall.service");
const { canExecuteTool } = require("../firewall/toolGuard");
const { getBalance, getTransactionsForUser, maskAccountNumber } = require("./account.service");
const {
  prepareTransfer,
  confirmTransfer,
  createOperationalRequest,
} = require("./transaction.service");
const { createMoneyRequest } = require("./moneyRequest.service");
const { createLoanDraft, submitLoanApplication, getLoansForUser } = require("./loan.service");
const { getUserNotifications } = require("./notification.service");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const ApiError = require("../utils/ApiError");

/**
 * Tool definitions and executor
 */
async function executeTool(toolName, args, user, firewallResult) {
  const guard = canExecuteTool({
    toolName,
    user,
    firewallVerdict: firewallResult.verdict,
    toolArgs: args,
  });

  if (!guard.allowed) {
    return {
      success: false,
      error: guard.reason,
    };
  }

  try {
    switch (toolName) {
      case "get_balance": {
        const balance = await getBalance(user._id);
        return {
          success: true,
          data: balance,
          formatted: `Your available balance is ₹${balance.balanceRupees.toFixed(2)} in account ${balance.accountNumber}.`,
        };
      }

      case "get_transaction_history": {
        const history = await getTransactionsForUser(user._id, {
          page: 1,
          limit: args.limit || 5,
        });
        return {
          success: true,
          data: history.transactions,
          formatted: `Retrieved ${history.transactions.length} recent transactions.`,
        };
      }

      case "get_transaction_status": {
        const tx = await Transaction.findOne({
          $or: [{ _id: args.transactionId }, { reference: args.reference }],
        });
        if (!tx) return { success: false, error: "Transaction not found" };
        return {
          success: true,
          data: {
            reference: tx.reference,
            status: tx.status,
            amount: tx.amountPaise / 100,
            memo: tx.memo,
            createdAt: tx.createdAt,
          },
        };
      }

      case "resolve_recipient": {
        if (!args.accountNumber) {
          return {
            success: false,
            error: "Recipient account number is required. Please provide a 12-digit account number.",
          };
        }
        const acc = await Account.findOne({ accountNumber: args.accountNumber.trim() }).populate("userId");
        if (!acc) return { success: false, error: "Recipient account not found." };
        return {
          success: true,
          data: {
            accountNumber: acc.accountNumber,
            maskedAccountNumber: maskAccountNumber(acc.accountNumber),
            recipientName: acc.userId?.fullName || "Verified Customer",
          },
        };
      }

      case "prepare_transfer": {
        if (!args.recipientAccountNumber) {
          return {
            success: false,
            error: "Please provide the exact recipient account number to proceed with transfer.",
          };
        }
        const prepared = await prepareTransfer(user._id, {
          recipientAccountNumber: args.recipientAccountNumber,
          amount: Number(args.amount),
          memo: args.memo || "AI Assistant Transfer",
        });
        return {
          success: true,
          data: prepared,
          formatted: `Transfer prepared: ₹${prepared.amount.toFixed(2)} to ${prepared.recipientDisplayName} (${prepared.maskedRecipientAccountNumber}). Please explicitly confirm this transfer with token: ${prepared.confirmationToken}`,
        };
      }

      case "execute_confirmed_transfer": {
        const confirmed = await confirmTransfer(user._id, {
          transactionId: args.transactionId,
          confirmationToken: args.confirmationToken,
        });
        return {
          success: true,
          data: confirmed,
          formatted: `Transfer successfully completed! Reference: ${confirmed.reference}, Amount: ₹${confirmed.amount.toFixed(2)}.`,
        };
      }

      case "create_money_request": {
        const req = await createMoneyRequest(user._id, {
          recipientAccountNumber: args.recipientAccountNumber,
          amount: Number(args.amount),
          memo: args.memo || "",
        });
        return {
          success: true,
          data: req,
          formatted: `Money request for ₹${req.amount.toFixed(2)} sent to account ${req.recipientAccountNumber}.`,
        };
      }

      case "submit_deposit_request": {
        const dep = await createOperationalRequest(user._id, "DEPOSIT", {
          amount: Number(args.amount),
          notes: args.notes || "Requested via AI Assistant",
        });
        return {
          success: true,
          data: dep,
          formatted: dep.message,
        };
      }

      case "submit_withdrawal_request": {
        const wth = await createOperationalRequest(user._id, "WITHDRAWAL", {
          amount: Number(args.amount),
          notes: args.notes || "Requested via AI Assistant",
        });
        return {
          success: true,
          data: wth,
          formatted: wth.message,
        };
      }

      case "prepare_loan_application": {
        const draft = await createLoanDraft(user._id, {
          loanType: args.loanType || "PERSONAL",
          requestedAmount: Number(args.requestedAmount),
          purpose: args.purpose || "",
          annualIncome: Number(args.annualIncome || 0),
          tenureMonths: Number(args.tenureMonths || 12),
        });
        return {
          success: true,
          data: draft,
          formatted: `Loan draft created for ₹${draft.requestedAmount.toFixed(2)}. Review the details and submit when ready.`,
        };
      }

      case "submit_loan_application": {
        const submitted = await submitLoanApplication(user._id, args.loanId);
        return {
          success: true,
          data: submitted,
          formatted: submitted.message,
        };
      }

      case "get_notifications": {
        const notes = await getUserNotifications(user._id, { limit: 5 });
        return {
          success: true,
          data: notes.notifications,
          formatted: `You have ${notes.pagination.unreadCount} unread notifications.`,
        };
      }

      default:
        return { success: false, error: `Tool ${toolName} not implemented` };
    }
  } catch (err) {
    return {
      success: false,
      error: err.message || "Failed to execute banking tool",
    };
  }
}

/**
 * Resolve flexible model names (e.g. 1.5, 2.0, 2.1, gemini-1.5-flash)
 */
function resolveModelName(rawModel) {
  if (!rawModel || typeof rawModel !== "string") return "gemini-1.5-flash";
  const trimmed = rawModel.trim();
  if (!trimmed) return "gemini-1.5-flash";
  if (trimmed.startsWith("gemini-") || trimmed.startsWith("models/")) return trimmed;
  if (trimmed === "1.5" || trimmed === "1.5-flash") return "gemini-1.5-flash";
  if (trimmed === "1.5-pro") return "gemini-1.5-pro";
  if (trimmed === "2.0" || trimmed === "2.0-flash") return "gemini-2.0-flash";
  if (trimmed === "2.0-pro" || trimmed === "2.0-pro-exp") return "gemini-2.0-pro-exp";
  if (trimmed === "2.1" || trimmed === "2.5" || trimmed === "2.5-flash") return `gemini-${trimmed}`;
  return `gemini-${trimmed}`;
}

/**
 * Handle incoming conversational messages
 */
async function processChatMessage(user, { message, conversationId = null }) {
  if (!message || typeof message !== "string" || !message.trim()) {
    throw ApiError.badRequest("Message cannot be empty", "INVALID_MESSAGE");
  }

  // 1. Run AI Firewall
  const firewallResult = await checkFirewall({
    text: message,
    context: { action: "chat", role: user.role },
    userId: user._id,
  });

  // If blocked by Firewall, return immediate defensive response
  if (firewallResult.verdict === "BLOCK") {
    return {
      conversationId: conversationId || "conv-" + Date.now(),
      reply: `🛡️ Security Alert: Your request was blocked by the Bankism Blue-Team AI Firewall.\nReason: ${firewallResult.rationale} (Threat Category: ${firewallResult.threat_category}, Risk Level: ${firewallResult.risk_level}).`,
      firewall: firewallResult,
      actionRequired: null,
      toolResults: [],
    };
  }

  // 2. Identify and execute banking tools based on intent and input
  const normalized = message.trim().toLowerCase();
  const toolResults = [];
  let actionRequired = null;
  let reply = "";

  // Check for balance inquiry
  if (normalized.includes("balance") || normalized.includes("how much money")) {
    const res = await executeTool("get_balance", {}, user, firewallResult);
    toolResults.push({ tool: "get_balance", result: res });
    reply = res.success
      ? res.formatted
      : `I couldn't retrieve your balance: ${res.error}`;
  }
  // Check for transaction history
  else if (normalized.includes("transaction") || normalized.includes("history") || normalized.includes("recent spending")) {
    const res = await executeTool("get_transaction_history", { limit: 5 }, user, firewallResult);
    toolResults.push({ tool: "get_transaction_history", result: res });
    if (res.success) {
      if (res.data.length === 0) {
        reply = "You don't have any past transactions on record yet.";
      } else {
        const list = res.data
          .map(
            (t) =>
              `• ${t.type === "OUTGOING" ? "Sent" : "Received"} ₹${t.amountRupees.toFixed(2)} (${t.counterpartyAccountNumber}) - ${t.status}`
          )
          .join("\n");
        reply = `Here are your most recent transactions:\n${list}`;
      }
    } else {
      reply = `Could not retrieve transactions: ${res.error}`;
    }
  }
  // Check for transfer intent
  else if (normalized.includes("transfer") || normalized.includes("send money") || normalized.includes("pay")) {
    // Extract amount and account number if mentioned
    const amountMatch = normalized.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d{1,2})?)/i);
    const accountMatch = normalized.match(/\b(4091\d{8}|\d{10,16})\b/);

    const amount = amountMatch ? parseFloat(amountMatch[1]) : null;
    const recipientAccountNumber = accountMatch ? accountMatch[1] : null;

    if (!recipientAccountNumber) {
      reply =
        "To ensure financial safety, I need the recipient's exact 12-digit account number. Please provide the account number (e.g. 4091XXXXXXXX) and the amount in ₹.";
    } else if (!amount || amount <= 0) {
      reply = `I have recipient account ${recipientAccountNumber}, but I need the transfer amount in ₹. How much would you like to transfer?`;
    } else {
      const res = await executeTool(
        "prepare_transfer",
        { recipientAccountNumber, amount, memo: "Transfer via AI Assistant" },
        user,
        firewallResult
      );
      toolResults.push({ tool: "prepare_transfer", result: res });
      if (res.success) {
        actionRequired = {
          type: "CONFIRM_TRANSFER",
          data: res.data,
        };
        reply = `I have verified the recipient and prepared your transfer:\n\n• Recipient: ${res.data.recipientDisplayName} (${res.data.maskedRecipientAccountNumber})\n• Amount: ₹${res.data.amount.toFixed(2)}\n• Expiry: 15 minutes\n\n⚠️ To protect your funds, please review these details and click Confirm Transfer to authorize payment.`;
      } else {
        reply = `Unable to prepare transfer: ${res.error}`;
      }
    }
  }
  // Check for loan inquiry
  else if (normalized.includes("loan") || normalized.includes("borrow")) {
    const amountMatch = normalized.match(/(\d+(?:\.\d{1,2})?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 50000;

    const res = await executeTool(
      "prepare_loan_application",
      { loanType: "PERSONAL", requestedAmount: amount, purpose: "General banking loan" },
      user,
      firewallResult
    );
    toolResults.push({ tool: "prepare_loan_application", result: res });
    if (res.success) {
      actionRequired = {
        type: "REVIEW_LOAN",
        data: res.data,
      };
      reply = `I've prepared a Personal Loan draft for ₹${amount.toFixed(2)}.\n\nNote: Bankism AI never automatically approves loans. The draft must be submitted and reviewed by bank management.`;
    } else {
      reply = `Could not create loan draft: ${res.error}`;
    }
  }
  // Check for notifications
  else if (normalized.includes("notification") || normalized.includes("alerts")) {
    const res = await executeTool("get_notifications", {}, user, firewallResult);
    toolResults.push({ tool: "get_notifications", result: res });
    reply = res.formatted;
  }
  // General banking conversation
  else {
    // If Gemini API Key is available, use live Gemini model with system guard prompt
    const apiKey = (LLM_API_KEY || process.env.LLM_API_KEY || "").trim();
    if (apiKey) {
      const resolvedModel = resolveModelName(LLM_MODEL || process.env.LLM_MODEL);
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: resolvedModel });
        const systemPrompt = `You are the Strombreaker 2.0 AI Banking Security Assistant. You assist authenticated customers with banking inquiries in INR (₹). You must adhere to strict financial guardrails. Never fabricate balances or completed transfers. Always remind customers that transfers require explicit user confirmation. Answer concisely and professionally.`;
        const result = await model.generateContent(`${systemPrompt}\nUser: ${message}`);
        reply = result.response.text();
      } catch (genErr) {
        console.warn(`[Gemini Error on ${resolvedModel}]:`, genErr.message);
        reply = `Hello ${user.fullName}, I am your Strombreaker 2.0 AI Banking Assistant. You can check your balance, view transactions, prepare a transfer, inquire about loans, or review notifications. How may I help you today?`;
      }
    } else {
      reply = `Hello ${user.fullName}, I am your Strombreaker 2.0 AI Banking Assistant. You can ask me to:\n• Check your account balance ("What is my balance?")\n• View recent transactions ("Show my transactions")\n• Prepare a secure transfer ("Transfer ₹500 to account 4091XXXXXXXX")\n• Apply for a loan ("I want to apply for a loan of ₹50,000")\n\nAll actions are protected by the Blue-Team AI Firewall. How can I assist you?`;
    }
  }

  return {
    conversationId: conversationId || "conv-" + Date.now(),
    reply,
    firewall: firewallResult,
    actionRequired,
    toolResults,
  };
}

module.exports = {
  processChatMessage,
  executeTool,
};
