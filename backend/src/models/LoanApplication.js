const mongoose = require("mongoose");
const { LOAN_STATUS } = require("../config/constants");

const loanApplicationSchema = new mongoose.Schema(
  {
    reference: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    applicantUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    loanType: {
      type: String,
      required: true,
      enum: ["PERSONAL", "HOME", "BUSINESS", "EDUCATION", "VEHICLE"],
      default: "PERSONAL",
    },
    requestedAmountPaise: {
      type: Number,
      required: true,
      min: [100000, "Minimum loan amount is ₹1,000"],
      validate: {
        validator: Number.isInteger,
        message: "{VALUE} is not an integer paise value",
      },
    },
    applicationDetails: {
      purpose: { type: String, default: "" },
      annualIncomePaise: { type: Number, default: 0 },
      employmentStatus: { type: String, default: "" },
      tenureMonths: { type: Number, default: 12 },
      notes: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: Object.values(LOAN_STATUS),
      default: LOAN_STATUS.DRAFT,
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

loanApplicationSchema.index({ applicantUserId: 1, status: 1 });

const LoanApplication = mongoose.model("LoanApplication", loanApplicationSchema);

module.exports = LoanApplication;
