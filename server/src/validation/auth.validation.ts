import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters")
  .max(72, "Password must be at most 72 bytes for bcrypt")
  .refine(
    (password) => Buffer.byteLength(password, "utf8") <= 72,
    "Password must be at most 72 bytes for bcrypt",
  );

export const registerBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(100, "Name must be at most 100 characters"),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Email must be valid")
      .max(255, "Email must be at most 255 characters"),

    password: passwordSchema,

    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: "custom",
        path: ["confirmPassword"],
        message: "Passwords do not match",
      });
    }
  });

export const loginBodySchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Email must be valid")
    .max(255, "Email must be at most 255 characters"),

  password: z.string().min(1, "Password is required").max(72),
});

export const registerRequestSchema = z.object({
  body: registerBodySchema,
});

export const loginRequestSchema = z.object({
  body: loginBodySchema,
});

export type RegisterInput = z.infer<typeof registerBodySchema>;
export type LoginInput = z.infer<typeof loginBodySchema>;