const { THREAT_CATEGORIES, VERDICTS, RISK_LEVELS } = require("../config/constants");

/**
 * Policy Engine
 * Combines normalized input, injection detections, jailbreak detections,
 * and contextual analysis into deterministic policy verdicts.
 */

function evaluatePolicy({ normalizedText, flags, injectionResult, jailbreakResult, context = {} }) {
  // 1. Check for prompt injection
  if (injectionResult.detected) {
    return {
      verdict: VERDICTS.BLOCK,
      threatCategory: THREAT_CATEGORIES.PROMPT_INJECTION,
      riskLevel: RISK_LEVELS.HIGH,
      rationale: `Prompt injection pattern detected: "${injectionResult.matches[0]}"`,
      requiresConfirmation: true,
      permittedAction: null,
    };
  }

  // 2. Check for jailbreak attempts
  if (jailbreakResult.detected) {
    return {
      verdict: VERDICTS.BLOCK,
      threatCategory: THREAT_CATEGORIES.JAILBREAK,
      riskLevel: RISK_LEVELS.CRITICAL,
      rationale: `Jailbreak / roleplay override attempt detected: "${jailbreakResult.matches[0]}"`,
      requiresConfirmation: true,
      permittedAction: null,
    };
  }

  // 3. Check for memo injection (if memo was passed in context or text has memo prefix)
  const isMemo = context.action === "memo" || !!context.memo;
  const memoText = context.memo || normalizedText;
  const memoInjectionPattern = /(?:ignore|disregard|system|eval|admin|bypass|transfer)/i;
  if (isMemo && memoInjectionPattern.test(memoText) && (flags.length > 0 || injectionResult.detected)) {
    return {
      verdict: VERDICTS.BLOCK,
      threatCategory: THREAT_CATEGORIES.MEMO_INJECTION,
      riskLevel: RISK_LEVELS.HIGH,
      rationale: "Malicious transaction memo attempted to influence system policies.",
      requiresConfirmation: true,
      permittedAction: null,
    };
  }

  // 4. Check for unauthorized access attempts (e.g. attempting to switch roles or request manager endpoints)
  const roleOverridePattern = /(?:act\s+as\s+manager|give\s+me\s+admin|set\s+role\s+to\s+MANAGER|unlock\s+all\s+accounts)/i;
  if (roleOverridePattern.test(normalizedText)) {
    return {
      verdict: VERDICTS.BLOCK,
      threatCategory: THREAT_CATEGORIES.UNAUTHORIZED_ACCESS,
      riskLevel: RISK_LEVELS.CRITICAL,
      rationale: "Attempt to manipulate authorization credentials or claim privileged administrative role.",
      requiresConfirmation: true,
      permittedAction: null,
    };
  }

  // 5. Check for obfuscation with suspicious intent
  if (flags.includes("ZERO_WIDTH_CHARS_DETECTED") || flags.includes("SUSPICIOUS_HEX_ENCODING")) {
    return {
      verdict: VERDICTS.BLOCK,
      threatCategory: THREAT_CATEGORIES.OBFUSCATION,
      riskLevel: RISK_LEVELS.MEDIUM,
      rationale: "Obfuscated or hidden characters detected in banking instruction.",
      requiresConfirmation: true,
      permittedAction: null,
    };
  }

  // Determine intent for clean banking requests
  let intent = "general_inquiry";
  let requiresConfirmation = false;
  const lower = normalizedText.toLowerCase();

  if (lower.includes("balance") || lower.includes("how much money")) {
    intent = "check_balance";
  } else if (lower.includes("transfer") || lower.includes("send money") || lower.includes("pay")) {
    intent = "transfer";
    requiresConfirmation = true;
  } else if (lower.includes("transaction") || lower.includes("history") || lower.includes("statement")) {
    intent = "get_transactions";
  } else if (lower.includes("loan") || lower.includes("borrow")) {
    intent = "loan_inquiry";
  } else if (lower.includes("request money") || lower.includes("ask money")) {
    intent = "money_request";
  } else if (lower.includes("deposit")) {
    intent = "deposit_request";
  } else if (lower.includes("withdraw")) {
    intent = "withdrawal_request";
  }

  // Clean request passed deterministic firewall checks
  return {
    verdict: VERDICTS.APPROVE,
    threatCategory: THREAT_CATEGORIES.NONE,
    riskLevel: RISK_LEVELS.LOW,
    rationale: "Request complies with security policies. Proceeding to backend validation.",
    intent,
    requiresConfirmation,
    permittedAction: intent,
  };
}

module.exports = {
  evaluatePolicy,
};
