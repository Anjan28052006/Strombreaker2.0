const SENSITIVE_KEYS = [
  "password",
  "passwordHash",
  "token",
  "jwt",
  "authorization",
  "apiKey",
  "llm_api_key",
  "confirmationToken",
  "tokenHash",
  "cvv",
  "cardNumber",
  "secret",
];

function sanitizeObject(obj, depth = 0) {
  if (depth > 5 || !obj || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item, depth + 1));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((sensitive) => lowerKey.includes(sensitive.toLowerCase()))) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value, depth + 1);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

function safeLog(...args) {
  const sanitizedArgs = args.map((arg) => (typeof arg === "object" ? sanitizeObject(arg) : arg));
  console.log(...sanitizedArgs);
}

module.exports = {
  sanitizeObject,
  safeLog,
};
