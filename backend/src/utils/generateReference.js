const crypto = require("crypto");

function generateAccountNumber() {
  // 12-digit bank account number starting with 4091 (Bankism BIN prefix)
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000).toString();
  return `4091${randomDigits}`;
}

function generateTransactionReference() {
  const dateStr = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
  const randomStr = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `TXN-${dateStr}-${randomStr}`;
}

function generateConfirmationToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateReference(prefix = "REF") {
  const dateStr = new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 14);
  const randomStr = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `${prefix}-${dateStr}-${randomStr}`;
}

module.exports = {
  generateAccountNumber,
  generateTransactionReference,
  generateConfirmationToken,
  hashToken,
  generateReference,
};
