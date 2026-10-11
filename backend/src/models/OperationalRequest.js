const mongoose = require("mongoose");
const { OPERATIONAL_REQUEST_TYPES, OPERATIONAL_REQUEST_STATUS } = require("../config/constants");

const operationalRequestSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(OPERATIONAL_REQUEST_TYPES),
      required: true,
      index: true,
    },
    amountPaise: {
      type: Number,
      required: true,
      min: [1, "Amount must be at least 1 paise"],
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer paise value",
      },
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(OPERATIONAL_REQUEST_STATUS),
      default: OPERATIONAL_REQUEST_STATUS.PENDING,
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    decisionReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

operationalRequestSchema.index({ userId: 1, createdAt: -1 });
operationalRequestSchema.index({ status: 1, createdAt: -1 });

const OperationalRequest = mongoose.model("OperationalRequest", operationalRequestSchema);

module.exports = OperationalRequest;
