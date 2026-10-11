const { z } = require("zod");

const prepareTransferSchema = z.object({
  body: z.object({
    recipientAccountNumber: z
      .string({ required_error: "Recipient account number is mandatory" })
      .trim()
      .min(8, "Recipient account number must be at least 8 digits")
      .max(20, "Recipient account number must not exceed 20 digits"),
    amount: z
      .number({ required_error: "Amount is required" })
      .positive("Amount must be greater than zero")
      .max(500000, "Maximum transfer amount per transaction is ₹500,000")
      .refine(
        (val) => Number.isInteger(Math.round(val * 100)),
        "Amount cannot have more than 2 decimal places"
      ),
    memo: z.string().max(250, "Memo must not exceed 250 characters").optional().default(""),
    idempotencyKey: z.string().max(100).optional(),
  }),
});

const confirmTransferSchema = z.object({
  body: z.object({
    transactionId: z.string({ required_error: "Transaction ID is required" }).trim().min(1),
    confirmationToken: z.string({ required_error: "Confirmation token is required" }).trim().min(1),
  }),
});

const operationalRequestSchema = z.object({
  body: z.object({
    amount: z
      .number({ required_error: "Amount is required" })
      .positive("Amount must be greater than zero")
      .max(10000000, "Maximum amount is ₹10,000,000")
      .refine(
        (val) => Number.isInteger(Math.round(val * 100)),
        "Amount cannot have more than 2 decimal places"
      ),
    notes: z.string().max(300, "Notes must not exceed 300 characters").optional().default(""),
  }),
});

const moneyRequestSchema = z.object({
  body: z.object({
    recipientAccountNumber: z
      .string({ required_error: "Recipient account number is mandatory" })
      .trim()
      .min(8),
    amount: z
      .number({ required_error: "Amount is required" })
      .positive("Amount must be greater than zero")
      .max(500000, "Maximum money request amount is ₹500,000"),
    memo: z.string().max(250).optional().default(""),
  }),
});

module.exports = {
  prepareTransferSchema,
  confirmTransferSchema,
  operationalRequestSchema,
  moneyRequestSchema,
};
