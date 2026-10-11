const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later.",
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      details: [],
    },
  },
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please slow down.",
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      details: [],
    },
  },
});

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // max 30 chat messages per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Chat rate limit exceeded. Please wait a moment before sending another message.",
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      details: [],
    },
  },
});

module.exports = {
  authLimiter,
  generalLimiter,
  chatLimiter,
};
