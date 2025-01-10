import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { pgAdminExperts } from '../drizzle/schema';

export const baseSchema = createInsertSchema(pgAdminExperts);

export const AdminExpertSchema = baseSchema
  .omit({
    adminExpertId: true,
    login: true,
    password: true,
    name: true,
    surname: true,
    birthday: true,
    town: true,
    cv: true,
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
    town: z.string(),
    cv: z.string(),
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

export const UpdateAdminExpertSchema = AdminExpertSchema.extend({
  adminExpertId: z.string(),
});

export const UploadFileSchema = z.object({
  file: z.any(),
  name: z.string(),
});

export const UploadFilesSchema = z.object({
  files: z.array(z.any()),
});
