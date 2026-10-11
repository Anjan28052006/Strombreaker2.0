const { z } = require("zod");

const loanDraftSchema = z.object({
  body: z.object({
    loanType: z.enum(["PERSONAL", "HOME", "BUSINESS", "EDUCATION", "VEHICLE"]).default("PERSONAL"),
    requestedAmount: z
      .number({ required_error: "Requested amount is required" })
      .min(1000, "Minimum loan amount is ₹1,000")
      .max(5000000, "Maximum loan amount is ₹5,000,000"),
    purpose: z.string().max(500).optional().default(""),
    annualIncome: z.number().nonnegative().optional().default(0),
    employmentStatus: z.string().max(100).optional().default(""),
    tenureMonths: z.number().int().min(3).max(360).optional().default(12),
    notes: z.string().max(500).optional().default(""),
  }),
});

module.exports = {
  loanDraftSchema,
};
