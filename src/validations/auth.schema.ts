import { z } from "zod";

const emailSchema = z.string().trim().email().min(1).max(255);
const passwordSchema = z.string().trim().min(4);

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
