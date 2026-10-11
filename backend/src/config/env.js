require("dotenv").config();

const requiredEnvs = ["JWT_SECRET"];

function validateEnv() {
  const missing = [];
  for (const envVar of requiredEnvs) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0 && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

validateEnv();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bankism",
  JWT_SECRET: process.env.JWT_SECRET || "bankism-super-secret-jwt-key-2026-production-ready",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  LLM_PROVIDER: process.env.LLM_PROVIDER || "gemini",
  LLM_API_KEY: process.env.LLM_API_KEY || process.env.GEMINI_API_KEY || "",
  LLM_MODEL: process.env.LLM_MODEL || "gemini-1.5-flash",
};
