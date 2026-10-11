const { RISK_LEVELS, THREAT_CATEGORIES } = require("../config/constants");

/**
 * Risk Scorer
 * Evaluates the sensitivity of an action, threat category, evidence, and prior user attempts.
 */

function calculateRiskScore({ threatCategory, userMaliciousAttempts = 0, isFinancialAction = false }) {
  let baseScore = 0;

  switch (threatCategory) {
    case THREAT_CATEGORIES.JAILBREAK:
    case THREAT_CATEGORIES.UNAUTHORIZED_ACCESS:
      baseScore = 90;
      break;
    case THREAT_CATEGORIES.PROMPT_INJECTION:
    case THREAT_CATEGORIES.POLICY_OVERRIDE:
      baseScore = 75;
      break;
    case THREAT_CATEGORIES.MEMO_INJECTION:
      baseScore = 65;
      break;
    case THREAT_CATEGORIES.OBFUSCATION:
      baseScore = 50;
      break;
    default:
      baseScore = 10;
  }

  // Elevate if financial action involved
  if (isFinancialAction) {
    baseScore += 10;
  }

  // Elevate if user has past attempts
  baseScore += Math.min(userMaliciousAttempts * 10, 30);

  if (baseScore >= 85) return RISK_LEVELS.CRITICAL;
  if (baseScore >= 60) return RISK_LEVELS.HIGH;
  if (baseScore >= 35) return RISK_LEVELS.MEDIUM;
  return RISK_LEVELS.LOW;
}

module.exports = {
  calculateRiskScore,
};
