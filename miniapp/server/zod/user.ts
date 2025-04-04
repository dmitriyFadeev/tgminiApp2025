import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { pgUsers } from '../drizzle/schema';

export const baseSchema = createInsertSchema(pgUsers);

export const UserSchema = baseSchema
  .omit({
    userId: true,
    login: true,
    password: true,
    name: true,
    surname: true,
    birthday: true,
    companyName: true,
    businessSector: true,
    post: true,
    fileName: true,
    fileDataIntro: true,
    bucketName: true,
    interests: true,
    role: true,
  })
  .extend({
    login: z.string(),
    name: z.string(),
    surname: z.string(),
    birthday: z.date(),
    companyName: z.string(),
    businessSector: z.string(),
    post: z.string(),
    fileName: z.string().nullable(),
    fileDataIntro: z.string().nullable(),
    bucketName: z.string().nullable(),
    interests: z.array(z.string()),
    role: z.string(),
    password: z
      .string()
      .min(8)
      .max(64)
      .regex(/^(?=.*[A-z])/, 'Пароль должен содержать хотя бы одну букву')
      .regex(/^(?=.*\d)/, 'Пароль должен содержать хотя бы одну цифру'),
  });

export const UpdateUserSchema = UserSchema.extend({
  userId: z.string(),
});

export const UploadFileSchema = z.object({
  file: z.any(),
  name: z.string(),
});

export const UploadFilesSchema = z.object({
  files: z.array(z.any()),
});
