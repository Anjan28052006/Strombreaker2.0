const { normalizeInput } = require("../firewall/inputNormalizer");
const { detectInjection } = require("../firewall/injectionDetector");
const { detectJailbreak } = require("../firewall/jailbreakDetector");
const { evaluatePolicy } = require("../firewall/policyEngine");
const { calculateRiskScore } = require("../firewall/riskScorer");
const { validateFirewallOutput } = require("../firewall/outputValidator");
const SecurityEvent = require("../models/SecurityEvent");
const User = require("../models/User");
const { VERDICTS, LIMITS } = require("../config/constants");
const { logAudit } = require("./audit.service");
const { createNotification } = require("./notification.service");

async function checkFirewall({ text, context = {}, userId = null }) {
  // 1. Normalize input
  const { normalizedText, rawLength, obfuscationDetected, flags } = normalizeInput(text);

  // 2. Deterministic threat checks
  const injectionResult = detectInjection(normalizedText);
  const jailbreakResult = detectJailbreak(normalizedText);

  // 3. User history
  let userMaliciousAttempts = 0;
  let userDoc = null;
  if (userId) {
    userDoc = await User.findById(userId);
    if (userDoc) {
      userMaliciousAttempts = userDoc.maliciousAttemptCount || 0;
    }
  }

  // 4. Policy evaluation
  const policyResult = evaluatePolicy({
    normalizedText,
    flags,
    injectionResult,
    jailbreakResult,
    context,
  });

  // 5. Risk calculation
  const computedRisk = calculateRiskScore({
    threatCategory: policyResult.threatCategory,
    userMaliciousAttempts,
    isFinancialAction: policyResult.requiresConfirmation,
  });

  const finalResult = {
    verdict: policyResult.verdict,
    risk_level: policyResult.verdict === VERDICTS.BLOCK ? policyResult.riskLevel : computedRisk,
    threat_category: policyResult.threatCategory,
    rationale: policyResult.rationale,
    intent: policyResult.intent,
    requires_confirmation: policyResult.requiresConfirmation,
    permitted_action: policyResult.permittedAction,
  };

  // 6. Security Event recording and penalty management
  if (finalResult.verdict === VERDICTS.BLOCK) {
    const sanitizedEvidence = normalizedText.slice(0, 300);

    await SecurityEvent.create({
      userId,
      threatCategory: finalResult.threat_category,
      riskLevel: finalResult.risk_level,
      verdict: finalResult.verdict,
      sanitizedEvidence,
      actionTaken: "REQUEST_BLOCKED_BY_FIREWALL",
      metadata: { flags, contextAction: context.action },
    });

    if (userDoc) {
      userDoc.maliciousAttemptCount += 1;
      await userDoc.save();

      // Notify customer of blocked attempt
      await createNotification({
        recipientUserId: userDoc._id,
        type: "SECURITY_ALERT",
        title: "Security Shield Alert",
        message: `A request was blocked by the AI Firewall due to suspicious patterns (${finalResult.threat_category}).`,
        resourceType: "SECURITY_EVENT",
      });

      // If user exceeds limit, log for banker review
      if (userDoc.maliciousAttemptCount > LIMITS.MAX_MALICIOUS_ATTEMPTS_BEFORE_FLAG) {
        await logAudit({
          actorUserId: userId,
          action: "USER_FLAGGED_FOR_BANKER_REVIEW",
          resourceType: "USER",
          resourceId: userDoc._id.toString(),
          metadata: { maliciousAttemptCount: userDoc.maliciousAttemptCount },
        });
      }
    }
  }

  return finalResult;
}

module.exports = {
  checkFirewall,
};
