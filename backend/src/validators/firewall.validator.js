const { z } = require("zod");

const firewallCheckSchema = z.object({
  body: z.object({
    text: z
      .string({ required_error: "Input text is required" })
      .min(1, "Input text cannot be empty")
      .max(4000, "Input text exceeds maximum allowed length of 4000 characters"),
    context: z
      .object({
        action: z.string().optional(),
        memo: z.string().optional(),
        role: z.string().optional(),
      })
      .optional()
      .default({}),
  }),
});

module.exports = {
  firewallCheckSchema,
};
