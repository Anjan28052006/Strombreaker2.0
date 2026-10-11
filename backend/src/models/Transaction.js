const mongoose = require("mongoose");
const { TRANSACTION_STATUS } = require("../config/constants");

const transactionSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    senderAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    recipientAccountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
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
    memo: {
      type: String,
      trim: true,
      maxlength: 250,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.PREPARED,
      index: true,
    },
    idempotencyKey: {
      type: String,
      index: true,
      sparse: true,
    },
    confirmationTokenHash: {
      type: String,
      select: false,
    },
    confirmationExpiresAt: {
      type: Date,
      index: true,
    },
    confirmedAt: {
      type: Date,
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

transactionSchema.index({ senderAccountId: 1, createdAt: -1 });
transactionSchema.index({ recipientAccountId: 1, createdAt: -1 });
transactionSchema.index({ status: 1, confirmationExpiresAt: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
