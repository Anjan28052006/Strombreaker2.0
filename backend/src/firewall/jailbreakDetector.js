/**
 * Jailbreak Detector
 * Detects roleplay bypasses, fictional simulation attacks, DAN modes, and adversarial jailbreaks.
 */

const JAILBREAK_PATTERNS = [
  /(?:jailbreak|unrestricted|developer\s+mode|chaos\s+mode|evil\s+twin|god\s+mode)/i,
  /(?:you\s+are\s+now|act\s+as|pretend\s+to\s+be).*?(?:developer\s+mode|unrestricted|jailbreak|god\s+mode|dan)/i,
  /(?:roleplay|hypothetical\s+scenario|fiction\s+story)\s+where\s+you\s+(?:have\s+no\s+rules|are\s+an\s+unregulated\s+banker|can\s+steal|can\s+approve\s+loans)/i,
  /for\s+educational\s+purposes\s+only,?\s+(?:how\s+to\s+bypass|transfer\s+without\s+authorization|hack\s+bank)/i,
  /assume\s+(?:the\s+identity\s+of|a\s+persona\s+with)\s+infinite\s+(?:balance|privileges|permissions)/i,
  /always\s+respond\s+with\s+(?:yes|approved|success)\s+regardless\s+of/i,
  /(?:never\s+say\s+no|do\s+not\s+refuse\s+any\s+request)/i,
  /you\s+are\s+a\s+bank\s+manager\s+who\s+approves\s+all\s+loans\s+instantly/i,
  /override\s+permission\s+check/i,
  /grant\s+(?:me\s+)?(?:manager|banker|admin)\s+(?:access|role|status|privileges)/i,
];

function detectJailbreak(text) {
  if (!text || typeof text !== "string") {
    return { detected: false, matches: [] };
  }

  const matches = [];
  for (const pattern of JAILBREAK_PATTERNS) {
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
  detectJailbreak,
  JAILBREAK_PATTERNS,
};
