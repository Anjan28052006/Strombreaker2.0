const idempotencyStore = new Map();
const TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

function checkIdempotency(key) {
  if (!key) return null;
  const entry = idempotencyStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    idempotencyStore.delete(key);
    return null;
  }
  return entry.result;
}

function setIdempotency(key, result) {
  if (!key) return;
  idempotencyStore.set(key, {
    result,
    expiresAt: Date.now() + TTL_MS,
  });

  // Cleanup old keys occasionally
  if (idempotencyStore.size > 1000) {
    const now = Date.now();
    for (const [k, v] of idempotencyStore.entries()) {
      if (now > v.expiresAt) {
        idempotencyStore.delete(k);
      }
    }
  }
}

module.exports = {
  checkIdempotency,
  setIdempotency,
};
