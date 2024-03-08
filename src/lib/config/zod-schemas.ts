import { z } from "zod";

export const userSchema = z.object({
  displayName: z
    .string({ required_error: "Username is required" })
    .min(1, { message: "Username is required" })
    .trim(),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .trim(),
  confirmPassword: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" })
    .trim(),
  //terms: z.boolean({ required_error: 'You must accept the terms and privacy policy' }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const userUpdatePasswordSchema = userSchema
  .pick({ password: true, confirmPassword: true })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password and Confirm Password must match",
        path: ["password"],
      });
      ctx.addIssue({
        code: "custom",
        message: "Password and Confirm Password must match",
        path: ["confirmPassword"],
      });
    }
  });
