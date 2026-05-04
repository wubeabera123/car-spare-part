import { z } from "zod";

export const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").trim(),
  email: z.email("Enter a valid email").trim(),
  password: z
    .string()
    .min(8, "At least 8 characters")
    .regex(/[a-zA-Z]/, "At least one letter")
    .regex(/[0-9]/, "At least one number"),
});

export const LoginSchema = z.object({
  email: z.email().trim(),
  password: z.string().min(6),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
