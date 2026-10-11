const mongoose = require("mongoose");
const { MONEY_REQUEST_STATUS } = require("../config/constants");

const moneyRequestSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    requesterAccountId: {
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
      enum: Object.values(MONEY_REQUEST_STATUS),
      default: MONEY_REQUEST_STATUS.PENDING,
      index: true,
    },
    expiresAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

moneyRequestSchema.index({ recipientAccountId: 1, status: 1 });
moneyRequestSchema.index({ requesterAccountId: 1, status: 1 });

const MoneyRequest = mongoose.model("MoneyRequest", moneyRequestSchema);

module.exports = MoneyRequest;
