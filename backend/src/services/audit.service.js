const AuditLog = require("../models/AuditLog");
const { sanitizeObject } = require("../security/sanitizeLogs");

async function logAudit({ actorUserId = null, action, resourceType, resourceId = "", metadata = {} }) {
  try {
    const sanitizedMetadata = sanitizeObject(metadata);
    const log = await AuditLog.create({
      actorUserId,
      action,
      resourceType,
      resourceId: String(resourceId),
      metadata: sanitizedMetadata,
    });
    return log;
  } catch (error) {
    console.error("[AuditLog Error]", error.message);
    // Never fail the main business transaction because of an audit log error
    return null;
  }
}

module.exports = {
  logAudit,
};
