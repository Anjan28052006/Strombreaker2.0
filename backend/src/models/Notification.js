const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipientUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "REGISTRATION_DECISION",
        "BANKER_WARNING",
        "ACCOUNT_RESTRICTION",
        "SECURITY_ALERT",
        "MONEY_REQUEST",
        "TRANSFER_PREPARED",
        "TRANSFER_COMPLETED",
        "DEPOSIT_UPDATE",
        "WITHDRAWAL_UPDATE",
        "LOAN_UPDATE",
        "GENERAL",
      ],
      default: "GENERAL",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    resourceType: {
      type: String,
      enum: ["TRANSACTION", "LOAN", "MONEY_REQUEST", "ACCOUNT", "USER", "SECURITY_EVENT", "NONE"],
      default: "NONE",
    },
    resourceId: {
      type: String,
      default: "",
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ recipientUserId: 1, createdAt: -1 });
notificationSchema.index({ recipientUserId: 1, readAt: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
