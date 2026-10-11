const { z } = require("zod");

const registerSchema = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: "Full name is required" })
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters")
      .trim(),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address format")
      .trim()
      .toLowerCase(),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password must not exceed 128 characters"),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address format")
      .trim()
      .toLowerCase(),
    password: z.string({ required_error: "Password is required" }).min(1, "Password cannot be empty"),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
