import { z } from 'zod';

export const EmailSchema = z.object({
  email: z.string().email(),
});

export const LoginSchema = EmailSchema.extend({
  password: z.string().min(8),
});

export const RefreshSchema = z.object({
  refreshToken: z.string(),
  userId: z.string(),
});
