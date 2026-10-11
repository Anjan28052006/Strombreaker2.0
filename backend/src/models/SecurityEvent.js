const mongoose = require("mongoose");
const { THREAT_CATEGORIES, RISK_LEVELS, VERDICTS } = require("../config/constants");

const securityEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    threatCategory: {
      type: String,
      enum: Object.values(THREAT_CATEGORIES),
      required: true,
      index: true,
    },
    riskLevel: {
      type: String,
      enum: Object.values(RISK_LEVELS),
      required: true,
      index: true,
    },
    verdict: {
      type: String,
      enum: Object.values(VERDICTS),
      required: true,
      index: true,
    },
    sanitizedEvidence: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    actionTaken: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

securityEventSchema.index({ createdAt: -1 });
securityEventSchema.index({ userId: 1, createdAt: -1 });

const SecurityEvent = mongoose.model("SecurityEvent", securityEventSchema);

module.exports = SecurityEvent;
