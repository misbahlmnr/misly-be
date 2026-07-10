import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
  })
  .strict();

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
