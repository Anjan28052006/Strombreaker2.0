/**
 * Injection Detector
 * Detects prompt injection, prompt leakage, and instruction override attempts.
 */

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(?:previous|prior|above|system)\s+(?:instructions|prompts|rules|commands)/i,
  /disregard\s+(all\s+)?(?:previous|prior|above)\s+(?:instructions|prompts|rules)/i,
  /override\s+(?:system|banking|security)\s+(?:rules|policies|instructions|prompt)/i,
  /(?:system\s+prompt|system\s+instruction|system\s+message)\s*:\s*/i,
  /(?:show|reveal|display|output|print|echo|leak|dump)\s+(?:your|the)\s+(?:system\s+prompt|initial\s+prompt|hidden\s+instructions|system\s+message|secret\s+key|api\s+key)/i,
  /(?:repeat|restate)\s+(?:all\s+)?(?:words|text|instructions)\s+above/i,
  /(?:you\s+are\s+now|act\s+as|pretend\s+to\s+be)\s+(?:DAN|developer\s+mode|unfiltered|jailbroken|root|superuser|admin|god\s+mode)/i,
  /forget\s+(?:all\s+)?(?:previous|your)\s+(?:rules|constraints|limits|instructions)/i,
  /(?:bypass|disable|turn\s+off|skip)\s+(?:guardrails|firewall|safety|security|verification|authorization)/i,
  /(?:execute|run)\s+(?:raw\s+sql|mongodb|query|code|eval|script)\s+directly/i,
  /(?:transfer|move|send)\s+(?:money|funds)\s+without\s+(?:confirmation|asking|verification|pin|otp)/i,
  /<\/?system>/i,
  /\[SYSTEM_PROMPT\]/i,
  /---\s*BEGIN\s+SYSTEM\s+PROMPT/i,
];

function detectInjection(text) {
  if (!text || typeof text !== "string") {
    return { detected: false, matches: [] };
  }

  const matches = [];
  for (const pattern of INJECTION_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      matches.push(match[0]);
    }
  }

  return {
    detected: matches.length > 0,
    matches,
    count: matches.length,
  };
}

module.exports = {
  detectInjection,
  INJECTION_PATTERNS,
};
