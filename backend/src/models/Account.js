const mongoose = require("mongoose");
const { ACCOUNT_STATUS } = require("../config/constants");

const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
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
    accountType: {
      type: String,
      enum: ["SAVINGS", "CURRENT"],
      default: "SAVINGS",
    },
    balancePaise: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Account balance cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer paise value",
      },
    },
    currency: {
      type: String,
      default: "INR",
    },
    status: {
      type: String,
      enum: Object.values(ACCOUNT_STATUS),
      default: ACCOUNT_STATUS.ACTIVE,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

accountSchema.index({ userId: 1, status: 1 });

const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
